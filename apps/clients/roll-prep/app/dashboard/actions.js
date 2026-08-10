"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/libs/supabase/server";
import { isAcademyId } from "@/libs/academies";
import config from "@/config";

async function getAuthedClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("No autenticado");

  return { supabase, user };
}

async function assertAdmin(supabase, user) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") throw new Error("Solo el profesor puede hacer esto");
}

function revalidateAssignmentPaths(assignmentId) {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/clase");
  revalidatePath("/dashboard/calendario");
  revalidatePath("/dashboard/videoteca");
  if (assignmentId) revalidatePath(`/dashboard/clase/${assignmentId}`);
}

function todayInTimezone(timeZone = config.timezone) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function parseScheduledFor(value) {
  const raw = typeof value === "string" ? value.trim() : "";
  if (!raw) return todayInTimezone();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return null;
  return raw;
}

// ---------------------------------------------------------------------------
// ALUMNO
// ---------------------------------------------------------------------------

/**
 * Registra el clic de "Visto y Estudiado" para la tarea activa.
 * La RLS garantiza que solo puede insertar su propio registro y solo
 * sobre una tarea activa.
 */
export async function markAssignmentCompleted(assignmentId) {
  const { supabase, user } = await getAuthedClient();

  const { error } = await supabase.from("assignment_completions").insert({
    assignment_id: assignmentId,
    student_id: user.id,
  });

  // 23505 = ya estaba completada (clic doble) — no es un error para el alumno.
  if (error && error.code !== "23505") {
    return { error: "No se pudo registrar. Intenta de nuevo." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/clase");
  revalidatePath("/dashboard/perfil");
  revalidatePath("/dashboard/ranking");
  return { success: true };
}

/**
 * Registra (o cambia) el voto del alumno en la encuesta activa.
 */
export async function submitVote(pollId, optionId) {
  const { supabase, user } = await getAuthedClient();

  const { error } = await supabase.from("poll_votes").upsert(
    {
      poll_id: pollId,
      option_id: optionId,
      student_id: user.id,
    },
    { onConflict: "poll_id,student_id" }
  );

  if (error) {
    return { error: "No se pudo registrar tu voto. Intenta de nuevo." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/votar");
  revalidatePath("/dashboard/perfil");
  revalidatePath("/dashboard/ranking");
  return { success: true };
}

/**
 * Publica un comentario/pregunta en una clase.
 * El primer comentario en cada clase otorga puntos (trigger en DB).
 */
export async function addComment(assignmentId, body) {
  const { supabase, user } = await getAuthedClient();

  const text = body?.trim();
  if (!text) return { error: "Escribe algo antes de enviar." };
  if (text.length > 1000) return { error: "Máximo 1000 caracteres." };

  const { error } = await supabase.from("assignment_comments").insert({
    assignment_id: assignmentId,
    student_id: user.id,
    body: text,
  });

  if (error) {
    return { error: "No se pudo publicar el comentario. Intenta de nuevo." };
  }

  revalidatePath("/dashboard/clase");
  revalidatePath(`/dashboard/clase/${assignmentId}`);
  revalidatePath("/dashboard/perfil");
  revalidatePath("/dashboard/ranking");
  return { success: true };
}

/**
 * Borra un comentario propio (o cualquiera, si es el profesor — RLS decide).
 */
export async function deleteComment(commentId, assignmentId) {
  const { supabase } = await getAuthedClient();

  const { error } = await supabase
    .from("assignment_comments")
    .delete()
    .eq("id", commentId);

  if (error) return { error: "No se pudo borrar el comentario." };

  revalidatePath("/dashboard/clase");
  revalidatePath(`/dashboard/clase/${assignmentId}`);
  return { success: true };
}

/**
 * Actualiza la ficha del alumno: nombre y academia. Completar el nombre por
 * primera vez otorga puntos (trigger en DB).
 *
 * El selector de academia solo llega en el form si la migración de academias
 * está aplicada; si no, se guarda solo el nombre, como antes.
 */
export async function updateProfile(formData) {
  const { supabase, user } = await getAuthedClient();

  const fullName = formData.get("full_name")?.trim();
  if (!fullName) return { error: "El nombre no puede estar vacío." };
  if (fullName.length > 80) return { error: "Máximo 80 caracteres." };

  const changes = { full_name: fullName };

  if (formData.has("academy_id")) {
    const academyId = formData.get("academy_id")?.trim() || null;
    if (academyId && !isAcademyId(academyId)) {
      return { error: "Esa academia no existe." };
    }
    changes.academy_id = academyId;
  }

  const { error } = await supabase
    .from("profiles")
    .update(changes)
    .eq("id", user.id);

  if (error) return { error: "No se pudo guardar el perfil." };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/perfil");
  revalidatePath("/dashboard/ranking");
  return { success: true };
}

// ---------------------------------------------------------------------------
// PROFESOR
// ---------------------------------------------------------------------------

/**
 * Crea una clase. Si se marca como activa, desactiva las anteriores.
 */
export async function createAssignment(formData) {
  const { supabase, user } = await getAuthedClient();
  await assertAdmin(supabase, user);

  const title = formData.get("title")?.trim();
  const videoUrl = formData.get("video_url")?.trim();
  const notes = formData.get("notes")?.trim() || null;
  const scheduledFor = parseScheduledFor(formData.get("scheduled_for"));
  const makeActive = formData.get("is_active") === "on";

  if (!title || !videoUrl) {
    return { error: "El título y la URL del video son obligatorios." };
  }
  if (!scheduledFor) {
    return { error: "La fecha de la clase no es válida." };
  }

  if (makeActive) {
    await supabase.from("assignments").update({ is_active: false }).eq("is_active", true);
  }

  const { data, error } = await supabase
    .from("assignments")
    .insert({
      title,
      video_url: videoUrl,
      notes,
      scheduled_for: scheduledFor,
      is_active: makeActive,
    })
    .select("id")
    .single();

  if (error) return { error: "No se pudo crear la tarea." };

  revalidateAssignmentPaths(data?.id);
  return { success: true };
}

/**
 * Edita una clase existente (título, video, notas, fecha y/o activa).
 */
export async function updateAssignment(formData) {
  const { supabase, user } = await getAuthedClient();
  await assertAdmin(supabase, user);

  const id = formData.get("id")?.trim();
  const title = formData.get("title")?.trim();
  const videoUrl = formData.get("video_url")?.trim();
  const notes = formData.get("notes")?.trim() || null;
  const scheduledFor = parseScheduledFor(formData.get("scheduled_for"));
  const makeActive = formData.get("is_active") === "on";

  if (!id) return { error: "Falta el id de la clase." };
  if (!title || !videoUrl) {
    return { error: "El título y la URL del video son obligatorios." };
  }
  if (!scheduledFor) {
    return { error: "La fecha de la clase no es válida." };
  }

  if (makeActive) {
    await supabase
      .from("assignments")
      .update({ is_active: false })
      .eq("is_active", true)
      .neq("id", id);
  }

  const { error } = await supabase
    .from("assignments")
    .update({
      title,
      video_url: videoUrl,
      notes,
      scheduled_for: scheduledFor,
      is_active: makeActive,
    })
    .eq("id", id);

  if (error) return { error: "No se pudo guardar la clase." };

  revalidateAssignmentPaths(id);
  return { success: true };
}

/**
 * Marca una clase como la activa (y desactiva las demás).
 */
export async function setActiveAssignment(assignmentId) {
  const { supabase, user } = await getAuthedClient();
  await assertAdmin(supabase, user);

  if (!assignmentId) return { error: "Falta el id de la clase." };

  await supabase.from("assignments").update({ is_active: false }).eq("is_active", true);

  const { error } = await supabase
    .from("assignments")
    .update({ is_active: true })
    .eq("id", assignmentId);

  if (error) return { error: "No se pudo activar la clase." };

  revalidateAssignmentPaths(assignmentId);
  return { success: true };
}

/**
 * Crea la votación del fin de semana con sus 3 opciones
 * (desactiva las encuestas anteriores).
 */
export async function createPoll(formData) {
  const { supabase, user } = await getAuthedClient();
  await assertAdmin(supabase, user);

  const question =
    formData.get("question")?.trim() || "¿Qué estudiamos en la próxima clase?";

  const options = [1, 2, 3]
    .map((i) => ({
      title: formData.get(`option_${i}_title`)?.trim(),
      description: formData.get(`option_${i}_description`)?.trim() || null,
    }))
    .filter((o) => o.title);

  if (options.length < 3) {
    return { error: "La encuesta necesita 3 opciones con título." };
  }

  await supabase.from("polls").update({ is_active: false }).eq("is_active", true);

  const { data: poll, error } = await supabase
    .from("polls")
    .insert({ question, is_active: true })
    .select("id")
    .single();

  if (error) return { error: "No se pudo crear la encuesta." };

  const { error: optionsError } = await supabase
    .from("poll_options")
    .insert(options.map((o) => ({ ...o, poll_id: poll.id })));

  if (optionsError) return { error: "No se pudieron crear las opciones." };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/votar");
  return { success: true };
}

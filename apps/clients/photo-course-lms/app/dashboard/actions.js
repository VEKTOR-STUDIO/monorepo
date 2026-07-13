"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/libs/supabase/server";

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
  return { success: true };
}

// ---------------------------------------------------------------------------
// PROFESOR
// ---------------------------------------------------------------------------

/**
 * Crea la tarea en curso (desactiva las anteriores).
 */
export async function createAssignment(formData) {
  const { supabase, user } = await getAuthedClient();
  await assertAdmin(supabase, user);

  const title = formData.get("title")?.trim();
  const videoUrl = formData.get("video_url")?.trim();
  const notes = formData.get("notes")?.trim() || null;

  if (!title || !videoUrl) {
    return { error: "El título y la URL del video son obligatorios." };
  }

  await supabase.from("assignments").update({ is_active: false }).eq("is_active", true);

  const { error } = await supabase
    .from("assignments")
    .insert({ title, video_url: videoUrl, notes, is_active: true });

  if (error) return { error: "No se pudo crear la tarea." };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/admin");
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
  return { success: true };
}

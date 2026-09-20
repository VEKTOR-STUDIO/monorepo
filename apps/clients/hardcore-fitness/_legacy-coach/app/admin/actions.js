"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/libs/supabase/server";

// -----------------------------------------------------------------------------
// Acciones del panel del entrenador.
//
// La base de datos ya bloquea la escritura a quien no sea admin (RLS). Aquí
// comprobamos el rol igualmente para poder devolver un mensaje claro en vez de
// un error críptico de Postgres.
// -----------------------------------------------------------------------------

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Necesitas iniciar sesión.");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") throw new Error("Solo el entrenador puede hacer esto.");
  return { supabase, user };
}

const wrap = async (work) => {
  try {
    return await work();
  } catch (error) {
    return { ok: false, error: error.message };
  }
};

const text = (formData, key) => formData.get(key)?.toString().trim() || null;
const number = (formData, key) => {
  const raw = formData.get(key)?.toString().trim();
  if (!raw) return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
};

const slugify = (value) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);

// =============================================================================
// Planes de entrenamiento
// =============================================================================
export async function createProgram(previousState, formData) {
  return wrap(async () => {
    const { supabase, user } = await requireAdmin();

    const title = text(formData, "title");
    if (!title) return { ok: false, error: "Ponle un nombre al plan." };

    // El slug tiene que ser único: si choca, le añadimos un sufijo.
    const base = slugify(title) || "plan";
    let slug = base;
    for (let attempt = 1; attempt <= 20; attempt += 1) {
      const { data: taken } = await supabase
        .from("programs")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();
      if (!taken) break;
      slug = `${base}-${attempt + 1}`;
    }

    const { data, error } = await supabase
      .from("programs")
      .insert({
        slug,
        title,
        subtitle: text(formData, "subtitle"),
        description: text(formData, "description"),
        level: text(formData, "level") || "todos",
        category: text(formData, "category"),
        duration_weeks: number(formData, "duration_weeks"),
        is_published: true,
        is_public: formData.get("is_public") === "on",
        coach_id: user.id,
      })
      .select("id")
      .single();

    if (error) return { ok: false, error: error.message };

    revalidatePath("/admin/programas");
    return { ok: true, id: data.id };
  });
}

export async function updateProgram(previousState, formData) {
  return wrap(async () => {
    const { supabase } = await requireAdmin();
    const id = text(formData, "id");

    const { error } = await supabase
      .from("programs")
      .update({
        title: text(formData, "title"),
        subtitle: text(formData, "subtitle"),
        description: text(formData, "description"),
        level: text(formData, "level") || "todos",
        category: text(formData, "category"),
        duration_weeks: number(formData, "duration_weeks"),
        is_published: formData.get("is_published") === "on",
        is_public: formData.get("is_public") === "on",
      })
      .eq("id", id);

    if (error) return { ok: false, error: error.message };

    revalidatePath(`/admin/programas/${id}`);
    revalidatePath("/admin/programas");
    return { ok: true };
  });
}

export async function deleteProgram(programId) {
  return wrap(async () => {
    const { supabase } = await requireAdmin();
    const { error } = await supabase.from("programs").delete().eq("id", programId);
    if (error) return { ok: false, error: error.message };

    revalidatePath("/admin/programas");
    return { ok: true };
  });
}

// =============================================================================
// Sesiones dentro de un plan
// =============================================================================
export async function createWorkout({ programId, title, focus, durationMinutes, weekNumber }) {
  return wrap(async () => {
    const { supabase } = await requireAdmin();
    if (!title?.trim()) return { ok: false, error: "Ponle un nombre a la sesión." };

    const { data: siblings } = await supabase
      .from("workouts")
      .select("sort_order")
      .eq("program_id", programId)
      .order("sort_order", { ascending: false })
      .limit(1);

    const { data, error } = await supabase
      .from("workouts")
      .insert({
        program_id: programId,
        title: title.trim(),
        focus: focus?.trim() || null,
        duration_minutes: durationMinutes ? Number(durationMinutes) : null,
        week_number: weekNumber ? Number(weekNumber) : null,
        sort_order: (siblings?.[0]?.sort_order || 0) + 1,
        is_published: true,
      })
      .select("id")
      .single();

    if (error) return { ok: false, error: error.message };

    revalidatePath(`/admin/programas/${programId}`);
    return { ok: true, id: data.id };
  });
}

export async function updateWorkout({ id, programId, ...fields }) {
  return wrap(async () => {
    const { supabase } = await requireAdmin();
    const { error } = await supabase
      .from("workouts")
      .update({
        title: fields.title?.trim(),
        description: fields.description?.trim() || null,
        focus: fields.focus?.trim() || null,
        duration_minutes: fields.durationMinutes ? Number(fields.durationMinutes) : null,
        week_number: fields.weekNumber ? Number(fields.weekNumber) : null,
        is_published: fields.isPublished ?? true,
      })
      .eq("id", id);

    if (error) return { ok: false, error: error.message };

    revalidatePath(`/admin/programas/${programId}`);
    return { ok: true };
  });
}

export async function deleteWorkout(id, programId) {
  return wrap(async () => {
    const { supabase } = await requireAdmin();
    const { error } = await supabase.from("workouts").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };

    revalidatePath(`/admin/programas/${programId}`);
    return { ok: true };
  });
}

/** Sube o baja una sesión intercambiando su posición con la vecina. */
export async function moveWorkout(id, programId, direction) {
  return wrap(async () => {
    const { supabase } = await requireAdmin();

    const { data: workouts } = await supabase
      .from("workouts")
      .select("id, sort_order")
      .eq("program_id", programId)
      .order("sort_order");

    const list = workouts || [];
    const index = list.findIndex((workout) => workout.id === id);
    const target = direction === "up" ? index - 1 : index + 1;
    if (index < 0 || target < 0 || target >= list.length) return { ok: true };

    await Promise.all([
      supabase
        .from("workouts")
        .update({ sort_order: list[target].sort_order })
        .eq("id", list[index].id),
      supabase
        .from("workouts")
        .update({ sort_order: list[index].sort_order })
        .eq("id", list[target].id),
    ]);

    revalidatePath(`/admin/programas/${programId}`);
    return { ok: true };
  });
}

// =============================================================================
// Ejercicios dentro de una sesión
// =============================================================================
export async function addExerciseToWorkout({ workoutId, programId, libraryId }) {
  return wrap(async () => {
    const { supabase } = await requireAdmin();

    const { data: exercise, error: libraryError } = await supabase
      .from("exercise_library")
      .select("id, name, cues, animation_slug, default_sets, default_reps")
      .eq("id", libraryId)
      .single();

    if (libraryError) return { ok: false, error: libraryError.message };

    const { data: siblings } = await supabase
      .from("exercises")
      .select("sort_order")
      .eq("workout_id", workoutId)
      .order("sort_order", { ascending: false })
      .limit(1);

    const { error } = await supabase.from("exercises").insert({
      workout_id: workoutId,
      library_id: exercise.id,
      name: exercise.name,
      description: exercise.cues,
      animation_slug: exercise.animation_slug,
      sets: exercise.default_sets || 3,
      reps: exercise.default_reps || "10-12",
      rest_seconds: 60,
      sort_order: (siblings?.[0]?.sort_order || 0) + 1,
    });

    if (error) return { ok: false, error: error.message };

    revalidatePath(`/admin/programas/${programId}`);
    return { ok: true };
  });
}

export async function updateExercise({ id, programId, ...fields }) {
  return wrap(async () => {
    const { supabase } = await requireAdmin();

    const { error } = await supabase
      .from("exercises")
      .update({
        name: fields.name?.trim(),
        description: fields.description?.trim() || null,
        sets: fields.sets ? Number(fields.sets) : null,
        reps: fields.reps?.trim() || null,
        rest_seconds: fields.restSeconds ? Number(fields.restSeconds) : null,
        target_weight_kg: fields.targetWeightKg ? Number(fields.targetWeightKg) : null,
        tempo: fields.tempo?.trim() || null,
        video_url: fields.videoUrl?.trim() || null,
        superset_group: fields.supersetGroup?.trim() || null,
        block_name: fields.blockName?.trim() || null,
        intensity: fields.intensity?.trim() || null,
        per_side: Boolean(fields.perSide),
      })
      .eq("id", id);

    if (error) return { ok: false, error: error.message };

    revalidatePath(`/admin/programas/${programId}`);
    return { ok: true };
  });
}

export async function deleteExercise(id, programId) {
  return wrap(async () => {
    const { supabase } = await requireAdmin();
    const { error } = await supabase.from("exercises").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };

    revalidatePath(`/admin/programas/${programId}`);
    return { ok: true };
  });
}

export async function moveExercise(id, workoutId, programId, direction) {
  return wrap(async () => {
    const { supabase } = await requireAdmin();

    const { data: exercises } = await supabase
      .from("exercises")
      .select("id, sort_order")
      .eq("workout_id", workoutId)
      .order("sort_order");

    const list = exercises || [];
    const index = list.findIndex((exercise) => exercise.id === id);
    const target = direction === "up" ? index - 1 : index + 1;
    if (index < 0 || target < 0 || target >= list.length) return { ok: true };

    await Promise.all([
      supabase
        .from("exercises")
        .update({ sort_order: list[target].sort_order })
        .eq("id", list[index].id),
      supabase
        .from("exercises")
        .update({ sort_order: list[index].sort_order })
        .eq("id", list[target].id),
    ]);

    revalidatePath(`/admin/programas/${programId}`);
    return { ok: true };
  });
}

// =============================================================================
// Alumnos y asignación de planes
// =============================================================================
export async function updateAthlete(previousState, formData) {
  return wrap(async () => {
    const { supabase } = await requireAdmin();
    const id = text(formData, "id");

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: text(formData, "full_name"),
        phone: text(formData, "phone"),
        goal: text(formData, "goal"),
        level: text(formData, "level"),
        coach_notes: text(formData, "coach_notes"),
        is_active: formData.get("is_active") === "on",
        // Ficha de peleador
        weight_kg: number(formData, "weight_kg"),
        height_cm: number(formData, "height_cm"),
        weight_class: text(formData, "weight_class"),
        discipline: text(formData, "discipline"),
        fight_record: text(formData, "fight_record"),
        fight_strategy: text(formData, "fight_strategy"),
      })
      .eq("id", id);

    if (error) return { ok: false, error: error.message };

    revalidatePath(`/admin/alumnos/${id}`);
    revalidatePath("/admin/alumnos");
    return { ok: true };
  });
}

export async function assignProgram({ athleteId, programId, startsOn, notes }) {
  return wrap(async () => {
    const { supabase, user } = await requireAdmin();

    const { error } = await supabase.from("program_assignments").upsert(
      {
        athlete_id: athleteId,
        program_id: programId,
        assigned_by: user.id,
        starts_on: startsOn || new Date().toISOString().slice(0, 10),
        notes: notes?.trim() || null,
        status: "activo",
      },
      { onConflict: "program_id,athlete_id" }
    );

    if (error) return { ok: false, error: error.message };

    revalidatePath(`/admin/alumnos/${athleteId}`);
    return { ok: true };
  });
}

export async function setAssignmentStatus(assignmentId, athleteId, status) {
  return wrap(async () => {
    const { supabase } = await requireAdmin();
    const { error } = await supabase
      .from("program_assignments")
      .update({ status })
      .eq("id", assignmentId);

    if (error) return { ok: false, error: error.message };

    revalidatePath(`/admin/alumnos/${athleteId}`);
    return { ok: true };
  });
}

export async function removeAssignment(assignmentId, athleteId) {
  return wrap(async () => {
    const { supabase } = await requireAdmin();
    const { error } = await supabase
      .from("program_assignments")
      .delete()
      .eq("id", assignmentId);

    if (error) return { ok: false, error: error.message };

    revalidatePath(`/admin/alumnos/${athleteId}`);
    return { ok: true };
  });
}

// =============================================================================
// Libro de entrenamiento (ejercicios propios del entrenador)
// =============================================================================
export async function createLibraryExercise(previousState, formData) {
  return wrap(async () => {
    const { supabase, user } = await requireAdmin();

    const name = text(formData, "name");
    if (!name) return { ok: false, error: "Ponle nombre al ejercicio." };

    const base = slugify(name) || "ejercicio";
    let slug = base;
    for (let attempt = 1; attempt <= 20; attempt += 1) {
      const { data: taken } = await supabase
        .from("exercise_library")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();
      if (!taken) break;
      slug = `${base}-${attempt + 1}`;
    }

    const { error } = await supabase.from("exercise_library").insert({
      slug,
      name,
      description: text(formData, "description"),
      cues: text(formData, "cues"),
      equipment: text(formData, "equipment"),
      primary_muscle: text(formData, "primary_muscle"),
      category: text(formData, "category") || "fuerza",
      exercise_type: text(formData, "exercise_type") || "weight_reps",
      animation_slug: text(formData, "animation_slug"),
      video_url: text(formData, "video_url"),
      default_sets: number(formData, "default_sets"),
      default_reps: text(formData, "default_reps"),
      created_by: user.id,
    });

    if (error) return { ok: false, error: error.message };

    revalidatePath("/admin/biblioteca");
    return { ok: true };
  });
}

export async function updateLibraryExercise({ id, cues, videoUrl, isPublished }) {
  return wrap(async () => {
    const { supabase } = await requireAdmin();

    const patch = {};
    if (cues !== undefined) patch.cues = cues?.trim() || null;
    if (videoUrl !== undefined) patch.video_url = videoUrl?.trim() || null;
    if (isPublished !== undefined) patch.is_published = isPublished;

    const { error } = await supabase.from("exercise_library").update(patch).eq("id", id);
    if (error) return { ok: false, error: error.message };

    revalidatePath("/admin/biblioteca");
    return { ok: true };
  });
}

// =============================================================================
// Clases
// =============================================================================
export async function createClass(previousState, formData) {
  return wrap(async () => {
    const { supabase, user } = await requireAdmin();

    const title = text(formData, "title");
    const date = text(formData, "date");
    const time = text(formData, "time");
    if (!title || !date || !time) {
      return { ok: false, error: "Hacen falta nombre, día y hora." };
    }

    const { error } = await supabase.from("classes").insert({
      title,
      description: text(formData, "description"),
      coach_id: user.id,
      starts_at: new Date(`${date}T${time}`).toISOString(),
      duration_minutes: number(formData, "duration_minutes") || 60,
      capacity: number(formData, "capacity") || 10,
      location: text(formData, "location"),
      level: text(formData, "level") || "todos",
      is_published: formData.get("is_published") === "on",
    });

    if (error) return { ok: false, error: error.message };

    revalidatePath("/admin/clases");
    return { ok: true };
  });
}

export async function setClassPublished(classId, isPublished) {
  return wrap(async () => {
    const { supabase } = await requireAdmin();
    const { error } = await supabase
      .from("classes")
      .update({ is_published: isPublished })
      .eq("id", classId);

    if (error) return { ok: false, error: error.message };

    revalidatePath("/admin/clases");
    return { ok: true };
  });
}

export async function deleteClass(classId) {
  return wrap(async () => {
    const { supabase } = await requireAdmin();
    const { error } = await supabase.from("classes").delete().eq("id", classId);
    if (error) return { ok: false, error: error.message };

    revalidatePath("/admin/clases");
    return { ok: true };
  });
}

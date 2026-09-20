"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/libs/supabase/server";

// -----------------------------------------------------------------------------
// Acciones del área de atletas.
//
// El XP, la racha y las medallas NO se calculan aquí: los calcula la base de
// datos con un trigger al insertar en workout_logs. Así el número es el mismo
// venga de donde venga el registro (la web, el panel del entrenador o un import).
// -----------------------------------------------------------------------------

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Necesitas iniciar sesión.");
  return { supabase, user };
}

/**
 * Registra una sesión completada y devuelve el XP ganado.
 *
 * @param {object} payload
 * @param {string}  payload.workoutId
 * @param {string} [payload.assignmentId]
 * @param {number} [payload.durationMinutes]
 * @param {number} [payload.effort]           Esfuerzo percibido, 1 a 10
 * @param {string} [payload.notes]
 * @param {boolean}[payload.partial]          true si no terminó toda la sesión
 * @param {Array}  [payload.sets]             Detalle serie a serie
 */
export async function logWorkout(payload = {}) {
  try {
    const { supabase, user } = await requireUser();

    const {
      workoutId,
      assignmentId = null,
      durationMinutes = null,
      effort = null,
      notes = "",
      partial = false,
      sets = [],
    } = payload;

    const { data: log, error } = await supabase
      .from("workout_logs")
      .insert({
        athlete_id: user.id,
        workout_id: workoutId || null,
        assignment_id: assignmentId,
        duration_minutes: durationMinutes ? Number(durationMinutes) : null,
        perceived_effort: effort ? Number(effort) : null,
        notes: notes?.trim() || null,
        status: partial ? "parcial" : "completada",
      })
      .select("id, xp_awarded")
      .single();

    if (error) {
      // El índice único deja registrar la misma sesión una sola vez por día.
      if (error.code === "23505") {
        return {
          ok: false,
          error: "Ya registraste esta sesión hoy. Mañana suma de nuevo.",
        };
      }
      return { ok: false, error: error.message };
    }

    const rows = (sets || [])
      .filter((set) => set?.completed)
      .map((set) => ({
        workout_log_id: log.id,
        exercise_id: set.exerciseId || null,
        library_id: set.libraryId || null,
        exercise_name: set.exerciseName || "Ejercicio",
        set_number: set.setNumber || 1,
        reps: set.reps ? Number(set.reps) : null,
        weight_kg: set.weightKg ? Number(set.weightKg) : null,
        seconds: set.seconds ? Number(set.seconds) : null,
        distance_m: set.distanceM ? Number(set.distanceM) : null,
        completed: true,
      }));

    if (rows.length > 0) {
      await supabase.from("exercise_logs").insert(rows);
    }

    // Medallas recién desbloqueadas (para celebrarlas en pantalla).
    const { data: fresh } = await supabase
      .from("athlete_achievements")
      .select("unlocked_at, achievements ( name, icon, description )")
      .eq("athlete_id", user.id)
      .gte("unlocked_at", new Date(Date.now() - 60_000).toISOString());

    const { data: stats } = await supabase
      .from("athlete_stats")
      .select("xp, level, current_streak, total_workouts")
      .eq("athlete_id", user.id)
      .maybeSingle();

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/plan");
    revalidatePath("/dashboard/ranking");
    revalidatePath("/dashboard/logros");

    return {
      ok: true,
      xp: log.xp_awarded,
      stats: stats || null,
      newAchievements: (fresh || []).map((row) => row.achievements).filter(Boolean),
    };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

const toNumber = (value) => {
  const parsed = Number(value?.toString().replace(",", ".").trim());
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

/** Datos que el propio alumno puede cambiar de su perfil. */
export async function updateMyProfile(formData) {
  try {
    const { supabase, user } = await requireUser();

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: formData.get("full_name")?.toString().trim() || null,
        phone: formData.get("phone")?.toString().trim() || null,
        goal: formData.get("goal")?.toString().trim() || null,
        show_in_ranking: formData.get("show_in_ranking") === "on",
        // Ficha de peleador (la estrategia la escribe el coach; la base la protege)
        weight_kg: toNumber(formData.get("weight_kg")),
        height_cm: toNumber(formData.get("height_cm")),
        weight_class: formData.get("weight_class")?.toString().trim() || null,
        discipline: formData.get("discipline")?.toString().trim() || null,
        fight_record: formData.get("fight_record")?.toString().trim() || null,
      })
      .eq("id", user.id);

    if (error) return { ok: false, error: error.message };

    revalidatePath("/dashboard/perfil");
    revalidatePath("/dashboard/ranking");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

/** Borra un registro propio (devuelve el XP por el trigger de la base). */
export async function deleteWorkoutLog(logId) {
  try {
    const { supabase } = await requireUser();
    const { error } = await supabase.from("workout_logs").delete().eq("id", logId);
    if (error) return { ok: false, error: error.message };

    revalidatePath("/dashboard");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

/** Adaptador para useActionState (React 19): recibe (estadoPrevio, formData). */
export async function updateMyProfileAction(previousState, formData) {
  return updateMyProfile(formData);
}

/** El alumno se apunta a una clase. El cupo lo controla la base de datos. */
export async function bookClass(classId) {
  try {
    const { supabase, user } = await requireUser();

    const { error } = await supabase
      .from("class_bookings")
      .upsert(
        { class_id: classId, athlete_id: user.id, status: "reservada" },
        { onConflict: "class_id,athlete_id" }
      );

    if (error) {
      // El trigger de cupo lanza su propio mensaje, ya en español.
      return { ok: false, error: error.message };
    }

    revalidatePath("/dashboard/clases");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

/** Anula la reserva y libera la plaza. */
export async function cancelClassBooking(classId) {
  try {
    const { supabase, user } = await requireUser();

    const { error } = await supabase
      .from("class_bookings")
      .update({ status: "cancelada" })
      .eq("class_id", classId)
      .eq("athlete_id", user.id);

    if (error) return { ok: false, error: error.message };

    revalidatePath("/dashboard/clases");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

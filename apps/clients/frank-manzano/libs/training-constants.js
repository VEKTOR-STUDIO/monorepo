// -----------------------------------------------------------------------------
// Constantes y cálculos puros del sistema de entrenamiento.
//
// Vive aparte de libs/training.js porque ese importa el cliente de Supabase de
// servidor (next/headers) y los componentes de cliente no pueden tocarlo.
// -----------------------------------------------------------------------------

export const LEVELS = ["principiante", "intermedio", "avanzado"];

export const CATEGORY_LABELS = {
  fuerza: "Fuerza",
  cardio: "Cardio",
  core: "Core",
  movilidad: "Movilidad",
};

// Qué se registra de cada ejercicio según cómo se mide.
export const TYPE_FIELDS = {
  weight_reps: ["reps", "weight_kg"],
  bodyweight_reps: ["reps"],
  assisted_bodyweight: ["reps", "weight_kg"],
  duration: ["seconds"],
  distance_duration: ["distance_m", "seconds"],
};

/**
 * Progreso hacia el nivel siguiente.
 * Misma fórmula que public.level_for_xp() en la base de datos:
 * el nivel N empieza en (N-1)² × 100 XP.
 */
export function levelProgress(xp = 0, level = 1) {
  const floor = (level - 1) ** 2 * 100;
  const ceiling = level ** 2 * 100;
  const span = Math.max(ceiling - floor, 1);
  return {
    floor,
    ceiling,
    missing: Math.max(ceiling - xp, 0),
    percent: Math.min(100, Math.max(0, Math.round(((xp - floor) / span) * 100))),
  };
}

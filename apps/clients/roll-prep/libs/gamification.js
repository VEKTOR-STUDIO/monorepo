// ============================================================================
// Gamificación de RollPrep: puntos (XP) + rangos de cinturón BJJ.
// Los puntos los otorga la base de datos vía triggers (ver la migración
// supabase/migrations/20260721160000_gamification.sql). Aquí solo se leen
// y se traducen a rangos/etiquetas para la UI.
// ============================================================================

// Debe coincidir con los valores de los triggers en la migración.
export const POINT_VALUES = {
  signup: 20,
  profile_completed: 25,
  assignment_completed: 50,
  poll_voted: 10,
  comment_posted: 5,
  tournament_participation: 15,
  tournament_finalist: 50,
  tournament_champion: 100,
};

export const POINT_EVENT_LABELS = {
  signup: "Te uniste al gym",
  profile_completed: "Perfil completado",
  assignment_completed: "Clase estudiada",
  poll_voted: "Voto emitido",
  comment_posted: "Comentario en clase",
  tournament_participation: "Peleaste en un tope",
  tournament_finalist: "Finalista del tope",
  tournament_champion: "Campeón del tope",
};

// Rangos estilo cinturones de BJJ. El umbral es el XP acumulado necesario.
// ~3x respecto a la primera versión (150 / 400 / 800 / 1500).
export const BELTS = [
  { name: "Cinturón Blanco", short: "Blanca", threshold: 0, color: "#f5f5f0" },
  { name: "Cinturón Azul", short: "Azul", threshold: 450, color: "#3b82f6" },
  { name: "Cinturón Violeta", short: "Violeta", threshold: 1200, color: "#a855f7" },
  { name: "Cinturón Marrón", short: "Marrón", threshold: 2400, color: "#92400e" },
  { name: "Cinturón Negro", short: "Negra", threshold: 4500, color: "#18181b" },
];

/**
 * Devuelve el rango actual y el progreso hacia el siguiente:
 * { belt, nextBelt, progress (0-1), pointsIntoBelt, pointsToNext }
 */
export function getRank(totalPoints) {
  const points = Math.max(0, totalPoints ?? 0);

  let beltIndex = 0;
  for (let i = BELTS.length - 1; i >= 0; i--) {
    if (points >= BELTS[i].threshold) {
      beltIndex = i;
      break;
    }
  }

  const belt = BELTS[beltIndex];
  const nextBelt = BELTS[beltIndex + 1] ?? null;

  if (!nextBelt) {
    return { belt, nextBelt: null, progress: 1, pointsIntoBelt: points - belt.threshold, pointsToNext: 0 };
  }

  const span = nextBelt.threshold - belt.threshold;
  const pointsIntoBelt = points - belt.threshold;

  return {
    belt,
    nextBelt,
    progress: Math.min(1, pointsIntoBelt / span),
    pointsIntoBelt,
    pointsToNext: nextBelt.threshold - points,
  };
}

/**
 * Lee el historial de puntos del alumno y devuelve
 * { totalPoints, events }. Si la tabla no existe todavía (migración sin
 * aplicar), devuelve cero sin romper la página.
 */
export async function getStudentPoints(supabase, studentId) {
  const { data: events } = await supabase
    .from("point_events")
    .select("id, kind, points, ref_id, created_at")
    .eq("student_id", studentId)
    .order("created_at", { ascending: false });

  const list = events ?? [];
  const totalPoints = list.reduce((sum, e) => sum + e.points, 0);

  return { totalPoints, events: list };
}

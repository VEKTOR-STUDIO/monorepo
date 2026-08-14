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
  tournament_third: 25,
  tournament_finalist: 50,
  tournament_champion: 100,
  // caos_upset es variable (20 / 40 / 60 según la carta): lo calcula el
  // trigger del CAOS. Aquí queda el piso, solo para referencia.
  caos_upset: 20,
  caos_finish: 20,
};

export const POINT_EVENT_LABELS = {
  signup: "Te uniste al gym",
  profile_completed: "Perfil completado",
  assignment_completed: "Clase estudiada",
  poll_voted: "Voto emitido",
  comment_posted: "Comentario en clase",
  tournament_participation: "Peleaste en un tope",
  tournament_third: "3er puesto del tope",
  tournament_finalist: "Finalista del tope",
  tournament_champion: "Campeón del tope",
  caos_upset: "Remontaste desde la desventaja",
  caos_finish: "Finalizaste en el CAOS",
};

// ----------------------------------------------------------------------------
// CINTURONES Y GRADOS
//
// Como en el tatami: cada cinturón se recorre por grados (los "stripes")
// antes de cambiar de color. `degrees` es el XP de entrada al cinturón y
// después a cada grado, así que el camino completo son 24 rangos:
//   Blanca → Blanca I..IV → Azul → Azul I..IV → ... → Negra I..III
//
// La escala es ~26x la anterior (la Negra estaba en 4.500 XP, hoy abre en
// 52.000). A ritmo de dos clases por semana con voto y comentario — unos
// 600 XP al mes — sale más o menos así:
//   primer grado ~1 mes · Azul ~7 meses · Violeta ~1,5 años ·
//   Marrón ~3,5 años · Negra ~7 años.
// Subir de grado deja de ser trámite y el ranking respira.
// ----------------------------------------------------------------------------

// La tinta del texto sobre la chapa del cinturón: la blanca pide texto
// oscuro, el resto texto claro.
const DARK_INK = "#18181b";
const LIGHT_INK = "#ffffff";

export const BELTS = [
  {
    key: "white",
    name: "Cinturón Blanco",
    short: "Blanca",
    color: "#f5f5f0",
    ink: DARK_INK,
    degrees: [0, 600, 1300, 2100, 3000],
  },
  {
    key: "blue",
    name: "Cinturón Azul",
    short: "Azul",
    color: "#3b82f6",
    ink: LIGHT_INK,
    degrees: [4000, 5600, 7200, 8800, 10400],
  },
  {
    key: "purple",
    name: "Cinturón Violeta",
    short: "Violeta",
    color: "#a855f7",
    ink: LIGHT_INK,
    degrees: [12000, 14800, 17600, 20400, 23200],
  },
  {
    key: "brown",
    name: "Cinturón Marrón",
    short: "Marrón",
    color: "#92400e",
    ink: LIGHT_INK,
    degrees: [26000, 31000, 36000, 41000, 46000],
  },
  {
    // La negra no lleva grados de cinta: lleva danes.
    key: "black",
    name: "Cinturón Negro",
    short: "Negra",
    color: "#18181b",
    ink: LIGHT_INK,
    degrees: [52000, 70000, 92000, 120000],
  },
];

const DEGREE_NUMERALS = ["", "I", "II", "III", "IV"];

/**
 * El camino completo, plano y ordenado por XP: un elemento por grado.
 * Cada rango arrastra los datos de su cinturón para pintarse solo.
 */
export const RANKS = BELTS.flatMap((belt) =>
  belt.degrees.map((threshold, degree) => ({
    key: `${belt.key}-${degree}`,
    beltKey: belt.key,
    // "Cinturón Blanco" — el color, sin el grado.
    name: belt.name,
    // "Blanca II" — lo que se lee en el ranking.
    short: degree ? `${belt.short} ${DEGREE_NUMERALS[degree]}` : belt.short,
    color: belt.color,
    ink: belt.ink,
    degree,
    maxDegree: belt.degrees.length - 1,
    threshold,
  }))
);

/**
 * Devuelve el rango actual y el progreso hacia el siguiente:
 * { belt, nextBelt, progress (0-1), pointsIntoBelt, pointsToNext }
 *
 * `belt` es un rango del camino (cinturón + grado), no solo el color.
 */
export function getRank(totalPoints) {
  const points = Math.max(0, totalPoints ?? 0);

  let rankIndex = 0;
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (points >= RANKS[i].threshold) {
      rankIndex = i;
      break;
    }
  }

  const belt = RANKS[rankIndex];
  const nextBelt = RANKS[rankIndex + 1] ?? null;

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

/** XP con separador de miles: 52000 → "52.000". */
export function formatXp(points) {
  return Number(points ?? 0).toLocaleString("es-VE");
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

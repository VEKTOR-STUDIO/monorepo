// ============================================================================
// Torneos internos (topes) de RollPrep: helpers del bracket de eliminación
// simple. Los puntos los otorga la base de datos vía triggers (ver la
// migración supabase/migrations/20260727120000_tournaments.sql).
//
// Modelo del bracket: el ganador de (round r, slot s) avanza a
// (round r+1, slot floor(s/2)) — como student1 si s es par, student2 si impar.
//
// La ronda más alta tiene dos casillas: el slot 0 es la FINAL y el slot 1 es
// la pelea por el 3er puesto. Ahí caen los dos perdedores de semifinales con
// la misma regla de paridad (semi slot 0 → student1, semi slot 1 → student2).
// ============================================================================

// Debe coincidir con los valores de los triggers en la migración.
export const TOURNAMENT_POINTS = {
  participation: 15,
  finalist: 50,
  champion: 100,
  third: 25,
};

// Slot de la pelea por el 3er puesto dentro de la ronda final. La final es el
// slot 0, así que "la última pelea del bracket" sigue siendo la primera de la
// ronda más alta (round desc, slot asc) — la regla que usan los triggers.
export const BRONZE_SLOT = 1;

// Cómo terminó la pelea: lo típico de BJJ.
export const MATCH_METHODS = {
  submission: "Sumisión",
  points: "Por puntos",
  decision: "Decisión",
  dq: "Descalificación",
  walkover: "No presentado",
};

export const TOURNAMENT_STATUS_LABELS = {
  scheduled: "Programado",
  active: "En curso",
  completed: "Finalizado",
};

export const TOURNAMENT_SCHEDULE_MIGRATION =
  "supabase/migrations/20260813140000_tournament_schedule.sql";

/**
 * La base todavía no tiene scheduled_for o el estado 'scheduled'.
 * Mismo criterio que isMissingCaosRanking en libs/caos.js.
 */
export function isMissingSchedule(error) {
  if (!error) return false;
  if (error.code === "42703" || error.code === "PGRST204") {
    return /scheduled_for/.test(error.message ?? "");
  }
  // El check de status todavía no admite 'scheduled'.
  if (error.code === "23514") {
    return /status/.test(error.message ?? "");
  }
  return false;
}

// ---------------------------------------------------------------------------
// INVITADOS
// Al tope cae gente sin cuenta (el amigo, el de otro gym, el que vino a
// probar). Entran al bracket con un nombre de guerra inventado: el profesor
// no tiene que preguntar cómo se llama cada uno antes de sortear, y en el
// bracket se distingue quién es quién. Si quiere, lo edita a mano.
//
// Los dos pedazos se combinan sin género para que nada quede mal escrito:
// sustantivo + frase con "de/sin". Da ~500 combinaciones.
// ---------------------------------------------------------------------------
export const MAX_GUESTS = 32;
export const MAX_GUEST_NAME = 60;

const GUEST_ALIASES = [
  "Anaconda", "Tiburón", "Machete", "Cocodrilo", "Relámpago", "Tornado",
  "Pantera", "Mandíbula", "Candado", "Guillotina", "Trompo", "Chancleta",
  "Escorpión", "Avalancha", "Bulldog", "Culebra", "Martillo", "Terremoto",
  "Kimura", "Berimbolo", "Araña", "Búfalo", "Ciclón", "Rinoceronte",
];

const GUEST_TAGS = [
  "del Tatami", "de la Esquina", "sin Kimono", "de Otro Gym", "sin Cinturón",
  "de Visita", "del Barrio", "sin Nombre", "de Turno", "del Fondo",
  "de Estreno", "sin Récord", "de Última Hora", "del Sótano",
];

const pick = (list) => list[Math.floor(Math.random() * list.length)];

/**
 * Un nombre de guerra al azar. `taken` (array o Set de nombres ya usados)
 * evita repetidos: si la combinación choca, reintenta; si el azar se pone
 * terco, le pega un número al final.
 */
export function randomGuestName(taken = []) {
  const used = taken instanceof Set ? taken : new Set(taken);

  for (let attempt = 0; attempt < 40; attempt++) {
    const name = `${pick(GUEST_ALIASES)} ${pick(GUEST_TAGS)}`;
    if (!used.has(name)) return name;
  }

  return `${pick(GUEST_ALIASES)} ${used.size + 1}`;
}

/**
 * `count` nombres de guerra distintos entre sí.
 */
export function randomGuestNames(count, taken = []) {
  const used = new Set(taken);
  const names = [];

  for (let i = 0; i < count; i++) {
    const name = randomGuestName(used);
    used.add(name);
    names.push(name);
  }

  return names;
}

/**
 * Nombre de la ronda según cuántas peleas tiene.
 */
export function roundName(matchesInRound) {
  if (matchesInRound === 1) return "Final";
  if (matchesInRound === 2) return "Semifinales";
  if (matchesInRound === 4) return "Cuartos de final";
  if (matchesInRound === 8) return "Octavos de final";
  return `Ronda de ${matchesInRound * 2}`;
}

/**
 * Orden estándar de seeds para un bracket de `size` posiciones (potencia
 * de 2). Ej: size 8 → [1, 8, 4, 5, 2, 7, 3, 6]. Garantiza que los byes
 * (seeds > N) queden repartidos y nunca se enfrenten dos byes.
 */
export function seedOrder(size) {
  let order = [1];
  while (order.length < size) {
    const mirror = order.length * 2 + 1;
    const next = [];
    for (const seed of order) {
      next.push(seed, mirror - seed);
    }
    order = next;
  }
  return order;
}

/**
 * ¿Este cuadro lleva pelea por el 3er puesto? Solo si las dos semifinales se
 * pelean de verdad: hacen falta DOS perdedores para cruzar. En un cuadro de 4
 * las semifinales son la ronda 1, así que un bye deja a uno sin rival y no hay
 * bronce; de 8 en adelante las semifinales siempre llegan llenas.
 */
function hasBronzeMatch(n, size) {
  if (size < 4) return false;
  return size > 4 || n === 4;
}

/**
 * Genera todas las peleas del bracket a partir de la lista YA barajada de
 * ids (el orden del array es el seed). Devuelve filas listas para insertar:
 * { round, slot, student1_id, student2_id, winner_id, method }.
 * Los byes de la ronda 1 quedan resueltos y su peleador avanzado a la 2.
 * La ronda final lleva la final (slot 0) y, si hay semifinales de verdad, la
 * pelea por el 3er puesto (slot 1), que nace vacía como cualquier otra.
 */
export function buildBracket(shuffledIds) {
  const n = shuffledIds.length;
  if (n < 2) return [];

  let size = 2;
  while (size < n) size *= 2;
  const totalRounds = Math.log2(size);
  const order = seedOrder(size);

  const matches = [];
  for (let slot = 0; slot < size / 2; slot++) {
    const seedA = order[slot * 2];
    const seedB = order[slot * 2 + 1];
    matches.push({
      round: 1,
      slot,
      student1_id: seedA <= n ? shuffledIds[seedA - 1] : null,
      student2_id: seedB <= n ? shuffledIds[seedB - 1] : null,
      winner_id: null,
      method: null,
    });
  }

  for (let round = 2; round <= totalRounds; round++) {
    const count = size / 2 ** round;
    for (let slot = 0; slot < count; slot++) {
      matches.push({
        round,
        slot,
        student1_id: null,
        student2_id: null,
        winner_id: null,
        method: null,
      });
    }
  }

  // El loser bracket del sistema: una sola pelea, la de los dos que perdieron
  // en semifinales. Va pegada a la final (misma ronda, slot 1) para que la
  // regla "la final es round desc + slot asc" siga apuntando a la final.
  if (hasBronzeMatch(n, size)) {
    matches.push({
      round: totalRounds,
      slot: BRONZE_SLOT,
      student1_id: null,
      student2_id: null,
      winner_id: null,
      method: null,
    });
  }

  // Resolver los byes de la ronda 1 y avanzar al peleador solitario.
  for (const match of matches) {
    if (match.round !== 1) continue;
    const solo =
      match.student1_id && !match.student2_id
        ? match.student1_id
        : !match.student1_id && match.student2_id
          ? match.student2_id
          : null;
    if (!solo) continue;

    match.winner_id = solo;
    const next = matches.find(
      (m) => m.round === 2 && m.slot === Math.floor(match.slot / 2)
    );
    if (next) {
      if (match.slot % 2 === 0) next.student1_id = solo;
      else next.student2_id = solo;
    }
  }

  return matches;
}

/**
 * Una pelea de ronda 1 con un solo peleador es un pase directo (bye).
 */
export function isBye(match) {
  return (
    match.round === 1 &&
    ((match.student1_id && !match.student2_id) ||
      (!match.student1_id && match.student2_id))
  );
}

/**
 * La ronda más alta del cuadro. Ahí viven la final y el 3er puesto.
 */
export function lastRoundOf(matches) {
  return matches.length ? Math.max(...matches.map((m) => m.round)) : 0;
}

/**
 * La final: ronda más alta, slot 0.
 */
export function finalMatchOf(matches) {
  const last = lastRoundOf(matches);
  return matches.find((m) => m.round === last && m.slot === 0) ?? null;
}

/**
 * La pelea por el 3er puesto: ronda más alta, slot 1. Devuelve null en los
 * cuadros que no la tienen (los de 2, y los de 4 con un bye en semifinales)
 * y en los torneos sorteados antes de que el 3er puesto existiera.
 */
export function bronzeMatchOf(matches) {
  const last = lastRoundOf(matches);
  return matches.find((m) => m.round === last && m.slot === BRONZE_SLOT) ?? null;
}

/**
 * Una semifinal es la pelea cuyo ganador pasa a la ronda final. Su perdedor
 * es el que cae a la pelea por el 3er puesto.
 */
export function isSemifinal(match, matches) {
  return match.round + 1 === lastRoundOf(matches);
}

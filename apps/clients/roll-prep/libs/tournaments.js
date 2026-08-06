// ============================================================================
// Torneos internos (topes) de RollPrep: helpers del bracket de eliminación
// simple. Los puntos los otorga la base de datos vía triggers (ver la
// migración supabase/migrations/20260727120000_tournaments.sql).
//
// Modelo del bracket: el ganador de (round r, slot s) avanza a
// (round r+1, slot floor(s/2)) — como student1 si s es par, student2 si impar.
// ============================================================================

// Debe coincidir con los valores de los triggers en la migración.
export const TOURNAMENT_POINTS = {
  participation: 15,
  finalist: 50,
  champion: 100,
};

// Cómo terminó la pelea: lo típico de BJJ.
export const MATCH_METHODS = {
  submission: "Sumisión",
  points: "Por puntos",
  decision: "Decisión",
  dq: "Descalificación",
  walkover: "No presentado",
};

export const TOURNAMENT_STATUS_LABELS = {
  active: "En curso",
  completed: "Finalizado",
};

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
 * Genera todas las peleas del bracket a partir de la lista YA barajada de
 * ids (el orden del array es el seed). Devuelve filas listas para insertar:
 * { round, slot, student1_id, student2_id, winner_id, method }.
 * Los byes de la ronda 1 quedan resueltos y su peleador avanzado a la 2.
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

/**
 * El guion del video, en un solo sitio.
 *
 * Las cartas están copiadas literalmente de `apps/clients/roll-prep/libs/caos.js`
 * y las cifras de `CONCEPTO.md`. No se inventa copy aquí: si el mazo cambia en
 * la app, este archivo se actualiza a mano y el video vuelve a decir la verdad.
 */

/** El terreno que se enseña en la escena 05. */
export const TERRAIN = {
  key: "suelo_de_lava",
  name: "Suelo de Lava",
  rule: "Nadie puede quedarse de espaldas más de cinco segundos. Al sexto, ventaja para el rival.",
};

/** Los nombres que pasan en la ruleta antes de que caiga el terreno bueno. */
export const TERRAIN_REEL = [
  "Muerte Súbita",
  "Esquina Caliente",
  "Mundo al Revés",
  "Zona de Talones",
  "Aire Viciado",
  "Presión Total",
  "Sin Retirada",
  "Piel de Anguila",
  "Reloj Roto",
  "Manos de Piedra",
];

/** La carta doble de la escena 06: tier 3, la que se graba. */
export const DUEL = {
  key: "t3_rey_de_la_montada",
  tier: 3,
  tierLabel: "Brutal",
  start: "En el suelo, montada armada.",
  alfa: {
    name: "Rey de la Montada",
    rule: "Arrancas montado, con cuatro puntos ya en el marcador.",
  },
  omega: {
    name: "Bajo la Montada",
    rule: "Arrancas debajo de la montada, cuatro puntos abajo. Tu meta: escapar.",
  },
};

/** Cuántas veces sale cada nivel de locura (TIER_ODDS del mazo). */
export const TIERS = [
  { tier: 0, label: "Neutro", odds: 25, note: "Los dos arrancan igual." },
  { tier: 1, label: "Leve", odds: 35, note: "Desbalance chiquito." },
  { tier: 2, label: "Serio", odds: 25, note: "Se siente." },
  { tier: 3, label: "Brutal", odds: 15, note: "El momento de grabar video." },
];

/** Tamaño del mazo No-Gi, el que sale en la escena de los números. */
export const DECK = {
  outfit: "No-Gi",
  terrains: 13,
  duels: 24,
  combos: 312,
};

/** El XP extra que solo existe en la modalidad CAOS. */
export const XP = {
  /** 10 XP por punto de diferencia de peso ⇒ 2 × tier. */
  upset: [20, 40, 60],
  finish: 20,
};

export const CTA = {
  url: "rollprep.alessandrovaru.com/caos",
  sign: "Oss.",
};

/**
 * Episodio 01 · cómo fue el torneo.
 *
 * Las cartas NO se inventan: terrenos, duelos, mitades y arranques están
 * copiados literalmente de `apps/clients/roll-prep/libs/caos.js` —
 * `TERRAINS` y el mazo de duelos— y los niveles de `TIER_LABELS`. Lo único
 * que aporta este archivo es qué salió en cada pelea y quién ganó.
 *
 * El ranking es el de `caos_leaderboard` tal como lo pinta
 * `app/dashboard/ranking/caos/page.js`: PC, récord, sub, remontadas y títulos.
 */
import type { DuelSide } from "../../theme";

/** Una mitad de la carta de duelo, ya con el peleador que le tocó. */
export type Corner = {
  side: DuelSide;
  fighter: string;
  /** El nombre de la mitad: "Encima", "Reloj en Contra", "Tortugas"… */
  name: string;
  rule: string;
  /** "Ventaja +1" / "Carga -2". Los duelos neutros no llevan. */
  edge?: string;
};

export type Match = {
  id: string;
  /** Semifinal, tercer puesto, final. */
  stage: string;
  tier: number;
  /** TIER_LABELS de `libs/caos.js`. */
  tierLabel: string;
  terrain: { name: string; rule: string };
  /** El nombre de la carta de duelo completa. */
  duel: string;
  start: string;
  /** En el orden del bracket, no por lado. */
  corners: [Corner, Corner];
  /** XP de remontada que pagaba la carta, y a quién. `null` en duelo parejo. */
  bounty: { fighter: string; xp: number } | null;
  winner: string;
};

export const EPISODE = {
  number: 1,
  numeral: "01",
  title: "El recap",
  /** EVENT_TYPES.circuit + OUTFITS.nogi de `libs/caos.js`. */
  kind: "Circuito",
  outfit: "No-Gi",
  academy: "Élite Jiu-Jitsu",
} as const;

/** Lo que paga finalizar, igual en las cuatro peleas (CAOS_POINTS.finish). */
export const FINISH_XP = 20;

const PRESION_TOTAL = {
  name: "Presión Total",
  rule: "Cada diez segundos seguidos en posición dominante suman un punto extra. Se acumula.",
};

const MANOS_DE_PIEDRA = {
  name: "Manos de Piedra",
  rule: "Prohibido entrelazar los dedos y prohibido el gable grip. Todo control es con antebrazo, palma abierta y presión.",
};

export const MATCHES: Match[] = [
  {
    id: "semi-1",
    stage: "Semifinal 01",
    tier: 1,
    tierLabel: "Leve",
    terrain: PRESION_TOTAL,
    duel: "Media Guardia",
    start: "En el suelo, media guardia armada.",
    corners: [
      {
        side: "omega",
        fighter: "Juan Marval",
        name: "Debajo",
        rule: "Arrancas abajo en media guardia. Tu meta: recomponer o barrer.",
        edge: "Carga −1",
      },
      {
        side: "alfa",
        fighter: "Kleiner Sandoval",
        name: "Encima",
        rule: "Arrancas arriba en media guardia. Tu meta: pasar.",
        edge: "Ventaja +1",
      },
    ],
    bounty: { fighter: "Juan Marval", xp: 20 },
    winner: "Kleiner Sandoval",
  },
  {
    id: "semi-2",
    stage: "Semifinal 02",
    tier: 2,
    tierLabel: "Serio",
    terrain: {
      name: "Reloj Roto",
      rule: "Tres minutos, sin prórroga. Si terminan empatados, gana el que arrancó en la posición peor.",
    },
    duel: "Reloj en Contra",
    start: "De pie, a distancia de agarre.",
    corners: [
      {
        side: "alfa",
        fighter: "Juan Francisco Vielma",
        name: "El Tiempo Juega",
        rule: "Si pasan dos minutos sin resultado, la pelea es tuya.",
        edge: "Ventaja +2",
      },
      {
        side: "omega",
        fighter: "Adrian Arturo Varela",
        name: "Reloj en Contra",
        rule: "Tienes dos minutos para ganar. Si suenan, pierdes.",
        edge: "Carga −2",
      },
    ],
    bounty: { fighter: "Adrian Arturo Varela", xp: 40 },
    winner: "Juan Francisco Vielma",
  },
  {
    id: "tercero",
    stage: "Tercer puesto",
    tier: 0,
    tierLabel: "Neutro",
    terrain: MANOS_DE_PIEDRA,
    duel: "Tortugas",
    start: "Los dos en tortuga, hombro con hombro.",
    corners: [
      {
        side: "neutro",
        fighter: "Juan Marval",
        name: "Tortugas",
        rule: "Nadie puede voltearse de espaldas. Se sale hacia arriba o hacia la espalda del otro.",
      },
      {
        side: "neutro",
        fighter: "Adrian Arturo Varela",
        name: "Tortugas",
        rule: "Nadie puede voltearse de espaldas. Se sale hacia arriba o hacia la espalda del otro.",
      },
    ],
    bounty: null,
    winner: "Juan Marval",
  },
  {
    id: "final",
    stage: "La final",
    tier: 1,
    tierLabel: "Leve",
    terrain: MANOS_DE_PIEDRA,
    duel: "Mano Muerta",
    start: "De pie, sin agarres.",
    corners: [
      {
        side: "omega",
        fighter: "Kleiner Sandoval",
        name: "Mano Muerta",
        rule: "Solo un agarre a la vez. Si agarras con las dos, sueltas y el rival gana una ventaja.",
        edge: "Carga −1",
      },
      {
        side: "alfa",
        fighter: "Juan Francisco Vielma",
        name: "Manos Libres",
        rule: "Peleas sin restricción de agarres.",
        edge: "Ventaja +1",
      },
    ],
    bounty: { fighter: "Kleiner Sandoval", xp: 20 },
    winner: "Kleiner Sandoval",
  },
];

export type RankingRowData = {
  name: string;
  academy: string;
  wins: number;
  losses: number;
  submissions: number;
  upsets: number;
  titles: number;
  pc: number;
};

/** El tablero como quedó, ordenado por PC. */
export const RANKING: RankingRowData[] = [
  {
    name: "Kleiner Sandoval",
    academy: EPISODE.academy,
    wins: 2,
    losses: 0,
    submissions: 0,
    upsets: 1,
    titles: 1,
    pc: 465,
  },
  {
    name: "Juan Francisco Vielma",
    academy: EPISODE.academy,
    wins: 1,
    losses: 1,
    submissions: 0,
    upsets: 0,
    titles: 0,
    pc: 240,
  },
  {
    name: "Juan Marval",
    academy: EPISODE.academy,
    wins: 1,
    losses: 1,
    submissions: 0,
    upsets: 0,
    titles: 0,
    pc: 190,
  },
  {
    name: "Adrian Arturo Varela",
    academy: EPISODE.academy,
    wins: 0,
    losses: 2,
    submissions: 0,
    upsets: 0,
    titles: 0,
    pc: 40,
  },
];

export const CHAMPION = RANKING[0];

export const CTA = {
  url: "rollprep.alessandrovaru.com/caos",
  sign: "Oss.",
} as const;

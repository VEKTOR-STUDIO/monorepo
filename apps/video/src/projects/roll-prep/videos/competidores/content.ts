/**
 * Episodio 02 · quién pelea.
 *
 * Los nombres los pone el profesor a mano, igual que en la story de lineup de
 * la app (`components/rollprep/LineupStudio.js`): el bracket todavía no existe
 * el día que se publica esto. Este archivo es el único que cambia de un
 * episodio al siguiente — las escenas leen de aquí y no saben de nadie.
 *
 * `belt` usa las claves de `theme.ts`, que son las de `libs/gamification.js`.
 */
import type { BeltKey } from "../../theme";

export type Fighter = {
  slot: number;
  name: string;
  belt: BeltKey;
  /** Opcional: si se sabe la academia, sale junto al cinturón. */
  academy?: string;
};

export const EPISODE = {
  number: 2,
  /** Como se pinta en pantalla: dos dígitos, estilo cartelera. */
  numeral: "02",
  title: "Los competidores",
  /** EVENT_TYPES.circuit de `libs/caos.js`: el evento que se arma para grabarlo. */
  kind: "Circuito",
  /** OUTFITS de `libs/caos.js`. Cambiar a "Gi" si el episodio se pelea con kimono. */
  outfit: "No-Gi",
  date: {
    weekday: "Viernes",
    weekdayShort: "Vie",
    day: "28",
    month: "Ago",
    monthLong: "Agosto",
    year: "2026",
  },
} as const;

/** Los cuatro que se suben al tatami, en orden de cartelera. */
export const FIGHTERS: Fighter[] = [
  { slot: 1, name: "Kleider Sandoval", belt: "brown", academy: "Elite Jiujitsu" },
  { slot: 2, name: "Kevin Medina", belt: "purple", academy: "Elite Jiujitsu" },
  { slot: 3, name: "Anderson Peña", belt: "purple", academy: "Elite Jiujitsu" },
  { slot: 4, name: "Felipe Chang", belt: "purple", academy: "Elite Jiujitsu" },
];

/** Fecha corta para las chapas: "VIE 28 AGO". */
export const DATE_TAG = `${EPISODE.date.weekdayShort} ${EPISODE.date.day} ${EPISODE.date.month}`;

export const CTA = {
  url: "rollprep.alessandrovaru.com/caos",
  sign: "Oss.",
} as const;

/**
 * El montaje del episodio, escena por escena.
 *
 * Mismo trato que en `modo-caos/timeline.ts`: cada escena declara cuánto dura,
 * los frames de entrada se calculan solos y `TOTAL` con ellos. La diferencia
 * es que aquí el bloque del medio no está escrito a mano — sale de `FIGHTERS`,
 * así que agregar o quitar un competidor recoloca el video entero sin tocar
 * nada más.
 */
import { FIGHTERS } from "./content";

export const FPS = 30;

const s = (seconds: number) => Math.round(seconds * FPS);

/** Lo que la escena necesita saber de sí misma para renderizarse. */
export type SceneSpec =
  | { id: string; title: string; frames: number; kind: "portada" | "cartelera" | "cierre" }
  | { id: string; title: string; frames: number; kind: "peleador"; index: number };

export const SCENE_LIST: SceneSpec[] = [
  { id: "portada", title: "Episodio 02", frames: s(4.5), kind: "portada" },

  // Uno por competidor: entra, se lee el nombre, corte. Tres segundos y pico
  // es lo que aguanta una story antes de que el dedo se vaya.
  ...FIGHTERS.map((fighter, index) => ({
    id: `peleador-${fighter.slot}`,
    title: fighter.name,
    frames: s(3.2),
    kind: "peleador" as const,
    index,
  })),

  { id: "cartelera", title: "Los cuatro", frames: s(6), kind: "cartelera" },
  { id: "cierre", title: "Cierre", frames: s(4.5), kind: "cierre" },
];

/** Cada escena con su frame de entrada ya resuelto. */
export const SCENES = SCENE_LIST.reduce<Array<SceneSpec & { from: number }>>((acc, scene) => {
  const previous = acc[acc.length - 1];
  const from = previous ? previous.from + previous.frames : 0;
  acc.push({ ...scene, from });
  return acc;
}, []);

export const TOTAL = SCENES.reduce((sum, scene) => sum + scene.frames, 0);

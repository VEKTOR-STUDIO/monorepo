/**
 * El montaje del recap.
 *
 * Igual que en los otros videos: cada escena declara su duración, los frames
 * de entrada se resuelven solos y `TOTAL` con ellos. El bloque del medio sale
 * de `MATCHES`, así que un torneo de ocho peleas se recorta solo desde
 * `content.ts` sin tocar el montaje.
 */
import { MATCHES } from "./content";

export const FPS = 30;

const s = (seconds: number) => Math.round(seconds * FPS);

export type SceneSpec =
  | { id: string; title: string; frames: number; kind: "portada" | "ranking" | "cierre" }
  | { id: string; title: string; frames: number; kind: "combate"; index: number };

export const SCENE_LIST: SceneSpec[] = [
  { id: "portada", title: "Episodio 01", frames: s(4.5), kind: "portada" },

  // Una pelea por escena. Seis segundos y medio es lo que tarda en leerse el
  // terreno, las dos mitades y el resultado sin que se sienta una ficha
  // técnica: es un recap, no el reglamento.
  ...MATCHES.map((match, index) => ({
    id: match.id,
    title: match.stage,
    frames: s(6.5),
    kind: "combate" as const,
    index,
  })),

  { id: "ranking", title: "El tablero", frames: s(7.5), kind: "ranking" },
  { id: "cierre", title: "Cierre", frames: s(4.5), kind: "cierre" },
];

export const SCENES = SCENE_LIST.reduce<Array<SceneSpec & { from: number }>>((acc, scene) => {
  const previous = acc[acc.length - 1];
  const from = previous ? previous.from + previous.frames : 0;
  acc.push({ ...scene, from });
  return acc;
}, []);

export const TOTAL = SCENES.reduce((sum, scene) => sum + scene.frames, 0);

/**
 * El montaje del video, escena por escena.
 *
 * Todo el timing sale de aquí: cambiar la duración de una escena recoloca las
 * siguientes solas y `TOTAL` se recalcula. Ninguna escena conoce su posición
 * absoluta — cada una anima desde su frame 0 dentro de su `<Sequence>`.
 */
export const FPS = 30;

const s = (seconds: number) => Math.round(seconds * FPS);

export const SCENE_LIST = [
  { id: "hook", title: "Modo Caos", frames: s(4.5) },
  { id: "roll", title: "El roll de siempre", frames: s(5.5) },
  { id: "idea", title: "Mismo juego, otras reglas", frames: s(5.5) },
  { id: "dado", title: "La ceremonia", frames: s(6) },
  { id: "terreno", title: "El terreno", frames: s(7) },
  { id: "duelo", title: "El duelo", frames: s(8.5) },
  { id: "tiers", title: "Niveles de locura", frames: s(6.5) },
  { id: "balance", title: "La regla de oro", frames: s(8) },
  { id: "mazo", title: "El mazo", frames: s(5.5) },
  { id: "cierre", title: "Cierre", frames: s(5) },
] as const;

export type SceneId = (typeof SCENE_LIST)[number]["id"];

/** Cada escena con su frame de entrada ya resuelto. */
export const SCENES = SCENE_LIST.reduce<
  Array<{ id: SceneId; title: string; from: number; frames: number }>
>((acc, scene) => {
  const previous = acc[acc.length - 1];
  const from = previous ? previous.from + previous.frames : 0;
  acc.push({ ...scene, from });
  return acc;
}, []);

export const TOTAL = SCENES.reduce((sum, scene) => sum + scene.frames, 0);

export const sceneAt = (id: SceneId) => {
  const scene = SCENES.find((item) => item.id === id);
  if (!scene) throw new Error(`Escena desconocida: ${id}`);
  return scene;
};

/**
 * El montaje de los videos de concesionario: 20 segundos justos, igual para las
 * trece marcas. Cambiar una duración recoloca las demás y `TOTAL` se recalcula.
 */
export const FPS = 30;

const s = (seconds: number) => Math.round(seconds * FPS);

export const SCENE_LIST = [
  { id: "portada", title: "La marca", frames: s(3) },
  { id: "problema", title: "Lo que pasa hoy", frames: s(3.4) },
  { id: "web", title: "Su web, en el teléfono", frames: s(6.6) },
  { id: "diferencial", title: "Lo que solo tiene esta marca", frames: s(3.3) },
  { id: "cierre", title: "Precio y firma", frames: s(3.7) },
] as const;

export type SceneId = (typeof SCENE_LIST)[number]["id"];

export const SCENES = SCENE_LIST.reduce<
  Array<{ id: SceneId; title: string; from: number; frames: number }>
>((acc, scene) => {
  const previous = acc[acc.length - 1];
  const from = previous ? previous.from + previous.frames : 0;
  acc.push({ ...scene, from });
  return acc;
}, []);

export const TOTAL = SCENES.reduce((sum, scene) => sum + scene.frames, 0);

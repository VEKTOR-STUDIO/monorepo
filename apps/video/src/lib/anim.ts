import { Easing, interpolate, random } from "remotion";

/** Curva de salida de la app (`cubic-bezier(0.22, 1, 0.36, 1)`): entra rápido, frena suave. */
export const easeOut = Easing.bezier(0.22, 1, 0.36, 1);

/** La que rebota (`cubic-bezier(0.22, 1.4, 0.36, 1)`): pasa de largo y regresa. */
export const easeOvershoot = Easing.bezier(0.22, 1.4, 0.36, 1);

/** Entrada arcade: mucha inercia al principio, clavada al final. */
export const easeSlam = Easing.bezier(0.16, 1, 0.3, 1);

type Range = { delay?: number; duration?: number; easing?: typeof easeOut };

/**
 * Progreso 0→1 de una animación que arranca en `delay` y dura `duration`.
 * Todo lo demás en este archivo se construye encima de esto.
 */
export const progress = (
  frame: number,
  { delay = 0, duration = 20, easing = easeOut }: Range = {}
): number =>
  interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

/** Aparece subiendo, como `.rise` en la app. */
export const riseIn = (frame: number, opts: Range & { travel?: number } = {}) => {
  const p = progress(frame, { duration: 18, ...opts });
  return {
    opacity: p,
    transform: `translateY(${(1 - p) * (opts.travel ?? 24)}px)`,
  };
};

/**
 * `caos-slam`: la carta cae desde arriba, se pasa de largo, y clava.
 * Es la misma curva que usa la ceremonia real en CSS.
 */
export const slamIn = (frame: number, { delay = 0, duration = 17 }: Range = {}) => {
  const p = progress(frame, { delay, duration, easing: easeOvershoot });
  const y = interpolate(p, [0, 0.55, 0.75, 1], [-140, 6, -3, 0]);
  const scale = interpolate(p, [0, 0.55, 0.75, 1], [1.4, 0.96, 1.02, 1]);
  const rot = interpolate(p, [0, 0.55, 1], [-6, 1, 0]);

  return {
    opacity: progress(frame, { delay, duration: 5 }),
    transform: `translateY(${y}%) scale(${scale}) rotate(${rot}deg)`,
  };
};

/** `caos-fly-left` / `caos-fly-right`: las cartas de duelo chocan en el centro. */
export const flyIn = (
  frame: number,
  from: "left" | "right",
  { delay = 0, duration = 15 }: Range = {}
) => {
  const sign = from === "left" ? -1 : 1;
  const p = progress(frame, { delay, duration, easing: easeSlam });
  const x = interpolate(p, [0, 0.7, 1], [160 * sign, -6 * sign, 0]);
  const skew = interpolate(p, [0, 0.7, 1], [14 * -sign, 4 * -sign, 0]);

  return {
    opacity: progress(frame, { delay, duration: 4 }),
    transform: `translateX(${x}%) skewX(${skew}deg)`,
  };
};

/**
 * Temblor determinista. Usa `random()` de Remotion con el frame de semilla:
 * el mismo frame tiembla igual en cada render, que es lo que hace que un
 * render distribuido no salga con costuras.
 */
export const shake = (frame: number, amount: number): string => {
  if (amount <= 0) return "translate3d(0, 0, 0)";
  const x = (random(`shake-x-${frame}`) - 0.5) * 2 * amount;
  const y = (random(`shake-y-${frame}`) - 0.5) * 2 * amount;
  return `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
};

/** Latido lento, para auras y watermarks. */
export const breathe = (frame: number, periodInFrames: number): number =>
  (Math.sin((frame / periodInFrames) * Math.PI * 2) + 1) / 2;

/**
 * Cuenta un número hacia arriba. Redondea al entero para que no se vean
 * decimales bailando en pantalla.
 */
export const countTo = (frame: number, to: number, opts: Range = {}): number =>
  Math.round(progress(frame, { duration: 30, ...opts }) * to);

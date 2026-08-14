/**
 * El tema `rollprep` traducido a hex.
 *
 * La app define su paleta en oklch dentro de `apps/clients/roll-prep/app/globals.css`.
 * Aquí van los mismos tonos ya convertidos a sRGB, porque el compositor de
 * Remotion renderiza sobre Chrome headless y conviene no depender de que el
 * color space del build coincida con el del navegador del diseñador.
 *
 * Si la paleta de la app cambia, este archivo es el único sitio que hay que
 * tocar en todo el proyecto de video.
 */
export const colors = {
  /** Fondo principal. oklch(15% 0.004 270) */
  base100: "#0A0B0D",
  /** Superficie de paneles y cartas. oklch(19% 0.005 270) */
  base200: "#131416",
  /** Bordes y separadores. oklch(26% 0.006 270) */
  base300: "#232427",
  /** Tinta sobre fondo oscuro. oklch(96% 0.003 90) */
  baseContent: "#F2F2EF",

  /**
   * Volt neón: el color de la casa y del lado ALFA.
   * El CSS lo declara como `--color-volt: #d4ff00` además del token primary,
   * y ese es el valor de marca que manda.
   */
  primary: "#D4FF00",
  primaryContent: "#0A0B0D",

  secondary: "#F8F8F8",

  /** Rojo de peligro: el lado OMEGA, el que carga la desventaja. */
  accent: "#FF5223",
  accentContent: "#F8F8F8",

  neutral: "#1C1D1F",
  info: "#00BAFD",
  success: "#5FED6C",
  warning: "#FFC31A",
  error: "#F9262A",
} as const;

export const fonts = {
  /** Anton condensado en mayúsculas: todo titular. */
  display: "Anton, Impact, sans-serif",
  /** Barlow: cuerpo, etiquetas y cifras. */
  sans: "Barlow, 'Helvetica Neue', sans-serif",
} as const;

/** Rutas dentro de `public/`. Todo asset del cliente cuelga de su slug. */
export const assets = {
  logo: "roll-prep/images/logo.png",
  caosVolt: "roll-prep/images/caosPrimary.png",
  caosInk: "roll-prep/images/caosBlack.png",
} as const;

/** Colores de chapa por lado del duelo, tal como los pinta la app. */
export const sideColor = {
  alfa: colors.primary,
  omega: colors.accent,
  neutro: colors.secondary,
} as const;

export type DuelSide = keyof typeof sideColor;

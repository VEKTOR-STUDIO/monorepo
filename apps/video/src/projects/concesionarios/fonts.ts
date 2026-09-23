import barlowCondensed from "./assets/fonts/BarlowCondensed-ExtraBoldItalic.ttf";
import chakraPetch from "./assets/fonts/ChakraPetch-Bold.ttf";
import cinzel from "./assets/fonts/Cinzel-Bold.ttf";
import exo2 from "./assets/fonts/Exo2-ExtraBoldItalic.ttf";
import microgramma from "./assets/fonts/Microgramma.otf";
import questrial from "./assets/fonts/Questrial-Regular.ttf";
import russoOne from "./assets/fonts/RussoOne-Regular.ttf";
import sairaBold from "./assets/fonts/Saira-Bold.ttf";
import sairaSemi from "./assets/fonts/Saira-SemiBold.ttf";
import soraBold from "./assets/fonts/Sora-Bold.ttf";

/**
 * Las tipografías de los videos de concesionarios, incrustadas igual que las de
 * RollPrep (ver `src/projects/roll-prep/fonts.ts`): data URI por la regla
 * `asset/inline` de `remotion.config.ts` y `@font-face` normal, sin
 * `delayRender`.
 *
 * Dos son de la casa y salen en los trece videos:
 *   · **Microgramma** — la firma de Vektor (y antes de Alessandrovaru): las
 *     etiquetas, el dominio y el crédito final.
 *   · **Questrial** — la voz del texto corrido. Es la del cuerpo de
 *     Aprovéchalo y Citta, y aquí hace de narrador neutro entre marcas.
 *
 * Las demás son los titulares de cada web, un solo peso por familia: el que usa
 * su clase `.display`. Los nombres llevan prefijo `CV` para no chocar con las
 * de otros proyectos del estudio.
 */
const STYLE_ID = "concesionarios-fonts";

export const FAMILIAS = {
  microgramma: "CV Microgramma",
  questrial: "CV Questrial",
  sora: "CV Sora",
  sairaBold: "CV Saira Bold",
  sairaSemi: "CV Saira SemiBold",
  barlow: "CV Barlow Condensed",
  cinzel: "CV Cinzel",
  chakra: "CV Chakra Petch",
  russo: "CV Russo One",
  exo: "CV Exo 2",
} as const;

const face = (
  family: string,
  url: string,
  { weight = 400, italic = false, format = "truetype" } = {}
) =>
  [
    "@font-face{",
    `font-family:"${family}";`,
    // Comillas obligatorias: el `;` de `;base64,` cortaría la declaración.
    `src:url("${url}") format("${format}");`,
    `font-weight:${weight};`,
    `font-style:${italic ? "italic" : "normal"};`,
    "font-display:block;",
    "}",
  ].join("");

// Cada familia se declara con el peso que la marca le pide en `marcas.ts`, así
// el navegador no sintetiza negritas ni itálicas encima de las reales.
export const CONCESIONARIOS_FONT_CSS = [
  face(FAMILIAS.microgramma, microgramma, { format: "opentype" }),
  face(FAMILIAS.questrial, questrial),
  face(FAMILIAS.sora, soraBold, { weight: 700 }),
  face(FAMILIAS.sairaBold, sairaBold, { weight: 700 }),
  face(FAMILIAS.sairaSemi, sairaSemi, { weight: 600 }),
  face(FAMILIAS.barlow, barlowCondensed, { weight: 800, italic: true }),
  face(FAMILIAS.cinzel, cinzel, { weight: 700 }),
  face(FAMILIAS.chakra, chakraPetch, { weight: 700 }),
  face(FAMILIAS.russo, russoOne),
  face(FAMILIAS.exo, exo2, { weight: 800, italic: true }),
].join("\n");

if (typeof document !== "undefined" && !document.getElementById(STYLE_ID)) {
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = CONCESIONARIOS_FONT_CSS;
  document.head.append(style);
}

import antonRegular from "./assets/fonts/Anton-Regular.ttf";
import barlowBold from "./assets/fonts/Barlow-Bold.ttf";
import barlowRegular from "./assets/fonts/Barlow-Regular.ttf";

/**
 * Anton y Barlow, declaradas por CSS con la fuente incrustada en el propio
 * archivo.
 *
 * Dos decisiones que costaron un par de renders caídos:
 *
 * 1. **Incrustadas, no servidas.** Los imports de arriba pasan por la regla
 *    `asset/inline` de `remotion.config.ts` y llegan como data URI. Sirviéndolas
 *    desde `public/`, cada pestaña de Chrome tenía que ir a buscar los tres TTF
 *    por HTTP y alguna petición se quedaba colgada.
 *
 * 2. **Sin `delayRender`.** La tentación es retener el render hasta que
 *    `FontFace.load()` resuelva, pero esa promesa se cuelga y tumba el render
 *    entero a mitad de camino. No hace falta: Remotion ya espera
 *    `document.fonts.ready` antes de capturar CADA frame
 *    (`@remotion/renderer/dist/seek-to-frame.js`). Declarando las caras por CSS,
 *    Chrome las carga durante el layout y Remotion espera solo. Si algo fallara,
 *    se vería un frame con la tipografía de respaldo — no un render muerto.
 */
const STYLE_ID = "roll-prep-fonts";

const face = (family: string, url: string, weight: number) =>
  [
    "@font-face{",
    `font-family:"${family}";`,
    // Las comillas alrededor del data URI no son opcionales: sin ellas el `;`
    // del `;base64,` corta la declaración de CSS a la mitad.
    `src:url("${url}") format("truetype");`,
    `font-weight:${weight};`,
    "font-style:normal;",
    // `block` evita el parpadeo con la fuente de respaldo: el texto espera.
    "font-display:block;",
    "}",
  ].join("");

export const ROLL_PREP_FONT_CSS = [
  face("Anton", antonRegular, 400),
  face("Barlow", barlowRegular, 400),
  face("Barlow", barlowBold, 700),
].join("\n");

if (typeof document !== "undefined" && !document.getElementById(STYLE_ID)) {
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = ROLL_PREP_FONT_CSS;
  document.head.append(style);
}

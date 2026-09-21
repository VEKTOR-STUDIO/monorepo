#!/usr/bin/env node
/**
 * Genera los iconos de Veloce Autos.
 * Uso: npm run generate-favicon  (o: node scripts/generate-favicon.mjs)
 *
 * El dibujo es la propia marca —la V alada, trazada de su foto de perfil— y no
 * una versión simplificada: son doce rectas, caben en 16 px y no hace falta
 * inventar nada para que se reconozca.
 *
 * Dos decisiones que vienen de su avatar y no de un gusto:
 *
 *   · NEGRO SOBRE BLANCO, al revés que la página. Así está su foto de perfil de
 *     Instagram, así está su comunicado, y así es como la gente ya reconoce
 *     esta marca. Además, un cuadro blanco se ve tanto en una barra de
 *     pestañas clara como en una oscura; uno negro desaparece en la oscura.
 *   · SIN PÚAS POR DEBAJO DE 32 px. Las dos púas interiores van separadas del
 *     cuerpo por un hueco de menos de dos unidades de las 143 de ancho: a
 *     16 px ese hueco no cabe en un píxel, se empastan con el cuerpo y la
 *     marca se convierte en un borrón. Quitarlas conserva el gesto.
 *
 * No hay ningún archivo de imagen que mantener a mano: si cambia el trazado,
 * se cambia en components/MarcaVeloce.js, se copia aquí y se vuelve a correr.
 */

import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");
const appDir = join(__dirname, "..", "app");

const NEGRO = "#0A0A0B";
const BLANCO = "#FFFFFF";

// El mismo trazado que components/MarcaVeloce.js, en su caja de 143.1 × 100.
const CUERPO =
  "M143.1 0.1L136.3 10.2L93.7 30.9L81.1 85.2L71.6 100L62 85.2L49.5 30.9L6.8 10.2L0 0.1L58.4 26.4L71.6 87.4L84.7 26.4Z";
const PUAS = [
  "M89.2 71L97.8 33.7L133.3 16.1L126 27.6L106.8 37.9L104.5 48.1Z",
  "M53.9 71L45.3 33.7L9.8 16.1L17.1 27.6L36.3 37.9L38.6 48.1Z",
];

const ANCHO_MARCA = 143.1;
const ALTO_MARCA = 100;

function construir(lado) {
  // Todo se mide sobre una rejilla de 64 y se escala con el atributo width.
  // En los tamaños grandes la marca ocupa 46 de esas 64 unidades, que deja el
  // mismo margen que tiene dentro de su círculo de Instagram. En los pequeños
  // se agranda: el trazo de esta V es muy fino y a 16 px, con el margen
  // completo, se queda en menos de un píxel de grosor y no se ve nada. Llenar
  // el cuadro es lo que le devuelve el peso.
  const anchoDestino = lado <= 16 ? 60 : lado <= 32 ? 54 : 46;
  const escala = anchoDestino / ANCHO_MARCA;
  const x = (64 - anchoDestino) / 2;
  const y = (64 - ALTO_MARCA * escala) / 2;

  const conPuas = lado >= 32;
  const trazos = [CUERPO, ...(conPuas ? PUAS : [])]
    .map((d) => `      <path d="${d}"/>`)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${lado}" height="${lado}" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="${BLANCO}"/>
  <g transform="translate(${x} ${y.toFixed(2)}) scale(${escala.toFixed(5)})" fill="${NEGRO}">
${trazos}
  </g>
</svg>
`;
}

const salidas = [
  [join(publicDir, "favicon-16.svg"), 16],
  [join(publicDir, "favicon-32.svg"), 32],
  [join(publicDir, "favicon.svg"), 64],
  [join(publicDir, "apple-touch-icon.svg"), 180],
  // Los que lee Next para <link rel="icon"> y el icono de iOS.
  [join(appDir, "icon.svg"), 64],
  [join(appDir, "apple-icon.svg"), 180],
];

for (const [ruta, lado] of salidas) {
  writeFileSync(ruta, construir(lado), "utf8");
  console.log("·", ruta.replace(join(__dirname, ".."), "."));
}

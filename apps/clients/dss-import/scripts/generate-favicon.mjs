#!/usr/bin/env node
/**
 * Genera los iconos de DSS Import & Export.
 * Uso: npm run generate-favicon  (o: node scripts/generate-favicon.mjs)
 *
 * El dibujo es su sello reducido a lo que sobrevive a 32 px: el disco de pan de
 * oro y la S del monograma calada en negro encima. El sello completo —la S
 * caligráfica cruzando la D, el rótulo "IMPORT & EXPORT" en arco— a este tamaño
 * es una mancha marrón, así que no se intenta.
 *
 * DOS COSAS QUE SE PROBARON Y NO FUNCIONAN A ESTE TAMAÑO:
 *
 *   · Las tres letras "DSS". A 16 px son seis píxeles por letra: se leen como
 *     un borrón. Una sola letra grande siempre gana.
 *   · El monograma S sobre D. Lo que lo hace reconocible en grande es que los
 *     dos trazos se cruzan, y ese cruce a 16 px cierra los contrafuertes y deja
 *     un cuadrado relleno.
 *
 * El disco va con un degradado, no con un amarillo plano: es lo que hace que se
 * lea como pan de oro. Y va REDONDO, no con esquinas redondeadas, porque su
 * logotipo es un sello circular; un cuadrado dorado sería otra marca.
 *
 * No hay ningún archivo de imagen que mantener a mano: si cambia el oro, se
 * cambia aquí y se vuelve a correr.
 */

import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");
const appDir = join(__dirname, "..", "app");

const NEGRO = "#0D0D0D";
const ORO = "#D9A72C";
const ORO_CLARO = "#F5DE8A";
const ORO_HONDO = "#A9761A";

function construir(lado) {
  // A 16 px la S tiene que ocupar casi toda la caja o no se lee nada.
  const fuente = lado <= 16 ? 52 : 46;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${lado}" height="${lado}" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="oro" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${ORO_CLARO}"/>
      <stop offset="45%" stop-color="${ORO}"/>
      <stop offset="100%" stop-color="${ORO_HONDO}"/>
    </linearGradient>
  </defs>
  <circle cx="32" cy="32" r="32" fill="url(#oro)"/>
  <text
    x="50%"
    y="54%"
    dominant-baseline="central"
    text-anchor="middle"
    font-family="Georgia, 'Times New Roman', serif"
    font-weight="700"
    font-size="${fuente}"
    fill="${NEGRO}"
  >S</text>
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

#!/usr/bin/env node
/**
 * Genera los iconos de Coronado Carss.
 * Uso: npm run generate-favicon  (o: node scripts/generate-favicon.mjs)
 *
 * El dibujo es SU RECUADRO reducido a lo que sobrevive a 32 px: el cuadro azul
 * rey y las dos líneas de "CORONADO / CARSS" en amarillo neón, la de arriba
 * larga y la de abajo corta, inclinadas como sus letras. A este tamaño las
 * letras serían una mancha; las dos barras, en cambio, se leen como su
 * logotipo de un vistazo, que es lo que hace un icono de pestaña.
 *
 * Son trazados y no texto a propósito: un <text> en un favicon se pinta con
 * la fuente del sistema de cada quien y nunca sale igual.
 *
 * A 16 px las barras van un poco más gruesas: a su grosor normal medirían un
 * píxel y medio y se ensuciarían.
 *
 * No hay ningún archivo de imagen que mantener a mano: si cambia algo, se
 * cambia aquí y se vuelve a correr.
 */

import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");
const appDir = join(__dirname, "..", "app");

const AZUL = "#0B4DC4";
const LIMA = "#E3F52A";

/** Un paralelogramo con la pendiente de la casa (unos 12°). */
function barra(x, y, ancho, alto) {
  const sesgo = alto * 0.21;
  return `M${x + sesgo} ${y} L${x + ancho + sesgo} ${y} L${x + ancho} ${y + alto} L${x} ${y + alto} Z`;
}

function construir(lado) {
  const grueso = lado <= 16 ? 14 : 11;
  const d = [
    barra(10, 17, 44, grueso),
    barra(10, 35, 26, grueso),
  ].join(" ");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${lado}" height="${lado}" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="10" fill="${AZUL}"/>
  <path d="${d}" fill="${LIMA}"/>
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

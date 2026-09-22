#!/usr/bin/env node
/**
 * Genera los iconos de DealerNauta Cars.
 * Uso: npm run generate-favicon  (o: node scripts/generate-favicon.mjs)
 *
 * El dibujo es el emblema reducido a lo que sobrevive a 32 px: el negro, el ala
 * naranja, la plateada por debajo y las siglas que van dentro del carro de su
 * logotipo. El escudo completo —el arco de texto, las estrellas, el rótulo— a
 * este tamaño es una mancha, así que no se intenta.
 *
 * No hay ningún archivo de imagen que mantener a mano: si cambia el naranja, se
 * cambia aquí y se vuelve a correr.
 */

import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");
const appDir = join(__dirname, "..", "app");

const NEGRO = "#0D0D0D";
const NARANJA = "#F07423";
const PLATA = "#C8CBD0";
const BLANCO = "#FFFFFF";

const tamaños = [16, 32, 64, 180];

function construir(lado) {
  const u = lado / 64; // todo está medido sobre una rejilla de 64
  // A 16 px "DC" tiene que ocupar casi toda la caja o no se lee nada.
  const fuente = lado <= 16 ? 32 : 30;
  void u;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${lado}" height="${lado}" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="${NEGRO}"/>
  <path d="M2 22 L60 14 L58 23 L4 31 Z" fill="${NARANJA}"/>
  <path d="M8 50 L62 44 L60 50 L10 55 Z" fill="${PLATA}" opacity="0.55"/>
  <text
    x="50%"
    y="56%"
    dominant-baseline="central"
    text-anchor="middle"
    font-family="Arial Narrow, Arial, system-ui, sans-serif"
    font-weight="700"
    font-style="italic"
    font-size="${fuente}"
    fill="${BLANCO}"
  >DC</text>
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

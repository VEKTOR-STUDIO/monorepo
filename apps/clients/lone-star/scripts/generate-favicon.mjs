#!/usr/bin/env node
/**
 * Genera los iconos de Lone Star All In Autos.
 * Uso: npm run generate-favicon  (o: node scripts/generate-favicon.mjs)
 *
 * El dibujo es el emblema reducido a lo que sobrevive a 32 px: el círculo
 * negro con su filo rojo y la estrella partida en blanco y rojo. El rótulo, las
 * pickups y el buque a este tamaño son una mancha, así que no se intentan.
 *
 * No hay ningún archivo de imagen que mantener a mano: si cambia el rojo, se
 * cambia aquí y se vuelve a correr.
 */

import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");
const appDir = join(__dirname, "..", "app");

const NEGRO = "#0B0A0A";
const ROJO = "#E3161E";
const BLANCO = "#FFFFFF";

function construir(lado) {
  // A 16 px el filo rojo se come la estrella si es tan grueso como a 64.
  const filo = lado <= 16 ? 3 : 2.5;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${lado}" height="${lado}" viewBox="0 0 64 64">
  <circle cx="32" cy="32" r="${32 - filo / 2}" fill="${NEGRO}" stroke="${ROJO}" stroke-width="${filo}"/>
  <g transform="translate(9 8.5) scale(0.46)">
    <path d="M48.5 5 L38.5 37.2 L4.3 38.2 L31.5 59 L21.8 91.8 L48.5 73.5 Z" fill="${BLANCO}"/>
    <path d="M51.5 5 L61.5 37.2 L95.7 38.2 L68.5 59 L78.2 91.8 L51.5 73.5 Z" fill="${ROJO}"/>
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

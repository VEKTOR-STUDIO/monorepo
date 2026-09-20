#!/usr/bin/env node
/**
 * Genera los iconos de Aprovéchalo.
 * Uso: npm run generate-favicon  (o: node scripts/generate-favicon.mjs)
 *
 * El dibujo es el de la marca: la inicial en blanco sobre el azul de la casa,
 * con la banda diagonal de tres franjas debajo. No hay ningún archivo de
 * imagen que mantener; si cambia el azul, se cambia aquí y se vuelve a correr.
 */

import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");

const AZUL = "#0B5FB0";
const AZUL_CLARO = "#5B9BD5";
const ROJO = "#D0303A";
const BLANCO = "#FFFFFF";

const tamaños = [16, 32, 64, 180];

function construir(lado) {
  const fuente = Math.round(lado * 0.58);
  const bandaY = Math.round(lado * 0.8);
  const bandaAlto = Math.max(1, Math.round(lado * 0.09));
  const tercio = lado / 3;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${lado}" height="${lado}" viewBox="0 0 ${lado} ${lado}">
  <rect width="${lado}" height="${lado}" fill="${AZUL}"/>
  <text
    x="50%"
    y="46%"
    dominant-baseline="central"
    text-anchor="middle"
    font-family="system-ui, sans-serif"
    font-weight="800"
    font-size="${fuente}"
    fill="${BLANCO}"
  >A</text>
  <g>
    <rect x="0" y="${bandaY}" width="${tercio}" height="${bandaAlto}" fill="${AZUL_CLARO}"/>
    <rect x="${tercio}" y="${bandaY}" width="${tercio}" height="${bandaAlto}" fill="${BLANCO}"/>
    <rect x="${tercio * 2}" y="${bandaY}" width="${tercio}" height="${bandaAlto}" fill="${ROJO}"/>
  </g>
</svg>`;
}

const salidas = {
  16: "favicon-16.svg",
  32: "favicon-32.svg",
  64: "favicon.svg",
  180: "apple-touch-icon.svg",
};

for (const lado of tamaños) {
  const archivo = join(publicDir, salidas[lado]);
  writeFileSync(archivo, construir(lado), "utf8");
  console.log(`· ${salidas[lado]}`);
}

console.log("Iconos generados.");

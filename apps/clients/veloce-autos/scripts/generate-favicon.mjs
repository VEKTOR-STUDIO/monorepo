#!/usr/bin/env node
/**
 * Genera los iconos de HB Inversiones.
 * Uso: npm run generate-favicon  (o: node scripts/generate-favicon.mjs)
 *
 * El dibujo es la marca reducida a lo mínimo que sigue siendo reconocible: el
 * negro, la cuña roja en diagonal y las dos letras en itálica. A 16 px no cabe
 * nada más, y con eso basta para distinguirla en una pestaña.
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

const NEGRO = "#0D0D0D";
const ROJO = "#E11019";
const BLANCO = "#FFFFFF";

const tamaños = [16, 32, 64, 180];

function construir(lado) {
  const u = lado / 64; // todo está medido sobre una rejilla de 64
  const fuente = Math.round(34 * u);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${lado}" height="${lado}" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="${NEGRO}"/>
  <path d="M-8 44 L34 44 L22 72 L-20 72 Z" fill="${ROJO}"/>
  <path d="M40 -8 L82 -8 L60 44 L18 44 Z" fill="${ROJO}" opacity="0.18"/>
  <text
    x="50%"
    y="46%"
    dominant-baseline="central"
    text-anchor="middle"
    font-family="Arial Narrow, Arial, system-ui, sans-serif"
    font-weight="700"
    font-style="italic"
    font-size="${fuente}"
    fill="${BLANCO}"
  >HB</text>
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

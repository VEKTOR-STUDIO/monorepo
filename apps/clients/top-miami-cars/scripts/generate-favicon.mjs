#!/usr/bin/env node
/**
 * Genera los iconos de Top Miami Cars.
 * Uso: npm run generate-favicon  (o: node scripts/generate-favicon.mjs)
 *
 * El dibujo es su logotipo reducido a lo que sobrevive a 32 px: el blanco del
 * fondo, el escudo de acero y la línea azul del deportivo cruzándolo. El rótulo
 * —"TOP MIAMI CARS"— a este tamaño es una mancha, así que no se intenta.
 *
 * No hay ningún archivo de imagen que mantener a mano: si cambia el azul, se
 * cambia aquí y se vuelve a correr.
 */

import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");
const appDir = join(__dirname, "..", "app");

const BLANCO = "#FFFFFF";
const AZUL = "#001478";

function construir(lado) {
  // A 16 px los biseles y la segunda línea del carro son ruido: se quitan y la
  // línea engorda, que es lo único que se distingue a ese tamaño.
  const pequeño = lado <= 16;
  const trazo = pequeño ? 5 : 3.6;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${lado}" height="${lado}" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="acero" x1="0" y1="0" x2="1" y2="0" gradientTransform="rotate(14)">
      <stop offset="0" stop-color="#454d4f"/>
      <stop offset="0.2" stop-color="#f3f4f4"/>
      <stop offset="0.34" stop-color="#a9aeb0"/>
      <stop offset="0.5" stop-color="#4b5355"/>
      <stop offset="0.7" stop-color="#ffffff"/>
      <stop offset="0.86" stop-color="#9aa0a2"/>
      <stop offset="1" stop-color="#454d4f"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="12" fill="${BLANCO}"/>
  <path fill-rule="evenodd" fill="url(#acero)"
    d="M12 9 Q32 5 52 9 L52 36 L32 59 L12 36 Z M17.5 14 Q32 10.5 46.5 14 L46.5 34 L32 51 L17.5 34 Z"/>
  <g fill="none" stroke="${AZUL}" stroke-width="${trazo}" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3 30 C14 27 24 23 31 20 L29.5 23.5 C40 21.5 50 25 61 35"/>
    ${pequeño ? "" : '<path d="M3 30 L8 38" /><path d="M11 37 C14 32 21 32 24 37.5" stroke-width="3"/><path d="M42 38 C45 33 52 33 55 39" stroke-width="3"/>'}
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

#!/usr/bin/env node
/**
 * Genera los iconos de SUSU CARS.
 * Uso: npm run generate-favicon  (o: node scripts/generate-favicon.mjs)
 *
 * El dibujo es la marca reducida a lo mínimo que sigue siendo reconocible: el
 * negro del logotipo, el trazo del deportivo en oro y las dos "S" debajo. A
 * 16 px no cabe nada más, y con eso basta para distinguirla en una pestaña.
 *
 * Dos cosas que hacen que se lea a tamaño pequeño y que conviene no tocar sin
 * volver a mirarlo a 16 px:
 *
 *   · El trazo se ENGORDA en los tamaños chicos. Una línea de 2 px sobre una
 *     rejilla de 64 desaparece cuando el icono se pinta a 16: el `grosor` sube
 *     a medida que el lado baja, para que el dibujo conserve el mismo peso
 *     visual en todos.
 *   · A 16 px el texto no entra. Por debajo de 32 se dibuja solo el trazo, que
 *     es lo único que sigue siendo legible.
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

const NEGRO = "#0D0C0A";
const NEGRO_CLARO = "#23211C";
const ORO = "#C9A24A";
const ORO_CLARO = "#EBD9A6";

const tamaños = [16, 32, 64, 180];

function construir(lado) {
  // Todo está medido sobre una rejilla de 64. El trazo es la excepción: se
  // calcula contra el tamaño real para que no se evapore en los iconos chicos.
  const grosor = lado <= 16 ? 5 : lado <= 32 ? 3.5 : 2.6;
  const conTexto = lado >= 32;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${lado}" height="${lado}" viewBox="0 0 64 64">
  <defs>
    <radialGradient id="fondo" cx="30%" cy="18%" r="95%">
      <stop offset="0%" stop-color="${NEGRO_CLARO}"/>
      <stop offset="100%" stop-color="${NEGRO}"/>
    </radialGradient>
  </defs>
  <rect width="64" height="64" fill="url(#fondo)"/>
  <g fill="none" stroke="${ORO}" stroke-width="${grosor}" stroke-linecap="round" stroke-linejoin="round">
    <path d="M9 ${conTexto ? 30 : 38} C7 26 9 23 13 21 L22 17 C27 13 34 11 41 11 C48 11 53 14 56 19"/>
    <path d="M17 ${conTexto ? 30 : 38} a5 5 0 0 1 10 0"/>
    <path d="M40 ${conTexto ? 30 : 38} a5 5 0 0 1 10 0"/>
  </g>
  ${
    conTexto
      ? `<text
    x="50%"
    y="72%"
    dominant-baseline="central"
    text-anchor="middle"
    font-family="Georgia, 'Times New Roman', serif"
    font-weight="700"
    font-size="24"
    letter-spacing="1"
    fill="${ORO_CLARO}"
  >SC</text>`
      : ""
  }
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

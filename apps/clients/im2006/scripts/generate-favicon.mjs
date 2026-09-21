#!/usr/bin/env node
/**
 * Genera los iconos de LM 2006.
 * Uso: npm run generate-favicon  (o: node scripts/generate-favicon.mjs)
 *
 * El dibujo es su logotipo reducido a lo mínimo que sigue siendo reconocible:
 * el grafito de fondo, las tres barras inclinadas —plata, roja y el bloque
 * azul— y las dos letras dentro del bloque. A 16 px no cabe nada más, y con
 * eso basta: el trío de colores ya se distingue en una pestaña aunque las
 * letras se empasten.
 *
 * El "2006" NO entra. Se probó y a 32 px las cuatro cifras se convierten en
 * una mancha gris que además le roba sitio al bloque azul, que es lo único que
 * de verdad identifica la marca a ese tamaño.
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

// Medidos sobre docs/fuentes/lm2006-foto-perfil.jpg.
const GRAFITO = "#15181D";
const PLATA = "#AABAD4";
const ROJO = "#FF1F1F";
const AZUL = "#0059FF";
const BLANCO = "#FFFFFF";

// Lo que se corre la base respecto al techo con 64 px de alto y −12°:
// 64 · tan(12°) = 13,6. Es la misma inclinación que --angulo-lm.
const SESGO = 13.6;

/** Un paralelogramo de borde a borde, con el sesgo de la marca. */
function barra(x, ancho, relleno) {
  const d = `M${x} -2 L${x + ancho} -2 L${(x + ancho - SESGO).toFixed(1)} 66 L${(x - SESGO).toFixed(1)} 66 Z`;
  return `<path d="${d}" fill="${relleno}"/>`;
}

function construir(lado) {
  const u = lado / 64; // todo está medido sobre una rejilla de 64
  const fuente = Math.round(30 * u);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${lado}" height="${lado}" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="${GRAFITO}"/>
  ${barra(8, 5, PLATA)}
  ${barra(16, 7, ROJO)}
  ${barra(27, 36, AZUL)}
  <text
    x="38"
    y="34"
    dominant-baseline="central"
    text-anchor="middle"
    font-family="Arial Narrow, Arial, system-ui, sans-serif"
    font-weight="700"
    font-style="italic"
    font-size="${fuente}"
    fill="${BLANCO}"
  >LM</text>
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

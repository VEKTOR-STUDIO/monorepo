#!/usr/bin/env node
/**
 * Genera los iconos de Citta Cars.
 * Uso: npm run generate-favicon  (o: node scripts/generate-favicon.mjs)
 *
 * El dibujo es el de la marca: la inicial en blanco sobre el negro de la casa,
 * con las tres barras inclinadas —verde, blanco y rojo— debajo, que es el
 * signo que lleva el logotipo delante del rótulo. No hay ningún archivo de
 * imagen que mantener; si cambian los colores, se cambian aquí y se vuelve a
 * correr.
 */

import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");

const NEGRO = "#0D0D0D";
const VERDE = "#009246";
const BLANCO = "#FFFFFF";
const ROJO = "#CE2B37";

const tamaños = [16, 32, 64, 180];

function construir(lado) {
  const fuente = Math.round(lado * 0.56);
  const bandaY = Math.round(lado * 0.78);
  const bandaAlto = Math.max(1, Math.round(lado * 0.1));
  // Tres barras con un hueco entre ellas, como en el logotipo.
  const ancho = lado * 0.24;
  const hueco = lado * 0.06;
  const margen = (lado - (ancho * 3 + hueco * 2)) / 2;
  const barras = [VERDE, BLANCO, ROJO].map((color, i) => {
    const x = margen + i * (ancho + hueco);
    return `    <rect x="${x.toFixed(2)}" y="${bandaY}" width="${ancho.toFixed(2)}" height="${bandaAlto}" fill="${color}"/>`;
  });

  // `skewX` desplaza cada punto tanto como tan(ángulo) × su altura, así que a
  // la altura de las barras el grupo entero se iría a la izquierda. Esto lo
  // devuelve a su sitio: sin ello, la primera barra se sale del icono.
  const compensar = (Math.tan((18 * Math.PI) / 180) * (bandaY + bandaAlto / 2)).toFixed(2);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${lado}" height="${lado}" viewBox="0 0 ${lado} ${lado}">
  <rect width="${lado}" height="${lado}" fill="${NEGRO}"/>
  <text
    x="50%"
    y="44%"
    dominant-baseline="central"
    text-anchor="middle"
    font-family="system-ui, sans-serif"
    font-weight="800"
    font-style="italic"
    font-size="${fuente}"
    fill="${BLANCO}"
  >C</text>
  <g transform="skewX(-18) translate(${compensar} 0)">
${barras.join("\n")}
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

// Los dos que Next sirve desde app/: el icono del navegador y el de iOS.
writeFileSync(join(__dirname, "..", "app", "icon.svg"), construir(64), "utf8");
writeFileSync(join(__dirname, "..", "app", "apple-icon.svg"), construir(180), "utf8");
console.log("· app/icon.svg\n· app/apple-icon.svg");

console.log("Iconos generados.");

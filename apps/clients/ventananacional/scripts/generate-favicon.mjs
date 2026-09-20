#!/usr/bin/env node
/**
 * Genera los iconos de Venta Nacional.
 * Uso: npm run generate-favicon  (o: node scripts/generate-favicon.mjs)
 *
 * El dibujo es el de la marca —el hexágono con el monograma VN sobre grafito y
 * las tres franjas de la bandera abajo—, el mismo que dibuja
 * components/Marca.js. No hay ningún archivo de imagen que mantener: si cambia
 * un color, se cambia aquí y se vuelve a correr.
 *
 * Escribe los cuatro iconos sueltos de public/ y también los dos que sirve
 * Next (app/icon.svg y app/apple-icon.svg), para que no haya dos versiones del
 * mismo signo conviviendo.
 *
 * Por debajo de 40 px el monograma se convierte en una mancha, así que en los
 * tamaños pequeños se queda solo el hexágono, que sí se reconoce.
 */

import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const raiz = join(__dirname, "..");

const GRAFITO = "#14161A";
const BLANCO = "#FFFFFF";
const AMARILLO = "#F2B705";
const AZUL = "#1D3FA8";
const ROJO = "#CE1126";

// El signo, en su sistema de coordenadas de 120 × 104. Se escala al vuelo.
const HEXAGONO = "M60 3 L95 23 L95 81 L60 101 L25 81 L25 23 Z";
const MONOGRAMA = `    <g transform="translate(60 52) skewX(-8) translate(-60 -52)" stroke-width="8">
      <path d="M35 30 L46 74 L57 30"/>
      <path d="M69 74 L69 30 L85 74 L85 30"/>
    </g>`;

function construir(lado) {
  // El signo ocupa el 82 % del alto y deja sitio abajo para las franjas.
  const escala = (lado * 0.8) / 104;
  const ancho = 120 * escala;
  const x = (lado - ancho) / 2;
  const y = lado * 0.015;

  const bandaY = Math.round(lado * 0.89);
  const bandaAlto = Math.max(1, Math.round(lado * 0.11));
  const tercio = lado / 3;
  const conMonograma = lado >= 40;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${lado}" height="${lado}" viewBox="0 0 ${lado} ${lado}">
  <rect width="${lado}" height="${lado}" fill="${GRAFITO}"/>
  <g transform="translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${escala.toFixed(4)})" fill="none" stroke="${BLANCO}" stroke-linejoin="miter">
    <path d="${HEXAGONO}" stroke-width="7"/>
${conMonograma ? MONOGRAMA : ""}
  </g>
  <g>
    <rect x="0" y="${bandaY}" width="${tercio}" height="${bandaAlto}" fill="${AMARILLO}"/>
    <rect x="${tercio}" y="${bandaY}" width="${tercio}" height="${bandaAlto}" fill="${AZUL}"/>
    <rect x="${tercio * 2}" y="${bandaY}" width="${tercio}" height="${bandaAlto}" fill="${ROJO}"/>
  </g>
</svg>`;
}

const salidas = [
  [16, "public/favicon-16.svg"],
  [32, "public/favicon-32.svg"],
  [64, "public/favicon.svg"],
  [180, "public/apple-touch-icon.svg"],
  // Los dos que sirve Next desde app/.
  [64, "app/icon.svg"],
  [180, "app/apple-icon.svg"],
];

for (const [lado, destino] of salidas) {
  writeFileSync(join(raiz, destino), construir(lado), "utf8");
  console.log(`· ${destino}`);
}

console.log("Iconos generados.");

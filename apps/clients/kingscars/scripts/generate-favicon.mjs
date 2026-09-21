#!/usr/bin/env node
/**
 * Genera los iconos de Kings Cars.
 * Uso: npm run generate-favicon  (o: node scripts/generate-favicon.mjs)
 *
 * El dibujo es LA CORONA, y solo la corona. Es lo único de su emblema que
 * sobrevive a 32 px: el rótulo "KING CARS" que va debajo, a este tamaño, es una
 * mancha de tres píxeles, así que no se intenta.
 *
 * La corona es la misma de components/MarcaCorona.js, con las mismas
 * coordenadas sobre la rejilla de 200×128; aquí solo se escala y se centra en
 * la baldosa. Si se redibuja allí, hay que traer el trazado nuevo aquí también:
 * son dos copias a propósito —este script no puede importar un componente de
 * React— y esa es la única razón.
 *
 * A 16 px LA CORONA VA MACIZA, sin los rombos ni la estrella: esos huecos miden
 * ahí medio píxel, y medio píxel no se ve, se ensucia. Un contorno limpio se
 * reconoce; uno lleno de agujeros que no llegan a abrirse, no.
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

// La losa de su foto de perfil, no negro puro: es lo que hace que el icono se
// parezca a su avatar de Instagram y no a un icono cualquiera.
const PIEDRA = "#262626";
const BLANCO = "#FFFFFF";

// La silueta de la corona, sobre la rejilla de 200×128 de MarcaCorona.
const SILUETA = "M100 2 L134 56 L197 56 L170 126 L30 126 L3 56 L66 56 Z";

// Los huecos: los dos rombos de la banda y la estrella del pico.
const HUECOS = [
  "M28 72 L62 72 L76.7 110 L42.7 110 Z",
  "M172 72 L138 72 L123.3 110 L157.3 110 Z",
  "M100 14 C103 40 106 48 122 56 C106 64 103 72 100 98 C97 72 94 64 78 56 C94 48 97 40 100 14 Z",
];

function construir(lado) {
  // La corona ocupa 52 de los 64 de ancho y se centra a ojo en vertical: el
  // pico deja más aire arriba que la banda abajo, así que se baja un punto.
  const escala = 52 / 200;
  const alto = 128 * escala;
  const x = (64 - 52) / 2;
  const y = (64 - alto) / 2 + 1;

  const conHuecos = lado > 16;
  const d = conHuecos ? [SILUETA, ...HUECOS].join(" ") : SILUETA;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${lado}" height="${lado}" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="${PIEDRA}"/>
  <g transform="translate(${x} ${y.toFixed(2)}) scale(${escala})">
    <path d="${d}" fill="${BLANCO}" fill-rule="evenodd"/>
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

#!/usr/bin/env node
/**
 * Genera el favicon de DEL PROYECTO
 * Uso: npm run generate-favicon  (o: node scripts/generate-favicon.mjs)
 *
 * Genera:
 *   - public/favicon.svg  (para navegadores que soportan SVG)
 *
 * Next.js ya usa app/icon.js para el favicon dinámico; este script sirve
 * para tener un asset estático SVG por si lo necesitas (PWA, etc.).
 */

import { writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const publicDir = join(root, "public");

const PRIMARY = "#FFFFFF"; // DEL PROYECTO — blanco sobre negro
const DARK = "#000000";

const sizes = [16, 32, 64, 180];

function buildSvg(size) {
  const fontSize = Math.round(size * 0.6);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${DARK}"/>
  <text
    x="50%"
    y="50%"
    dominant-baseline="central"
    text-anchor="middle"
    font-family="system-ui, sans-serif"
    font-weight="700"
    font-size="${fontSize}"
    fill="${PRIMARY}"
  >F</text>
</svg>
`;
}

mkdirSync(publicDir, { recursive: true });

const svg64 = buildSvg(64);
writeFileSync(join(publicDir, "favicon.svg"), svg64.trim(), "utf8");
console.log("✓ public/favicon.svg (64×64)");

for (const s of sizes) {
  if (s === 64) continue;
  const name = s === 180 ? "apple-touch-icon.svg" : `favicon-${s}.svg`;
  writeFileSync(join(publicDir, name), buildSvg(s).trim(), "utf8");
  console.log(`✓ public/${name} (${s}×${s})`);
}

console.log("\nFavicon generado: F en blanco (#FFFFFF) sobre fondo negro (#000000).");
console.log("El favicon en producción lo sirve Next.js desde app/icon.js.");

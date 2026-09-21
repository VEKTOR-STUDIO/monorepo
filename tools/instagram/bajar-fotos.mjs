#!/usr/bin/env node
// -----------------------------------------------------------------------------
// Bajar a disco las fotos que leyó leer-perfil.mjs.
//
//   node tools/instagram/bajar-fotos.mjs tools/instagram/salida/cuenta.json \
//        --destino apps/clients/<cliente>/public/vehiculos
//
// Va aparte de la lectura por una razón práctica: leer el perfil es lo que
// arriesga la cuenta y lo que caduca; bajar fotos es tirar de URLs que ya
// tenemos. Separados, puedes repetir la descarga sin volver a tocar la API.
//
// Si hay sharp a mano, las fotos salen recomprimidas y enderezadas por su
// EXIF. Hoy no lo hay en este monorepo (solo existe como dependencia
// transitiva, no importable), y no pasa nada: Instagram ya sirve a 1080 px.
// Con `pnpm add -w -D sharp` el script lo encuentra sin tocar nada más.
// -----------------------------------------------------------------------------

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve, join } from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const NAVEGADOR =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

function fallar(mensaje) {
  console.error(`\n✖ ${mensaje}\n`);
  process.exit(1);
}

function leerArgumentos(argv) {
  const [entrada, ...resto] = argv;
  const opciones = { destino: null, ancho: 1600, calidad: 82, max: Infinity };

  for (let i = 0; i < resto.length; i += 2) {
    const clave = resto[i];
    const valor = resto[i + 1];
    if (valor === undefined) fallar(`La opción ${clave} se quedó sin valor.`);
    if (clave === "--destino") opciones.destino = valor;
    else if (clave === "--ancho") opciones.ancho = Number(valor);
    else if (clave === "--calidad") opciones.calidad = Number(valor);
    else if (clave === "--max") opciones.max = Number(valor);
    else fallar(`No conozco la opción ${clave}.`);
  }

  if (!entrada || entrada.startsWith("--")) {
    fallar(
      "Falta el JSON que dejó leer-perfil.mjs.\n\n" +
        "  node tools/instagram/bajar-fotos.mjs <json> --destino <carpeta> [--ancho 1600]"
    );
  }
  if (!opciones.destino) fallar("Falta --destino: la carpeta donde dejar las fotos.");
  return { entrada: resolve(entrada), opciones };
}

/**
 * sharp es opcional. Se busca desde la carpeta destino y desde donde se haya
 * lanzado el script; si no aparece, se guardan los originales y se avisa una
 * sola vez, que para fotos de 1080 px es un desenlace perfectamente digno.
 */
async function cargarSharp(destino) {
  const require = createRequire(import.meta.url);
  try {
    const resuelto = require.resolve("sharp", { paths: [destino, process.cwd()] });
    const modulo = await import(pathToFileURL(resuelto).href);
    return modulo.default;
  } catch {
    return null;
  }
}

async function bajar(url) {
  const respuesta = await fetch(url, { headers: { "User-Agent": NAVEGADOR, Referer: "https://www.instagram.com/" } });
  if (respuesta.status === 403 || respuesta.status === 410) {
    throw new Error("CADUCADA");
  }
  if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
  return Buffer.from(await respuesta.arrayBuffer());
}

async function main() {
  const { entrada, opciones } = leerArgumentos(process.argv.slice(2));

  let datos;
  try {
    datos = JSON.parse(await readFile(entrada, "utf8"));
  } catch (error) {
    fallar(`No pude leer ${entrada}: ${error.message}`);
  }
  if (!Array.isArray(datos.posts)) fallar(`${entrada} no tiene un array 'posts'. ¿Es la salida de leer-perfil.mjs?`);

  const destino = resolve(opciones.destino);
  await mkdir(destino, { recursive: true });
  const sharp = await cargarSharp(destino);
  if (!sharp) {
    console.log("   (sin sharp a mano: guardo los originales sin redimensionar)");
  }

  const posts = datos.posts.slice(0, opciones.max);
  console.log(`\n▸ Bajando fotos de ${posts.length} publicación(es) a ${destino}…`);

  let bajadas = 0;
  let caducadas = 0;

  for (const post of posts) {
    post.archivos = [];
    for (const [indice, url] of post.imagenes.entries()) {
      const nombre = post.imagenes.length > 1 ? `${post.shortcode}-${indice + 1}.jpg` : `${post.shortcode}.jpg`;
      try {
        const original = await bajar(url);
        const contenido = sharp
          ? await sharp(original)
              .rotate()
              .resize({ width: opciones.ancho, withoutEnlargement: true })
              .jpeg({ quality: opciones.calidad, mozjpeg: true })
              .toBuffer()
          : original;
        await writeFile(join(destino, nombre), contenido);
        post.archivos.push(nombre);
        bajadas++;
      } catch (error) {
        if (error.message === "CADUCADA") caducadas++;
        else console.log(`   ✖ ${nombre}: ${error.message}`);
      }
    }
    if (post.archivos.length > 0) console.log(`   ${post.shortcode}: ${post.archivos.length} foto(s)`);
  }

  datos.descargado = { en: new Date().toISOString(), destino, archivos: bajadas };
  await writeFile(entrada, `${JSON.stringify(datos, null, 2)}\n`, "utf8");

  console.log(`\n✓ ${bajadas} fotos en ${destino}`);
  console.log(`   El JSON ahora dice qué archivo salió de cada publicación (campo 'archivos').`);
  if (caducadas > 0) {
    console.log(
      `\n⚠ ${caducadas} URL(s) ya habían caducado. Las firmas del CDN duran horas:\n` +
        `   vuelve a ejecutar leer-perfil.mjs y repite esta descarga seguida.`
    );
  }
  console.log("");
}

main();

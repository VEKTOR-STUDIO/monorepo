#!/usr/bin/env node
/**
 * Importa un PDF de catálogo de Hardcore al proyecto.
 *
 *   node scripts/importar-catalogo.mjs "public/Catalogo Hardcore 3 precios.pdf"
 *   npm run importar-catalogo -- "ruta/al/pdf"
 *
 * Genera:
 *   - data/catalogo.json            los productos (fuente de la tienda sin Supabase)
 *   - public/productos/<slug>.jpg   la foto de cada producto, sacada del PDF
 *   - supabase/seeds/catalogo.sql   el seed para cargar el catálogo en Supabase
 *
 * Es el camino "de taller": se ejecuta aquí y los archivos entran al repo.
 * Para que Hardcore actualice por su cuenta está el panel /admin/importar,
 * que usa el mismo lector y escribe en Supabase.
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { leerCatalogoPdf, extraerImagen } from "../libs/pdf-catalog.mjs";
import { normalizarProductos, FAMILIAS } from "../libs/catalogo-normalizar.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const raiz = join(__dirname, "..");

const rutaPdf = resolve(
  process.argv[2] || join(raiz, "public", "Catalogo Hardcore 3 precios.pdf")
);
const dirImagenes = join(raiz, "public", "productos");
const dirDatos = join(raiz, "data");
const dirSeeds = join(raiz, "supabase", "seeds");

console.log(`\n  Leyendo ${rutaPdf}\n`);

const { productos: filas, paginas, crudo, objetos } = leerCatalogoPdf(readFileSync(rutaPdf));
const productos = normalizarProductos(filas);

if (!productos.length) {
  console.error("  No se encontró ningún producto. ¿Es un catálogo de Hardcore?\n");
  process.exit(1);
}

// --- imágenes ---------------------------------------------------------------
mkdirSync(dirImagenes, { recursive: true });
// Se rehace la carpeta entera para que no queden fotos de productos que ya no
// están en la lista.
for (const archivo of readdirSync(dirImagenes)) {
  rmSync(join(dirImagenes, archivo), { force: true });
}

let conFoto = 0;
const cache = new Map(); // un mismo objeto del PDF se usa en varias filas
for (const producto of productos) {
  if (!producto.imagenObj) continue;
  let imagen = cache.get(producto.imagenObj);
  if (imagen === undefined) {
    imagen = extraerImagen(crudo, objetos, producto.imagenObj);
    cache.set(producto.imagenObj, imagen);
  }
  if (!imagen) continue;
  const archivo = `${producto.slug}.${imagen.extension}`;
  writeFileSync(join(dirImagenes, archivo), imagen.datos);
  producto.imagen = `/productos/${archivo}`;
  producto.imagenAncho = imagen.ancho;
  producto.imagenAlto = imagen.alto;
  conFoto++;
}

// --- catalogo.json ----------------------------------------------------------
mkdirSync(dirDatos, { recursive: true });
const catalogo = {
  origen: rutaPdf.split("/").pop(),
  importado: new Date().toISOString(),
  paginas,
  total: productos.length,
  familias: FAMILIAS.map(([slug, nombre]) => ({ slug, nombre })),
  productos: productos.map(({ imagenObj, ...resto }) => resto),
};
writeFileSync(join(dirDatos, "catalogo.json"), `${JSON.stringify(catalogo, null, 2)}\n`);

// --- seed de Supabase -------------------------------------------------------
const sql = (v) => (v === null || v === undefined ? "null" : `'${String(v).replace(/'/g, "''")}'`);
const num = (v) => (v === null || v === undefined || Number.isNaN(v) ? "null" : String(v));
const arr = (lista) =>
  lista.length ? `ARRAY[${lista.map((v) => sql(v)).join(", ")}]::text[]` : "ARRAY[]::text[]";

mkdirSync(dirSeeds, { recursive: true });
const lineas = [
  "-- Catálogo de Hardcore. Generado por scripts/importar-catalogo.mjs.",
  `-- Origen: ${catalogo.origen} · ${catalogo.total} productos · ${catalogo.importado}`,
  "-- No editar a mano: se regenera al importar un PDF nuevo.",
  "",
  "begin;",
  "",
  "insert into public.categorias (slug, nombre, familia) values",
  [
    ...new Map(
      productos.map((p) => [p.categoriaSlug, `  (${sql(p.categoriaSlug)}, ${sql(p.categoria)}, ${sql(p.familia)})`])
    ).values(),
  ].join(",\n"),
  "on conflict (slug) do update set nombre = excluded.nombre, familia = excluded.familia;",
  "",
  "insert into public.productos",
  "  (slug, nombre, categoria_slug, categoria_original, marca, variaciones, estado,",
  "   precio_bcv, precio_contado, precio_pago_movil, oferta_flash, imagen, pagina_catalogo, activo)",
  "values",
  productos
    .map(
      (p) =>
        `  (${sql(p.slug)}, ${sql(p.nombre)}, ${sql(p.categoriaSlug)}, ${sql(p.categoriaOriginal)}, ` +
        `${sql(p.marca)}, ${arr(p.variaciones)}, ${sql(p.estado)}, ${num(p.precioBcv)}, ` +
        `${num(p.precioContado)}, ${num(p.precioPagoMovil)}, ${p.ofertaFlash}, ${sql(p.imagen)}, ` +
        `${num(p.pagina)}, true)`
    )
    .join(",\n"),
  "on conflict (slug) do update set",
  "  nombre = excluded.nombre,",
  "  categoria_slug = excluded.categoria_slug,",
  "  categoria_original = excluded.categoria_original,",
  "  marca = excluded.marca,",
  "  variaciones = excluded.variaciones,",
  "  estado = excluded.estado,",
  "  precio_bcv = excluded.precio_bcv,",
  "  precio_contado = excluded.precio_contado,",
  "  precio_pago_movil = excluded.precio_pago_movil,",
  "  oferta_flash = excluded.oferta_flash,",
  "  imagen = coalesce(excluded.imagen, public.productos.imagen),",
  "  pagina_catalogo = excluded.pagina_catalogo,",
  "  activo = true,",
  "  actualizado_en = now();",
  "",
  "-- Lo que ya no viene en la lista se oculta, pero no se borra: los pedidos",
  "-- viejos siguen apuntando a ese producto.",
  "update public.productos set activo = false, actualizado_en = now()",
  `where slug <> all (ARRAY[${productos.map((p) => sql(p.slug)).join(", ")}]::text[]);`,
  "",
  "commit;",
  "",
];
writeFileSync(join(dirSeeds, "catalogo.sql"), lineas.join("\n"));

// --- informe ----------------------------------------------------------------
const porFamilia = new Map();
for (const p of productos) porFamilia.set(p.familia, (porFamilia.get(p.familia) || 0) + 1);
const nuevas = [...new Set(productos.filter((p) => p.familia === "otros").map((p) => p.categoriaOriginal))];

console.log(`  ${productos.length} productos en ${paginas} páginas`);
console.log(`  ${conFoto} con foto · ${productos.length - conFoto} sin foto`);
console.log(`  ${productos.filter((p) => p.ofertaFlash).length} en oferta flash`);
console.log(`  ${productos.filter((p) => p.estado === "transito").length} en tránsito\n`);
for (const [slug, nombre] of FAMILIAS) {
  const n = porFamilia.get(slug);
  if (n) console.log(`    ${String(n).padStart(4)}  ${nombre}`);
}
if (nuevas.length) {
  console.log(`\n  Categorías sin clasificar (añádelas a libs/catalogo-normalizar.mjs):`);
  for (const c of nuevas) console.log(`    · ${c}`);
}
console.log(`\n  → data/catalogo.json`);
console.log(`  → public/productos/ (${conFoto} imágenes)`);
console.log(`  → supabase/seeds/catalogo.sql\n`);

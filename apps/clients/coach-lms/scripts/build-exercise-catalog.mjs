#!/usr/bin/env node
// -----------------------------------------------------------------------------
// Genera el "libro de entrenamiento" a partir del paquete @bryllim/workout-guide
// (302 ejercicios, 3 fotogramas SVG/PNG cada uno — las "animaciones/monigotes").
//
//   node scripts/build-exercise-catalog.mjs
//
// Produce:
//   libs/exercise-catalog.json                  -> catálogo que usa la app
//   supabase/seeds/exercise_library_seed.sql    -> INSERT para Supabase
//
// Requiere el manifest del paquete. Se busca en, por orden:
//   1) node_modules/@bryllim/workout-guide/manifest.json
//   2) la ruta pasada como primer argumento
// Si no está instalado:  npm i -D @bryllim/workout-guide   (o pasa la ruta)
//
// Licencias: código MIT, ilustraciones CC BY-SA 4.0 (Bryl Lim, sobre Everkinetic).
// La atribución se muestra en /entrenamientos/biblioteca — no la quites.
// -----------------------------------------------------------------------------

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { NAMES_ES, EQUIPMENT_ES, MUSCLE_ES, TYPE_ES } from "./exercise-names-es.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const candidates = [
  process.argv[2],
  join(root, "node_modules/@bryllim/workout-guide/manifest.json"),
  join(root, "../../../node_modules/@bryllim/workout-guide/manifest.json"),
].filter(Boolean);

const manifestPath = candidates.find((p) => existsSync(p));
if (!manifestPath) {
  console.error(
    "No encuentro manifest.json de @bryllim/workout-guide.\n" +
      "Instálalo con:  npm i -D @bryllim/workout-guide\n" +
      "O pasa la ruta:  node scripts/build-exercise-catalog.mjs /ruta/manifest.json"
  );
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

function categoryOf(ex) {
  if (ex.isStretch || ex.primaryMuscle === "Mobility") return "movilidad";
  if (ex.equipment === "Cardio") return "cardio";
  if (ex.primaryMuscle === "Core") return "core";
  return "fuerza";
}

const missing = [];

const catalog = manifest
  .map((ex) => {
    if (!NAMES_ES[ex.slug]) missing.push(ex.slug);
    return {
      slug: ex.slug,
      name: NAMES_ES[ex.slug] || ex.name,
      name_en: ex.name,
      equipment: EQUIPMENT_ES[ex.equipment] || ex.equipment,
      primary_muscle: MUSCLE_ES[ex.primaryMuscle] || ex.primaryMuscle,
      secondary_muscles: (ex.secondaryMuscles || []).map((m) => MUSCLE_ES[m] || m),
      exercise_type: ex.exerciseType,
      exercise_type_label: TYPE_ES[ex.exerciseType] || ex.exerciseType,
      is_stretch: !!ex.isStretch,
      category: categoryOf(ex),
      frames: (ex.frames || []).length,
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name, "es"));

writeFileSync(
  join(root, "libs/exercise-catalog.json"),
  JSON.stringify(catalog, null, 2) + "\n"
);

// ---- Seed SQL ---------------------------------------------------------------
const q = (v) => (v == null ? "null" : `'${String(v).replace(/'/g, "''")}'`);
const arr = (a) =>
  a.length ? `array[${a.map((x) => q(x)).join(", ")}]::text[]` : "'{}'::text[]";

const rows = catalog
  .map(
    (e) =>
      `  (${q(e.slug)}, ${q(e.name)}, ${q(e.name_en)}, ${q(e.equipment)}, ` +
      `${q(e.primary_muscle)}, ${arr(e.secondary_muscles)}, ${q(e.exercise_type)}, ` +
      `${e.is_stretch}, ${q(e.category)}, ${q(e.slug)})`
  )
  .join(",\n");

const sql = `-- =============================================================================
-- Semilla del LIBRO DE ENTRENAMIENTO (public.exercise_library)
-- ${catalog.length} ejercicios con animación (3 fotogramas) de @bryllim/workout-guide.
--
-- GENERADO AUTOMÁTICAMENTE por scripts/build-exercise-catalog.mjs — no lo edites
-- a mano: vuelve a ejecutar el script.
--
-- Ejecútalo DESPUÉS de migrations/20260911100000_esquema_completo.sql
-- Es idempotente: puedes volver a correrlo (on conflict do update).
--
-- Ilustraciones: Bryl Lim (CC BY-SA 4.0), derivadas de Everkinetic (CC BY-SA 4.0).
-- =============================================================================

insert into public.exercise_library
  (slug, name, name_en, equipment, primary_muscle, secondary_muscles,
   exercise_type, is_stretch, category, animation_slug)
values
${rows}
on conflict (slug) do update set
  name             = excluded.name,
  name_en          = excluded.name_en,
  equipment        = excluded.equipment,
  primary_muscle   = excluded.primary_muscle,
  secondary_muscles= excluded.secondary_muscles,
  exercise_type    = excluded.exercise_type,
  is_stretch       = excluded.is_stretch,
  category         = excluded.category,
  animation_slug   = excluded.animation_slug;
`;

mkdirSync(join(root, "supabase/seeds"), { recursive: true });
writeFileSync(join(root, "supabase/seeds/exercise_library_seed.sql"), sql);

console.log(`✔ ${catalog.length} ejercicios`);
console.log("  libs/exercise-catalog.json");
console.log("  supabase/seeds/exercise_library_seed.sql");
if (missing.length) {
  console.warn(
    `\n⚠ ${missing.length} sin traducción en scripts/exercise-names-es.mjs (se quedan en inglés):\n  ` +
      missing.join("\n  ")
  );
}

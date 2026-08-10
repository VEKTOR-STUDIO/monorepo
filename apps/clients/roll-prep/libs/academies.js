// ============================================================================
// Academias del circuito (Slam MMA, Élite Jiu-Jitsu, ...).
// Las filas viven en public.academies (ver la migración
// supabase/migrations/20260809120000_academies.sql). Aquí solo están los
// helpers de lectura y las etiquetas para la UI.
// ============================================================================

export const NO_ACADEMY_LABEL = "Sin academia";
export const ACADEMY_FALLBACK_COLOR = "#71717a";

export const ACADEMIES_MIGRATION =
  "supabase/migrations/20260809120000_academies.sql";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** El id que llegó del formulario tiene forma de id de academia. */
export function isAcademyId(value) {
  return UUID_PATTERN.test(value ?? "");
}

/**
 * La base todavía no tiene la migración de academias: falta la columna
 * (42703 / PGRST204), la tabla o la vista (42P01), o la relación que
 * PostgREST necesita para el embed (PGRST200).
 */
export function isMissingAcademies(error) {
  return ["42703", "42P01", "PGRST200", "PGRST204", "PGRST205"].includes(
    error?.code
  );
}

/**
 * Academias disponibles para los selects. Devuelve [] si falta la migración,
 * y entonces la UI simplemente no muestra el selector.
 */
export async function getAcademies(supabase) {
  const { data } = await supabase
    .from("academies")
    .select("id, name, slug, color")
    .order("name", { ascending: true });

  return data ?? [];
}

/**
 * Perfil del alumno con su academia ya resuelta:
 * { full_name, created_at, academy_id, academy }.
 * Si falta la migración, cae al perfil de siempre sin romper la página.
 */
export async function getProfileWithAcademy(supabase, userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "full_name, created_at, academy_id, academy:academies (id, name, slug, color)"
    )
    .eq("id", userId)
    .single();

  if (!error) return { ...data, academy: data.academy ?? null };
  if (!isMissingAcademies(error)) return null;

  const { data: basic } = await supabase
    .from("profiles")
    .select("full_name, created_at")
    .eq("id", userId)
    .single();

  return basic ? { ...basic, academy_id: null, academy: null } : null;
}

/**
 * Normaliza las columnas planas que devuelven las vistas (leaderboard,
 * admin_users) al mismo objeto de academia que usa el resto de la UI.
 */
export function academyFromRow(row) {
  if (!row?.academy_id) return null;

  return {
    id: row.academy_id,
    name: row.academy_name,
    slug: row.academy_slug,
    color: row.academy_color,
  };
}

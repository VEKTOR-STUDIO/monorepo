import { createClient } from "@supabase/supabase-js";

/**
 * Cliente con la service role: se salta RLS.
 *
 * Solo en servidor y solo donde haga falta escribir por cuenta del sistema
 * (guardar un pedido de alguien sin sesión, la tasa del cron, la importación
 * de un PDF). Nunca se exporta al navegador.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const clave = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !clave) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en el entorno."
    );
  }

  return createClient(url, clave, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** ¿Está Supabase configurado? La tienda funciona sin él, con el JSON del PDF. */
export function haySupabase() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

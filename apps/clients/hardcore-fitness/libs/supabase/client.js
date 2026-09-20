import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente de Supabase para el navegador.
 *
 * Devuelve null si el proyecto todavía no está configurado, en vez de lanzar.
 * La tienda tiene que poder verse y usarse sin Supabase —lee el catálogo de
 * data/catalogo.json— y antes esto reventaba en consola en cada página.
 * Quien lo use debe comprobar el null: sin cliente, no hay sesión.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const clave = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !clave) return null;

  return createBrowserClient(url, clave);
}

/** ¿Hay sesión posible en este despliegue? */
export function hayAuth() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

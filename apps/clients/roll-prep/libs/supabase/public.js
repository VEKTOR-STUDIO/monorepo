import { createClient } from "@supabase/supabase-js";

/**
 * Cliente anónimo SIN cookies, para leer datos públicos desde el servidor
 * (hoy: los números del gym en la landing).
 *
 * El cliente de libs/supabase/server.js lee cookies, y eso vuelve dinámica
 * cualquier página que lo use. La landing no necesita sesión, así que con
 * este se queda cacheada y solo revalida cada tanto.
 *
 * Devuelve null si faltan las variables de entorno, para poder degradar en
 * vez de reventar el render.
 */
export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return null;

  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

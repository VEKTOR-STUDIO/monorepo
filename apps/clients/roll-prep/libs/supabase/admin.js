import { createClient } from "@supabase/supabase-js";

/**
 * Cliente con service role: se salta la RLS, así que SOLO puede usarse en el
 * servidor y detrás de una comprobación de rol admin.
 *
 * Hoy se usa para lo único que la RLS no puede hacer: borrar la cuenta de
 * auth de un alumno (el perfil se va en cascada).
 *
 * Devuelve null si falta la variable de entorno, para poder avisar en la UI
 * en vez de reventar el render.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) return null;

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

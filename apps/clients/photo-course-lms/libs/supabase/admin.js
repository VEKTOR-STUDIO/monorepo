import { createClient } from "@supabase/supabase-js";

/**
 * Cliente con service role: salta RLS. SOLO para uso en el servidor
 * (Server Actions / Server Components) — nunca importar desde un
 * componente cliente.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    }
  );
}

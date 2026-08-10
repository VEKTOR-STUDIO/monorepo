import { NextResponse } from "next/server";
import { createClient } from "@/libs/supabase/server";
import config from "@/config";

export const dynamic = "force-dynamic";

/**
 * En producción la app corre detrás de un proxy, así que `req.url` trae el
 * host interno (localhost:3000) y no el público. Redirigir a ese origen
 * mandaba al alumno a una URL que no existe fuera del servidor.
 *
 * Orden de confianza: la cabecera que pone el proxy → la variable de entorno
 * → el origen de la petición (que en local es el bueno).
 */
function getSiteOrigin(req, requestUrl) {
  const forwardedHost = req.headers.get("x-forwarded-host");

  if (forwardedHost) {
    const proto = req.headers.get("x-forwarded-proto") || "https";
    return `${proto}://${forwardedHost}`;
  }

  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return configured.replace(/\/$/, "");

  return requestUrl.origin;
}

// Esta ruta se llama al volver del magic link: cambia el código por una
// sesión y manda al dashboard (ver config.js).
export async function GET(req) {
  const requestUrl = new URL(req.url);
  const code = requestUrl.searchParams.get("code");
  const origin = getSiteOrigin(req, requestUrl);

  // Supabase avisa aquí mismo cuando el enlace venció o ya se usó.
  const authError = requestUrl.searchParams.get("error_description");
  if (authError) {
    return NextResponse.redirect(
      `${origin}${config.auth.loginUrl}?error=${encodeURIComponent(authError)}`
    );
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    // Sin sesión, mandar al dashboard solo produce un rebote a /signin.
    if (error) {
      return NextResponse.redirect(
        `${origin}${config.auth.loginUrl}?error=${encodeURIComponent(
          "El enlace ya no sirve. Pide uno nuevo."
        )}`
      );
    }
  }

  return NextResponse.redirect(origin + config.auth.callbackUrl);
}

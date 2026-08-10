import { NextResponse } from "next/server";
import { createClient } from "@/libs/supabase/server";
import { sanitizeNextPath } from "@/libs/redirect";
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

/**
 * Vuelta al login conservando a dónde iba el alumno, así un enlace vencido no
 * le cuesta también el destino: pide otro magic link y sigue camino a la clase.
 */
function loginUrl(origin, message, next) {
  const params = new URLSearchParams({ error: message });
  if (next) params.set("next", next);

  return `${origin}${config.auth.loginUrl}?${params}`;
}

// Esta ruta se llama al volver del magic link: cambia el código por una
// sesión y manda al dashboard (ver config.js).
//
// El destino puede venir en ?next= cuando el alumno entró por un link con
// intención — el CTA de la clase activa en la landing, por ejemplo — y así cae
// en la clase en vez del menú (ver libs/redirect.js).
export async function GET(req) {
  const requestUrl = new URL(req.url);
  const code = requestUrl.searchParams.get("code");
  const origin = getSiteOrigin(req, requestUrl);
  const next = sanitizeNextPath(requestUrl.searchParams.get("next"));

  // Supabase avisa aquí mismo cuando el enlace venció o ya se usó.
  const authError = requestUrl.searchParams.get("error_description");
  if (authError) {
    return NextResponse.redirect(loginUrl(origin, authError, next));
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    // Sin sesión, mandar al dashboard solo produce un rebote a /signin.
    if (error) {
      return NextResponse.redirect(
        loginUrl(origin, "El enlace ya no sirve. Pide uno nuevo.", next)
      );
    }
  }

  return NextResponse.redirect(origin + (next ?? config.auth.callbackUrl));
}

/**
 * El destino de después del login viaja en la URL como `?next=`: la landing lo
 * pone al mandar a /signin, /signin lo reenvía al callback de Supabase y el
 * callback devuelve al alumno justo ahí (ver app/api/auth/callback/route.js).
 *
 * Es un parámetro que puede escribir cualquiera, así que nunca se redirige a
 * lo que traiga sin filtrarlo: sin esto, un link a
 * /signin?next=https://otro-sitio.com convierte nuestro login en el trampolín
 * de una página de phishing con nuestro dominio en el remitente.
 *
 * Solo pasan rutas internas de esta app. Se rechaza:
 *   · lo que no empiece por "/"        → URL absoluta a otro dominio
 *   · "//host" y "/\host"              → el navegador los lee como host
 *   · saltos de línea y control chars  → inyección en la cabecera Location
 *
 * @returns {string|null} la ruta si es segura, null si no hay o no sirve.
 */
export function sanitizeNextPath(value) {
  if (typeof value !== "string") return null;

  const path = value.trim();

  if (!path.startsWith("/")) return null;
  if (path.startsWith("//") || path.startsWith("/\\")) return null;
  if ([...path].some((char) => char.charCodeAt(0) < 0x20)) return null;

  return path;
}

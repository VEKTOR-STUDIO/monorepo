import { updateSession } from "@/libs/supabase/middleware";

export async function middleware(request) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Todas las rutas menos las que no necesitan sesión:
     * - _next/static, _next/image  → estáticos y optimización de imágenes
     * - iconos y OpenGraph         → los pide cada crawler que ve el link
     * - robots.txt y sitemaps      → los pide Google
     * - cualquier archivo con extensión de imagen
     * Refrescar la sesión de Supabase en esas rutas es trabajo tirado.
     */
    "/((?!_next/static|_next/image|favicon.ico|apple-icon|opengraph-image|twitter-image|robots\\.txt|sitemap.*\\.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

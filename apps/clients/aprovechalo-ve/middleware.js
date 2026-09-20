import { NextResponse } from "next/server";
import { updateSession } from "@/libs/supabase/middleware";
import { COOKIE_ACCESO, cookieEsValida, hayCandado, rutaLibre } from "@/libs/acceso";

export async function middleware(request) {
  const { pathname, search } = request.nextUrl;

  // La puerta de la demo va antes que nada: si no se ha pasado, no se sirve
  // ni una página de la tienda. Se comprueba aquí, en el servidor, y no en el
  // navegador: una pantalla de bloqueo pintada con CSS se quita con F12.
  if (hayCandado() && !rutaLibre(pathname)) {
    const cookie = request.cookies.get(COOKIE_ACCESO)?.value;

    if (!(await cookieEsValida(cookie))) {
      const puerta = request.nextUrl.clone();
      puerta.pathname = "/entrar";
      puerta.search = "";
      // Para devolver a la gente a donde iba en cuanto abra.
      if (pathname !== "/") puerta.searchParams.set("destino", `${pathname}${search}`);
      return NextResponse.redirect(puerta);
    }
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Todo menos los archivos estáticos y las imágenes, que no necesitan
     * pasar por aquí.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

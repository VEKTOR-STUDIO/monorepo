import { NextResponse } from "next/server";
import { COOKIE_ACCESO, cookieEsValida, hayCandado, rutaLibre } from "@/libs/acceso";

export async function middleware(request) {
  const { pathname, search } = request.nextUrl;

  // La puerta de la demo. Si no se ha pasado, no se sirve ni una página del
  // sitio. Se comprueba aquí, en el servidor, y no en el navegador: una
  // pantalla de bloqueo pintada con CSS se quita con F12 en diez segundos.
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

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Todo menos los archivos estáticos y las imágenes, que no necesitan
     * pasar por aquí, y menos /_vercel, que es por donde Web Analytics carga
     * su script y manda las visitas: si pasara por la puerta, cada visita a
     * /entrar se perdería en un 307.
     */
    "/((?!_next/static|_next/image|_vercel|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

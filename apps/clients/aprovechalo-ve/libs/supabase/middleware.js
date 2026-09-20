import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { DEV_NO_LOGIN } from "@/libs/dev-mode";
import { esDemo } from "@/libs/demo";

const LANDING_ONLY = process.env.NEXT_PUBLIC_LANDING_ONLY === "true";

export async function updateSession(request) {
  const { pathname } = request.nextUrl;

  // Modo local sin login (ver libs/dev-mode.js): nada de redirecciones.
  if (DEV_NO_LOGIN) {
    return NextResponse.next({ request });
  }

  // En demo el panel se deja ver sin sesión: enseñarlo es parte de la venta.
  // No escribe nada —acciones.js lo corta— ni consulta pedidos reales.
  if (esDemo() && pathname.startsWith("/admin")) {
    return NextResponse.next({ request });
  }

  // Sin Supabase no hay sesión que refrescar y createServerClient revienta.
  // La tienda tiene que seguir en pie: el catálogo no necesita base de datos.
  // Las rutas privadas se defienden solas (app/admin/layout.js avisa de que
  // falta conectar Supabase), así que aquí basta con dejar pasar.
  const hayCredenciales =
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!hayCredenciales) {
    return NextResponse.next({ request });
  }

  // Landing only: no Supabase; redirect signin/dashboard to /
  if (LANDING_ONLY) {
    if (
      pathname.startsWith("/signin") ||
      pathname.startsWith("/signup") ||
      pathname.startsWith("/cuenta") ||
      pathname.startsWith("/admin")
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next({ request });
  }

  // La tienda y el checkout son públicos: se compra sin cuenta. El cron lleva
  // su propio secreto, así que tampoco necesita sesión.
  const skipAuthRoutes = ['/api/checkout', '/api/cron'];
  if (skipAuthRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next({
      request,
    });
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // refreshing the auth token
  const { data: { user } } = await supabase.auth.getUser();

  // Rutas que piden sesión. Que /admin sea SOLO para el equipo de Hardcore se
  // comprueba en app/admin/layout.js, donde ya se puede leer el rol sin pagar
  // una consulta a la base de datos en cada petición.
  const protectedRoutes = ['/cuenta', '/admin'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Rutas de autenticación (login/signup)
  const authRoutes = ['/signin', '/signup'];
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  // Si el usuario NO está autenticado y está en una ruta protegida, redirigir a /signin
  if (!user && isProtectedRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/signin';
    redirectUrl.searchParams.set('redirect', pathname); // Guardar la ruta original para redirigir después del login
    return NextResponse.redirect(redirectUrl);
  }

  // Si el usuario SÍ está autenticado y está en una ruta de auth (signin/signup), redirigir a /dashboard
  if (user && isAuthRoute) {
    // Verificar si hay un parámetro de redirección
    const redirectTo = request.nextUrl.searchParams.get('redirect');
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = redirectTo || '/cuenta';
    redirectUrl.search = ''; // Limpiar los query params
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}

import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function updateSession(request) {
  // Skip auth refresh for API routes that don't need authentication
  const { pathname } = request.nextUrl;
  const skipAuthRoutes = ['/api/webhook', '/api/lead'];
  
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

  // Rutas protegidas que requieren autenticación
  const protectedRoutes = ['/dashboard'];
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
    redirectUrl.pathname = redirectTo || '/dashboard';
    redirectUrl.search = ''; // Limpiar los query params
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}

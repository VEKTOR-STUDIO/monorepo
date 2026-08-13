import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function updateSession(request) {
  // Skip auth refresh for API routes that don't need authentication
  const { pathname } = request.nextUrl;
  // El flyer de las invitaciones (/api/invitaciones/<slug>/imagen) lo pide
  // cualquiera: el que abre la story, WhatsApp al generar el preview, el
  // cliente de correo. Refrescar sesión ahí es trabajo tirado y además le
  // pega un Set-Cookie a una respuesta que queremos cacheada en el CDN.
  const skipAuthRoutes = ['/api/webhook', '/api/lead', '/api/invitaciones'];
  
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
  await supabase.auth.getUser();

  return supabaseResponse;
}

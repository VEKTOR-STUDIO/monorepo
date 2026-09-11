import { NextResponse } from "next/server";
import { createClient } from "@/libs/supabase/server";
import config from "@/config";

export const dynamic = "force-dynamic";

// -----------------------------------------------------------------------------
// Vuelta del login (Google y enlace mágico por correo).
// Canjea el código por una sesión y manda a cada quien a su sitio:
//   entrenador -> /admin      alumno -> /dashboard (o la página que pedía)
// -----------------------------------------------------------------------------
export async function GET(req) {
  const requestUrl = new URL(req.url);
  const origin = requestUrl.origin;
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next");
  const authError = requestUrl.searchParams.get("error_description");

  if (authError) {
    return NextResponse.redirect(
      `${origin}/signin?error=${encodeURIComponent(authError)}`
    );
  }

  if (!code) {
    return NextResponse.redirect(`${origin}${config.auth.loginUrl}`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      `${origin}/signin?error=${encodeURIComponent(error.message)}`
    );
  }

  // Si el alumno pidió una página concreta antes de entrar, respetarla.
  if (next && next.startsWith("/")) {
    return NextResponse.redirect(`${origin}${next}`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.role === "admin") {
      return NextResponse.redirect(`${origin}/admin`);
    }
  }

  return NextResponse.redirect(`${origin}${config.auth.callbackUrl}`);
}

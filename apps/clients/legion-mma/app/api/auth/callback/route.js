import { NextResponse } from "next/server";
import { createClient } from "@/libs/supabase/server";
import config from "@/config";

export const dynamic = "force-dynamic";

// This route is called after a successful login. It exchanges the code for a session and redirects to the callback URL (see config.js).
export async function GET(req) {
  const requestUrl = new URL(req.url);
  const code = requestUrl.searchParams.get("code");
  // Optional path to redirect to after login (set by middleware when hitting a protected route).
  const redirectTo = requestUrl.searchParams.get("redirect");

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Redirect to the SAME origin the user came from (localhost, vercel.app, or the
  // production domain) so the session cookie set on this request stays valid.
  return NextResponse.redirect(
    requestUrl.origin + (redirectTo || config.auth.callbackUrl)
  );
}

// ============================================================================
// STORY DE LINEUP — PNG 1080×1920 con 4 peleadores escritos a mano.
//
// POST /api/invitaciones/<slug>/lineup
//   body: { fighters: [{ name, academy, rank }, { ... }, { ... }, { ... }] }
//
// Solo el profesor: los nombres no viven en la base, se dibujan y se bajan.
// ============================================================================

import { createClient } from "@/libs/supabase/server";
import { parseLineup, lineupImageFilename } from "@/libs/invites";
import { renderLineupPng } from "./card";

export const runtime = "nodejs";
export const maxDuration = 30;

const FIELDS =
  "id, slug, title, tagline, starts_at, location, outfit, event_type";

async function getAdminClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "No autenticado", status: 401 };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { error: "Solo el profesor puede hacer esto", status: 403 };
  }

  return { supabase };
}

export async function POST(request, { params }) {
  const { slug } = await params;
  const auth = await getAdminClient();
  if (auth.error) {
    return new Response(auth.error, {
      status: auth.status,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  const { data: invite } = await auth.supabase
    .from("caos_invites")
    .select(FIELDS)
    .eq("slug", slug)
    .maybeSingle();

  if (!invite) {
    return new Response("Invitación no encontrada", {
      status: 404,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response("JSON inválido", {
      status: 400,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  const parsed = parseLineup(body?.fighters);
  if (parsed.error) {
    return new Response(parsed.error, {
      status: 400,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  let png;
  try {
    png = await renderLineupPng(invite, parsed.fighters);
  } catch (error) {
    console.error("[caos lineup]", error);
    return new Response("No se pudo generar la story", {
      status: 500,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  const headers = new Headers();
  headers.set("content-type", "image/png");
  headers.set("Cache-Control", "private, no-store");
  headers.set(
    "Content-Disposition",
    `attachment; filename="${lineupImageFilename(slug)}"`
  );

  return new Response(png, { status: 200, headers });
}

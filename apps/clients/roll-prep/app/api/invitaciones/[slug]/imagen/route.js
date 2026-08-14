// ============================================================================
// EL FLYER — la invitación CAOS rasterizada en PNG.
//
//   /api/invitaciones/<slug>/imagen                → story 1080×1920 (9:16)
//   /api/invitaciones/<slug>/imagen?formato=post   → post  1080×1350 (4:5)
//   ...&descargar=1                                → se baja como archivo
//   ...&v=<updated_at>                             → rompe el caché al editar
//
// Es la misma imagen para todo: el preview del panel, el botón de descarga
// que se sube a las stories, la que viaja en el correo y la que enseña
// WhatsApp cuando alguien pega el link. Un solo sitio donde está el diseño.
//
// Aquí solo está el HTTP: quién puede ver cuál, qué se cachea y qué se baja
// como archivo. El diseño del póster está en ./flyer.js.
// ============================================================================

import { createPublicClient } from "@/libs/supabase/public";
import { createClient } from "@/libs/supabase/server";
import { DEFAULT_FORMAT, INVITE_FORMATS, inviteImageFilename } from "@/libs/invites";
import { renderFlyerPng } from "./flyer";

export const runtime = "nodejs";
export const maxDuration = 30;

const FIELDS =
  "id, slug, title, tagline, description, starts_at, location, cta_url, cta_label, outfit, event_type, slots, price, updated_at";

/**
 * Busca la invitación primero por la vista pública (sin cookies, cacheable) y
 * si no está, con la sesión: es la única forma de que el profesor vea el
 * preview de una invitación que todavía tiene el link público apagado.
 * `cacheable` dice por cuál de las dos entró, y de eso depende el caché.
 */
async function loadInvite(slug) {
  const publicClient = createPublicClient();

  if (publicClient) {
    const { data } = await publicClient
      .from("caos_invites_public")
      .select(FIELDS)
      .eq("slug", slug)
      .maybeSingle();

    if (data) return { invite: data, cacheable: true };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { invite: null, cacheable: true };

  const { data } = await supabase
    .from("caos_invites")
    .select(FIELDS)
    .eq("slug", slug)
    .maybeSingle();

  return { invite: data ?? null, cacheable: false };
}

// ----------------------------------------------------------------------------
export async function GET(request, { params }) {
  const { slug } = await params;
  const { searchParams } = new URL(request.url);

  const requested = searchParams.get("formato");
  const format = INVITE_FORMATS[requested] ? requested : DEFAULT_FORMAT;
  const download = searchParams.get("descargar") === "1";

  const { invite, cacheable } = await loadInvite(slug);

  if (!invite) {
    return new Response("Invitación no encontrada", {
      status: 404,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  let png;
  try {
    png = await renderFlyerPng(invite, format);
  } catch (error) {
    console.error("[caos flyer]", error);
    return new Response("No se pudo generar el flyer", {
      status: 500,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  const headers = new Headers();
  headers.set("content-type", "image/png");

  // El flyer de una invitación con link público apagado solo lo ve quien tiene
  // sesión: no puede quedar guardado en el CDN, que sirve a cualquiera.
  headers.set(
    "Cache-Control",
    cacheable
      ? "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400"
      : "private, no-store"
  );

  if (download) {
    headers.set(
      "Content-Disposition",
      `attachment; filename="${inviteImageFilename(slug, format)}"`
    );
  }

  return new Response(png, { status: 200, headers });
}

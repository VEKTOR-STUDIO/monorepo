// ============================================================================
// PREVIEW DEL CORREO — el HTML que va a salir, servido tal cual en el
// navegador.
//
// Mientras Resend no esté configurado no hay forma de mandarse una prueba, y
// aun después seguirá siendo más rápido mirarlo aquí que esperar la bandeja.
// Es el MISMO builder que usa el envío (libs/invite-email.js): lo que se ve
// aquí es lo que llega.
//
// Ojo: los route handlers NO pasan por el layout de /dashboard/admin, así que
// el rol se comprueba aquí mismo.
// ============================================================================

import { createClient } from "@/libs/supabase/server";
import { inviteEmailHtml, inviteSubject } from "@/libs/invite-email";
import { isMissingInvites } from "@/libs/invites";

export async function GET(request, { params }) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return new Response("No autenticado", { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return new Response("Solo el profesor puede ver esto", { status: 403 });
  }

  const { data: invite, error } = await supabase
    .from("caos_invites")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (isMissingInvites(error)) {
    return new Response("Falta correr la migración de invitaciones.", {
      status: 500,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  if (!invite) return new Response("Esa invitación no existe", { status: 404 });

  // El correo se arma con el nombre de quien mira: así se ve el saludo real.
  const html = inviteEmailHtml(invite, { greetingName: profile.full_name });

  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "private, no-store",
      // El asunto no se ve en el cuerpo: va aquí para poder revisarlo también.
      "x-email-subject": encodeURIComponent(inviteSubject(invite)),
    },
  });
}

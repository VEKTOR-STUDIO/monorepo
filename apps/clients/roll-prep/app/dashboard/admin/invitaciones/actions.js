"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/libs/supabase/server";
import config from "@/config";
import { OUTFITS, EVENT_TYPES } from "@/libs/caos";
import {
  buildInviteSlug,
  CAOS_INVITES_MIGRATION,
  INVITE_LIMITS,
  isMissingInvites,
  localInputToISO,
} from "@/libs/invites";
import {
  inviteEmailHtml,
  inviteEmailText,
  inviteSubject,
  safeUrl,
} from "@/libs/invite-email";

const MISSING_MIGRATION = `Falta correr ${CAOS_INVITES_MIGRATION} en el SQL Editor de Supabase.`;

// Resend manda hasta 100 correos por llamada del batch.
const BATCH_SIZE = 100;
// Tope de correos escritos a mano en el formulario, para no convertir el
// panel en una lista de difusión.
const MAX_EXTRA = 100;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

async function getAdminSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("No autenticado");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    throw new Error("Solo el profesor puede hacer esto");
  }

  return { supabase, user };
}

function revalidateInvitePaths(slug) {
  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/admin/invitaciones");
  // La cartelera pública se prerenderiza: sin esto, el evento recién creado
  // no aparece hasta que le toque el revalidate por tiempo.
  revalidatePath("/caos");
  if (slug) {
    revalidatePath(`/dashboard/admin/invitaciones/${slug}`);
    revalidatePath(`/caos/${slug}`);
  }
}

/**
 * Lee y valida el formulario. Devuelve { values } o { error } con el primer
 * problema en cristiano — los CHECK de Postgres dicen lo mismo pero en un
 * idioma que no le sirve al profesor.
 */
function readInviteForm(formData) {
  const text = (name) => formData.get(name)?.trim() || null;

  const fields = {
    title: text("title"),
    tagline: text("tagline"),
    description: text("description"),
    location: text("location"),
    price: text("price"),
    cta_label: text("cta_label"),
  };

  if (!fields.title) return { error: "La invitación necesita un título." };

  const tooLong = [
    ["El título", fields.title, INVITE_LIMITS.title],
    ["El gancho", fields.tagline, INVITE_LIMITS.tagline],
    ["La descripción", fields.description, INVITE_LIMITS.description],
    ["La sede", fields.location, INVITE_LIMITS.location],
    ["La entrada", fields.price, INVITE_LIMITS.price],
    ["El texto del botón", fields.cta_label, INVITE_LIMITS.ctaLabel],
  ].find(([, value, max]) => value && value.length > max);

  if (tooLong) {
    return { error: `${tooLong[0]} no puede pasar de ${tooLong[2]} caracteres.` };
  }

  const startsAt = localInputToISO(formData.get("starts_at"));
  if (!startsAt) return { error: "Falta la fecha y la hora del evento." };

  const outfit = formData.get("outfit") || "nogi";
  if (!OUTFITS[outfit]) return { error: "Ruleset inválido." };

  const eventType = formData.get("event_type") || "circuit";
  if (!EVENT_TYPES[eventType]) return { error: "Tipo de evento inválido." };

  const rawSlots = formData.get("slots")?.trim();
  let slots = null;
  if (rawSlots) {
    slots = Number(rawSlots);
    if (!Number.isInteger(slots) || slots < 2 || slots > 128) {
      return { error: "Los cupos van de 2 a 128." };
    }
  }

  // Los links viajan en el correo y en la página pública: solo http(s).
  const urls = {};
  for (const name of ["map_url", "cta_url"]) {
    const raw = formData.get(name)?.trim();
    if (!raw) {
      urls[name] = null;
      continue;
    }
    const clean = safeUrl(raw);
    if (!clean) {
      return {
        error:
          name === "map_url"
            ? "El link del mapa tiene que empezar por http:// o https://."
            : "El link de inscripción tiene que empezar por http:// o https://.",
      };
    }
    if (clean.length > INVITE_LIMITS.url) return { error: "Ese link es demasiado largo." };
    urls[name] = clean;
  }

  return {
    values: {
      ...fields,
      starts_at: startsAt,
      outfit,
      event_type: eventType,
      slots,
      is_public: formData.get("is_public") === "on",
      ...urls,
    },
  };
}

/**
 * Crea la invitación. El slug se calcula aquí una sola vez: es la llave que
 * va en el link público y en la URL del flyer.
 */
export async function createInvite(formData) {
  const { supabase, user } = await getAdminSession();

  const { values, error: formError } = readInviteForm(formData);
  if (formError) return { error: formError };

  const { data, error } = await supabase
    .from("caos_invites")
    .insert({
      ...values,
      slug: buildInviteSlug(values.title),
      created_by: user.id,
    })
    .select("id, slug")
    .single();

  if (isMissingInvites(error)) return { error: MISSING_MIGRATION };
  if (error?.code === "23505") {
    return { error: "Ya existe una invitación con ese link. Intenta de nuevo." };
  }
  if (error) return { error: "No se pudo crear la invitación." };

  revalidateInvitePaths(data.slug);
  return { success: true, id: data.id, slug: data.slug };
}

/**
 * Guarda los cambios. El slug NO se toca: los links que ya se repartieron
 * tienen que seguir abriendo.
 */
export async function updateInvite(formData) {
  const { supabase } = await getAdminSession();

  const id = formData.get("id")?.trim();
  if (!id) return { error: "Falta la invitación." };

  const { values, error: formError } = readInviteForm(formData);
  if (formError) return { error: formError };

  const { data, error } = await supabase
    .from("caos_invites")
    .update(values)
    .eq("id", id)
    .select("slug")
    .single();

  if (isMissingInvites(error)) return { error: MISSING_MIGRATION };
  if (error) return { error: "No se pudo guardar la invitación." };

  revalidateInvitePaths(data?.slug);
  return { success: true };
}

export async function deleteInvite(id) {
  const { supabase } = await getAdminSession();

  if (!id) return { error: "Falta la invitación." };

  const { data } = await supabase
    .from("caos_invites")
    .select("slug")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("caos_invites").delete().eq("id", id);

  if (isMissingInvites(error)) return { error: MISSING_MIGRATION };
  if (error) return { error: "No se pudo borrar la invitación." };

  revalidateInvitePaths(data?.slug);
  return { success: true };
}

// ----------------------------------------------------------------------------
// ENVÍO
//
// Resend todavía no está configurado (falta verificar el dominio), así que
// esta parte se prueba el día que la llave exista. Hasta entonces devuelve el
// aviso y no toca la base: nada queda marcado como enviado por error.
// ----------------------------------------------------------------------------

/** Los correos escritos a mano en el textarea: coma, punto y coma o salto. */
function parseExtraEmails(raw) {
  const list = String(raw ?? "")
    .split(/[\s,;]+/)
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  return [...new Set(list)];
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Manda la invitación por correo.
 *
 * audience:
 *   test     → solo a quien está en el panel, para revisar cómo llega
 *   students → los alumnos
 *   all      → todo el gym (alumnos y profesores)
 * Siempre se le suman los correos sueltos del textarea (el otro gym, el
 * amigo que no tiene cuenta): son los que hacen crecer el evento.
 *
 * A quien ya le llegó no se le vuelve a escribir, salvo que se marque
 * "reenviar a todos": así se puede convocar a los que entraron después sin
 * spamear a los demás.
 */
export async function sendInvite(formData) {
  const { supabase, user } = await getAdminSession();

  const id = formData.get("id")?.trim();
  const audience = formData.get("audience") || "students";
  const resendAll = formData.get("resend_all") === "on";

  if (!id) return { error: "Falta la invitación." };
  if (!["test", "students", "all"].includes(audience)) {
    return { error: "Destinatarios inválidos." };
  }

  if (!process.env.RESEND_API_KEY) {
    return {
      error:
        "Falta RESEND_API_KEY. Verifica el dominio en Resend, pon la llave en las variables de entorno y vuelve a darle: el correo ya está armado.",
    };
  }

  const { data: invite, error: inviteError } = await supabase
    .from("caos_invites")
    .select(
      "id, slug, title, tagline, description, starts_at, location, cta_url, cta_label, outfit, event_type, slots, price, updated_at"
    )
    .eq("id", id)
    .maybeSingle();

  if (isMissingInvites(inviteError)) return { error: MISSING_MIGRATION };
  if (!invite) return { error: "Esa invitación ya no existe." };

  // --- A quién --------------------------------------------------------------
  const extra = parseExtraEmails(formData.get("extra"));
  const invalid = extra.filter((email) => !EMAIL_PATTERN.test(email));
  if (invalid.length) return { error: `Correo inválido: ${invalid[0]}` };
  if (extra.length > MAX_EXTRA) {
    return { error: `Máximo ${MAX_EXTRA} correos sueltos por envío.` };
  }

  let recipients = [];

  if (audience === "test") {
    if (!user.email) return { error: "Tu cuenta no tiene correo." };
    recipients = [{ email: user.email.toLowerCase(), name: null, profileId: user.id }];
  } else {
    const { data: rows, error: usersError } = await supabase
      .from("admin_users")
      .select("id, email, full_name, role");

    if (usersError) {
      return { error: "No se pudo leer la lista del gym." };
    }

    recipients = (rows ?? [])
      .filter((row) => row.email && (audience === "all" || row.role === "student"))
      .map((row) => ({
        email: row.email.toLowerCase(),
        name: row.full_name,
        profileId: row.id,
      }));
  }

  for (const email of extra) {
    if (!recipients.some((person) => person.email === email)) {
      recipients.push({ email, name: null, profileId: null });
    }
  }

  // --- Quién ya la recibió --------------------------------------------------
  let skipped = 0;

  if (audience !== "test" && !resendAll) {
    const { data: alreadySent } = await supabase
      .from("caos_invite_sends")
      .select("email")
      .eq("invite_id", invite.id)
      .eq("status", "sent");

    const done = new Set((alreadySent ?? []).map((row) => row.email));
    const before = recipients.length;
    recipients = recipients.filter((person) => !done.has(person.email));
    skipped = before - recipients.length;
  }

  if (!recipients.length) {
    return skipped
      ? { error: "Ya se les mandó a todos. Marca «reenviar» si quieres repetirlo." }
      : { error: "No hay a quién mandársela." };
  }

  // --- El envío -------------------------------------------------------------
  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);

  const subject = inviteSubject(invite);
  const results = [];

  for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
    const chunk = recipients.slice(i, i + BATCH_SIZE);

    const payload = chunk.map((person) => ({
      from: config.resend.fromAdmin,
      to: person.email,
      replyTo: config.resend.supportEmail,
      subject,
      html: inviteEmailHtml(invite, { greetingName: person.name }),
      text: inviteEmailText(invite, { greetingName: person.name }),
    }));

    let sent;
    let failure = null;

    try {
      const response = await resend.batch.send(payload);
      failure = response.error?.message ?? null;
      sent = response.data?.data ?? [];
    } catch (err) {
      failure = err?.message ?? "Resend no respondió.";
      sent = [];
    }

    chunk.forEach((person, index) => {
      results.push({
        invite_id: invite.id,
        email: person.email,
        profile_id: person.profileId,
        status: failure ? "failed" : "sent",
        error: failure,
        provider_id: failure ? null : (sent[index]?.id ?? null),
        sent_at: new Date().toISOString(),
      });
    });

    if (i + BATCH_SIZE < recipients.length) await sleep(600);
  }

  const failed = results.filter((row) => row.status === "failed");
  const okCount = results.length - failed.length;

  // El log se guarda pase lo que pase: si algo rebotó, el panel lo enseña.
  await supabase
    .from("caos_invite_sends")
    .upsert(results, { onConflict: "invite_id,email" });

  if (okCount && audience !== "test") {
    await supabase
      .from("caos_invites")
      .update({ sent_at: new Date().toISOString() })
      .eq("id", invite.id);
  }

  revalidateInvitePaths(invite.slug);

  if (!okCount) {
    return { error: `No salió ningún correo: ${failed[0]?.error ?? "error de Resend"}` };
  }

  return { success: true, sent: okCount, failed: failed.length, skipped };
}

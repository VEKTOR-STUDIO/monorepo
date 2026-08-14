// ============================================================================
// INVITACIONES CAOS — la convocatoria de un evento antes de que exista el
// bracket. Vive en public.caos_invites (ver la migración
// supabase/migrations/20260813120000_caos_invites.sql).
//
// De cada invitación salen tres cosas, todas con los mismos datos:
//   · el FLYER (PNG) que se descarga y se sube a las stories
//     → app/api/invitaciones/[slug]/imagen/route.js
//   · la PÁGINA pública del evento, que es a donde apunta el flyer
//     → app/caos/[slug]/page.js
//   · el CORREO que se manda con Resend
//     → libs/invite-email.js
//
// Este módulo lo importan cliente y servidor: nada de `fs`, `process.env`
// privado ni dependencias de Node aquí.
// ============================================================================

import config from "@/config";
import { CAOS_STEPS } from "@/libs/caos";
import { RANKS } from "@/libs/gamification";

export const CAOS_INVITES_MIGRATION =
  "supabase/migrations/20260813120000_caos_invites.sql";

// Límites que replican los CHECK de la migración. La UI corta antes para que
// el error salga en el formulario y no como un 400 de Postgres.
export const INVITE_LIMITS = {
  title: 60,
  tagline: 90,
  description: 700,
  location: 60,
  price: 30,
  ctaLabel: 24,
  url: 500,
};

export const DEFAULT_CTA_LABEL = "Nos vemos ahí";

// ----------------------------------------------------------------------------
// FORMATOS DEL FLYER
// story  → el que se sube a Instagram/WhatsApp stories (9:16).
// post   → el del feed (4:5), que es el que se mete en el correo y en el
//          preview de los links (OG image).
// ----------------------------------------------------------------------------
export const INVITE_FORMATS = {
  story: {
    label: "Story",
    ratio: "9:16",
    width: 1080,
    height: 1920,
    hint: "Instagram / WhatsApp stories",
  },
  post: {
    label: "Post",
    ratio: "4:5",
    width: 1080,
    height: 1350,
    hint: "Feed de Instagram · preview del link",
  },
};

export const DEFAULT_FORMAT = "story";

/**
 * La base todavía no tiene la migración de invitaciones: falta la tabla o la
 * vista (42P01 / PGRST205), o una columna (42703 / PGRST204).
 */
export function isMissingInvites(error) {
  return ["42703", "42P01", "PGRST204", "PGRST205"].includes(error?.code);
}

// ----------------------------------------------------------------------------
// SLUG — la llave pública. Se genera UNA vez, al crear: vive en los links que
// ya se repartieron, así que editar el título no lo mueve.
// ----------------------------------------------------------------------------
const SLUG_SUFFIX = "abcdefghijkmnpqrstuvwxyz23456789";

export function slugify(value) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
    .replace(/-+$/g, "");
}

/**
 * Slug con cola aleatoria: `caos-circuito-1-k4p9`. La cola evita chocar con
 * el evento del mes pasado, que muchas veces se llama igual.
 */
export function buildInviteSlug(title) {
  const base = slugify(title) || "caos";
  let suffix = "";
  for (let i = 0; i < 4; i++) {
    suffix += SLUG_SUFFIX[Math.floor(Math.random() * SLUG_SUFFIX.length)];
  }
  return `${base}-${suffix}`;
}

// ----------------------------------------------------------------------------
// FECHAS
// La base guarda `starts_at` en UTC, pero el evento es a las 7:30pm DE
// CARACAS. El input del formulario da una hora sin huso ("2026-08-20T19:30"),
// y hay que leerla en la zona del gym — no en la del navegador del profesor ni
// en la del servidor de Vercel.
// ----------------------------------------------------------------------------
const LOCAL_INPUT = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/;

function zoneParts(date, timeZone) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  return Object.fromEntries(parts.map((part) => [part.type, part.value]));
}

/** Cuánto se adelanta la zona respecto a UTC, en ms, para ese instante. */
function zoneOffsetMs(date, timeZone) {
  const p = zoneParts(date, timeZone);
  const asUtc = Date.UTC(
    Number(p.year),
    Number(p.month) - 1,
    Number(p.day),
    Number(p.hour),
    Number(p.minute),
    Number(p.second)
  );
  return asUtc - date.getTime();
}

/**
 * "2026-08-20T19:30" (hora del gym) → ISO en UTC para guardar.
 * Devuelve null si el texto no tiene forma de fecha.
 */
export function localInputToISO(value, timeZone = config.timezone) {
  const match = LOCAL_INPUT.exec(value ?? "");
  if (!match) return null;

  const [, y, m, d, hh, mm] = match;
  const naive = Date.UTC(Number(y), Number(m) - 1, Number(d), Number(hh), Number(mm));
  // Una pasada basta: Caracas no tiene horario de verano, y donde lo hay el
  // salto es de una hora, nunca en el minuto exacto del evento.
  const utc = naive - zoneOffsetMs(new Date(naive), timeZone);

  return Number.isNaN(utc) ? null : new Date(utc).toISOString();
}

/**
 * ISO de la base → el valor que espera un <input type="datetime-local">,
 * ya convertido a la hora del gym.
 */
export function isoToLocalInput(iso, timeZone = config.timezone) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  const p = zoneParts(date, timeZone);
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
}

/**
 * Los pedazos de la fecha para pintarla: el flyer usa el día suelto y el mes
 * corto en bloques distintos, el correo usa la línea larga.
 */
export function inviteDateParts(iso, timeZone = config.timezone) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;

  const fmt = (options) =>
    new Intl.DateTimeFormat("es-VE", { timeZone, ...options }).format(date);

  const time = fmt({ hour: "numeric", minute: "2-digit", hour12: true })
    .replace(/\s?a\.\s?m\.?/i, " AM")
    .replace(/\s?p\.\s?m\.?/i, " PM")
    .toUpperCase();

  return {
    weekday: fmt({ weekday: "long" }),
    weekdayShort: fmt({ weekday: "short" }).replace(".", ""),
    day: fmt({ day: "numeric" }),
    month: fmt({ month: "short" }).replace(".", ""),
    monthLong: fmt({ month: "long" }),
    year: fmt({ year: "numeric" }),
    time,
    long: `${fmt({ weekday: "long", day: "numeric", month: "long" })} · ${time}`,
    short: `${fmt({ weekday: "short", day: "numeric", month: "short" }).replace(/\./g, "")} · ${time}`,
  };
}

/** El evento ya pasó (con una hora de gracia: en el tatami nada empieza puntual). */
export function isPastInvite(iso, now = new Date()) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return false;
  return date.getTime() + 3_600_000 < now.getTime();
}

// ----------------------------------------------------------------------------
// URLS
// ----------------------------------------------------------------------------

/**
 * El dominio público. En el correo y en el flyer los links tienen que ser
 * absolutos: los abre alguien que no está en la app.
 */
export function siteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  return (fromEnv || `https://${config.domainName}`).replace(/\/+$/, "");
}

export function invitePath(slug) {
  return `/caos/${slug}`;
}

export function inviteUrl(slug) {
  return `${siteUrl()}${invitePath(slug)}`;
}

/**
 * URL del flyer. `v` (updated_at) rompe el caché al editar; `descargar`
 * hace que el navegador lo baje como archivo en vez de abrirlo.
 */
export function inviteImagePath(slug, { format = DEFAULT_FORMAT, v, download } = {}) {
  const params = new URLSearchParams();
  if (format !== DEFAULT_FORMAT) params.set("formato", format);
  if (v) params.set("v", String(new Date(v).getTime() || v));
  if (download) params.set("descargar", "1");

  const query = params.toString();
  return `/api/invitaciones/${slug}/imagen${query ? `?${query}` : ""}`;
}

export function inviteImageUrl(slug, options) {
  return `${siteUrl()}${inviteImagePath(slug, options)}`;
}

/** Nombre del archivo que se descarga. */
export function inviteImageFilename(slug, format = DEFAULT_FORMAT) {
  return `caos-${slug}-${format}.png`;
}

export const LINEUP_SIZE = 4;
export const LINEUP_LIMITS = {
  name: 32,
  academy: 28,
};

export function lineupRankOf(key) {
  const rank = RANKS.find((row) => row.key === key);
  if (!rank) return null;
  return {
    key: rank.key,
    short: rank.short,
    color: rank.color,
    ink: rank.ink,
  };
}

/**
 * Lee los 4 peleadores que van en la story de lineup. El profesor los
 * escribe a mano: no salen del bracket (ese se arma el día del evento).
 */
export function parseLineup(raw) {
  if (!Array.isArray(raw) || raw.length !== LINEUP_SIZE) {
    return { error: `Van exactamente ${LINEUP_SIZE} peleadores.` };
  }

  const fighters = raw.map((row, index) => {
    const name = String(row?.name ?? "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, LINEUP_LIMITS.name);
    const academy = String(row?.academy ?? "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, LINEUP_LIMITS.academy);
    const rank = lineupRankOf(row?.rank);

    return { slot: index + 1, name, academy, rank };
  });

  if (fighters.some((fighter) => !fighter.name)) {
    return { error: "Cada peleador necesita un nombre." };
  }

  return { fighters };
}

export function lineupImageFilename(slug) {
  return `caos-${slug}-lineup.png`;
}

/**
 * Caption corto para pegar junto a la story de los 4 peleadores.
 */
export function lineupCaption(invite, fighters) {
  const date = inviteDateParts(invite.starts_at);
  const names = (fighters ?? [])
    .filter((fighter) => fighter.name)
    .map((fighter) => {
      const rank =
        fighter.rank?.short ?? lineupRankOf(fighter.rank)?.short ?? null;
      const bits = [rank, fighter.academy].filter(Boolean);
      return bits.length ? `${fighter.name} · ${bits.join(" · ")}` : fighter.name;
    });

  return [
    `🥋 ${invite.title.toUpperCase()}`,
    date ? `📅 ${date.weekday} ${date.day} de ${date.monthLong} · ${date.time}` : null,
    invite.location ? `📍 ${invite.location}` : null,
    "",
    "El lineup:",
    ...names.map((name, i) => `${String(i + 1).padStart(2, "0")}  ${name}`),
    "",
    `La convocatoria 👉 ${inviteUrl(invite.slug)}`,
    "",
    "#jiujitsu #bjj #caos #grappling",
  ]
    .filter((line) => line !== null)
    .join("\n");
}

/**
 * El texto que acompaña al flyer cuando se publica: caption de Instagram,
 * mensaje de WhatsApp, lo que sea. Se copia de un botón para que subir la
 * story sea bajar la imagen, pegar el texto y ya.
 */
export function inviteCaption(invite) {
  const date = inviteDateParts(invite.starts_at);

  return [
    `🥋 ${invite.title.toUpperCase()}`,
    invite.tagline,
    "",
    date ? `📅 ${date.weekday} ${date.day} de ${date.monthLong} · ${date.time}` : null,
    invite.location ? `📍 ${invite.location}` : null,
    invite.price ? `💵 ${invite.price}` : null,
    "",
    ...CAOS_STEPS.map(({ short }) => `▸ ${short}`),
    "",
    `Fuiste invitado. La convocatoria 👉 ${inviteUrl(invite.slug)}`,
    "",
    "#jiujitsu #bjj #caos #nogi #grappling",
  ]
    .filter((line) => line !== null)
    .join("\n");
}

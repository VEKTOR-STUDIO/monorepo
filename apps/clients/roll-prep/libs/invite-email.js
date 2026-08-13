// ============================================================================
// EL CORREO de una invitación CAOS.
//
// Se arma con tablas y estilos en línea porque así es como sobreviven los
// correos: Gmail borra el <style>, Outlook no entiende flexbox y ninguno
// carga fuentes de fuera. La identidad se mantiene con lo que sí pasa —
// fondo negro, volt, mayúsculas y espaciado — y el peso visual lo carga el
// flyer, que va arriba como imagen.
//
// La imagen es la MISMA que se descarga para el feed (formato post), servida
// desde /api/invitaciones/<slug>/imagen. Nada que adjuntar ni que subir.
// ============================================================================

import config from "@/config";
import { OUTFITS, EVENT_TYPES } from "@/libs/caos";
import {
  CAOS_PITCH,
  inviteDateParts,
  inviteImageUrl,
  inviteUrl,
  DEFAULT_CTA_LABEL,
} from "@/libs/invites";

const INK = "#0f0f12";
const PANEL = "#17171b";
const VOLT = "#d4ff00";
const PAPER = "#f5f5f0";
const MUTED = "#8a8a85";
const LINE = "#2a2a30";

const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif";

/** Escapa lo que escribió el profesor: va dentro del HTML del correo. */
function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Los saltos de línea de la descripción se vuelven párrafos. */
function paragraphs(text) {
  return String(text ?? "")
    .split(/\n{1,}/)
    .map((line) => line.trim())
    .filter(Boolean);
}

/**
 * Solo dejamos pasar http(s): un `javascript:` escrito a mano en el panel no
 * tiene por qué llegar a la bandeja de nadie.
 */
export function safeUrl(value) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.toString() : null;
  } catch {
    return null;
  }
}

export function inviteSubject(invite) {
  const date = inviteDateParts(invite.starts_at);
  const when = date ? `${date.weekday} ${date.day} de ${date.monthLong}` : "";
  // Si el título ya dice CAOS no se repite: en la bandeja se ve el asunto
  // cortado y "CAOS · CAOS ·" se come el espacio que necesita la fecha.
  const prefix = /caos/i.test(invite.title) ? "" : "CAOS · ";

  return `${prefix}${invite.title}${when ? ` — ${when}` : ""}`;
}

/**
 * El cuerpo del correo. `greetingName` es el nombre del destinatario cuando
 * lo tenemos (los del gym); los de fuera reciben el saludo genérico.
 */
export function inviteEmailHtml(invite, { greetingName } = {}) {
  const date = inviteDateParts(invite.starts_at);
  const link = inviteUrl(invite.slug);
  const flyer = inviteImageUrl(invite.slug, {
    format: "post",
    v: invite.updated_at,
  });
  const cta = safeUrl(invite.cta_url) ?? link;
  const ctaLabel = invite.cta_label || DEFAULT_CTA_LABEL;
  const outfit = OUTFITS[invite.outfit]?.label ?? "No-Gi";
  const kind = EVENT_TYPES[invite.event_type]?.label ?? "Circuito";

  const rows = [
    ["Cuándo", date ? `${date.weekday} ${date.day} de ${date.monthLong} · ${date.time}` : null],
    ["Dónde", invite.location],
    ["Ruleset", `${outfit} · Torneo ${kind}`],
    ["Cupos", invite.slots ? `${invite.slots} peleadores` : null],
    ["Entrada", invite.price],
  ].filter(([, value]) => Boolean(value));

  const label = (text) =>
    `<span style="font-family:${SANS};font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${MUTED};">${esc(text)}</span>`;

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="dark" />
<title>${esc(inviteSubject(invite))}</title>
</head>
<body style="margin:0;padding:0;background:${INK};">
  <!-- Lo que se lee en la lista de correos, antes de abrir. -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
    ${esc(invite.tagline || "Torneo CAOS: cada pelea se rolea. Terreno aleatorio y cartas de duelo.")}
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${INK};padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:100%;background:${PANEL};border:1px solid ${LINE};">

          <!-- FLYER -->
          <tr>
            <td>
              <a href="${esc(link)}" style="text-decoration:none;">
                <img src="${esc(flyer)}" width="600" alt="${esc(invite.title)} — invitación CAOS" style="display:block;width:100%;max-width:600px;height:auto;border:0;" />
              </a>
            </td>
          </tr>

          <!-- TÍTULO -->
          <tr>
            <td style="padding:32px 32px 0 32px;">
              ${label(`Torneo ${kind} · ${outfit}`)}
              <h1 style="margin:10px 0 0 0;font-family:${SANS};font-size:30px;line-height:1.1;font-weight:800;letter-spacing:-0.5px;text-transform:uppercase;color:${PAPER};">
                ${esc(invite.title)}
              </h1>
              ${
                invite.tagline
                  ? `<p style="margin:12px 0 0 0;font-family:${SANS};font-size:17px;line-height:1.45;font-weight:700;color:${VOLT};">${esc(invite.tagline)}</p>`
                  : ""
              }
            </td>
          </tr>

          <!-- SALUDO + DESCRIPCIÓN -->
          <tr>
            <td style="padding:24px 32px 0 32px;font-family:${SANS};font-size:16px;line-height:1.6;color:${PAPER};">
              <p style="margin:0 0 14px 0;">${greetingName ? `${esc(greetingName)},` : "Ey,"}</p>
              ${paragraphs(invite.description)
                .map((line) => `<p style="margin:0 0 14px 0;">${esc(line)}</p>`)
                .join("")}
            </td>
          </tr>

          <!-- DATOS DEL EVENTO -->
          <tr>
            <td style="padding:8px 32px 0 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${INK};border:1px solid ${LINE};">
                ${rows
                  .map(
                    ([name, value]) => `
                <tr>
                  <td style="padding:14px 18px;border-bottom:1px solid ${LINE};width:110px;vertical-align:top;">${label(name)}</td>
                  <td style="padding:14px 18px;border-bottom:1px solid ${LINE};font-family:${SANS};font-size:16px;font-weight:700;color:${PAPER};">${esc(value)}</td>
                </tr>`
                  )
                  .join("")}
              </table>
            </td>
          </tr>

          <!-- QUÉ ES CAOS -->
          <tr>
            <td style="padding:28px 32px 0 32px;">
              ${label("Cómo se pelea")}
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:12px;">
                ${CAOS_PITCH.map(
                  (line) => `
                <tr>
                  <td width="18" style="vertical-align:top;padding:0 0 10px 0;font-family:${SANS};font-size:16px;color:${VOLT};">■</td>
                  <td style="padding:0 0 10px 0;font-family:${SANS};font-size:15px;line-height:1.5;color:${PAPER};">${esc(line)}</td>
                </tr>`
                ).join("")}
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:28px 32px 8px 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td align="center" bgcolor="${VOLT}" style="padding:0;">
                    <a href="${esc(cta)}" style="display:block;padding:18px 24px;font-family:${SANS};font-size:16px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:${INK};text-decoration:none;">
                      ${esc(ctaLabel)}
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:14px 0 0 0;font-family:${SANS};font-size:13px;line-height:1.5;color:${MUTED};text-align:center;">
                O comparte el evento: <a href="${esc(link)}" style="color:${VOLT};text-decoration:none;">${esc(link.replace(/^https?:\/\//, ""))}</a>
              </p>
            </td>
          </tr>

          <!-- PIE -->
          <tr>
            <td style="padding:28px 32px 32px 32px;border-top:1px solid ${LINE};">
              <p style="margin:0;font-family:${SANS};font-size:12px;line-height:1.6;color:${MUTED};">
                Te llega porque estás en ${esc(config.appName)}, el marcador del gym.
                ¿Dudas del evento? Responde este correo.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** La versión de texto plano, para el cliente que no pinta HTML. */
export function inviteEmailText(invite, { greetingName } = {}) {
  const date = inviteDateParts(invite.starts_at);
  const link = inviteUrl(invite.slug);
  const outfit = OUTFITS[invite.outfit]?.label ?? "No-Gi";
  const kind = EVENT_TYPES[invite.event_type]?.label ?? "Circuito";

  const lines = [
    `${greetingName ? `${greetingName},` : "Ey,"}`,
    "",
    `CAOS · ${invite.title}`.toUpperCase(),
    invite.tagline ?? null,
    "",
    date ? `Cuándo: ${date.weekday} ${date.day} de ${date.monthLong} · ${date.time}` : null,
    invite.location ? `Dónde: ${invite.location}` : null,
    `Ruleset: ${outfit} · Torneo ${kind}`,
    invite.slots ? `Cupos: ${invite.slots} peleadores` : null,
    invite.price ? `Entrada: ${invite.price}` : null,
    "",
    ...paragraphs(invite.description),
    "",
    "Cómo se pelea:",
    ...CAOS_PITCH.map((line) => `- ${line}`),
    "",
    `Anótate: ${safeUrl(invite.cta_url) ?? link}`,
    `Evento: ${link}`,
    "",
    `Te llega porque estás en ${config.appName}.`,
  ];

  return lines.filter((line) => line !== null).join("\n");
}

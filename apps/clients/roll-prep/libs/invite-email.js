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
import {
  OUTFITS,
  EVENT_TYPES,
  CAOS_RANK_POINTS,
  CAOS_STEPS,
  TIER_LABELS,
  CARD_TONE_LABELS,
  caosShowcase,
} from "@/libs/caos";
import {
  inviteDateParts,
  inviteImageUrl,
  inviteUrl,
  siteUrl,
  DEFAULT_CTA_LABEL,
} from "@/libs/invites";

const INK = "#0f0f12";
const PANEL = "#17171b";
const VOLT = "#d4ff00";
const PAPER = "#f5f5f0";
const MUTED = "#8a8a85";
const LINE = "#2a2a30";
// Volt apagado: la sombra dura de los botones, que les da relieve de tecla.
const SHADOW = "#8aa800";
// El rojo del lado OMEGA y el fondo de las cartas, como en la app.
const ACCENT = "#ff5223";
const CARD = "#16171a";

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
export function inviteEmailHtml(invite, { greetingName, flyerSrc } = {}) {
  const date = inviteDateParts(invite.starts_at);
  const link = inviteUrl(invite.slug);
  const flyer =
    flyerSrc ??
    inviteImageUrl(invite.slug, {
      format: "post",
      v: invite.updated_at,
    });
  // La firma va en PNG, no en el .webp original: Outlook de escritorio no
  // dibuja webp y dejaría el pie con el cuadro roto. El PNG se genera del
  // mismo archivo y vive al lado en /public.
  const signature = `${siteUrl()}/logoAlessandrovaruBlanco.png`;
  const cta = safeUrl(invite.cta_url) ?? link;
  const ctaLabel = invite.cta_label || DEFAULT_CTA_LABEL;
  const outfit = OUTFITS[invite.outfit]?.label ?? "No-Gi";
  const kind = EVENT_TYPES[invite.event_type]?.label ?? "Circuito";
  // Las dos cartas de muestra y el tamaño del mazo: las mismas que salen en
  // el flyer de este evento (van ancladas a su slug).
  const show = caosShowcase(invite.slug, invite.outfit);

  // Los datos de la misión: cuándo, dónde y con qué reglas. Ni cupos ni
  // precio — esto es una convocatoria, no una entrada de cine. Lo demás está
  // en la página del evento, a un clic.
  const rows = [
    ["Cuándo", date ? `${date.weekday} ${date.day} de ${date.monthLong} · ${date.time}` : null],
    ["Dónde", invite.location],
    ["Reglas", `${outfit} · Torneo ${kind}`],
  ].filter(([, value]) => Boolean(value));

  // El botín: lo que suma cada cosa al ranking CAOS. Es la parte de
  // videojuego que sí es real — los números salen de la misma tabla que
  // usa la app para repartir puntos (libs/caos.js).
  const loot = [
    ["Pelear cada combate", `+${CAOS_RANK_POINTS.fight} PC`],
    ["Ganar una pelea", `+${CAOS_RANK_POINTS.win} PC`],
    ["Finalizar por sumisión", `+${CAOS_RANK_POINTS.submission} PC`],
    [
      "Remontar desde abajo",
      `+${CAOS_RANK_POINTS.upsetPerTier} a +${CAOS_RANK_POINTS.upsetPerTier * 3} PC`,
    ],
    ["3er puesto", `+${CAOS_RANK_POINTS.third} PC`],
    ["Ser finalista", `+${CAOS_RANK_POINTS.finalist} PC`],
    ["Llevarte el torneo", `+${CAOS_RANK_POINTS.champion} PC`],
  ];

  const label = (text) =>
    `<span style="font-family:${SANS};font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${MUTED};">${esc(text)}</span>`;

  /**
   * Botón de arcade: el bloque volt con una barra oscura debajo que le da
   * el relieve de tecla. Nada de box-shadow ni de transform —Outlook no los
   * dibuja—: son dos celdas de tabla con color de fondo, que sí pasan.
   */
  const arcadeButton = (href, text, { primary = true } = {}) => `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td align="center" bgcolor="${primary ? VOLT : PANEL}" style="padding:0;${primary ? "" : `border:2px solid ${VOLT};border-bottom:0;`}">
          <a href="${esc(href)}" style="display:block;padding:${primary ? "20px" : "16px"} 24px;font-family:${SANS};font-size:${primary ? "17" : "14"}px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:${primary ? INK : VOLT};text-decoration:none;">
            ${esc(text)}
          </a>
        </td>
      </tr>
      <tr>
        <td height="7" bgcolor="${primary ? SHADOW : VOLT}" style="height:7px;line-height:7px;font-size:0;">&nbsp;</td>
      </tr>
    </table>`;

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

          <!-- CHIP + TÍTULO -->
          <tr>
            <td style="padding:32px 32px 0 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td bgcolor="${VOLT}" style="padding:6px 12px;font-family:${SANS};font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:${INK};">
                    Torneo ${esc(kind)}
                  </td>
                  <td width="8" style="font-size:0;line-height:0;">&nbsp;</td>
                  <td style="padding:6px 12px;border:2px solid ${VOLT};font-family:${SANS};font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:${VOLT};">
                    ${esc(outfit)}
                  </td>
                </tr>
              </table>
              <h1 style="margin:16px 0 0 0;font-family:${SANS};font-size:32px;line-height:1.05;font-weight:800;letter-spacing:-0.5px;text-transform:uppercase;color:${PAPER};">
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

          <!-- LA MISIÓN: cuándo, dónde, con qué reglas -->
          <tr>
            <td style="padding:8px 32px 0 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${INK};border:2px solid ${LINE};">
                <tr>
                  <td colspan="2" bgcolor="${LINE}" style="padding:8px 18px;font-family:${SANS};font-size:11px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:${VOLT};">
                    ▸ La misión
                  </td>
                </tr>
                ${rows
                  .map(
                    ([name, value], i) => `
                <tr>
                  <td style="padding:14px 18px;${i < rows.length - 1 ? `border-bottom:1px solid ${LINE};` : ""}width:96px;vertical-align:middle;">${label(name)}</td>
                  <td style="padding:14px 18px;${i < rows.length - 1 ? `border-bottom:1px solid ${LINE};` : ""}font-family:${SANS};font-size:17px;font-weight:800;text-transform:uppercase;color:${PAPER};">${esc(value)}</td>
                </tr>`
                  )
                  .join("")}
              </table>
            </td>
          </tr>

          <!-- CÓMO SE PELEA: los tres pasos del modo -->
          <tr>
            <td style="padding:26px 32px 0 32px;">
              ${label("▸ Así se pelea")}
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:14px;">
                ${CAOS_STEPS.map(
                  ({ n, long }) => `
                <tr>
                  <td width="46" style="vertical-align:top;padding:0 0 16px 0;font-family:${SANS};font-size:24px;font-weight:800;color:${VOLT};">${n}</td>
                  <td style="padding:0 0 16px 0;font-family:${SANS};font-size:15px;line-height:1.6;color:${PAPER};">${esc(long)}</td>
                </tr>`
                ).join("")}
              </table>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:4px;background:${CARD};border-left:6px solid ${VOLT};">
                <tr>
                  <td style="padding:14px 18px;font-family:${SANS};font-size:15px;line-height:1.5;color:${PAPER};">
                    El mazo tiene <span style="font-weight:800;color:${VOLT};">${show.combos} combinaciones</span>
                    (${show.terrainCount} terrenos × ${show.duelCount} arranques).
                    Nadie sabe cuál le toca hasta que suena el silbato.
                    Los puntos van al ranking CAOS, no al cinturón.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CARTAS DE MUESTRA: un terreno y un duelo de ESTE evento -->
          <tr>
            <td style="padding:22px 32px 0 32px;">
              ${label("▸ Así se ve una pelea")}
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:14px;background:${CARD};border-left:6px solid ${VOLT};">
                <tr>
                  <td style="padding:16px 18px;">
                    <div style="font-family:${SANS};font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:${VOLT};">Terreno</div>
                    <div style="margin-top:6px;font-family:${SANS};font-size:20px;font-weight:800;text-transform:uppercase;color:${PAPER};">${esc(show.terrain.name)}</div>
                    <p style="margin:8px 0 0 0;font-family:${SANS};font-size:14px;line-height:1.5;color:${PAPER};">${esc(show.terrain.rule)}</p>
                  </td>
                </tr>
              </table>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:10px;background:${CARD};border-left:6px solid ${ACCENT};">
                <tr>
                  <td style="padding:16px 18px;">
                    <div style="font-family:${SANS};font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:${ACCENT};">
                      Un arranque · ${esc(TIER_LABELS[show.duel.tier])}
                    </div>
                    <div style="margin-top:6px;font-family:${SANS};font-size:20px;font-weight:800;text-transform:uppercase;color:${PAPER};">${esc(show.duel.name)}</div>
                    <p style="margin:6px 0 0 0;font-family:${SANS};font-size:13px;font-style:italic;color:${MUTED};">${esc(show.duel.start)}</p>
                    <p style="margin:12px 0 0 0;font-family:${SANS};font-size:14px;line-height:1.5;color:${PAPER};">
                      <span style="font-weight:800;color:${VOLT};">${esc(CARD_TONE_LABELS.alfa)}:</span> ${esc(show.duel.alfa.rule)}
                    </p>
                    <p style="margin:8px 0 0 0;font-family:${SANS};font-size:14px;line-height:1.5;color:${PAPER};">
                      <span style="font-weight:800;color:${ACCENT};">${esc(CARD_TONE_LABELS.omega)}:</span> ${esc(show.duel.omega.rule)}
                    </p>
                  </td>
                </tr>
              </table>
              <p style="margin:10px 0 0 0;font-family:${SANS};font-size:12px;line-height:1.5;color:${MUTED};">
                Estas dos son de muestra. El día del evento cada pelea saca las suyas.
              </p>
            </td>
          </tr>

          <!-- MEDIDOR DE LOCURA: cuánto sale cada nivel -->
          <tr>
            <td style="padding:22px 32px 0 32px;">
              ${label("▸ Qué tan raro se pone")}
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:12px;">
                <tr>
                  ${show.tiers
                    .map(
                      ({ tier, label: name, odds }) => `
                  <td width="25%" align="center" bgcolor="${tier === 3 ? ACCENT : CARD}" style="padding:12px 4px;border:1px solid ${tier === 3 ? ACCENT : LINE};">
                    <div style="font-family:${SANS};font-size:10px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:${tier === 3 ? "#ffffff" : MUTED};">${esc(name)}</div>
                    <div style="margin-top:4px;font-family:${SANS};font-size:18px;font-weight:800;color:${tier === 3 ? "#ffffff" : VOLT};">${esc(odds)}</div>
                  </td>`
                    )
                    .join("")}
                </tr>
              </table>
              <p style="margin:10px 0 0 0;font-family:${SANS};font-size:12px;line-height:1.5;color:${MUTED};">
                Una de cada siete peleas sale en nivel brutal. Esa es la que termina en el video.
              </p>
            </td>
          </tr>

          <!-- EL BOTÍN: la tabla de puntos, como el loot de una partida -->
          <tr>
            <td style="padding:20px 32px 0 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${INK};border:2px solid ${VOLT};">
                <tr>
                  <td colspan="2" bgcolor="${VOLT}" style="padding:8px 18px;font-family:${SANS};font-size:11px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:${INK};">
                    ▸ Botín · puntos CAOS
                  </td>
                </tr>
                ${loot
                  .map(
                    ([what, points], i) => `
                <tr>
                  <td style="padding:11px 18px;${i < loot.length - 1 ? `border-bottom:1px solid ${LINE};` : ""}font-family:${SANS};font-size:14px;color:${PAPER};">${esc(what)}</td>
                  <td align="right" style="padding:11px 18px;${i < loot.length - 1 ? `border-bottom:1px solid ${LINE};` : ""}font-family:${SANS};font-size:16px;font-weight:800;white-space:nowrap;color:${VOLT};">${esc(points)}</td>
                </tr>`
                  )
                  .join("")}
              </table>
              <p style="margin:10px 0 0 0;font-family:${SANS};font-size:12px;line-height:1.5;color:${MUTED};">
                Los PC son del ranking CAOS: miden récord de peleas, no cinturón.
                Se pueden ganar desde el primer torneo.
              </p>
            </td>
          </tr>

          <!-- BOTONES -->
          <tr>
            <td style="padding:26px 32px 8px 32px;">
              ${arcadeButton(cta, `▶ ${ctaLabel}`)}
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td height="12" style="height:12px;line-height:12px;font-size:0;">&nbsp;</td></tr>
              </table>
              ${arcadeButton(link, "Ver la convocatoria", { primary: false })}
              <p style="margin:16px 0 0 0;font-family:${SANS};font-size:12px;line-height:1.5;color:${MUTED};text-align:center;">
                La invitación vive aquí:
                <a href="${esc(link)}" style="color:${VOLT};text-decoration:none;">${esc(link.replace(/^https?:\/\//, ""))}</a>
              </p>
            </td>
          </tr>

          <!-- PIE + FIRMA -->
          <tr>
            <td style="padding:28px 32px 32px 32px;border-top:1px solid ${LINE};">
              <p style="margin:0 0 20px 0;font-family:${SANS};font-size:12px;line-height:1.6;color:${MUTED};">
                Te llega porque estás en ${esc(config.appName)}, el marcador del gym.
                ¿Dudas del evento? Responde este correo.
              </p>
              <img src="${esc(signature)}" width="150" height="28" alt="Alessandrovaru" style="display:block;width:150px;height:auto;border:0;opacity:0.85;" />
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
  const show = caosShowcase(invite.slug, invite.outfit);

  const lines = [
    `${greetingName ? `${greetingName},` : "Ey,"}`,
    "",
    `CAOS · ${invite.title}`.toUpperCase(),
    invite.tagline ?? null,
    "",
    date ? `Cuándo: ${date.weekday} ${date.day} de ${date.monthLong} · ${date.time}` : null,
    invite.location ? `Dónde: ${invite.location}` : null,
    `Reglas: ${outfit} · Torneo ${kind}`,
    "",
    ...paragraphs(invite.description),
    "",
    "Así se pelea:",
    ...CAOS_STEPS.map(({ n, long }) => `${n}. ${long}`),
    "",
    `El mazo ${outfit} tiene ${show.combos} combinaciones (${show.terrainCount} terrenos × ${show.duelCount} arranques). Nadie sabe cuál le toca hasta que suena el silbato. Los puntos van al ranking CAOS, no al cinturón.`,
    "",
    `Ejemplo de terreno: ${show.terrain.name} — ${show.terrain.rule}`,
    `Ejemplo de arranque (${TIER_LABELS[show.duel.tier]}): ${show.duel.name}. ${CARD_TONE_LABELS.alfa}: ${show.duel.alfa.rule} ${CARD_TONE_LABELS.omega}: ${show.duel.omega.rule}`,
    "",
    "Botín (puntos CAOS):",
    `- Pelear cada combate: +${CAOS_RANK_POINTS.fight} PC`,
    `- Ganar una pelea: +${CAOS_RANK_POINTS.win} PC`,
    `- Finalizar por sumisión: +${CAOS_RANK_POINTS.submission} PC`,
    `- Remontar desde abajo: +${CAOS_RANK_POINTS.upsetPerTier} a +${CAOS_RANK_POINTS.upsetPerTier * 3} PC`,
    `- 3er puesto: +${CAOS_RANK_POINTS.third} PC`,
    `- Ser finalista: +${CAOS_RANK_POINTS.finalist} PC`,
    `- Llevarte el torneo: +${CAOS_RANK_POINTS.champion} PC`,
    "",
    "",
    safeUrl(invite.cta_url) ? `Confirmar: ${safeUrl(invite.cta_url)}` : null,
    `La convocatoria: ${link}`,
    "",
    `Te llega porque estás en ${config.appName}.`,
  ];

  return lines
    .filter((line) => line !== null)
    // Dos vacías seguidas quedan cuando un bloque opcional no salió.
    .filter((line, i, all) => line !== "" || all[i - 1] !== "")
    .join("\n");
}

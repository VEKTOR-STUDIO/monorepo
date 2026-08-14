// ============================================================================
// STORY DE LINEUP — 4 peleadores en una pieza 9:16 para stories.
//
// No es el flyer de la convocatoria: ese invita. Este enseña QUIÉN pelea.
// Los nombres los escribe el profesor a mano (el bracket todavía no existe
// o no es eso lo que se quiere mostrar). El evento (título, fecha, sede,
// ruleset) sale de la invitación.
//
// Mismas reglas de satori que flyer.js: flex en cada div con hijos, hex,
// fuentes por archivo. Los assets se reutilizan de loadFlyerAssets.
// ============================================================================

import { ImageResponse } from "next/og";
import { OUTFITS, EVENT_TYPES } from "@/libs/caos";
import { INVITE_FORMATS, inviteDateParts } from "@/libs/invites";
import { loadFlyerAssets } from "../imagen/flyer";

const INK = "#0f0f12";
const VOLT = "#d4ff00";
const PAPER = "#f5f5f0";
const MUTED = "#8a8a85";
const ACCENT = "#ff5223";
const CARD = "#16171a";

function clamp(text, max) {
  const clean = (text ?? "").replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > max * 0.6 ? lastSpace : max).trim()}…`;
}

function nameSize(name) {
  const length = name.length;
  if (length > 26) return 42;
  if (length > 20) return 50;
  if (length > 14) return 58;
  return 64;
}

function Tag({ children, size, filled = true, color = VOLT, ink = INK }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        transform: "skewX(-12deg)",
        background: filled ? color : "transparent",
        border: filled ? "none" : `4px solid ${color}`,
        padding: `${size * 0.42}px ${size * 0.85}px`,
      }}
    >
      <div
        style={{
          display: "flex",
          transform: "skewX(12deg)",
          fontFamily: "Barlow",
          fontWeight: 700,
          fontSize: size,
          letterSpacing: size * 0.14,
          textTransform: "uppercase",
          color: filled ? ink : color,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export async function renderLineupPng(invite, fighters) {
  const { fonts, logo, signature } = await loadFlyerAssets();
  const spec = INVITE_FORMATS.story;
  const image = new ImageResponse(
    <LineupCard
      invite={invite}
      fighters={fighters}
      logo={logo}
      signature={signature}
    />,
    { width: spec.width, height: spec.height, fonts }
  );
  return Buffer.from(await image.arrayBuffer());
}

function LineupCard({ invite, fighters, logo, signature }) {
  const spec = INVITE_FORMATS.story;
  const date = inviteDateParts(invite.starts_at);
  const title = clamp(invite.title, 40).toUpperCase();
  const outfit = OUTFITS[invite.outfit]?.short ?? "No-Gi";
  const kind = EVENT_TYPES[invite.event_type]?.label ?? "Circuito";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: INK,
        backgroundImage:
          "radial-gradient(110% 50% at 88% 8%, rgba(212,255,0,0.18) 0%, rgba(15,15,18,0) 58%), radial-gradient(80% 40% at 6% 92%, rgba(255,82,35,0.16) 0%, rgba(15,15,18,0) 55%)",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          display: "flex",
          top: spec.height * 0.42,
          left: -spec.width * 0.18,
          width: spec.width * 1.4,
          height: 280,
          background: "rgba(212,255,0,0.05)",
          transform: "rotate(-12deg)",
        }}
      />

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logo}
        alt=""
        width={Math.round(spec.width * 0.95)}
        height={Math.round(spec.width * 0.95 * (1027 / 1271))}
        style={{
          position: "absolute",
          top: spec.height * 0.38,
          left: -spec.width * 0.18,
          opacity: 0.06,
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          padding: "190px 78px 250px 78px",
          justifyContent: "space-between",
        }}
      >
        {/* ---------------------------- CABECERA ------------------------- */}
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Tag size={24}>El lineup</Tag>
            <Tag size={24} filled={false}>
              {outfit}
            </Tag>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 24,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo}
              alt=""
              width={220}
              height={Math.round(220 * (1027 / 1271))}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 6,
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontFamily: "Barlow",
                  fontWeight: 700,
                  fontSize: 22,
                  letterSpacing: 4,
                  textTransform: "uppercase",
                  color: MUTED,
                }}
              >
                Torneo {kind}
              </div>
              <div
                style={{
                  display: "flex",
                  fontFamily: "Anton",
                  fontSize: 36,
                  lineHeight: 0.9,
                  color: PAPER,
                }}
              >
                {title}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: VOLT,
              padding: "18px 24px",
              gap: 22,
            }}
          >
            <div
              style={{
                display: "flex",
                fontFamily: "Anton",
                fontSize: 64,
                lineHeight: 0.82,
                color: INK,
              }}
            >
              {date?.day ?? "—"}
            </div>
            <div style={{ display: "flex", width: 4, height: 70, background: INK }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 2, flexGrow: 1 }}>
              <div
                style={{
                  display: "flex",
                  fontFamily: "Anton",
                  fontSize: 32,
                  textTransform: "uppercase",
                  color: INK,
                }}
              >
                {date?.weekdayShort ?? ""} {date?.month ?? ""} · {date?.time ?? ""}
              </div>
              {invite.location && (
                <div
                  style={{
                    display: "flex",
                    fontFamily: "Barlow",
                    fontWeight: 700,
                    fontSize: 22,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    color: "rgba(15,15,18,0.7)",
                  }}
                >
                  {clamp(invite.location, 42)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ------------------------- LOS 4 PELEADORES -------------------- */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {fighters.map((fighter, index) => {
            const stripe = index % 2 === 0 ? VOLT : ACCENT;
            const number = String(fighter.slot).padStart(2, "0");
            const name = clamp(fighter.name, 28).toUpperCase();

            return (
              <div
                key={number}
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: CARD,
                  borderLeft: `10px solid ${stripe}`,
                  padding: "18px 22px",
                  gap: 22,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    fontFamily: "Anton",
                    fontSize: 56,
                    lineHeight: 0.85,
                    color: stripe,
                    width: 86,
                  }}
                >
                  {number}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    flexGrow: 1,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      fontFamily: "Anton",
                      fontSize: nameSize(name),
                      lineHeight: 0.92,
                      color: PAPER,
                    }}
                  >
                    {name}
                  </div>
                  {(fighter.rank || fighter.academy) && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      {fighter.rank ? (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            background: fighter.rank.color,
                            padding: "4px 10px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              fontFamily: "Barlow",
                              fontWeight: 700,
                              fontSize: 18,
                              letterSpacing: 2,
                              textTransform: "uppercase",
                              color: fighter.rank.ink,
                            }}
                          >
                            {fighter.rank.short}
                          </div>
                        </div>
                      ) : null}
                      {fighter.academy ? (
                        <div
                          style={{
                            display: "flex",
                            fontFamily: "Barlow",
                            fontWeight: 700,
                            fontSize: 22,
                            letterSpacing: 3,
                            textTransform: "uppercase",
                            color: stripe,
                          }}
                        >
                          {clamp(fighter.academy, 28)}
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ------------------------------ PIE ---------------------------- */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 20,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div
              style={{
                display: "flex",
                fontFamily: "Barlow",
                fontWeight: 700,
                fontSize: 20,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: MUTED,
              }}
            >
              Ranking CAOS · 4 en el tatami
            </div>
            <div
              style={{
                display: "flex",
                fontFamily: "Anton",
                fontSize: 34,
                textTransform: "uppercase",
                color: VOLT,
              }}
            >
              Fuiste invitado
            </div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={signature}
            alt=""
            width={240}
            height={Math.round(240 * (71 / 379))}
            style={{ opacity: 0.9, marginBottom: 2 }}
          />
        </div>
      </div>
    </div>
  );
}

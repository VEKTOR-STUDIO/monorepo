// ============================================================================
// EL DISEÑO DEL FLYER — el póster de una invitación CAOS, dibujado con
// satori (next/og) para que salga PNG.
//
// Vive aparte de la ruta a propósito: aquí solo está la composición, y en
// route.js solo está el HTTP (quién puede verlo, caché, descarga). Así el
// diseño se puede mirar suelto sin montar una petición.
//
// Reglas de satori que hay que respetar o no dibuja:
//   · todo div con hijos lleva `display: flex` escrito a mano
//   · nada de clip-path ni de variables CSS: los colores van en hex
//   · las fuentes se pasan como archivo (public/fonts), no como next/font
// ============================================================================

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { OUTFITS, EVENT_TYPES } from "@/libs/caos";
import { CAOS_PITCH, INVITE_FORMATS, inviteDateParts, siteUrl } from "@/libs/invites";

// Paleta del tema "rollprep" en hex: satori no resuelve oklch ni variables.
const INK = "#0f0f12";
const VOLT = "#d4ff00";
const PAPER = "#f5f5f0";
const MUTED = "#8a8a85";

// Las fuentes y el logo se leen del disco una sola vez por instancia.
let assetsPromise;

export function loadFlyerAssets() {
  if (!assetsPromise) {
    const asset = (path) => readFile(join(process.cwd(), path));

    assetsPromise = Promise.all([
      asset("public/fonts/Anton-Regular.ttf"),
      asset("public/fonts/Barlow-Regular.ttf"),
      asset("public/fonts/Barlow-Bold.ttf"),
      asset("public/images/caosPrimary.png"),
    ]).then(([anton, barlow, barlowBold, logo]) => ({
      fonts: [
        { name: "Anton", data: anton, weight: 400, style: "normal" },
        { name: "Barlow", data: barlow, weight: 400, style: "normal" },
        { name: "Barlow", data: barlowBold, weight: 700, style: "normal" },
      ],
      logo: `data:image/png;base64,${logo.toString("base64")}`,
    }));
  }

  return assetsPromise;
}

/** Corta sin partir palabras: en un póster una línea a medias se nota. */
function clamp(text, max) {
  const clean = (text ?? "").replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;

  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > max * 0.6 ? lastSpace : max).trim()}…`;
}

/** El título manda en la composición: mientras más largo, más chico. */
function titleSize(title, base) {
  const length = title.length;
  if (length > 34) return base * 0.58;
  if (length > 26) return base * 0.7;
  if (length > 18) return base * 0.84;
  return base;
}

// ----------------------------------------------------------------------------
// PIEZAS
// ----------------------------------------------------------------------------

function Tag({ children, size, filled = true }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        transform: "skewX(-12deg)",
        background: filled ? VOLT : "transparent",
        border: filled ? "none" : `${Math.round(size * 0.14)}px solid ${VOLT}`,
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
          color: filled ? INK : VOLT,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default function Flyer({ invite, format, logo }) {
  const spec = INVITE_FORMATS[format];
  const story = format === "story";
  const date = inviteDateParts(invite.starts_at);

  // Un solo mando de escala: el post es el story apretado.
  const u = story ? 1 : 0.78;
  const pad = story ? 86 : 72;
  const title = clamp(invite.title, 46).toUpperCase();
  const outfit = OUTFITS[invite.outfit]?.short ?? "No-Gi";
  const kind = EVENT_TYPES[invite.event_type]?.label ?? "Circuito";
  const pitch = story ? CAOS_PITCH : CAOS_PITCH.slice(0, 2);
  const url = siteUrl().replace(/^https?:\/\//, "");

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: INK,
        // Luz volt en la esquina, como el .glow de la app.
        backgroundImage: `radial-gradient(120% 60% at 78% 4%, rgba(212,255,0,0.16) 0%, rgba(15,15,18,0) 62%), radial-gradient(90% 50% at 8% 96%, rgba(212,255,0,0.10) 0%, rgba(15,15,18,0) 60%)`,
        position: "relative",
      }}
    >
      {/* Barra diagonal de fondo: la misma pegada del tag-skew, en grande. */}
      <div
        style={{
          position: "absolute",
          display: "flex",
          top: spec.height * (story ? 0.3 : 0.28),
          left: -spec.width * 0.2,
          width: spec.width * 1.4,
          height: story ? 320 : 260,
          background: "rgba(212,255,0,0.06)",
          transform: "rotate(-12deg)",
        }}
      />

      {/* El logo, gigante y cortado por el borde: marca de agua de la casa.
          Dentro de satori no existe next/image: se dibuja el <img> tal cual. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logo}
        alt=""
        width={Math.round(spec.width * (story ? 1.05 : 0.95))}
        height={Math.round(spec.width * (story ? 1.05 : 0.95) * (1027 / 1271))}
        style={{
          position: "absolute",
          top: spec.height * (story ? 0.36 : 0.34),
          left: -spec.width * (story ? 0.22 : 0.2),
          opacity: 0.07,
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          // En la story, arriba y abajo hay zona muerta: la cabecera del perfil
          // se come los primeros ~190px y la barra de responder los últimos
          // ~250px. Nada que haya que leer entra ahí.
          padding: `${story ? 190 : 92}px ${pad}px ${story ? 250 : 92}px ${pad}px`,
          justifyContent: "space-between",
        }}
      >
        {/* ---------------------------- CABECERA ------------------------- */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 34 * u,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Tag size={26 * u}>Torneo {kind}</Tag>
            <Tag size={26 * u} filled={false}>
              {outfit}
            </Tag>
          </div>

          {/* Solo la marca: el logo YA dice CAOS. Ponerle la palabra al lado
              era decirlo dos veces en la misma línea. */}
          <div style={{ display: "flex" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo}
              alt=""
              width={Math.round(420 * u)}
              height={Math.round(420 * u * (1027 / 1271))}
            />
          </div>

          <div style={{ display: "flex", height: 10 * u, background: VOLT }} />
        </div>

        {/* ------------------------------ TÍTULO -------------------------- */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: 24 * u }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: "Anton",
              fontSize: titleSize(title, 116 * u),
              lineHeight: 0.9,
              letterSpacing: -1,
              color: PAPER,
            }}
          >
            {title}
          </div>

          {invite.tagline && (
            <div
              style={{
                display: "flex",
                fontFamily: "Barlow",
                fontWeight: 700,
                fontSize: 36 * u,
                lineHeight: 1.25,
                color: VOLT,
              }}
            >
              {clamp(invite.tagline, 90)}
            </div>
          )}
        </div>

        {/* ------------------------------ FECHA --------------------------- */}
        <div style={{ display: "flex", background: VOLT, padding: `${28 * u}px ${34 * u}px` }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 30 * u,
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontFamily: "Anton",
                  fontSize: 118 * u,
                  lineHeight: 0.82,
                  color: INK,
                }}
              >
                {date?.day ?? "—"}
              </div>
              <div
                style={{
                  display: "flex",
                  fontFamily: "Barlow",
                  fontWeight: 700,
                  fontSize: 30 * u,
                  letterSpacing: 6 * u,
                  textTransform: "uppercase",
                  color: INK,
                }}
              >
                {date?.month ?? ""}
              </div>
            </div>

            <div style={{ display: "flex", width: 5 * u, height: 130 * u, background: INK }} />

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8 * u,
                flexGrow: 1,
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontFamily: "Anton",
                  fontSize: 46 * u,
                  textTransform: "uppercase",
                  color: INK,
                }}
              >
                {date?.weekday ?? ""} {date?.time ?? ""}
              </div>
              {invite.location && (
                <div
                  style={{
                    display: "flex",
                    fontFamily: "Barlow",
                    fontWeight: 700,
                    fontSize: 30 * u,
                    textTransform: "uppercase",
                    letterSpacing: 2,
                    color: "rgba(15,15,18,0.72)",
                  }}
                >
                  {clamp(invite.location, 46)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --------------------------- QUÉ ES CAOS ------------------------ */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 * u }}>
          {pitch.map((line) => (
            <div key={line} style={{ display: "flex", alignItems: "flex-start", gap: 18 * u }}>
              <div
                style={{
                  display: "flex",
                  width: 14 * u,
                  height: 14 * u,
                  marginTop: 12 * u,
                  background: VOLT,
                  transform: "rotate(45deg)",
                }}
              />
              <div
                style={{
                  display: "flex",
                  fontFamily: "Barlow",
                  fontSize: 30 * u,
                  lineHeight: 1.3,
                  color: PAPER,
                  flexGrow: 1,
                }}
              >
                {line}
              </div>
            </div>
          ))}
        </div>

        {/* ---------------------------- PIE / CTA -------------------------
            Cupos y entrada NO van aquí: esto es una invitación, la pieza que
            la gente enseña. La letra chica vive en la página del evento y en
            el correo, que es donde se entra a decidir. */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 * u }}>
          <div
            style={{
              display: "flex",
              fontFamily: "Barlow",
              fontWeight: 700,
              fontSize: 24 * u,
              letterSpacing: 5 * u,
              textTransform: "uppercase",
              color: MUTED,
            }}
          >
            Anótate en
          </div>
          {/* El dominio pelado. Sin ruta: en una story nadie teclea un slug,
              y la dirección corta ya dice de quién es el evento — por eso
              tampoco va la firma "RollPrep" al lado, sería repetirse. */}
          <div
            style={{
              display: "flex",
              fontFamily: "Anton",
              fontSize: 44 * u,
              textTransform: "uppercase",
              color: VOLT,
            }}
          >
            {url}
          </div>
        </div>
      </div>
    </div>
  );
}

import { ImageResponse } from "next/og";
import config from "@/config";

// La tarjeta que sale al pegar el enlace en WhatsApp, Instagram o Twitter.
// Es su emblema reducido a lo esencial: el negro, el humo rojo saliendo de
// abajo, las bandas en diagonal, la estrella partida y la frase del emblema.

const ROJO = config.colors.main;
const NEGRO = "#0B0A0A";

export const size = { width: 1200, height: 628 };
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 628,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: NEGRO,
          padding: "0 90px",
          position: "relative",
        }}
      >
        {/* El humo rojo, abajo. Satori no resuelve los degradados radiales
            igual que un navegador, así que aquí va como una banda lineal. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(to top, ${ROJO}66 0%, ${ROJO}1f 28%, transparent 58%)`,
          }}
        />

        {/* Las bandas de la casa. */}
        <div
          style={{
            position: "absolute",
            top: -90,
            left: 620,
            width: 1000,
            height: 90,
            background: ROJO,
            transform: "rotate(-11deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 510,
            left: 460,
            width: 1000,
            height: 30,
            background: "#FFFFFF",
            opacity: 0.16,
            transform: "rotate(-11deg)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center" }}>
          <svg width="64" height="64" viewBox="0 0 100 100">
            <path d="M48.5 5 L38.5 37.2 L4.3 38.2 L31.5 59 L21.8 91.8 L48.5 73.5 Z" fill="#FFFFFF" />
            <path d="M51.5 5 L61.5 37.2 L95.7 38.2 L68.5 59 L78.2 91.8 L51.5 73.5 Z" fill={ROJO} />
          </svg>
          <div
            style={{
              display: "flex",
              marginLeft: 22,
              fontSize: 46,
              fontWeight: 800,
              fontStyle: "italic",
              color: "#FFFFFF",
            }}
          >
            LONE <span style={{ color: ROJO, marginLeft: 14 }}>STAR</span>
          </div>
          <div
            style={{
              display: "flex",
              marginLeft: 22,
              fontSize: 20,
              color: "rgba(255,255,255,0.6)",
              letterSpacing: 8,
            }}
          >
            ALL IN AUTOS
          </div>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 34,
            fontSize: 84,
            fontWeight: 800,
            fontStyle: "italic",
            color: "#FFFFFF",
            lineHeight: 1.02,
            textTransform: "uppercase",
            maxWidth: 950,
          }}
        >
          {config.business.tagline}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 30,
            fontSize: 30,
            color: "rgba(255,255,255,0.7)",
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          {config.business.lema}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 22,
            fontSize: 28,
            fontWeight: 700,
            color: ROJO,
            letterSpacing: 2,
          }}
        >
          USA → VENEZUELA · PANAMÁ · COLOMBIA
        </div>
      </div>
    ),
    { ...size }
  );
}

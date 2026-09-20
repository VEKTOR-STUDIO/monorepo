import { ImageResponse } from "next/og";
import config from "@/config";

// La tarjeta que sale al pegar el enlace en WhatsApp, Instagram o Twitter.
// Es una página de su catálogo reducida a lo esencial: el negro, el corte
// rojo en diagonal y la frase con la que se presentan.

const ROJO = config.colors.main;
const NEGRO = "#0D0D0D";

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
        {/* Las diagonales de la casa. Van en `transform` y no en un degradado
            porque Satori —el motor que dibuja esto— no resuelve los gradientes
            angulares igual que un navegador. */}
        <div
          style={{
            position: "absolute",
            top: -120,
            left: 620,
            width: 1000,
            height: 150,
            background: ROJO,
            transform: "rotate(-18deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 470,
            left: 500,
            width: 1000,
            height: 60,
            background: ROJO,
            opacity: 0.35,
            transform: "rotate(-18deg)",
          }}
        />

        <div style={{ display: "flex", fontSize: 26, color: "rgba(255,255,255,0.5)", letterSpacing: 8 }}>
          {config.business.ciudad.toUpperCase()} · VENEZUELA
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 26,
            fontSize: 86,
            fontWeight: 800,
            fontStyle: "italic",
            color: "#FFFFFF",
            lineHeight: 1.02,
            textTransform: "uppercase",
            maxWidth: 900,
          }}
        >
          Importamos y vendemos el auto de tus sueños
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 34,
            fontSize: 34,
            fontWeight: 700,
            color: ROJO,
            letterSpacing: 2,
          }}
        >
          {config.business.razonSocial}
        </div>
      </div>
    ),
    { ...size }
  );
}

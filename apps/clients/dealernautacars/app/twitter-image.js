import { ImageResponse } from "next/og";
import config from "@/config";

// La tarjeta que sale al pegar el enlace en WhatsApp, Instagram o Twitter.
// Es una publicación suya reducida a lo esencial: el negro, el cielo naranja
// barriendo en diagonal, la frase con la que se presentan y las dos sedes.

const NARANJA = config.colors.main;
const NARANJA_CLARO = "#FFA53F";
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
        {/* El cielo, abajo. Satori no resuelve los degradados radiales igual
            que un navegador, así que aquí va como una banda lineal. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(to top, ${NARANJA}55 0%, ${NARANJA}18 26%, transparent 55%)`,
          }}
        />

        {/* Las alas de la casa. Van en `transform` y no en un degradado angular
            por la misma razón. */}
        <div
          style={{
            position: "absolute",
            top: -110,
            left: 580,
            width: 1000,
            height: 130,
            background: `linear-gradient(to right, ${NARANJA}, ${NARANJA_CLARO})`,
            transform: "rotate(-11deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 500,
            left: 460,
            width: 1000,
            height: 46,
            background: "#C8CBD0",
            opacity: 0.22,
            transform: "rotate(-11deg)",
          }}
        />

        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: "rgba(255,255,255,0.5)",
            letterSpacing: 7,
          }}
        >
          CARACAS · SAN ANTONIO DE LOS ALTOS
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 26,
            fontSize: 84,
            fontWeight: 800,
            fontStyle: "italic",
            color: "#FFFFFF",
            lineHeight: 1.02,
            textTransform: "uppercase",
            maxWidth: 900,
          }}
        >
          {config.business.tagline}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 30,
            fontSize: 30,
            color: "rgba(255,255,255,0.65)",
          }}
        >
          {config.business.lema}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 26,
            fontSize: 34,
            fontWeight: 700,
            color: NARANJA,
            letterSpacing: 2,
          }}
        >
          {config.business.nombre}
        </div>
      </div>
    ),
    { ...size }
  );
}

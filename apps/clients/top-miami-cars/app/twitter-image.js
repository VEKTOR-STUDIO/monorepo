import { ImageResponse } from "next/og";
import config from "@/config";

// La tarjeta que sale al pegar el enlace en WhatsApp o en redes. Es su
// logotipo reducido a lo esencial: el blanco, una banda de acero arriba, el
// azul de la casa en el titular y la dirección del salón.
//
// No lleva la imagen del logotipo a propósito: Satori —el motor que pinta esto—
// no lee WebP, y meter un PNG duplicado solo para esta tarjeta es un archivo
// más que se queda viejo el día que cambien el logo.

const AZUL = config.colors.main;
const TINTA = "#0B1034";
const ACERO =
  "linear-gradient(100deg, #454d4f 0%, #8d9395 9%, #f3f4f4 19%, #ffffff 23%, #a9aeb0 33%, #4b5355 46%, #6f7678 54%, #d5d8d9 66%, #ffffff 72%, #b9bdbf 81%, #5a6264 92%, #454d4f 100%)";

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
          background: "linear-gradient(to bottom, #ffffff 0%, #ffffff 58%, #e6e9ee 100%)",
          padding: "0 90px",
          position: "relative",
        }}
      >
        {/* El borde de arriba del escudo: acero cepillado. */}
        <div
          style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 26, background: ACERO }}
        />
        {/* Y el filo azul de abajo. */}
        <div
          style={{ position: "absolute", bottom: 0, left: 0, width: 1200, height: 14, background: AZUL }}
        />

        <div style={{ display: "flex", fontSize: 24, color: "rgba(11,16,52,0.55)", letterSpacing: 7 }}>
          {`${config.business.categoria} · ${config.business.ciudad}`.toUpperCase()}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 22,
            fontSize: 104,
            fontWeight: 900,
            color: AZUL,
            lineHeight: 1,
            textTransform: "uppercase",
            letterSpacing: -1,
          }}
        >
          {config.business.nombre}
        </div>

        {/* El filete de acero bajo el nombre. */}
        <div style={{ display: "flex", marginTop: 26, width: 220, height: 14, background: ACERO }} />

        <div
          style={{
            display: "flex",
            marginTop: 30,
            fontSize: 44,
            fontWeight: 700,
            color: TINTA,
            textTransform: "uppercase",
          }}
        >
          {config.business.tagline}
        </div>

        <div style={{ display: "flex", marginTop: 18, fontSize: 28, color: "rgba(11,16,52,0.6)" }}>
          {config.business.direccion}
        </div>
      </div>
    ),
    { ...size }
  );
}

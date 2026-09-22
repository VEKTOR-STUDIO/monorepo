import { ImageResponse } from "next/og";
import config from "@/config";

// La tarjeta que sale al pegar el enlace en WhatsApp, Instagram o Twitter.
//
// Es su logotipo reducido a lo esencial: el recuadro AZUL REY con "CORONADO
// CARSS" en amarillo neón, y a su lado el lema y la ciudad sobre la noche azul
// de la página. El amarillo solo va dentro del recuadro, que es la misma
// disciplina que tiene el resto de la página.
//
// Satori no carga Exo 2 ni sabe hacer cursiva sin la fuente, así que la
// inclinación del nombre se hace con un `skewX` sobre el bloque.

const AZUL = config.colors.main;
const NOCHE = "#0A1330";
const NOCHE_CLARA = "#11205A";
const LIMA = "#E3F52A";
const BLANCO = "#FFFFFF";

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
          alignItems: "center",
          justifyContent: "space-between",
          background: NOCHE,
          padding: "0 80px",
          position: "relative",
        }}
      >
        {/* La luz azul. Satori no resuelve los degradados radiales igual que un
            navegador, así que aquí va como un degradado lineal. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(200deg, ${NOCHE_CLARA} 0%, ${NOCHE} 62%)`,
          }}
        />

        {/* El filete amarillo, en la pendiente de la casa. */}
        <div
          style={{
            position: "absolute",
            top: 548,
            left: -60,
            width: 1400,
            height: 4,
            background: LIMA,
            opacity: 0.8,
            transform: "skewX(-12deg)",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 560 }}>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              color: "rgba(255,255,255,0.55)",
              letterSpacing: 6,
            }}
          >
            {config.business.ciudad.toUpperCase()} · {config.business.estado.toUpperCase()}
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 24,
              fontSize: 70,
              fontWeight: 700,
              color: BLANCO,
              lineHeight: 1.02,
              textTransform: "uppercase",
            }}
          >
            {config.business.tagline}
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 28,
              color: "rgba(255,255,255,0.7)",
            }}
          >
            {config.business.lema}
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 18,
              fontSize: 24,
              color: "rgba(255,255,255,0.45)",
            }}
          >
            {config.business.centroLargo} · @{config.business.instagram}
          </div>
        </div>

        {/* El recuadro del logotipo. */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            background: AZUL,
            padding: "26px 40px 34px",
            boxShadow: "0 30px 60px rgba(0,0,0,0.45)",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 17,
              color: BLANCO,
              marginBottom: 8,
            }}
          >
            Compra - Venta y Consignación de Vehículos
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 92,
              fontWeight: 800,
              color: LIMA,
              lineHeight: 0.92,
              transform: "skewX(-12deg)",
            }}
          >
            <span>CORONADO</span>
            <span>CARSS</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}

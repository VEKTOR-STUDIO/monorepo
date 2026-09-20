import { ImageResponse } from "next/og";
import config from "@/config";

// La tarjeta que se ve al pegar el enlace en un chat o en una red. Se dibuja
// aquí y no se sirve una imagen: así el nombre y el color salen siempre de
// config y no hay un PNG que se quede viejo.
//
// El signo va como polígono y no con una tipografía: ImageResponse solo tiene
// las fuentes que se le pasen, y para un hexágono no hace falta ninguna.

const AMARILLO = config.colors.main;
const AZUL = "#1D3FA8";
const ROJO = "#CE1126";
const GRAFITO = "#14161A";

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
          alignItems: "center",
          justifyContent: "center",
          background: GRAFITO,
          gap: 28,
        }}
      >
        <svg width="260" height="225" viewBox="0 0 120 104">
          <path
            d="M60 3 L95 23 L95 81 L60 101 L25 81 L25 23 Z"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="7"
          />
          <g
            transform="translate(60 52) skewX(-8) translate(-60 -52)"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="8"
          >
            <path d="M35 30 L46 74 L57 30" />
            <path d="M69 74 L69 30 L85 74 L85 30" />
          </g>
        </svg>

        <span
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#FFFFFF",
            fontFamily: "system-ui, sans-serif",
            letterSpacing: "-0.02em",
          }}
        >
          {config.appName}
        </span>

        <span
          style={{
            fontSize: 30,
            color: "rgba(255,255,255,0.7)",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          {config.business.categoria} · Caracas y Barcelona
        </span>

        <div style={{ display: "flex", marginTop: 12 }}>
          <div style={{ width: 120, height: 10, background: AMARILLO }} />
          <div style={{ width: 120, height: 10, background: AZUL }} />
          <div style={{ width: 120, height: 10, background: ROJO }} />
        </div>
      </div>
    ),
    { ...size }
  );
}

import { ImageResponse } from "next/og";
import config from "@/config";

// La tarjeta que sale cuando se comparte el enlace: el rótulo sobre negro y
// las tres barras de la marca. Se dibuja aquí en vez de servir una imagen para
// que no haya un PNG desactualizado el día que cambie el nombre o el color.
//
// Nada de `skew` ni de filtros: Satori —el motor que pinta esto— solo entiende
// un subconjunto de CSS, y las barras rectas se ven igual de bien.

const NEGRO = config.colors.fondo;
const ROJO = config.colors.main;
const VERDE = config.colors.acento;
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
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: NEGRO,
          gap: 28,
        }}
      >
        <div style={{ display: "flex", gap: 14 }}>
          {[VERDE, BLANCO, ROJO].map((color) => (
            <div key={color} style={{ width: 76, height: 22, background: color }} />
          ))}
        </div>

        <span
          style={{
            fontSize: 132,
            fontWeight: 800,
            color: BLANCO,
            fontFamily: "system-ui, sans-serif",
            lineHeight: 1,
            letterSpacing: "-0.04em",
            textTransform: "uppercase",
          }}
        >
          {config.appName}
        </span>

        <span
          style={{
            fontSize: 34,
            color: "rgba(255,255,255,0.7)",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Concesionario · Taller de accesorios · Detailing
        </span>
      </div>
    ),
    { ...size }
  );
}

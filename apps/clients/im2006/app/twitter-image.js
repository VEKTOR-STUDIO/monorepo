import { ImageResponse } from "next/og";
import config from "@/config";

// La tarjeta que sale al pegar el enlace en WhatsApp, Instagram o Twitter.
// Es una de sus publicaciones reducida a lo esencial: el grafito, las tres
// barras inclinadas y la primera línea de su bio.

const AZUL = config.colors.main;
const ROJO = "#FF1F1F";
const PLATA = "#AABAD4";
const GRAFITO = "#12151A";

export const size = { width: 1200, height: 628 };
export const contentType = "image/png";

/**
 * Una barra de la marca.
 *
 * Van en `transform: rotate` y no en un degradado angular porque Satori —el
 * motor que dibuja esto— no resuelve los gradientes angulares como un
 * navegador, y lo que en la web es una sola capa con tres cortes aquí tiene
 * que ser tres cajas.
 */
function Barra({ top, left, alto, color, opacidad = 1 }) {
  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        width: 1400,
        height: alto,
        background: color,
        opacity: opacidad,
        transform: "rotate(-12deg)",
      }}
    />
  );
}

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
          background: GRAFITO,
          padding: "0 90px",
          position: "relative",
        }}
      >
        {/* El trío de la marca, cruzando arriba a la derecha. El orden es el
            del logotipo: plata, rojo y el azul, que se lleva el peso. */}
        <Barra top={-170} left={560} alto={14} color={PLATA} opacidad={0.55} />
        <Barra top={-140} left={560} alto={30} color={ROJO} opacidad={0.9} />
        <Barra top={-90} left={560} alto={130} color={AZUL} />

        {/* Y el mismo trío al pie, como el remate de sus publicaciones. */}
        <Barra top={560} left={-200} alto={8} color={PLATA} opacidad={0.4} />
        <Barra top={580} left={-200} alto={16} color={ROJO} opacidad={0.55} />
        <Barra top={606} left={-200} alto={46} color={AZUL} opacidad={0.75} />

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
            maxWidth: 820,
          }}
        >
          Vehículos y camiones
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 30,
            fontSize: 32,
            fontWeight: 600,
            color: "rgba(255,255,255,0.62)",
            letterSpacing: 2,
          }}
        >
          {config.business.lema}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 34,
            fontSize: 38,
            fontWeight: 800,
            fontStyle: "italic",
            color: AZUL,
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

import { ImageResponse } from "next/og";
import config from "@/config";

// La tarjeta que sale al pegar el enlace en WhatsApp, Instagram o Twitter.
//
// Es el logotipo reducido a lo esencial: el negro, el trazo de oro y la frase
// con la que se presentan. Es también la primera vez que alguien ve esta marca
// —un enlace pegado en un grupo—, así que la frase que va grande es la suya,
// la de sus publicaciones, y no el nombre del negocio: lo que engancha es
// "vende tu vehículo", no "SUSU CARS".

const ORO = config.colors.main;
const ORO_CLARO = "#EBD9A6";
const NEGRO = "#0D0C0A";

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
        {/* Los filetes de la casa. Van como rectángulos girados y no como un
            degradado angular porque Satori —el motor que dibuja esto— no
            resuelve los gradientes igual que un navegador, y lo que en la web
            es una línea que se apaga aquí saldría como una barra sólida. Por
            eso además se les baja la opacidad a mano. */}
        <div
          style={{
            position: "absolute",
            top: 96,
            left: 380,
            width: 1100,
            height: 2,
            background: ORO,
            opacity: 0.55,
            transform: "rotate(-8deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 508,
            left: 300,
            width: 1100,
            height: 2,
            background: ORO,
            opacity: 0.3,
            transform: "rotate(-8deg)",
          }}
        />

        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: "rgba(255,255,255,0.45)",
            letterSpacing: 8,
          }}
        >
          {config.business.ciudad.toUpperCase()} · {config.business.direccion.toUpperCase()}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 26,
            fontSize: 74,
            fontWeight: 700,
            color: "#FFFFFF",
            lineHeight: 1.08,
            textTransform: "uppercase",
            letterSpacing: 1,
            maxWidth: 940,
          }}
        >
          Vende tu vehículo en tiempo récord y con seguridad
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 34,
            fontSize: 34,
            fontWeight: 700,
            color: ORO_CLARO,
            letterSpacing: 6,
            textTransform: "uppercase",
          }}
        >
          {config.business.nombre}
        </div>
      </div>
    ),
    { ...size }
  );
}

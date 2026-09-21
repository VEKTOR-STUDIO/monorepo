import { ImageResponse } from "next/og";
import config from "@/config";

// La tarjeta que sale al pegar el enlace en WhatsApp, Instagram o Twitter.
//
// Es una publicación suya reducida a lo esencial: la losa oscura, la corona
// blanca, la frase de su bio y el C.C.C.T. El rojo aparece una sola vez, en el
// nombre, que es la misma disciplina que tiene el resto de la página.

const ROJO = config.colors.main;
const PIEDRA = "#262626";
const PIEDRA_HONDA = "#161616";
const BLANCO = "#FFFFFF";

// La corona, la misma de components/MarcaCorona.js. Va como SVG en línea y no
// como componente porque esto lo renderiza Satori, que no ejecuta React de la
// aplicación: es la tercera copia del trazado y es la última.
const CORONA =
  "M100 2 L134 56 L197 56 L170 126 L30 126 L3 56 L66 56 Z " +
  "M28 72 L62 72 L76.7 110 L42.7 110 Z " +
  "M172 72 L138 72 L123.3 110 L157.3 110 Z " +
  "M100 14 C103 40 106 48 122 56 C106 64 103 72 100 98 C97 72 94 64 78 56 C94 48 97 40 100 14 Z";

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
          background: PIEDRA_HONDA,
          padding: "0 90px",
          position: "relative",
        }}
      >
        {/* La losa. Satori no resuelve los degradados radiales igual que un
            navegador, así que aquí va como dos bandas lineales cruzadas. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(160deg, ${PIEDRA} 0%, ${PIEDRA_HONDA} 58%)`,
          }}
        />

        {/* Los rombos de la casa. Van en `transform` y no en un degradado
            angular por la misma razón. */}
        <div
          style={{
            position: "absolute",
            top: 96,
            left: -60,
            width: 1400,
            height: 3,
            background: BLANCO,
            opacity: 0.12,
            transform: "skewX(-16deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 520,
            left: -60,
            width: 1400,
            height: 2,
            background: ROJO,
            opacity: 0.45,
            transform: "skewX(-16deg)",
          }}
        />

        {/* La corona al agua, a la derecha, como la marca de agua de sus
            publicaciones. */}
        <svg
          width="420"
          height="269"
          viewBox="0 0 200 128"
          style={{ position: "absolute", top: 60, right: 40, opacity: 0.09 }}
        >
          <path d={CORONA} fill={BLANCO} fillRule="evenodd" />
        </svg>

        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: "rgba(255,255,255,0.5)",
            letterSpacing: 7,
          }}
        >
          {config.business.centro.toUpperCase()} · {config.business.ciudad.toUpperCase()}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 26,
            fontSize: 78,
            fontWeight: 700,
            color: BLANCO,
            lineHeight: 1.04,
            textTransform: "uppercase",
            maxWidth: 780,
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
            color: ROJO,
            letterSpacing: 4,
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

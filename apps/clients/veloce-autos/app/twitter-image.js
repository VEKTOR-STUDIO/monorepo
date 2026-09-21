import { ImageResponse } from "next/og";
import config from "@/config";

// La tarjeta que sale al pegar el enlace en WhatsApp, Instagram o Twitter.
//
// Es la marca y nada más: la V en blanco sobre negro, el nombre debajo y la
// frase con la que se presentan. Sin color, porque esta marca no tiene
// ninguno, y sin foto, porque un logotipo de doce rectas aguanta mejor el
// recorte que hace cada aplicación que una foto de un carro.
//
// El trazado es el mismo de components/MarcaVeloce.js. Se repite aquí en vez
// de importarse porque esto lo dibuja Satori, no un navegador, y conviene que
// el archivo sea autónomo: un fallo aquí rompe el build entero.

const NEGRO = "#0A0A0B";
const BLANCO = "#FFFFFF";

const CUERPO =
  "M143.1 0.1L136.3 10.2L93.7 30.9L81.1 85.2L71.6 100L62 85.2L49.5 30.9L6.8 10.2L0 0.1L58.4 26.4L71.6 87.4L84.7 26.4Z";
const PUAS = [
  "M89.2 71L97.8 33.7L133.3 16.1L126 27.6L106.8 37.9L104.5 48.1Z",
  "M53.9 71L45.3 33.7L9.8 16.1L17.1 27.6L36.3 37.9L38.6 48.1Z",
];

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
        {/* La misma V, enorme y al 4 %, haciendo de fondo. Es lo que hace
            Alas.js en la página: la marca ampliada hasta ser retícula. */}
        <svg
          width="900"
          height="629"
          viewBox="0 0 143.1 100"
          style={{ position: "absolute", top: -40, left: 620, opacity: 0.05 }}
        >
          <path d={CUERPO} fill={BLANCO} />
          {PUAS.map((d) => (
            <path key={d} d={d} fill={BLANCO} />
          ))}
        </svg>

        <svg width="129" height="90" viewBox="0 0 143.1 100">
          <path d={CUERPO} fill={BLANCO} />
          {PUAS.map((d) => (
            <path key={d} d={d} fill={BLANCO} />
          ))}
        </svg>

        <div
          style={{
            display: "flex",
            marginTop: 30,
            fontSize: 74,
            fontWeight: 700,
            color: BLANCO,
            lineHeight: 1.05,
            textTransform: "uppercase",
            letterSpacing: 2,
            maxWidth: 780,
          }}
        >
          Importación directa de vehículos
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 26,
            fontSize: 28,
            color: "rgba(255,255,255,0.55)",
            letterSpacing: 4,
          }}
        >
          {config.business.procedencias.join("  ·  ").toUpperCase()}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 38,
            fontSize: 26,
            fontWeight: 600,
            color: BLANCO,
            letterSpacing: 8,
            textTransform: "uppercase",
          }}
        >
          {config.business.nombre} · {config.business.ciudad}
        </div>
      </div>
    ),
    { ...size }
  );
}

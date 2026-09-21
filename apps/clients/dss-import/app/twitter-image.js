import { ImageResponse } from "next/og";
import config from "@/config";

// La tarjeta que sale al pegar el enlace en WhatsApp, Instagram o Twitter.
// Es una publicación suya reducida a lo esencial: el negro, el cielo dorado
// subiendo desde abajo, las vetas del pan de oro cruzando, la frase con la que
// se presentan y —lo que de verdad importa en este negocio— la cuota.

const ORO = config.colors.main;
const ORO_CLARO = "#F5DE8A";
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
            background: `linear-gradient(to top, ${ORO}55 0%, ${ORO}18 26%, transparent 55%)`,
          }}
        />

        {/* Las vetas del oro. Van en `transform` y no en un degradado angular
            por la misma razón. */}
        <div
          style={{
            position: "absolute",
            top: -110,
            left: 580,
            width: 1000,
            height: 130,
            background: `linear-gradient(to right, ${ORO}, ${ORO_CLARO})`,
            transform: "rotate(-9deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 500,
            left: 460,
            width: 1000,
            height: 46,
            background: ORO_CLARO,
            opacity: 0.22,
            transform: "rotate(-9deg)",
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
          MARACAY · EDO. ARAGUA
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

        {/* La cuota, que es lo único que ellos anuncian con número. En una
            tarjeta que se ve de pasada en un chat, es lo que hace que alguien
            abra el enlace. */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            marginTop: 30,
            fontSize: 44,
            fontWeight: 700,
            color: ORO,
            letterSpacing: 1,
          }}
        >
          Cuotas desde ${config.credito.cuotaDesde}
          <span
            style={{
              fontSize: 26,
              marginLeft: 12,
              color: "rgba(255,255,255,0.55)",
              textTransform: "uppercase",
              letterSpacing: 3,
            }}
          >
            {config.credito.cuotaDesdePeriodo}
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}

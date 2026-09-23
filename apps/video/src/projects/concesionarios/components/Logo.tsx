import React from "react";
import { Img, staticFile } from "remotion";
import { useStage } from "../../../lib/layout";
import { FAMILIAS } from "../fonts";
import { useMarca } from "./Tipos";

/**
 * La V de Veloce: el mismo trazado de `apps/clients/veloce-autos/components/MarcaVeloce.js`
 * (26 puntos sacados de su foto de perfil, simetrizados).
 */
const VeloceV: React.FC<{ width: number; color: string }> = ({ width, color }) => (
  <svg viewBox="0 0 143.1 100" width={width} height={width * 0.7} fill={color}>
    <path d="M143.1 0.1L136.3 10.2L93.7 30.9L81.1 85.2L71.6 100L62 85.2L49.5 30.9L6.8 10.2L0 0.1L58.4 26.4L71.6 87.4L84.7 26.4Z" />
    <path d="M89.2 71L97.8 33.7L133.3 16.1L126 27.6L106.8 37.9L104.5 48.1Z" />
    <path d="M53.9 71L45.3 33.7L9.8 16.1L17.1 27.6L36.3 37.9L38.6 48.1Z" />
  </svg>
);

/**
 * El recuadro de Coronado Carss, como `MarcaCoronado.js` de su web: azul rey,
 * la línea pequeña arriba y CORONADO / CARSS en amarillo neón, Exo 2 negra
 * itálica. `textLength` fija el ancho aunque la fuente tarde.
 */
const CoronadoBox: React.FC<{ width: number }> = ({ width }) => (
  <svg viewBox="0 0 500 190" width={width} height={(width * 190) / 500}>
    <rect width="500" height="190" fill="#0B4DC4" />
    <g style={{ fontFamily: `"${FAMILIAS.exo}", sans-serif` }} fontStyle="italic" fontWeight={800}>
      <text x="250" y="33" textAnchor="middle" fontSize="19" fill="#FCFCFC" textLength="400" style={{ fontFamily: `"${FAMILIAS.questrial}", sans-serif`, fontStyle: "normal" }}>
        Compra - Venta y Consignación de Vehículos
      </text>
      <text x="250" y="104" textAnchor="middle" fontSize="72" fill="#E2F734" textLength="420">
        CORONADO
      </text>
      <text x="250" y="170" textAnchor="middle" fontSize="72" fill="#E2F734" textLength="260">
        CARSS
      </text>
    </g>
  </svg>
);

/**
 * El logo de la marca, a `size` unidades de alto.
 *
 * Los avatares de Instagram se recortan en círculo con un aro del color de la
 * casa: es como el dueño ve su marca todos los días, y así los trece videos
 * tratan igual logos que vienen con fondos muy distintos (mármol, pizarra,
 * dorado…). Veloce y Coronado tienen su marca en vector en la web, y aquí
 * también.
 */
export const Logo: React.FC<{ size?: number; style?: React.CSSProperties; aro?: boolean }> = ({
  size = 22,
  style,
  aro = true,
}) => {
  const { u } = useStage();
  const { logo, colores, nombre } = useMarca();
  const px = size * u;

  if (logo.kind === "veloce") {
    return (
      <div style={{ ...style, display: "flex", justifyContent: "center" }}>
        <VeloceV width={px * 1.2} color={colores.tinta} />
      </div>
    );
  }

  if (logo.kind === "coronado") {
    return (
      <div style={{ ...style, display: "flex", justifyContent: "center" }}>
        <CoronadoBox width={px * 2.1} />
      </div>
    );
  }

  return (
    <div
      style={{
        width: px,
        height: px,
        borderRadius: "50%",
        overflow: "hidden",
        backgroundColor: logo.fondo ?? colores.superficie,
        boxShadow: aro
          ? `0 0 0 ${u * 0.5}px ${colores.primario}, 0 ${u * 2}px ${u * 6}px rgba(0,0,0,0.35)`
          : undefined,
        flexShrink: 0,
        ...style,
      }}
    >
      <Img
        src={staticFile(logo.src)}
        alt={nombre}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
};

/** Versión mínima para la cabecera del teléfono: círculo o la V, sin aro. */
export const LogoMini: React.FC<{ px: number }> = ({ px }) => {
  const { logo, colores } = useMarca();

  if (logo.kind === "veloce") return <VeloceV width={px * 1.3} color={colores.tinta} />;
  if (logo.kind === "coronado") return <CoronadoBox width={px * 2.6} />;

  return (
    <div
      style={{
        width: px,
        height: px,
        borderRadius: "50%",
        overflow: "hidden",
        backgroundColor: logo.fondo ?? colores.superficie,
        flexShrink: 0,
      }}
    >
      <Img src={staticFile(logo.src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </div>
  );
};

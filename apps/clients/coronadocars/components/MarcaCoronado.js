// -----------------------------------------------------------------------------
// El recuadro de Coronado Carss.
//
// Su logotipo es un rectángulo AZUL REY con, de arriba abajo, "Compra - Venta
// y Consignación de Vehículos" en blanco pequeño y "CORONADO / CARSS" en
// AMARILLO NEÓN, grueso y en cursiva, a dos líneas. Una 4Runner blanca se sale
// del recuadro por la derecha y "Servimos con Excelencia" va debajo, fuera.
//
// Aquí está el recuadro redibujado en vector —el original, tal cual lo publican,
// es docs/fuentes/coronadocarss-perfil.jpg—, y no el JPG, por dos razones:
//
//   · El JPG es un cuadrado BLANCO con el recuadro en medio. Sobre la noche
//     azul de la página saldría como un parche blanco, y recortarlo deja la
//     4Runner partida por la mitad.
//   · En vector se pinta nítido a 34 px en la cabecera y a 600 px en la
//     puerta, sin cargar ninguna imagen.
//
// Las letras son TEXTO con la tipografía de la casa (Exo 2 negra itálica, la
// que carga app/layout.js), no trazados, y cada línea lleva `textLength`: así
// ocupan exactamente el ancho que ocupan en su logotipo aunque la fuente tarde
// en cargar o no cargue, y el recuadro nunca se descuadra.
//
// Dos formas:
//
//   <MarcaCoronado />                 el recuadro entero, con la línea de arriba
//   <MarcaCoronado detalle={false} /> sin la línea pequeña, para la cabecera:
//                                     a 34 px de alto esa línea es un hilo gris
// -----------------------------------------------------------------------------

/**
 * @param {boolean} detalle  con "Compra - Venta y Consignación…" encima
 * @param {string}  titulo   texto alternativo; vacío = decorativo
 */
export default function MarcaCoronado({ className = "", detalle = true, titulo = "" }) {
  const decorativo = !titulo;

  return (
    <svg
      viewBox="0 0 500 190"
      role={decorativo ? "presentation" : "img"}
      aria-hidden={decorativo ? "true" : undefined}
      aria-label={decorativo ? undefined : titulo}
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <rect width="500" height="190" fill="var(--color-azul, #0b4dc4)" />

      <g
        style={{ fontFamily: "var(--font-exo), 'Arial Narrow', sans-serif" }}
        fontStyle="italic"
      >
        {detalle && (
          <text
            x="250"
            y="33"
            textAnchor="middle"
            fontSize="19"
            fontWeight="500"
            fontStyle="normal"
            fill="#ffffff"
            textLength="340"
            lengthAdjust="spacingAndGlyphs"
          >
            Compra - Venta y Consignación de Vehículos
          </text>
        )}

        <text
          x="40"
          y={detalle ? 104 : 92}
          fontSize="82"
          fontWeight="800"
          fill="var(--color-lima, #e3f52a)"
          textLength="416"
          lengthAdjust="spacingAndGlyphs"
        >
          CORONADO
        </text>
        <text
          x="34"
          y={detalle ? 170 : 164}
          fontSize="82"
          fontWeight="800"
          fill="var(--color-lima, #e3f52a)"
          textLength="236"
          lengthAdjust="spacingAndGlyphs"
        >
          CARSS
        </text>
      </g>
    </svg>
  );
}

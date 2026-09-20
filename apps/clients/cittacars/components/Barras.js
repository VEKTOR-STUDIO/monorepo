// -----------------------------------------------------------------------------
// Las tres barras de Citta Cars.
//
// El logotipo lleva delante tres barras inclinadas en verde, blanco y rojo: el
// guiño italiano de "Citta". Es el único trozo de la marca que se puede
// dibujar —el rótulo es tipográfico y para eso está la imagen original en
// components/Logo.js—, y dibujarlo tiene ventajas: escala a cualquier tamaño,
// pesa nada y se puede pintar en color o en un solo tono según el fondo.
//
// Se usa como signo suelto: en el 404, en las cabeceras de sección y en los
// separadores. La banda ancha de CSS (.banda, en globals.css) es la misma idea
// hecha con un degradado, para cuando solo hace falta una línea.
// -----------------------------------------------------------------------------

const VERDE = "#009246";
const BLANCO = "#FFFFFF";
const ROJO = "#CE2B37";

/**
 * @param {boolean} color  en los tres colores de la marca; si no, monocromo
 *                         con `currentColor`, que es lo que se quiere cuando
 *                         van pegadas a un texto.
 */
export default function Barras({ color = true, className = "" }) {
  const tonos = color ? [VERDE, BLANCO, ROJO] : ["currentColor", "currentColor", "currentColor"];
  const opacidades = color ? [1, 1, 1] : [0.45, 0.7, 1];

  return (
    <svg
      viewBox="0 0 120 40"
      className={className}
      role="img"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* El sesgo es el mismo que el de .banda (-22°), para que las barras
          dibujadas y las de CSS se lean como la misma cosa. */}
      <g transform="skewX(-22) translate(14 0)">
        {[0, 1, 2].map((i) => (
          <rect
            key={i}
            x={i * 34}
            y="10"
            width="24"
            height="20"
            rx="1.5"
            fill={tonos[i]}
            opacity={opacidades[i]}
          />
        ))}
      </g>
    </svg>
  );
}

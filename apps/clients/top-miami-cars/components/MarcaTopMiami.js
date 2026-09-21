import { useId } from "react";

// -----------------------------------------------------------------------------
// Los dos gestos de Top Miami Cars, en vector.
//
// Su logotipo son tres piezas: un ESCUDO de acero cepillado, la LÍNEA de un
// deportivo en azul marino cruzándolo de lado a lado, y el rótulo con filete.
// El logotipo de verdad, tal cual lo mandaron, está en
// /marca/top-miami-cars.webp y es el que sale donde va la marca
// (components/Logo.js). Esto es otra cosa: los dos gestos redibujados, para
// poder usarlos a cualquier tamaño, animarlos y ponerlos de fondo sin cargar
// ninguna imagen.
//
// No son un calco: son el mismo gesto vuelto a dibujar. Las proporciones sí
// están medidas sobre el archivo —el escudo ocupa el 71 % del ancho del
// conjunto y la línea lo cruza entre el 20 % y el 42 % del alto—, porque es ese
// encaje el que hace que se reconozca.
//
//   <Escudo />       el escudo de acero, solo.
//   <LineaCarro />   la línea del deportivo, sola.
//   <Emblema />      los dos juntos, con el encaje del logotipo.
// -----------------------------------------------------------------------------

/**
 * El acero cepillado, como degradado de SVG.
 *
 * Son las mismas bandas que `--cromo` en globals.css. Va inclinado porque en
 * el escudo el reflejo cae en diagonal: si fuera vertical parecería un
 * degradado de botón de los de 2008, no una chapa.
 */
function Acero({ id }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="0" gradientTransform="rotate(14)">
      <stop offset="0" stopColor="#454d4f" />
      <stop offset="0.09" stopColor="#8d9395" />
      <stop offset="0.19" stopColor="#f3f4f4" />
      <stop offset="0.23" stopColor="#ffffff" />
      <stop offset="0.33" stopColor="#a9aeb0" />
      <stop offset="0.46" stopColor="#4b5355" />
      <stop offset="0.54" stopColor="#6f7678" />
      <stop offset="0.66" stopColor="#d5d8d9" />
      <stop offset="0.72" stopColor="#ffffff" />
      <stop offset="0.81" stopColor="#b9bdbf" />
      <stop offset="0.92" stopColor="#5a6264" />
      <stop offset="1" stopColor="#454d4f" />
    </linearGradient>
  );
}

/**
 * El escudo: borde de arriba apenas arqueado, lados rectos y el pico abajo.
 *
 * Lleva los tres detalles que lo hacen SU escudo y no un escudo cualquiera: la
 * banda gruesa de acero, las dos pestañas biseladas por dentro de las esquinas
 * de arriba y la V pequeña que repite el pico por dentro.
 *
 * @param {boolean} biseles  los detalles de dentro; a tamaño de icono sobran
 */
export function Escudo({ className = "", biseles = true }) {
  // useId trae caracteres que no valen dentro de `url(#…)`; se limpian.
  const acero = `acero-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  return (
    <svg
      viewBox="0 0 200 212"
      className={className}
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <Acero id={acero} />
      </defs>

      {/* La banda: el contorno de fuera menos el de dentro. */}
      <path
        fillRule="evenodd"
        fill={`url(#${acero})`}
        d="M8 15 Q100 2 192 15 L192 118 L100 206 L8 118 Z
           M22 27 Q100 16 178 27 L178 112 L100 187 L22 112 Z"
      />

      {biseles && (
        <g fill={`url(#${acero})`} opacity="0.85">
          {/* Las pestañas de las esquinas de arriba: arrancan gruesas en la
              esquina y mueren en punta, por el borde y por el lado. */}
          <path d="M30 35 Q58 31 84 30 L84 31.6 Q58 35 34 39 L36 66 L33 66 Z" />
          <path d="M170 35 Q142 31 116 30 L116 31.6 Q142 35 166 39 L164 66 L167 66 Z" />
          {/* La V de dentro del pico. */}
          <path d="M70 146 L100 174 L130 146 L132 148.5 L100 180 L68 148.5 Z" />
        </g>
      )}
    </svg>
  );
}

/**
 * La línea del deportivo: el morro en punta a la izquierda, el capó subiendo
 * hasta el diente del parabrisas, el techo cayendo hacia la cola y los dos
 * pasos de rueda.
 *
 * Son TRAZOS y no formas rellenas a propósito: así se pueden dibujar solos
 * (`stroke-dashoffset`) al entrar en pantalla. Cada uno lleva `data-trazo` y
 * `pathLength="1"`, que es lo que deja animarlos todos con el mismo número sin
 * medir cuánto mide cada uno.
 *
 * @param {boolean} sombras  las dos líneas grises de la carrocería
 */
export function LineaCarro({ className = "", sombras = true }) {
  return (
    <svg
      viewBox="0 0 640 116"
      className={className}
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {sombras && (
        <g stroke="#8d9395" strokeWidth="3" opacity="0.6">
          <path data-trazo pathLength="1" d="M190 48 C250 37 340 36 394 48" />
          <path data-trazo pathLength="1" d="M92 62 C170 57 250 61 308 78" />
        </g>
      )}

      <g stroke="var(--color-azul, #001478)">
        {/* Del morro al diente del parabrisas, y de ahí el techo hasta la
            cola. Es un solo trazo: es lo que se dibuja primero. */}
        <path
          data-trazo
          pathLength="1"
          strokeWidth="5.5"
          d="M6 58 C80 43 160 26 227 12 L219 23 C300 13 392 24 446 46 C468 55 484 61 498 65"
        />
        {/* La aleta trasera y la cola, que se va afinando hacia la derecha. */}
        <path
          data-trazo
          pathLength="1"
          strokeWidth="4.5"
          d="M428 68 C462 62 522 61 562 76 C592 87 612 97 630 107"
        />
        {/* El filo de abajo del capó y el colmillo del morro. */}
        <path data-trazo pathLength="1" strokeWidth="4" d="M6 58 C52 62 110 68 158 77" />
        <path data-trazo pathLength="1" strokeWidth="5" d="M6 58 L30 97" />
        {/* Los pasos de rueda. */}
        <path data-trazo pathLength="1" strokeWidth="4.5" d="M70 90 C86 72 136 70 152 92" />
        <path data-trazo pathLength="1" strokeWidth="4.5" d="M472 98 C490 78 540 78 558 102" />
      </g>
    </svg>
  );
}

/**
 * Los dos juntos, con el encaje del logotipo: el escudo centrado ocupando el
 * 71 % del ancho y la línea cruzándolo entera entre el 20 % y el 42 % del alto.
 *
 * El contenedor lleva la proporción del logotipo (624×468). Quien lo use le da
 * el ancho o el alto y lo otro sale solo.
 */
export default function Emblema({
  className = "",
  biseles = true,
  sombras = true,
  linea = true,
}) {
  return (
    <div className={`relative aspect-[624/468] ${className}`} aria-hidden="true">
      <div data-escudo className="absolute inset-y-0 left-[14.5%] w-[71%]">
        <Escudo className="h-full w-full" biseles={biseles} />
      </div>
      {linea && (
        <div data-linea className="absolute inset-x-0 top-[20%]">
          <LineaCarro className="w-full" sombras={sombras} />
        </div>
      )}
    </div>
  );
}

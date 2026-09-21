// -----------------------------------------------------------------------------
// Siluetas de unidad.
//
// Mientras una ficha no tenga foto, la página no puede enseñar un hueco negro:
// dibuja la silueta del tipo de unidad sobre el fondo de estudio y sigue
// viéndose como un escaparate.
//
// HOY SE USAN TODAS. Las fotos de las nueve unidades todavía no se han bajado
// de @lm2006.ccs, así que esto es lo que se ve en su sitio. Es a propósito:
// poner fotos de banco de imágenes en el inventario de un concesionario es el
// detalle que hunde una reunión que iba bien, y una silueta dice la verdad.
//
// Son formas genéricas dibujadas aquí —de perfil, mirando a la derecha—, no el
// contorno de ningún modelo concreto ni de ninguna marca. Hay una por
// carrocería de las que vende LM 2006, y el camión y la moto no son un extra:
// la primera línea de su bio es «Vehículos y Camiones» y en su feed hay un
// Sinotruk de quince toneladas y una Cyclone RX600.
// -----------------------------------------------------------------------------

/** Las ruedas, que son iguales en todos los dibujos salvo el tamaño. */
function Rueda({ cx, cy, r }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="currentColor" opacity="0.92" />
      <circle cx={cx} cy={cy} r={r * 0.46} fill="currentColor" opacity="0.35" />
      <circle cx={cx} cy={cy} r={r * 0.17} fill="currentColor" opacity="0.6" />
    </g>
  );
}

/** El hueco de las ventanillas: es lo que hace que se lea como un vehículo. */
function Cristales({ d }) {
  return <path d={d} fill="#ffffff" opacity="0.22" />;
}

const DIBUJOS = {
  // SUV: alta, techo largo y recto, buena altura libre al suelo.
  suv: (
    <>
      <path
        d="M20 100 L26 74 C29 64 37 58 48 56 L104 50 L136 22 C143 16 152 13 163 13 L268 13 C281 13 291 17 297 26 L318 54 L356 62 C374 66 384 76 385 88 L386 100 Z"
        fill="currentColor"
        opacity="0.82"
      />
      <Cristales d="M142 48 L166 24 C170 21 175 19 181 19 L262 19 C270 19 276 22 280 28 L294 48 Z" />
      <Rueda cx={104} cy={100} r={29} />
      <Rueda cx={304} cy={100} r={29} />
    </>
  ),

  // Sedán: capó largo y bajo, techo corto, maletero marcado.
  sedan: (
    <>
      <path
        d="M18 104 L28 82 C32 73 40 68 51 66 L112 60 L146 32 C153 26 162 23 173 23 L238 23 C251 23 262 27 269 36 L292 64 L350 72 C369 75 381 85 383 97 L384 104 Z"
        fill="currentColor"
        opacity="0.82"
      />
      <Cristales d="M152 58 L176 34 C180 31 185 29 191 29 L232 29 C240 29 246 32 250 38 L266 58 Z" />
      <Rueda cx={106} cy={104} r={25} />
      <Rueda cx={300} cy={104} r={25} />
    </>
  ),

  // Compacto: lo mismo que el sedán pero sin maletero, cortado en vertical
  // detrás del eje trasero. Es lo que distingue a un Agya o un Baleno.
  hatchback: (
    <>
      <path
        d="M34 104 L42 82 C46 73 54 68 65 66 L120 60 L152 32 C159 26 168 23 179 23 L246 23 C259 23 269 27 276 36 L304 66 L330 70 C348 73 356 82 357 94 L358 104 Z"
        fill="currentColor"
        opacity="0.82"
      />
      <Cristales d="M158 58 L182 34 C186 31 191 29 197 29 L240 29 C248 29 254 32 258 38 L276 58 Z" />
      <Rueda cx={112} cy={104} r={25} />
      <Rueda cx={292} cy={104} r={25} />
    </>
  ),

  // Pick-up: cabina adelante y bandeja de carga abierta detrás. El escalón
  // entre las dos es lo que la hace reconocible a tamaño pequeño.
  pickup: (
    <>
      {/* Bandeja */}
      <path d="M232 60 L376 60 L376 98 L232 98 Z" fill="currentColor" opacity="0.72" />
      {/* Cabina y morro */}
      <path
        d="M20 98 L28 74 C32 65 40 60 51 58 L104 52 L138 24 C145 18 154 15 165 15 L214 15 C227 15 236 20 240 30 L240 98 Z"
        fill="currentColor"
        opacity="0.82"
      />
      <Cristales d="M144 50 L168 26 C172 23 177 21 183 21 L214 21 C222 21 228 24 230 30 L230 50 Z" />
      <Rueda cx={104} cy={98} r={27} />
      <Rueda cx={310} cy={98} r={27} />
    </>
  ),

  // Camión: chasis cabina, que es justo lo que es el Howo 15T de su feed —la
  // cabina alta y cuadrada delante y el bastidor desnudo detrás, sin cajón—.
  camion: (
    <>
      {/* Bastidor */}
      <path d="M150 74 L384 74 L384 88 L150 88 Z" fill="currentColor" opacity="0.7" />
      {/* Cabina, alta y de frente casi vertical */}
      <path
        d="M20 92 L20 30 C20 20 27 14 38 14 L128 14 C140 14 148 20 148 31 L148 92 Z"
        fill="currentColor"
        opacity="0.85"
      />
      <Cristales d="M32 22 L134 22 L134 50 L32 50 Z" />
      {/* Paragolpes */}
      <path d="M14 76 L24 76 L24 94 L14 94 Z" fill="currentColor" opacity="0.6" />
      <Rueda cx={72} cy={96} r={30} />
      <Rueda cx={288} cy={96} r={30} />
      <Rueda cx={344} cy={96} r={30} />
    </>
  ),

  // Moto: trail de aventura, que es lo que es la RX600. Dos ruedas grandes, el
  // depósito arriba y el asiento largo cayendo hacia atrás.
  moto: (
    <>
      {/* Chasis, depósito y asiento */}
      <path
        d="M138 68 L162 42 C166 36 172 34 180 34 L214 34 C222 34 228 38 230 46 L236 66 L288 66 C296 66 300 70 300 76 L300 84 L236 84 L222 96 L160 96 L146 82 Z"
        fill="currentColor"
        opacity="0.82"
      />
      {/* Horquilla delantera */}
      <path d="M124 44 L146 44 L118 104 L100 104 Z" fill="currentColor" opacity="0.7" />
      {/* Manillar y cúpula */}
      <path d="M104 30 L152 30 L152 40 L118 40 Z" fill="currentColor" opacity="0.6" />
      <Rueda cx={106} cy={104} r={34} />
      <Rueda cx={296} cy={104} r={34} />
    </>
  ),
};

/**
 * @param {string} tipo  suv | sedan | hatchback | pickup | camion | moto
 */
export default function Silueta({ tipo = "sedan", className = "" }) {
  const dibujo = DIBUJOS[tipo] || DIBUJOS.sedan;

  return (
    <svg
      viewBox="0 0 400 140"
      role="img"
      aria-hidden="true"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      {dibujo}
    </svg>
  );
}

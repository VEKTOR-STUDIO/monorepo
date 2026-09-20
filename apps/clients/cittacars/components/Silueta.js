// -----------------------------------------------------------------------------
// Siluetas de vehículo.
//
// Mientras una ficha no tenga fotos, la página no puede enseñar un hueco gris:
// dibuja la silueta del tipo de vehículo sobre el fondo de estudio y sigue
// viéndose como un escaparate.
//
// Son formas genéricas dibujadas aquí —un sedán, una camioneta y una pick-up
// de perfil—, no el contorno de ningún modelo concreto ni de ninguna marca. En
// cuanto se cargan fotos reales, esto deja de salir.
// -----------------------------------------------------------------------------

/** Las ruedas, que son iguales en los tres dibujos salvo el tamaño. */
function Rueda({ cx, cy, r }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="currentColor" opacity="0.92" />
      <circle cx={cx} cy={cy} r={r * 0.46} fill="currentColor" opacity="0.35" />
      <circle cx={cx} cy={cy} r={r * 0.17} fill="currentColor" opacity="0.6" />
    </g>
  );
}

const DIBUJOS = {
  // Sedán: capó largo y bajo, techo corto, maletero marcado.
  sedan: (
    <>
      <path
        d="M18 104 L28 82 C32 73 40 68 51 66 L112 60 L146 32 C153 26 162 23 173 23 L238 23 C251 23 262 27 269 36 L292 64 L350 72 C369 75 381 85 383 97 L384 104 Z"
        fill="currentColor"
        opacity="0.82"
      />
      {/* Ventanillas: el hueco es lo que hace que se lea como un carro. */}
      <path
        d="M152 58 L176 34 C180 31 185 29 191 29 L232 29 C240 29 246 32 250 38 L266 58 Z"
        fill="#000000"
        opacity="0.45"
      />
      <Rueda cx={106} cy={104} r={25} />
      <Rueda cx={300} cy={104} r={25} />
    </>
  ),

  // Camioneta: más alta, techo largo y recto, mayor altura libre al suelo.
  camioneta: (
    <>
      <path
        d="M20 100 L26 74 C29 64 37 58 48 56 L104 50 L136 22 C143 16 152 13 163 13 L268 13 C281 13 291 17 297 26 L318 54 L356 62 C374 66 384 76 385 88 L386 100 Z"
        fill="currentColor"
        opacity="0.82"
      />
      <path
        d="M142 48 L166 24 C170 21 175 19 181 19 L262 19 C270 19 276 22 280 28 L294 48 Z"
        fill="#000000"
        opacity="0.45"
      />
      <Rueda cx={104} cy={100} r={29} />
      <Rueda cx={304} cy={100} r={29} />
    </>
  ),

  // Pick-up: cabina corta delante, batea plana y larga detrás.
  pickup: (
    <>
      <path
        d="M18 100 L24 74 C27 64 35 58 46 56 L96 50 L128 22 C135 16 144 13 155 13 L214 13 C226 13 235 17 241 26 L258 52 L262 52 L262 44 L386 44 L386 100 Z"
        fill="currentColor"
        opacity="0.82"
      />
      <path
        d="M134 48 L157 24 C161 21 166 19 172 19 L210 19 C218 19 224 22 228 28 L241 48 Z"
        fill="#000000"
        opacity="0.45"
      />
      {/* La línea que separa la batea de la cabina. */}
      <rect x="262" y="44" width="124" height="4" fill="#000000" opacity="0.3" />
      <Rueda cx={96} cy={100} r={29} />
      <Rueda cx={310} cy={100} r={29} />
    </>
  ),
};

/**
 * @param {string} tipo  camioneta | pickup | sedan
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

// -----------------------------------------------------------------------------
// Siluetas de vehículo.
//
// Mientras una ficha no tenga foto, la página no puede enseñar un hueco negro:
// dibuja la silueta del tipo de vehículo sobre el fondo de estudio y sigue
// viéndose como un escaparate.
//
// Hoy las trece fichas del catálogo traen su foto, así que esto no llega a
// salir; existe para el día que el cliente cargue un vehículo desde el panel y
// todavía no le haya subido las fotos.
//
// Son formas genéricas dibujadas aquí —una SUV y un sedán de perfil—, no el
// contorno de ningún modelo concreto ni de ninguna marca. Solo hay dos porque
// el catálogo de HB solo tiene dos carrocerías.
// -----------------------------------------------------------------------------

/** Las ruedas, que son iguales en los dos dibujos salvo el tamaño. */
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
  // SUV: alta, techo largo y recto, buena altura libre al suelo.
  suv: (
    <>
      <path
        d="M20 100 L26 74 C29 64 37 58 48 56 L104 50 L136 22 C143 16 152 13 163 13 L268 13 C281 13 291 17 297 26 L318 54 L356 62 C374 66 384 76 385 88 L386 100 Z"
        fill="currentColor"
        opacity="0.82"
      />
      {/* Ventanillas: el hueco es lo que hace que se lea como un carro. */}
      <path
        d="M142 48 L166 24 C170 21 175 19 181 19 L262 19 C270 19 276 22 280 28 L294 48 Z"
        fill="#ffffff"
        opacity="0.22"
      />
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
      <path
        d="M152 58 L176 34 C180 31 185 29 191 29 L232 29 C240 29 246 32 250 38 L266 58 Z"
        fill="#ffffff"
        opacity="0.22"
      />
      <Rueda cx={106} cy={104} r={25} />
      <Rueda cx={300} cy={104} r={25} />
    </>
  ),
};

/**
 * @param {string} tipo  suv | sedan
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

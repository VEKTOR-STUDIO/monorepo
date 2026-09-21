// -----------------------------------------------------------------------------
// Siluetas de vehículo.
//
// Mientras una ficha no tenga foto, la página no puede enseñar un hueco negro:
// dibuja la silueta del tipo de vehículo sobre el fondo de estudio y sigue
// viéndose como un escaparate.
//
// Hoy esto SALE EN TODAS LAS FICHAS, y no es un accidente: el catálogo de
// muestra va sin fotos a propósito. Las que traía la plantilla eran las trece
// páginas del catálogo de otro concesionario —con su logotipo y su rojo
// impresos encima—, y enseñar el inventario ajeno en la web de SUSU es
// exactamente lo que hunde una reunión que iba bien. En cuanto se lean las
// publicaciones de @susucars, cada ficha estrena su foto y estas siluetas
// vuelven a ser lo que deben ser: el hueco de un vehículo recién cargado y
// todavía sin fotografiar.
//
// Son formas genéricas dibujadas aquí —una camioneta, un sedán y una pick-up
// de perfil—, no el contorno de ningún modelo concreto ni de ninguna marca.
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

  // Pick-up: cabina adelante, batea atrás y la caída del techo a la pared de
  // la batea, que es lo que la distingue de una camioneta a primera vista.
  pickup: (
    <>
      <path
        d="M18 104 L18 64 L172 64 L182 34 C186 28 192 25 200 25 L252 25 C262 25 270 29 276 36 L300 66 L356 72 C374 75 384 84 385 96 L386 104 Z"
        fill="currentColor"
        opacity="0.82"
      />
      <path
        d="M196 60 L204 34 C206 31 210 30 215 30 L250 30 C256 30 260 32 263 37 L277 60 Z"
        fill="#ffffff"
        opacity="0.22"
      />
      <Rueda cx={100} cy={104} r={27} />
      <Rueda cx={312} cy={104} r={27} />
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
 * @param {string} tipo  suv | sedan | pickup
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

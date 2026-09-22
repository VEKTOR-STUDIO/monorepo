// -----------------------------------------------------------------------------
// Siluetas de vehículo.
//
// Mientras una unidad no tenga foto, la página no puede enseñar un hueco negro:
// dibuja la silueta de su carrocería y sigue viéndose como un escaparate.
//
// Hoy sale en las unidades de muestra: de Lone Star solo hay fotos de la
// Tacoma y del Corolla, recortadas de sus publicaciones. En cuanto una ficha
// traiga `fotos`, la silueta desaparece sola.
//
// Son formas genéricas dibujadas aquí —de perfil—, no el contorno de ningún
// modelo concreto ni de ninguna marca. Hay tres porque es lo que sale en su
// emblema y en sus piezas: pickups, camionetas y sedanes.
//
// Van en blanco a propósito: sobre la noche roja de la casa, una silueta clara
// es lo que se ve en su emblema, con la Tundra roja, la RAV4 negra y el Camry
// blanco brillando sobre el piso mojado.
// -----------------------------------------------------------------------------

/**
 * Las ruedas, que son iguales en todos los dibujos salvo el tamaño.
 *
 * El neumático va OSCURO y solo el rin en el color del dibujo. La primera
 * versión los pintaba enteros en `currentColor` —igual que la carrocería— y,
 * sobre el fondo rojo, cada vehículo salía con dos faros blancos por ruedas:
 * lo más brillante de la pieza era justo lo que en la realidad es negro, y el
 * conjunto dejaba de leerse como un carro.
 */
function Rueda({ cx, cy, r }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#0b0b0b" opacity="0.88" />
      <circle cx={cx} cy={cy} r={r * 0.52} fill="currentColor" opacity="0.7" />
      <circle cx={cx} cy={cy} r={r * 0.2} fill="#0b0b0b" opacity="0.5" />
    </g>
  );
}

/**
 * El cristal: el hueco es lo que hace que un bulto se lea como un vehículo.
 *
 * Va OSCURO, no claro. Sobre una carrocería blanca unas ventanillas más claras todavía convertían el techo en una
 * joroba pálida sin forma; en oscuro se leen como lo que son y el vehículo se
 * reconoce de un vistazo, aun en la miniatura de 90 px del carrusel.
 */
function Cristal({ d }) {
  return <path d={d} fill="#0b0b0b" opacity="0.42" />;
}

const DIBUJOS = {
  // Camioneta: alta, techo largo y recto, buena altura libre al suelo.
  suv: (
    <>
      <path
        d="M20 100 L26 74 C29 64 37 58 48 56 L104 50 L136 22 C143 16 152 13 163 13 L268 13 C281 13 291 17 297 26 L318 54 L356 62 C374 66 384 76 385 88 L386 100 Z"
        fill="currentColor"
        opacity="0.82"
      />
      <Cristal d="M142 48 L166 24 C170 21 175 19 181 19 L262 19 C270 19 276 22 280 28 L294 48 Z" />
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
      <Cristal d="M152 58 L176 34 C180 31 185 29 191 29 L232 29 C240 29 246 32 250 38 L266 58 Z" />
      <Rueda cx={106} cy={104} r={25} />
      <Rueda cx={300} cy={104} r={25} />
    </>
  ),

  // Pickup: cabina adelante, batea abierta atrás y el corte que las separa.
  pickup: (
    <>
      <path
        d="M16 100 L22 76 C25 66 33 60 44 58 L96 52 L128 22 C135 16 144 13 155 13 L214 13 C227 13 237 18 243 27 L262 56 L266 58 L266 44 L388 44 L388 100 Z"
        fill="currentColor"
        opacity="0.82"
      />
      <Cristal d="M134 48 L158 24 C162 21 167 19 173 19 L210 19 C218 19 224 22 228 28 L242 48 Z" />
      {/* El borde de la batea, que es lo que la distingue de una camioneta. */}
      <path d="M268 50 L386 50 L386 58 L268 58 Z" fill="#000000" opacity="0.28" />
      <Rueda cx={98} cy={100} r={27} />
      <Rueda cx={320} cy={100} r={27} />
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

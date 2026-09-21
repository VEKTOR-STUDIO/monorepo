// -----------------------------------------------------------------------------
// Siluetas de vehículo.
//
// Mientras una unidad no tenga foto, la página no puede enseñar un hueco vacío:
// dibuja la silueta de su carrocería y sigue viéndose como un escaparate.
//
// Hoy esto SALE EN TODAS LAS FICHAS, y no por descuido: de Top Miami Cars no
// hay ni una foto de inventario en el proyecto —lo único suyo es el logotipo y
// la ficha de Google—. En cuanto carguen las suyas desde el panel, la silueta
// desaparece sola.
//
// Son formas genéricas dibujadas aquí —de perfil—, no el contorno de ningún
// modelo concreto ni de ninguna marca. Hay cinco porque un concesionario de
// usados en Caracas vende cinco cosas: camionetas, sedanes, pick-ups,
// compactos y algún deportivo.
//
// Van en el AZUL de la casa a propósito: el salón donde se posan es blanco
// (globals.css, `.estudio`), y una silueta en el azul marino del logotipo es
// exactamente la línea del deportivo de su emblema, rellena.
// -----------------------------------------------------------------------------

/**
 * Las ruedas, que son iguales en todos los dibujos salvo el tamaño.
 *
 * El neumático va casi negro y el rin en plata: si fueran del color de la
 * carrocería, el dibujo entero sería una mancha azul y dejaría de leerse como
 * un carro.
 */
function Rueda({ cx, cy, r }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#0a0f2c" />
      <circle cx={cx} cy={cy} r={r * 0.56} fill="#d5d8d9" />
      <circle cx={cx} cy={cy} r={r * 0.56} fill="none" stroke="#8d9395" strokeWidth={r * 0.09} />
      <circle cx={cx} cy={cy} r={r * 0.17} fill="#454d4f" />
    </g>
  );
}

/**
 * El cristal: el hueco es lo que hace que un bulto se lea como un vehículo.
 *
 * Va CLARO, al revés que sobre una carrocería blanca: aquí el cuerpo es azul
 * marino y unas ventanillas oscuras se perderían dentro. En un gris azulado
 * claro se leen como cristal con el cielo reflejado, aun en la miniatura de
 * 90 px del carrusel.
 */
function Cristal({ d }) {
  return <path d={d} fill="#e4e9f3" opacity="0.92" />;
}

const DIBUJOS = {
  // Camioneta: alta, techo largo y recto hasta atrás y el portón casi
  // vertical. Eso último es lo que la separa de un sedán: con la trasera
  // cayendo en maletero, una 4Runner se leía como un Corolla grande.
  suv: (
    <>
      <path
        d="M20 100 L26 74 C29 64 37 58 48 56 L104 50 L136 22 C143 16 152 13 163 13 L326 13 C340 13 349 18 353 29 L366 60 C378 64 385 74 385 88 L386 100 Z"
        fill="currentColor"
        opacity="1"
      />
      <Cristal d="M142 48 L166 24 C170 21 175 19 181 19 L236 19 L236 48 Z" />
      <Cristal d="M244 19 L322 19 C331 19 337 22 340 29 L348 48 L244 48 Z" />
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
        opacity="1"
      />
      <Cristal d="M152 58 L176 34 C180 31 185 29 191 29 L232 29 C240 29 246 32 250 38 L266 58 Z" />
      <Rueda cx={106} cy={104} r={25} />
      <Rueda cx={300} cy={104} r={25} />
    </>
  ),

  // Pick-up: cabina adelante, batea abierta atrás y el corte que las separa.
  pickup: (
    <>
      <path
        d="M16 100 L22 76 C25 66 33 60 44 58 L96 52 L128 22 C135 16 144 13 155 13 L214 13 C227 13 237 18 243 27 L262 56 L266 58 L266 44 L388 44 L388 100 Z"
        fill="currentColor"
        opacity="1"
      />
      <Cristal d="M134 48 L158 24 C162 21 167 19 173 19 L210 19 C218 19 224 22 228 28 L242 48 Z" />
      {/* El borde de la batea, que es lo que la distingue de una camioneta. */}
      <path d="M268 50 L386 50 L386 58 L268 58 Z" fill="#000000" opacity="0.32" />
      <Rueda cx={98} cy={100} r={27} />
      <Rueda cx={320} cy={100} r={27} />
    </>
  ),

  // Compacto: dos volúmenes, portón casi vertical y voladizos cortos.
  hatchback: (
    <>
      <path
        d="M30 104 L38 82 C42 72 50 67 61 65 L116 58 L150 30 C157 24 166 21 177 21 L262 21 C277 21 289 26 297 36 L330 66 L352 72 C366 76 372 85 373 96 L374 104 Z"
        fill="currentColor"
        opacity="1"
      />
      <Cristal d="M156 56 L180 32 C184 29 189 27 195 27 L258 27 C267 27 274 30 279 36 L300 56 Z" />
      <Rueda cx={112} cy={104} r={25} />
      <Rueda cx={304} cy={104} r={25} />
    </>
  ),

  // Deportivo: muy bajo, capó larguísimo, techo corto echado hacia atrás y la
  // cola cayendo. Es la línea de su emblema, rellena.
  coupe: (
    <>
      <path
        d="M10 106 L24 90 C30 83 40 79 52 77 L150 66 L196 42 C204 38 213 36 224 36 L262 36 C276 36 288 40 298 48 L330 70 L366 78 C380 82 388 90 389 100 L390 106 Z"
        fill="currentColor"
        opacity="1"
      />
      <Cristal d="M178 64 L206 46 C210 44 215 42 221 42 L258 42 C267 42 275 45 282 50 L304 66 Z" />
      <Rueda cx={100} cy={106} r={24} />
      <Rueda cx={316} cy={106} r={24} />
    </>
  ),
};

/**
 * @param {string} tipo  suv | sedan | pickup | hatchback | coupe
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

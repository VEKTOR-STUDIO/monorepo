// -----------------------------------------------------------------------------
// Siluetas de vehículo.
//
// Mientras una unidad no tenga foto, la página no puede enseñar un hueco negro:
// dibuja la silueta de su carrocería y sigue viéndose como un escaparate.
//
// Hoy esto SALE EN TODAS LAS FICHAS, y no por descuido: de Coronado Carss no
// hay ni una foto de inventario en el proyecto. En cuanto se carguen las
// suyas, la silueta desaparece sola.
//
// Son formas genéricas dibujadas aquí —de perfil—, no el contorno de ningún
// modelo concreto ni de ninguna marca. Hay cinco porque son las cinco
// carrocerías que se mueven en el mercado de usados de Valencia: sedanes,
// camionetas, hatchbacks, pick-ups y coupés.
//
// Van en `currentColor`: en la plantilla de sus posts se pintan en plata
// contra la pared clara del local, y en el logotipo en blanco, como la 4Runner
// que se sale del recuadro.
// -----------------------------------------------------------------------------

/**
 * Las ruedas, que son iguales en todos los dibujos salvo el tamaño.
 *
 * El neumático va OSCURO y solo el rin en el color del dibujo. La primera
 * versión los pintaba enteros en `currentColor` —igual que la carrocería— y
 * cada vehículo salía con dos faros blancos por ruedas: lo más brillante de la
 * pieza era justo lo que en la realidad es negro, y el conjunto dejaba de
 * leerse como un carro.
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
 * Va OSCURO, no claro. Sobre una carrocería clara unas ventanillas más claras
 * todavía convertían el techo en una joroba pálida sin forma; en oscuro se leen
 * como lo que son y el vehículo se reconoce de un vistazo, aun en la miniatura
 * de 90 px del carrusel.
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

  // Pick-up: cabina adelante, batea abierta atrás y el corte que las separa.
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

  // Hatchback: el mismo morro que un sedán pero sin maletero, el techo baja
  // recto hasta el portón. Es lo que lo distingue y lo único que hay que
  // conservar si algún día se redibuja.
  hatchback: (
    <>
      <path
        d="M22 104 L32 82 C36 73 44 68 55 66 L114 60 L148 32 C155 26 164 23 175 23 L246 23 C259 23 270 27 277 36 L322 92 C327 99 333 102 342 103 L360 104 Z"
        fill="currentColor"
        opacity="0.82"
      />
      <Cristal d="M154 58 L178 34 C182 31 187 29 193 29 L240 29 C248 29 254 32 258 38 L286 58 Z" />
      <Rueda cx={108} cy={104} r={25} />
      <Rueda cx={288} cy={104} r={25} />
    </>
  ),

  // Coupé: techo bajo y muy tumbado, dos puertas, cola corta. Lo que lo hace
  // leerse como deportivo es que el cristal casi toca el maletero.
  coupe: (
    <>
      <path
        d="M14 106 L24 88 C28 79 36 74 47 72 L108 66 L156 38 C166 32 176 29 188 29 L232 29 C246 29 258 34 266 44 L296 72 L352 78 C372 81 384 90 386 100 L386 106 Z"
        fill="currentColor"
        opacity="0.82"
      />
      <Cristal d="M164 64 L192 42 C197 38 202 36 209 36 L228 36 C237 36 244 40 249 47 L262 64 Z" />
      <Rueda cx={102} cy={106} r={24} />
      <Rueda cx={302} cy={106} r={24} />
    </>
  ),
};

/**
 * @param {string} tipo  sedan | suv | hatchback | pickup | coupe
 */
export default function Silueta({ tipo = "sedan", className = "", style }) {
  const dibujo = DIBUJOS[tipo] || DIBUJOS.sedan;

  return (
    <svg
      viewBox="0 0 400 140"
      role="img"
      aria-hidden="true"
      className={className}
      style={style}
      preserveAspectRatio="xMidYMid meet"
    >
      {dibujo}
    </svg>
  );
}

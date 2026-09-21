// -----------------------------------------------------------------------------
// Siluetas de vehículo.
//
// Aquí no son un plan B: mientras el inventario real no esté cargado desde su
// Instagram, NINGUNA ficha tiene foto, así que esto es lo que se ve en el
// inventario, en las tarjetas y en cada ficha. De ahí que haya cinco
// carrocerías y no dos, y que estén dibujadas con cuidado en vez de a bulto.
//
// Que sean siluetas y no fotos de banco de imágenes es una decisión, no una
// carencia. Una demo llena de fotos de stock se nota, y lo que resta no es la
// foto: es la credibilidad de todo lo demás. Un dibujo declarado no engaña a
// nadie, y sobre el negro de esta marca se lee como una ficha técnica.
//
// Son formas genéricas —una camioneta, una pick-up, un sedán, un deportivo y
// un hatchback de perfil—, no el contorno de ningún modelo concreto ni de
// ninguna marca.
//
// Todas comparten la misma línea de piso (y = 104) y el mismo par de ruedas
// en su sitio, para que puestas una al lado de otra en la rejilla no bailen.
// -----------------------------------------------------------------------------

/** Las ruedas, iguales en todos los dibujos salvo el tamaño. */
function Rueda({ cx, cy, r }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="currentColor" opacity="0.92" />
      <circle cx={cx} cy={cy} r={r * 0.46} fill="currentColor" opacity="0.3" />
      <circle cx={cx} cy={cy} r={r * 0.16} fill="currentColor" opacity="0.6" />
    </g>
  );
}

/** El hueco de las ventanillas: es lo que hace que se lea como un carro. */
function Cristal({ d }) {
  return <path d={d} fill="#ffffff" opacity="0.2" />;
}

const DIBUJOS = {
  // Camioneta: alta, techo largo y recto, buen despeje.
  suv: (
    <>
      <path
        d="M20 104 L26 76 C29 65 37 59 48 57 L104 51 L136 22 C143 16 152 13 163 13 L268 13 C281 13 291 17 297 26 L318 55 L356 63 C374 67 384 78 385 90 L386 104 Z"
        fill="currentColor"
        opacity="0.84"
      />
      <Cristal d="M142 49 L166 24 C170 21 175 19 181 19 L262 19 C270 19 276 22 280 28 L294 49 Z" />
      <Rueda cx={104} cy={104} r={29} />
      <Rueda cx={304} cy={104} r={29} />
    </>
  ),

  // Pick-up: la misma altura que la camioneta, pero con cabina corta adelante
  // y batea plana detrás. Es lo que la distingue de un vistazo.
  pickup: (
    <>
      <path
        d="M16 104 L22 76 C25 65 33 59 44 57 L96 51 L126 22 C133 16 142 13 153 13 L232 13 C244 13 252 17 257 26 L272 52 L272 60 L388 60 L388 104 Z"
        fill="currentColor"
        opacity="0.84"
      />
      <Cristal d="M132 49 L154 25 C158 22 163 20 169 20 L228 20 C235 20 241 23 245 29 L257 49 Z" />
      {/* El borde de la batea, marcado: sin esta línea la pick-up se lee como
          una camioneta con el maletero raro. */}
      <path d="M272 60 L388 60 L388 68 L272 68 Z" fill="#ffffff" opacity="0.14" />
      <Rueda cx={96} cy={104} r={29} />
      <Rueda cx={310} cy={104} r={29} />
    </>
  ),

  // Sedán: capó largo y bajo, techo corto, maletero marcado.
  sedan: (
    <>
      <path
        d="M18 104 L28 84 C32 74 40 69 51 67 L112 61 L146 33 C153 27 162 24 173 24 L238 24 C251 24 262 28 269 37 L292 65 L350 73 C369 76 381 86 383 98 L384 104 Z"
        fill="currentColor"
        opacity="0.84"
      />
      <Cristal d="M152 59 L176 35 C180 32 185 30 191 30 L232 30 C240 30 246 33 250 39 L266 59 Z" />
      <Rueda cx={106} cy={104} r={25} />
      <Rueda cx={300} cy={104} r={25} />
    </>
  ),

  // Deportivo: bajísimo, morro largo que casi toca el piso y la luneta
  // cayendo en una sola línea hasta la cola. Ruedas grandes, poco hueco.
  deportivo: (
    <>
      <path
        d="M14 104 L18 90 C21 81 29 76 41 74 L118 66 L158 42 C166 37 175 35 186 35 L232 35 C248 35 262 40 272 50 L300 74 L358 82 C376 85 386 92 387 100 L387 104 Z"
        fill="currentColor"
        opacity="0.84"
      />
      <Cristal d="M164 64 L186 45 C190 42 195 41 201 41 L229 41 C239 41 247 44 253 51 L266 64 Z" />
      <Rueda cx={100} cy={104} r={27} />
      <Rueda cx={302} cy={104} r={27} />
    </>
  ),

  // Hatchback: corto por detrás, con la cola cayendo casi en vertical.
  hatchback: (
    <>
      <path
        d="M22 104 L30 82 C34 72 42 67 53 65 L104 59 L140 30 C147 24 156 21 167 21 L246 21 C259 21 269 25 275 34 L296 62 L338 68 C356 71 366 80 367 92 L368 104 Z"
        fill="currentColor"
        opacity="0.84"
      />
      <Cristal d="M146 57 L168 32 C172 29 177 27 183 27 L240 27 C248 27 254 30 258 36 L272 57 Z" />
      <Rueda cx={106} cy={104} r={26} />
      <Rueda cx={292} cy={104} r={26} />
    </>
  ),
};

/**
 * @param {string} tipo  suv | pickup | sedan | deportivo | hatchback
 */
export default function Silueta({ tipo = "suv", className = "" }) {
  const dibujo = DIBUJOS[tipo] || DIBUJOS.suv;

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

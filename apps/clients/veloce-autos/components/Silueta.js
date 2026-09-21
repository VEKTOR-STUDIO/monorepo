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
// un hatchback de perfil, todas mirando a la izquierda—, no el contorno de
// ningún modelo concreto ni de ninguna marca.
//
// LA OPACIDAD VA EN EL GRUPO, NO EN CADA PIEZA. Es lo único que no se puede
// tocar sin romperlo: si el cuerpo y las ruedas llevan su propia
// semitransparencia, donde se solapan se suman y la rueda aparece como un
// parche más claro dentro del guardabarros. Con un solo `opacity` en el `<g>`
// que los envuelve, las dos formas se funden en una sola mancha plana y
// después se atenúan juntas, que es lo que hace que esto se lea como una
// silueta y no como un dibujo mal montado.
//
// Por eso quien la usa le pasa un color OPACO (`text-base-content`) y no uno
// ya rebajado (`text-base-content/30`): el rebaje lo pone este componente.
// -----------------------------------------------------------------------------

/** Una rueda, hueca por dentro para que se lea como llanta y no como disco. */
function Rueda({ cx, cy, r }) {
  return (
    <>
      <circle cx={cx} cy={cy} r={r} fill="currentColor" />
      {/* El hueco va en negro por encima del grupo ya fundido: no aclara, cala. */}
      <circle cx={cx} cy={cy} r={r * 0.42} fill="#000" opacity="0.55" />
    </>
  );
}

const DIBUJOS = {
  // Camioneta: alta, techo largo y recto, buen despeje.
  suv: {
    cuerpo:
      "M18 112 L18 74 C20 64 28 58 40 56 L110 50 L142 22 C149 17 157 14 168 14 L276 14 C289 14 298 18 304 27 L324 54 L364 62 C380 66 386 76 386 88 L386 112 Z",
    cristal:
      "M148 48 L170 26 C174 23 179 21 185 21 L272 21 C280 21 286 24 290 30 L303 48 Z",
    ruedas: [
      { cx: 98, cy: 112, r: 29 },
      { cx: 306, cy: 112, r: 29 },
    ],
  },

  // Pick-up: la misma altura que la camioneta, pero con cabina corta adelante
  // y batea plana detrás. Es lo que la distingue de un vistazo.
  pickup: {
    cuerpo:
      "M16 112 L16 74 C18 64 26 58 38 56 L100 50 L130 22 C137 17 145 14 156 14 L236 14 C248 14 256 18 261 27 L276 52 L276 62 L388 62 L388 112 Z",
    cristal: "M136 48 L158 25 C162 22 167 20 173 20 L232 20 C239 20 245 23 249 29 L261 48 Z",
    // El borde de la batea: sin esta línea la pick-up se lee como una
    // camioneta con el maletero raro.
    calado: "M276 62 L388 62 L388 71 L276 71 Z",
    ruedas: [
      { cx: 94, cy: 112, r: 29 },
      { cx: 312, cy: 112, r: 29 },
    ],
  },

  // Sedán: capó largo y bajo, techo corto, maletero marcado.
  sedan: {
    cuerpo:
      "M18 112 L18 86 C21 76 29 70 41 68 L116 60 L150 32 C157 26 166 23 177 23 L242 23 C255 23 265 27 272 36 L296 64 L354 72 C372 75 383 84 384 96 L384 112 Z",
    cristal: "M156 58 L180 34 C184 31 189 29 195 29 L238 29 C246 29 252 32 256 38 L272 58 Z",
    ruedas: [
      { cx: 100, cy: 112, r: 26 },
      { cx: 302, cy: 112, r: 26 },
    ],
  },

  // Deportivo: bajísimo, morro largo que casi toca el piso y la luneta
  // cayendo en una sola línea hasta la cola. Ruedas grandes, poco hueco.
  deportivo: {
    cuerpo:
      "M12 112 L12 94 C15 85 24 79 38 77 L124 68 L164 42 C172 37 181 35 192 35 L238 35 C254 35 268 40 278 51 L304 76 L362 84 C379 87 388 94 388 102 L388 112 Z",
    cristal: "M170 66 L192 45 C196 42 201 41 207 41 L235 41 C245 41 253 44 259 51 L272 66 Z",
    ruedas: [
      { cx: 96, cy: 112, r: 28 },
      { cx: 306, cy: 112, r: 28 },
    ],
  },

  // Hatchback: corto por detrás, con la cola cayendo casi en vertical.
  hatchback: {
    cuerpo:
      "M26 112 L26 82 C29 72 37 66 49 64 L108 57 L144 28 C151 22 160 19 171 19 L250 19 C263 19 273 23 279 32 L300 60 L340 67 C357 70 366 79 366 91 L366 112 Z",
    cristal: "M150 55 L172 30 C176 27 181 25 187 25 L244 25 C252 25 258 28 262 34 L276 55 Z",
    ruedas: [
      { cx: 100, cy: 112, r: 27 },
      { cx: 296, cy: 112, r: 27 },
    ],
  },
};

/**
 * @param {string} tipo  suv | pickup | sedan | deportivo | hatchback
 * @param {number} intensidad  cuánto pesa la silueta sobre el fondo
 */
export default function Silueta({ tipo = "suv", className = "", intensidad = 0.3 }) {
  const d = DIBUJOS[tipo] || DIBUJOS.suv;

  return (
    <svg
      viewBox="0 0 400 130"
      role="img"
      aria-hidden="true"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Todo el volumen en un solo grupo: se funde primero, se atenúa después. */}
      <g opacity={intensidad}>
        <path d={d.cuerpo} fill="currentColor" />
        {d.ruedas.map((r) => (
          <Rueda key={r.cx} {...r} />
        ))}
      </g>

      {/* El cristal va ENCIMA del grupo ya atenuado, no dentro: así aclara
          sobre el cuerpo en vez de mezclarse con él, que es lo que hace que se
          lea como una ventanilla y no como un agujero. */}
      <path d={d.cristal} fill="currentColor" opacity={intensidad * 0.55} />

      {/* La línea de la batea, solo en la pick-up. */}
      {d.calado && <path d={d.calado} fill="#000" opacity={intensidad * 1.2} />}
    </svg>
  );
}

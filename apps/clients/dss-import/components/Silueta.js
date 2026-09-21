// -----------------------------------------------------------------------------
// Siluetas de las unidades.
//
// Mientras una unidad no tenga foto, la página no puede enseñar un hueco negro:
// dibuja la silueta de su carrocería y sigue viéndose como un escaparate.
//
// Hoy esto SALE EN TODAS LAS FICHAS, y no por descuido: Instagram limitó las
// peticiones desde esta IP mientras se montaba la página, así que no hay ni una
// foto de DSS en el proyecto. En cuanto se puedan bajar —o las suban desde el
// panel— la silueta desaparece sola.
//
// Son formas genéricas dibujadas aquí —de perfil—, no el contorno de ningún
// modelo concreto ni de ninguna marca. Hay seis porque este negocio financia
// dos cosas muy distintas: CUATRO de carro (sedán, hatchback, camioneta,
// pick-up) y DOS de moto (moto de calle y scooter).
//
// Las motos son la mitad del catálogo, así que no valía reciclar el dibujo de
// un carro y encogerlo. Y hay un detalle que se aprende mirándolo al tamaño en
// que se usa: lo que hace que un dibujo se lea como MOTO y no como bicicleta no
// es el manillar ni el cuadro, es EL BLOQUE DEL MOTOR ocupando el hueco entre
// las dos ruedas. La primera versión de esta silueta era un triángulo de tubos
// con ruedas grandes y de lejos salía una BMX.
//
// Un scooter, además, se distingue de una moto por el escudo delantero y el
// piso plano hundido entre las ruedas, que es justo lo que los separa en la
// calle y lo que pregunta quien va a comprar una.
//
// Van en claro a propósito: sobre el asfalto y el cielo dorado de la casa, una
// silueta clara es exactamente lo que se ve en sus publicaciones.
//
// Todos los dibujos comparten el mismo lienzo (400 × 140) y se apoyan en la
// misma línea de suelo, para que al alternarlos en una rejilla no salten de
// altura. Ese es el detalle que más se nota si se rompe.
// -----------------------------------------------------------------------------

/**
 * Las ruedas de un carro.
 *
 * El neumático va OSCURO y solo el rin en el color del dibujo. Pintarlas
 * enteras en `currentColor` —igual que la carrocería— deja, sobre el cielo
 * dorado, dos faros claros por ruedas: lo más brillante de la pieza sería justo
 * lo que en la realidad es negro, y el conjunto deja de leerse como un
 * vehículo.
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
 * La rueda de una moto: llanta fina y radios, no un disco macizo.
 *
 * Una moto con las ruedas de un carro parece un juguete. Lo que la hace leerse
 * como moto es que se vea el HUECO de la llanta, así que el centro va vacío y
 * solo se insinúan los radios.
 */
function RuedaMoto({ cx, cy, r }) {
  return (
    <g>
      {/* El neumático, grueso. Una llanta fina con mucho radio es una rueda de
          bicicleta; lo que hace que se lea como moto es la banda ancha. */}
      <circle cx={cx} cy={cy} r={r} fill="#0b0b0b" opacity="0.92" />
      <circle
        cx={cx}
        cy={cy}
        r={r * 0.58}
        fill="none"
        stroke="currentColor"
        strokeWidth={r * 0.14}
        opacity="0.6"
      />
      <circle cx={cx} cy={cy} r={r * 0.2} fill="currentColor" opacity="0.75" />
    </g>
  );
}

/**
 * El cristal: el hueco es lo que hace que un bulto se lea como un vehículo.
 *
 * Va OSCURO, no claro. Sobre una carrocería clara, unas ventanillas todavía más
 * claras convierten el techo en una joroba pálida sin forma; en oscuro se leen
 * como lo que son y el vehículo se reconoce de un vistazo, aun en la miniatura
 * de 90 px del carrusel.
 */
function Cristal({ d }) {
  return <path d={d} fill="#0b0b0b" opacity="0.42" />;
}

const DIBUJOS = {
  // Sedán: capó largo y bajo, techo corto, maletero marcado. Es el grueso de
  // su catálogo de carros —Optra, Aveo, Corolla, Accent—.
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

  // Hatchback: lo mismo sin maletero, cortado en vertical atrás. Es lo que
  // distingue a un Caliber o a un Spark de un sedán, y se nota en la cola.
  hatchback: (
    <>
      <path
        d="M20 104 L30 80 C34 71 42 66 53 64 L112 58 L148 30 C155 24 164 21 175 21 L246 21 C260 21 271 26 278 36 L306 74 L342 78 C362 80 372 88 374 98 L374 104 Z"
        fill="currentColor"
        opacity="0.82"
      />
      <Cristal d="M154 56 L178 32 C182 29 187 27 193 27 L240 27 C248 27 254 30 258 36 L276 56 Z" />
      {/* El corte recto de la cola, que es la firma del hatchback. */}
      <path d="M306 74 L374 78 L374 86 L308 82 Z" fill="#000000" opacity="0.2" />
      <Rueda cx={108} cy={104} r={25} />
      <Rueda cx={298} cy={104} r={25} />
    </>
  ),

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

  // Pick-up: cabina adelante, batea abierta atrás y el corte que las separa.
  pickup: (
    <>
      <path
        d="M16 100 L22 76 C25 66 33 60 44 58 L96 52 L128 22 C135 16 144 13 155 13 L214 13 C227 13 237 18 243 27 L262 56 L266 58 L266 44 L388 44 L388 100 Z"
        fill="currentColor"
        opacity="0.82"
      />
      <Cristal d="M134 48 L158 24 C162 21 167 19 173 19 L210 19 C218 19 224 22 228 28 L242 48 Z" />
      <path d="M268 50 L386 50 L386 58 L268 58 Z" fill="#000000" opacity="0.28" />
      <Rueda cx={98} cy={100} r={27} />
      <Rueda cx={320} cy={100} r={27} />
    </>
  ),

  // Moto de calle: el bloque del MOTOR en el centro, el tanque en gota, el
  // asiento escalonado detrás y el escape saliendo bajo hacia atrás. Es la Toro
  // Power, la Owen, la Bera SBR.
  //
  // El motor es lo que la hace leerse como moto y no como bicicleta, y por eso
  // ocupa el hueco entre las dos ruedas en vez de esconderse detrás del cuadro.
  // La primera versión era un triángulo de tubos con ruedas grandes: a tamaño
  // de tarjeta salía una BMX.
  moto: (
    <>
      {/* El escape, bajo y hacia atrás. Va primero: todo lo demás lo tapa. */}
      <path
        d="M214 86 L322 92 C330 93 333 96 332 100 C331 104 326 106 320 105 L214 97 Z"
        fill="currentColor"
        opacity="0.5"
      />

      {/* El guardabarros delantero, montado sobre la rueda. */}
      <path
        d="M60 76 C68 54 94 42 120 48 L116 60 C96 56 78 66 70 80 Z"
        fill="currentColor"
        opacity="0.75"
      />

      {/* La horquilla, inclinada como en una moto de calle. */}
      <g stroke="currentColor" strokeWidth="8" strokeLinecap="round" opacity="0.85" fill="none">
        <path d="M150 54 L104 96" />
        <path d="M162 60 L114 100" />
        <path d="M150 54 L141 36" />
      </g>

      {/* El manillar. */}
      <path d="M110 28 L174 24 L174 34 L110 38 Z" fill="currentColor" opacity="0.85" />

      {/* EL MOTOR. Sin esto, esto es una bicicleta. */}
      <path
        d="M166 62 L228 62 L238 84 L228 99 L176 99 L160 84 Z"
        fill="currentColor"
        opacity="0.92"
      />
      {/* Las aletas del cilindro, que es lo que lo lee como bloque de motor. */}
      <g stroke="#0b0b0b" strokeWidth="3" opacity="0.3">
        <path d="M176 71 L226 71" />
        <path d="M172 80 L232 80" />
        <path d="M176 89 L228 89" />
      </g>

      {/* El basculante, del motor a la rueda de atrás. */}
      <path
        d="M236 86 L298 99"
        stroke="currentColor"
        strokeWidth="9"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* El tanque, en gota. */}
      <path d="M146 46 C170 33 208 33 230 44 L234 62 L196 71 L154 64 Z" fill="currentColor" />

      {/* El asiento, escalonado detrás del tanque. */}
      <path
        d="M228 44 L300 40 C313 40 317 47 315 55 L307 65 L234 65 Z"
        fill="currentColor"
        opacity="0.92"
      />

      <RuedaMoto cx={104} cy={100} r={33} />
      <RuedaMoto cx={300} cy={100} r={33} />
    </>
  ),

  // Scooter: el escudo delantero que tapa las piernas y el PISO PLANO entre las
  // dos ruedas. Esas dos cosas, y no el tamaño, son lo que separa un scooter de
  // una moto en la calle, y es lo que pregunta quien va a comprar una.
  scooter: (
    <>
      {/* El escudo delantero: la firma del scooter. */}
      <path
        d="M116 28 C138 24 156 36 160 54 L166 84 L140 86 L128 54 C125 42 121 32 116 28 Z"
        fill="currentColor"
        opacity="0.9"
      />

      {/* El piso plano, hundido entre las dos ruedas. */}
      <path d="M140 86 L236 86 L236 100 L136 100 Z" fill="currentColor" opacity="0.85" />

      {/* El cuerpo de atrás, bajo el asiento. */}
      <path
        d="M236 64 C258 58 290 62 304 76 L310 94 L300 101 L236 100 Z"
        fill="currentColor"
        opacity="0.9"
      />

      {/* El asiento corrido, de una pieza. */}
      <path d="M212 48 L296 44 C309 44 313 51 311 59 L305 68 L218 70 Z" fill="currentColor" />

      {/* El manillar, alto y despegado del cuerpo. */}
      <g stroke="currentColor" strokeWidth="8" strokeLinecap="round" opacity="0.85" fill="none">
        <path d="M146 42 L114 96" />
        <path d="M133 32 L127 24" />
      </g>
      <path d="M94 20 L158 16 L158 26 L94 30 Z" fill="currentColor" opacity="0.85" />

      <RuedaMoto cx={112} cy={100} r={28} />
      <RuedaMoto cx={288} cy={100} r={28} />
    </>
  ),
};

/**
 * @param {string} tipo  sedan | hatchback | suv | pickup | moto | scooter
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

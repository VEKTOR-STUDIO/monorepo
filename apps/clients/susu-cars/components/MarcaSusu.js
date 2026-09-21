// -----------------------------------------------------------------------------
// El trazo de SUSU.
//
// Encima de las letras de su logotipo hay un deportivo dibujado de una sola
// línea: capó largo, techo bajo que cae en fastback hasta la cola, y los dos
// arcos de las ruedas cerrando abajo. Eso es lo que se reconoce de la marca a
// distancia —en la foto de perfil, a 40 px, el texto ya no se lee y el trazo
// sí—, así que aquí se dibuja en vector para poder usarlo grande, pequeño, en
// oro o en blanco, sin cargar ninguna imagen.
//
// No es un calco del original: es el mismo gesto redibujado. El logotipo de
// verdad, tal cual, está en /marca/susu-logo.jpg y se usa en components/Logo.js.
//
// Dos cosas que lo hacen funcionar y que no son adorno:
//
//   · VA EN TRAZO, NO EN RELLENO. El logotipo es una línea; una silueta maciza
//     sería otra marca. Por eso todo son `stroke` y el `fill` es `none`.
//   · EL GROSOR NO ESCALA. Con `vectorEffect="non-scaling-stroke"` la línea
//     mide lo mismo a 40 px que a 400: sin eso, en la cabecera el trazo se
//     adelgaza hasta desaparecer y en la portada engorda hasta parecer una
//     silueta.
//
// Si se toca el dibujo, hay que mirarlo AL TAMAÑO EN QUE SE USA, no ampliado:
// lo que a 400 px es un coupé, a 100 px puede ser una mancha. Lo que lo
// mantiene legible es el hueco de la ventanilla y la caída larga del techo.
// -----------------------------------------------------------------------------

/**
 * @param {boolean} brillo  el filo claro que el metal coge por arriba
 * @param {number} grosor   ancho del trazo, en píxeles de pantalla
 * @param {object} style    para pedir una medida exacta en vez de con clases
 */
export default function MarcaSusu({ className = "", brillo = true, grosor = 2, style }) {
  return (
    <svg
      viewBox="0 0 240 80"
      role="img"
      aria-hidden="true"
      className={className}
      style={style}
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      stroke="currentColor"
      strokeWidth={grosor}
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
    >
      {/* El perfil, mirando a la derecha: cola caída, techo bajo, capó largo
          y morro afilado. Empieza en la cola y termina en el paragolpes. */}
      <path
        vectorEffect="non-scaling-stroke"
        d="M14 58
           C10 52 12 46 20 43
           L54 33
           C64 25 78 19 96 17
           L132 15
           C152 15 170 22 186 34
           L214 44
           C226 48 230 52 228 58"
      />

      {/* El hueco de la ventanilla. Es lo que lo hace legible como carro y no
          como una cuña: sin esta línea, a tamaño de cabecera se lee como un
          tejadillo. */}
      <path
        vectorEffect="non-scaling-stroke"
        d="M66 32
           C76 25 88 21 102 20
           L130 19
           C146 19 160 24 172 32
           Z"
        opacity="0.75"
      />

      {/* Los dos arcos de rueda, que cierran el dibujo por abajo. */}
      <path vectorEffect="non-scaling-stroke" d="M40 58 A20 20 0 0 1 80 58" />
      <path vectorEffect="non-scaling-stroke" d="M162 58 A20 20 0 0 1 202 58" />

      {/* El faldón, en tres tramos: entre la cola y la rueda trasera, entre
          las dos ruedas y entre la delantera y el morro. */}
      <path
        vectorEffect="non-scaling-stroke"
        d="M14 58 L40 58 M80 58 L162 58 M202 58 L228 58"
      />

      {/* El filo de luz de arriba, que es lo que hace que el trazo se lea como
          metal y no como una raya amarilla. Va por encima del techo y muere
          antes del morro. */}
      {brillo && (
        <path
          vectorEffect="non-scaling-stroke"
          d="M60 30 C72 22 86 18 104 17 L130 16"
          stroke="var(--color-oro-claro, #ebd9a6)"
          strokeWidth={grosor * 0.7}
          opacity="0.85"
        />
      )}
    </svg>
  );
}

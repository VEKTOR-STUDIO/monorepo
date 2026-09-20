// -----------------------------------------------------------------------------
// El trazo de HB.
//
// Encima de las letras de su logotipo hay un trazo que dibuja el perfil de un
// deportivo de un solo golpe, con unas cuñas rojas saliendo por detrás, como
// una estela. Es lo que se reconoce de la marca a distancia —en la chapa de
// las matrículas de sus fotos se ve incluso cuando el texto ya no se lee—, así
// que aquí se dibuja en vector para poder usarlo grande, pequeño, en blanco o
// en rojo, sin cargar ninguna imagen.
//
// No es un calco del original: es el mismo gesto redibujado. El logotipo de
// verdad, tal cual, está en /marca/hb-logo.png y se usa en components/Logo.js.
//
// El perfil va en `currentColor` y la estela siempre en rojo, que es como
// funciona en el original: el trazo cambia de color según el fondo, la estela
// no.
//
// Ojo con el dibujo: la primera versión tenía el techo demasiado abombado y a
// tamaño de cabecera —unos 100 px de ancho— no se leía como un carro, se leía
// como una mancha. Lo que lo arregla es la línea recta del techo entre el
// parabrisas y la luneta, y el morro bajo y afilado. Si se vuelve a tocar,
// hay que mirarlo AL TAMAÑO EN QUE SE USA, no ampliado.
// -----------------------------------------------------------------------------

export default function MarcaHB({ className = "", estela = true }) {
  return (
    <svg
      viewBox="0 0 240 72"
      role="img"
      aria-hidden="true"
      className={className}
      preserveAspectRatio="xMidYMid meet"
      fill="none"
    >
      {/* La estela, detrás del carro y con el ángulo de la casa. */}
      {estela && (
        <g fill="var(--color-rojo, #e11019)">
          <path d="M-6 58 L26 58 L36 44 L4 44 Z" />
          <path d="M4 40 L30 40 L40 26 L14 26 Z" opacity="0.45" />
        </g>
      )}

      {/* El perfil, mirando a la derecha: cola corta, techo recto, capó largo
          y morro bajo. */}
      <path
        d="M30 58
           L30 44
           C30 39 34 36 41 35
           L78 30
           L104 15
           C110 12 116 10 124 10
           L150 10
           C160 10 168 13 174 19
           L186 31
           L216 37
           C226 39 232 44 232 50
           L232 58
           Z"
        fill="currentColor"
      />

      {/* El hueco de las ventanillas: es lo que lo hace legible como carro y
          no como una cuña. */}
      <path
        d="M92 29
           L110 17
           C114 15 118 14 123 14
           L149 14
           C156 14 161 16 165 20
           L173 29
           Z"
        fill="var(--color-base-100, #0d0d0d)"
      />
    </svg>
  );
}

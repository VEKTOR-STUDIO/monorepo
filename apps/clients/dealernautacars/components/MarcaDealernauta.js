// -----------------------------------------------------------------------------
// El gesto de DealerNauta.
//
// Su emblema es un escudo circular: una cresta naranja arriba, dos alas
// cruzadas —una naranja y una plateada— y, metido entre ellas, el perfil de un
// deportivo dibujado a línea con las siglas "DC" dentro. A tamaño grande el
// emblema entero se lee; a tamaño de cabecera no, porque el rótulo en arco y
// las estrellas se convierten en una mancha.
//
// Por eso aquí ese escudo está reducido a su gesto: las dos alas y el perfil
// del carro, en vector, para poder usarlo grande, pequeño, en blanco o en
// naranja y sin cargar ninguna imagen.
//
// No es un calco: es el mismo gesto redibujado. El emblema de verdad, tal cual
// lo publica el cliente, está en /marca/dealernauta-cars.jpg y se usa en
// components/Logo.js.
//
// El perfil va en `currentColor` y las alas siempre en sus colores: el trazo
// cambia según el fondo, las alas no. Es como funciona en el original.
//
// Ojo con el dibujo: el perfil tiene que leerse como un carro a unos 100 px de
// ancho, que es como se usa en la cabecera. Lo que lo hace legible es el hueco
// de las ventanillas y el morro bajo y largo. Si se vuelve a tocar, hay que
// mirarlo AL TAMAÑO EN QUE SE USA, no ampliado.
// -----------------------------------------------------------------------------

export default function MarcaDealernauta({ className = "", alas = true }) {
  return (
    <svg
      viewBox="0 0 240 72"
      role="img"
      aria-hidden="true"
      className={className}
      preserveAspectRatio="xMidYMid meet"
      fill="none"
    >
      {alas && (
        <g>
          {/* El ala naranja, la de arriba, barriendo hacia la derecha. */}
          <path
            d="M4 28 Q76 2 178 7 Q92 15 14 37 Z"
            fill="var(--color-naranja, #f07423)"
          />
          {/* La plateada, por debajo y en sentido contrario, como en el
              emblema. */}
          <path
            d="M58 63 Q150 72 236 50 Q152 62 72 56 Z"
            fill="var(--color-plata, #c8cbd0)"
            opacity="0.7"
          />
        </g>
      )}

      {/* El perfil del deportivo, a línea, mirando a la derecha. */}
      <g
        stroke="currentColor"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M30 52 L30 46 C30 41 35 38 44 37 L92 31 L116 20 C124 16 132 14 142 14 L164 14 C176 14 186 17 193 24 L202 33 L222 38 C230 40 234 44 234 50 L234 52" />
        {/* El hueco de las ventanillas: es lo que lo hace legible como carro y
            no como una cuña. */}
        <path d="M104 29 L122 19 C128 17 134 16 141 16 L163 16 C172 16 179 19 184 25 L189 31" />
        <circle cx="66" cy="54" r="10" />
        <circle cx="196" cy="54" r="10" />
        <path d="M76 54 L186 54" opacity="0.35" />
      </g>
    </svg>
  );
}

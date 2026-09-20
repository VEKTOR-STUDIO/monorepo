// -----------------------------------------------------------------------------
// El signo de Venta Nacional.
//
// Su foto de perfil es un hexágono negro con el monograma VN, un caucho a un
// lado y una casa al otro, sobre unas alas con los colores de la bandera y una
// franja de asfalto con la línea discontinua.
//
// El JPEG no sirve para la cabecera: viene sobre un degradado gris de chapa que
// no hay manera de recortar —en `multiply` se pierde el monograma y en `screen`
// se pierde el fondo—, y a 24 px de alto no se lee nada. Así que el signo se
// dibuja, en dos piezas:
//
//   <Marca />        el hexágono con el VN, en currentColor. Escala a cualquier
//                    tamaño, pesa nada y se pinta del color que haga falta.
//   <MarcaAlada />   lo mismo, con las alas de la bandera y el asfalto. Para
//                    cuando hay sitio: portada, puerta, pie.
//
// Es una interpretación del signo para pantalla, no un calco: las proporciones
// se calculan aquí. El original, tal cual, está en public/marca/ y se usa en la
// puerta de la demo (ver components/Logo.js → LogoFoto).
// -----------------------------------------------------------------------------

/** Hexágono de lados verticales, como el del logotipo. */
const HEXAGONO = "M60 3 L95 23 L95 81 L60 101 L25 81 L25 23 Z";

/**
 * El monograma. La V y la N se dibujan con trazo grueso y unión en pico —no
 * con una tipografía— para que se vean iguales en cualquier máquina, y van
 * inclinadas como en el original.
 *
 * El hueco entre las dos letras es lo que decide si se lee "VN" o una mancha:
 * con el trazo a 8, los brazos que se miran tienen que quedar a más de 8
 * unidades o se tocan y el conjunto pasa a parecer una W.
 */
function Monograma() {
  return (
    <g
      transform="translate(60 52) skewX(-8) translate(-60 -52)"
      fill="none"
      stroke="currentColor"
      strokeWidth="8"
      strokeLinejoin="miter"
      strokeMiterlimit="6"
    >
      <path d="M35 30 L46 74 L57 30" />
      <path d="M69 74 L69 30 L85 74 L85 30" />
    </g>
  );
}

/**
 * El hexágono con el monograma dentro.
 *
 * @param {"linea"|"macizo"} relleno  contorno, o hexágono lleno con el
 *   monograma calado (para cuando va sobre una foto y necesita cuerpo)
 */
export default function Marca({ className = "", relleno = "linea" }) {
  const macizo = relleno === "macizo";

  return (
    <svg
      viewBox="0 0 120 104"
      className={className}
      role="img"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <path
        d={HEXAGONO}
        fill={macizo ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={macizo ? 6 : 7}
        strokeLinejoin="miter"
      />
      {macizo ? (
        // Sobre el hexágono lleno, el monograma se cala: se pinta del color
        // del fondo de la página en vez de con el color de la marca.
        <g style={{ color: "var(--color-base-100)" }}>
          <Monograma />
        </g>
      ) : (
        <Monograma />
      )}
    </svg>
  );
}

/**
 * El signo con las alas: tres franjas de bandera a cada lado, cruzadas por la
 * franja de asfalto con su línea discontinua. Los colores son fijos —son los
 * de la bandera, no los del tema— salvo el hexágono, que va en currentColor.
 *
 * @param {boolean} asfalto  pinta la calzada que cruza las alas
 */
export function MarcaAlada({ className = "", asfalto = true }) {
  // Un ala: tres tiras inclinadas que se acortan hacia abajo, como en el
  // original. Se dibuja una sola vez y la del otro lado es su reflejo.
  const ala = (
    <g transform="skewX(-16)">
      <rect x="0" y="30" width="96" height="11" fill="#F2B705" />
      <rect x="6" y="45" width="84" height="11" fill="#1D3FA8" />
      <rect x="12" y="60" width="72" height="11" fill="#CE1126" />
    </g>
  );

  return (
    <svg
      viewBox="0 0 400 130"
      className={className}
      role="img"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Ala izquierda y su reflejo. El desplazamiento las separa del
          hexágono, que va encima y las tapa por el centro. */}
      <g transform="translate(16 8)">{ala}</g>
      <g transform="translate(384 8) scale(-1 1)">{ala}</g>

      {asfalto && (
        <g>
          <rect x="8" y="74" width="384" height="16" fill="#3A3F46" />
          <g fill="#E8E8E8">
            {[30, 86, 142, 258, 314, 370].map((x) => (
              <rect key={x} x={x} y="80" width="26" height="4" />
            ))}
          </g>
        </g>
      )}

      {/* El hexágono, centrado y por encima de las alas. */}
      <g transform="translate(140 10)">
        <path d={HEXAGONO} fill="currentColor" stroke="currentColor" strokeWidth="6" strokeLinejoin="miter" />
        <g style={{ color: "var(--color-base-100)" }}>
          <Monograma />
        </g>
      </g>
    </svg>
  );
}

// -----------------------------------------------------------------------------
// La corona de Kings Cars.
//
// Su emblema es una corona geométrica: un pico triangular con una estrella de
// cuatro puntas calada dentro, la punta de abajo alargada como una cola, y una
// banda trapezoidal que se estrecha hacia el suelo con DOS ROMBOS HUECOS, uno a
// cada lado. Debajo, "KING CARS" en letras cuadradas de vértices cortados, con
// la "A" sustituida por el frente de un carro.
//
// Aquí está solo la corona, en vector. El logotipo entero —corona más rótulo—
// es un JPG de 1.080 px y vive en /marca/kings-cars.jpg; se usa en
// components/Logo.js. Lo que esta pieza resuelve es lo que el JPG no puede:
// pintarse a cualquier tamaño, en cualquier color, sin cargar una imagen y sin
// depender del filtro que recorta el fondo.
//
// No es un calco: es el mismo gesto redibujado. Y está dibujado para leerse a
// 24 px de alto, que es como se usa en la cabecera. Lo que lo hace legible a
// ese tamaño son tres cosas y solo tres: la silueta de corona, la estrella del
// pico y los dos rombos. Todo lo demás es detalle que a tamaño de cabecera se
// convierte en barro, así que si se vuelve a tocar hay que MIRARLO AL TAMAÑO
// EN QUE SE USA, no ampliado.
//
// TODO SE RECORTA CON `evenodd` SOBRE UN SOLO TRAZADO, y eso no es una manía:
// los huecos tienen que ser huecos DE VERDAD —transparentes— porque esta corona
// se pinta lo mismo sobre la losa de la página que sobre una tarjeta, sobre una
// foto o dentro del sello de una publicación. Rellenarlos del color del fondo
// funcionaría en un sitio y dejaría un parche gris en los otros tres.
//
// Va en `currentColor` entera, sin un solo color propio: la marca es monocroma
// y el rojo de la casa no entra aquí. Ver el comentario de app/globals.css.
// -----------------------------------------------------------------------------

// La corona: silueta, los dos rombos de la banda y la estrella del pico.
const CORONA = `
  M100 2 L134 56 L197 56 L170 126 L30 126 L3 56 L66 56 Z
  M28 72 L62 72 L76.7 110 L42.7 110 Z
  M172 72 L138 72 L123.3 110 L157.3 110 Z
  M100 14 C103 40 106 48 122 56 C106 64 103 72 100 98
           C97 72 94 64 78 56 C94 48 97 40 100 14 Z
`;

// Los dos pétalos que flanquean la cola de la estrella. Por debajo de unos
// 28 px de alto se cierran solos en un borrón, así que ahí se quitan.
const PETALOS = `
  M88 64 C84 78 82 92 80 108 C74 94 74 78 80 64 Z
  M112 64 C116 78 118 92 120 108 C126 94 126 78 120 64 Z
`;

/**
 * @param {boolean} detalle  con los pétalos del pico. Se apaga en tamaños
 *                           pequeños, donde solo ensucian.
 */
export default function MarcaCorona({ className = "", detalle = true }) {
  return (
    <svg
      viewBox="0 0 200 128"
      role="img"
      aria-hidden="true"
      className={className}
      preserveAspectRatio="xMidYMid meet"
      fill="none"
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d={detalle ? CORONA + PETALOS : CORONA}
      />
    </svg>
  );
}

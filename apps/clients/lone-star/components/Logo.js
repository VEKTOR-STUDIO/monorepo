import Image from "next/image";

// -----------------------------------------------------------------------------
// La marca de Lone Star All In Autos.
//
// Tiene dos formas y las dos son suyas:
//
//   · El EMBLEMA completo, tal cual, tomado de su foto de perfil
//     (public/marca/lone-star.jpg, 1080 px): el círculo negro con filo rojo, la
//     estrella, el rótulo, los tres verbos, las pickups y el buque. Es la
//     imagen con la que los reconocen, así que se usa sin retocar. Va
//     recortada en círculo —el archivo ya es un círculo sobre negro— y no con
//     un filtro que vuelva transparente el negro: aquí el negro no es fondo,
//     es parte de la foto, y el filtro se comería las sombras de los carros.
//
//   · La versión CORTA de la cabecera de sus publicaciones: la estrella
//     partida en blanco y rojo, "LONE" en blanco, "STAR" en rojo y "ALL IN
//     AUTOS" espaciado debajo. Es la que ellos mismos ponen arriba de cada
//     pieza, y es la que se lee a 40 px de alto. Va en vector.
//
//   <Logo />         estrella + rótulo. Cabecera y pie.
//   <LogoGrande />   el rótulo grande con la estrella encima, para portadas.
//   <LogoChapa />    el emblema redondo, a cualquier tamaño.
//   <Estrella />     la estrella sola.
// -----------------------------------------------------------------------------

const ARCHIVO = "/marca/lone-star.jpg";
const LADO_ORIGINAL = 1080;

/**
 * La estrella partida: la mitad izquierda blanca y la derecha roja, como en su
 * emblema. La línea del medio es un hueco y no un trazo, para que a 20 px se
 * siga leyendo como dos mitades y no como una estrella rosa.
 *
 * Las mitades se cortan con polígonos y no con <clipPath>: un clipPath se
 * referencia por id, y con varias estrellas en la misma página los ids
 * chocarían.
 */
export function Estrella({ className = "", style }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={className} style={style}>
      <path
        d="M48.5 5 L38.5 37.2 L4.3 38.2 L31.5 59 L21.8 91.8 L48.5 73.5 L48.5 5 Z"
        fill="currentColor"
      />
      <path
        d="M51.5 5 L61.5 37.2 L95.7 38.2 L68.5 59 L78.2 91.8 L51.5 73.5 Z"
        fill="var(--color-rojo, #e3161e)"
      />
    </svg>
  );
}

/** El emblema de la foto de perfil, redondo. */
export function LogoChapa({ lado = 36, className = "", prioridad = false }) {
  // `lado` admite un número de píxeles o cualquier medida CSS: la puerta le
  // pasa un `clamp()` para que el emblema encoja con el alto de la pantalla.
  const medida = typeof lado === "number" ? `${lado}px` : lado;
  // Next necesita un número para elegir qué archivo servir; con una medida CSS
  // se le pide el mayor que puede llegar a valer.
  const servir = typeof lado === "number" ? lado * 2 : 240;

  return (
    <span
      className={`relative block shrink-0 overflow-hidden rounded-full ${className}`}
      style={{ width: medida, height: medida }}
    >
      <Image
        src={ARCHIVO}
        alt="Lone Star All In Autos"
        width={LADO_ORIGINAL}
        height={LADO_ORIGINAL}
        sizes={`${servir}px`}
        priority={prioridad}
        className="block h-full w-full scale-[1.03] object-cover"
      />
    </span>
  );
}

/** "LONE" en blanco y "STAR" en rojo, exactamente como en el emblema. */
export function Rotulo({ className = "" }) {
  return (
    <span className={`display leading-none ${className}`}>
      <span className="text-base-content">Lone </span>
      <span className="text-primary">Star</span>
    </span>
  );
}

/** "ALL IN AUTOS", muy espaciado, con los dos filetes a los lados. */
function Bajada({ className = "" }) {
  return (
    <span className={`flex items-center gap-1.5 text-base-content/70 ${className}`}>
      <span className="h-px flex-1 bg-current opacity-60" aria-hidden="true" />
      <span className="shrink-0 font-sans font-semibold uppercase">All in autos</span>
      <span className="h-px flex-1 bg-current opacity-60" aria-hidden="true" />
    </span>
  );
}

export default function Logo({ className = "" }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Estrella className="size-8 shrink-0 text-base-content" />
      <span className="flex flex-col leading-none">
        <Rotulo className="text-[1.45rem]" />
        <Bajada className="mt-0.5 text-[0.46rem] tracking-[0.34em]" />
      </span>
    </span>
  );
}

/** Grande y centrado: la estrella encima del rótulo. */
export function LogoGrande({ className = "" }) {
  return (
    <span className={`inline-flex flex-col items-center ${className}`}>
      <Estrella className="size-16 text-base-content" />
      <Rotulo className="mt-2 text-5xl sm:text-6xl" />
      <Bajada className="mt-2 w-full text-[0.7rem] tracking-[0.42em]" />
    </span>
  );
}

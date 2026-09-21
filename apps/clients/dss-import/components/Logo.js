import Image from "next/image";
import MarcaDSS from "@/components/MarcaDSS";

// -----------------------------------------------------------------------------
// La marca de DSS Import & Export.
//
// El sello es el suyo, tal cual, tomado de la foto de perfil de @somosdss
// (public/marca/dss-import.jpg, 1080 px): el disco de pan de oro con el
// monograma S/D calado en negro y "IMPORT & EXPORT" en arco. Es la imagen con
// la que sus 43 mil seguidores los reconocen, así que se usa sin retocar.
//
// CÓMO SE RECORTA, Y POR QUÉ NO SE USA EL FILTRO DE ALFA.
//
// Otras marcas de este monorepo tienen el logotipo calado sobre NEGRO, y ahí se
// les quita el fondo con un filtro SVG que saca el alfa del brillo del píxel:
// lo oscuro se vuelve transparente. Aquí eso sería exactamente lo contrario de
// lo que hace falta. El archivo de DSS es un disco dorado sobre BLANCO, así que
// ese filtro dejaría las esquinas blancas bien opacas y calaría el monograma
// —que es lo único oscuro de la pieza—: un cuadrado blanco con un agujero con
// forma de S.
//
// Lo que sí funciona con un logotipo redondo es recortarlo redondo. La clase
// `.sello` de globals.css lo hace con `border-radius` y `object-fit: cover`: da
// igual qué haya en las esquinas, porque las esquinas no se pintan nunca. Y de
// paso le pone el anillo del canto, sin el cual el disco parece recortado con
// tijera sobre el negro de la página.
//
// Tres formas, según el sitio:
//
//   <Logo />         el sello pequeño + el rótulo. Para la cabecera y el pie.
//   <LogoGrande />   el sello encima del rótulo, para portadas.
//   <LogoChapa />    solo el sello, a cualquier tamaño.
// -----------------------------------------------------------------------------

const ARCHIVO = "/marca/dss-import.jpg";
const LADO_ORIGINAL = 1080;

/** El sello, tal cual. */
export function LogoChapa({ lado = 36, className = "", prioridad = false }) {
  // `lado` admite un número de píxeles o cualquier medida CSS: la puerta le
  // pasa un `clamp()` para que el sello encoja con el alto de la pantalla.
  const medida = typeof lado === "number" ? `${lado}px` : lado;
  // Next necesita un número para elegir qué archivo servir; con una medida CSS
  // se le pide el mayor que puede llegar a valer.
  const servir = typeof lado === "number" ? lado * 2 : 168;

  return (
    <span
      className={`sello relative block shrink-0 ${className}`}
      style={{ width: medida, height: medida }}
    >
      <Image
        src={ARCHIVO}
        alt="DSS Import & Export"
        width={LADO_ORIGINAL}
        height={LADO_ORIGINAL}
        sizes={`${servir}px`}
        priority={prioridad}
        // `cover` y no `contain`: el disco llega justo al borde del cuadrado,
        // así que con `contain` quedaría una orla blanca de un par de píxeles
        // por fuera del recorte redondo.
        className="block h-full w-full object-cover"
      />
    </span>
  );
}

/**
 * El rótulo escrito, con el reparto de sus piezas: "DSS" grande y
 * "IMPORT & EXPORT" debajo, separados por el filete de oro.
 */
export function Rotulo({ className = "", arco = true, centrado = false }) {
  return <MarcaDSS className={className} arco={arco} centrado={centrado} />;
}

export default function Logo({ className = "", lado = 38 }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoChapa lado={lado} />
      <MarcaDSS className="text-[0.72rem]" />
    </span>
  );
}

/** Grande y centrado: el sello y el rótulo debajo. */
export function LogoGrande({ className = "" }) {
  return (
    <span className={`inline-flex flex-col items-center ${className}`}>
      <LogoChapa lado={88} />
      <MarcaDSS centrado className="mt-4 text-[1.5rem]" />
      <span className="cifra mt-3 text-center text-[0.6rem] tracking-[0.36em] text-base-content/40">
        Confianza y seguridad en movimiento
      </span>
    </span>
  );
}

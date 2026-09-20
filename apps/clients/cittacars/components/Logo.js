import Image from "next/image";
import Barras from "@/components/Barras";

// -----------------------------------------------------------------------------
// La marca de Citta Cars.
//
// El logotipo es el suyo, tal cual: rótulo blanco sobre negro con las tres
// barras verde-blanco-rojo delante (public/marca/cittacars.jpg). El archivo es
// cuadrado y el rótulo va en la franja central, así que aquí se recorta con
// `object-cover` dentro de una caja apaisada en vez de servir medio JPEG de
// negro.
//
// El fondo negro del archivo se convierte en transparencia con el filtro SVG
// `marca-alfa`, que vive en el layout raíz: hace el alfa de cada píxel a partir
// de su brillo, así que el negro desaparece y el blanco, el rojo y el verde del
// rótulo se quedan intactos.
//
// Antes esto se hacía con `mix-blend-mode: screen`, que es más barato pero se
// apaga sin avisar: el blend mezcla con el contexto de apilamiento del padre, y
// en cuanto un ancestro tiene z-index, opacity o backdrop-filter —la puerta de
// acceso, sin ir más lejos— el rótulo volvía a salir con su recuadro negro. El
// filtro funciona igual en cualquier sitio.
//
//   <Logo />        el rótulo, tamaño de cabecera.
//   <LogoGrande />  el mismo, grande y centrado, para la puerta y el 404.
//   <Barras />      solo el signo, dibujado, para acentos y texturas.
// -----------------------------------------------------------------------------

const ARCHIVO = "/marca/cittacars.jpg";

// Proporción de la franja que se conserva del archivo original. Con el recorte
// centrado deja el rótulo completo y se come el negro de arriba y de abajo.
const PROPORCION = "6.4 / 1";

/**
 * @param {number} ancho  ancho en píxeles del rótulo
 */
export default function Logo({ ancho = 150, className = "", prioridad = false }) {
  // `ancho` admite un número de píxeles o cualquier medida CSS —la puerta le pasa
  // un `clamp()` para que el logo encoja con el alto de la pantalla—. Al
  // navegador le vale cualquiera de las dos; Next necesita un número para
  // elegir qué archivo servir, y ahí va el mayor que puede llegar a medir.
  const medida = typeof ancho === "number" ? `${ancho}px` : ancho;
  const servir = typeof ancho === "number" ? ancho : 340;

  return (
    <span
      className={`relative block overflow-hidden ${className}`}
      style={{ width: medida, aspectRatio: PROPORCION }}
    >
      <Image
        src={ARCHIVO}
        alt="Citta Cars"
        fill
        sizes={`${servir}px`}
        priority={prioridad}
        className="object-cover"
        style={{ filter: "url(#marca-alfa)" }}
      />
    </span>
  );
}

/** Grande y centrado. Mismo recorte, otro tamaño. */
export function LogoGrande({ ancho = 340, className = "", prioridad = false }) {
  return <Logo ancho={ancho} className={`max-w-full ${className}`} prioridad={prioridad} />;
}

/**
 * El nombre escrito, para donde no cabe una imagen: el pie de un correo, un
 * texto corrido o un fondo claro donde el blend no serviría.
 */
export function LogoTexto({ className = "" }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Barras className="h-3.5 w-10 shrink-0" />
      <span className="display text-[1.05rem] leading-none">Citta Cars</span>
    </span>
  );
}

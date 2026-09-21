import Image from "next/image";
import MarcaCorona from "@/components/MarcaCorona";
import config from "@/config";

// -----------------------------------------------------------------------------
// La marca de Kings Cars.
//
// Su emblema es el suyo, tal cual, tomado de la foto de perfil de
// @kingscars.ccct: la corona y "KING CARS" calados en blanco sobre una losa de
// piedra oscura (public/marca/kings-cars.jpg, 1080 px). Es la imagen con la que
// los reconocen sus 6.567 seguidores, así que se usa sin retocar.
//
// El fondo de piedra del archivo se convierte en transparencia con el filtro
// SVG `marca-alfa`, que vive en el layout raíz: hace el alfa de cada píxel a
// partir de su brillo, así que la losa desaparece y el blanco del emblema se
// queda. Sin eso, la corona saldría dentro de un cuadrado gris sobre el gris de
// la página, que es justo el recuadro que se ve en cuanto hay una sombra o un
// degradado detrás.
//
// OJO CON EL UMBRAL DE ESE FILTRO: aquí el fondo del archivo NO es negro puro
// —es una piedra gris con vetas claras—, así que el corte está más arriba que
// en otras marcas del monorepo. Si se toca, hay que mirar la corona sobre un
// fondo claro: es donde se ve si queda un halo de losa alrededor.
//
// Se hace con filtro y no con `mix-blend-mode: screen`, que es más barato pero
// se apaga sin avisar: el blend mezcla con el contexto de apilamiento del
// padre, y en cuanto un ancestro tiene z-index, opacity o backdrop-filter —la
// puerta de acceso, sin ir más lejos— vuelve el recuadro. El filtro funciona
// igual en cualquier sitio.
//
// Tres formas, según el sitio:
//
//   <Logo />         la corona pequeña + el nombre. Para la cabecera y el pie.
//   <LogoGrande />   la corona dibujada encima del nombre, para portadas.
//   <LogoChapa />    solo el emblema completo, a cualquier tamaño.
// -----------------------------------------------------------------------------

const ARCHIVO = "/marca/kings-cars.jpg";
const LADO_ORIGINAL = 1080;

/** El emblema completo del cliente, tal cual. */
export function LogoChapa({ lado = 36, className = "", prioridad = false }) {
  // `lado` admite un número de píxeles o cualquier medida CSS: la puerta le
  // pasa un `clamp()` para que el emblema encoja con el alto de la pantalla.
  const medida = typeof lado === "number" ? `${lado}px` : lado;
  // Next necesita un número para elegir qué archivo servir; con una medida CSS
  // se le pide el mayor que puede llegar a valer.
  const servir = typeof lado === "number" ? lado * 2 : 168;

  return (
    <span
      className={`relative block shrink-0 ${className}`}
      style={{ width: medida, height: medida }}
    >
      <Image
        src={ARCHIVO}
        alt={config.appName}
        width={LADO_ORIGINAL}
        height={LADO_ORIGINAL}
        sizes={`${servir}px`}
        priority={prioridad}
        className="block h-full w-full object-contain"
        style={{ filter: "url(#marca-alfa)" }}
      />
    </span>
  );
}

/**
 * El rótulo escrito.
 *
 * Va TODO DEL MISMO COLOR, sin partir la palabra en dos tonos. En el emblema
 * "KING CARS" está calado de una pieza en blanco: repartirlo en dos colores
 * —que es lo que hace medio concesionario— sería inventarle a esta marca un
 * color que no tiene.
 */
export function Rotulo({ className = "", tono = "oscuro" }) {
  const color = tono === "oscuro" ? "text-base-content" : "text-base-100";

  return (
    <span className={`display-abierto ${color} ${className}`}>Kings Cars</span>
  );
}

/**
 * @param {"claro"|"oscuro"} tono  sobre fondo claro o sobre fondo oscuro
 */
export default function Logo({ className = "", tono = "oscuro" }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* En la cabecera la corona va en vector y no en imagen: a 34 px el JPG
          entero mete también el rótulo "KING CARS" dentro del cuadrado y se
          convierte en una mancha de tres milímetros. */}
      <MarcaCorona
        className="h-6 w-9 shrink-0 text-base-content"
        detalle={false}
      />
      <span className="leading-none">
        <Rotulo tono={tono} className="block text-[1.05rem]" />
        <span className="cifra mt-1 block text-[0.5rem] tracking-[0.28em] text-base-content/40">
          {config.business.centro} · {config.business.ciudad}
        </span>
      </span>
    </span>
  );
}

/** Grande y centrado: la corona dibujada y el nombre debajo. */
export function LogoGrande({ className = "" }) {
  return (
    <span className={`inline-flex flex-col items-center ${className}`}>
      <MarcaCorona className="h-16 w-24 text-base-content" />
      <Rotulo className="mt-3 text-4xl sm:text-5xl" />
      <span className="cifra mt-2.5 text-[0.6rem] tracking-[0.42em] text-base-content/40">
        Comprar · Vender · Detailing
      </span>
    </span>
  );
}

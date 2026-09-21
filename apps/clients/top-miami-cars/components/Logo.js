import Image from "next/image";
import config from "@/config";

// -----------------------------------------------------------------------------
// La marca de Top Miami Cars.
//
// Su logotipo es el suyo, tal cual lo mandaron: el escudo de acero, la línea
// del deportivo en azul y el rótulo con filete. El archivo original
// (public/marca/unnamed.webp) es un cuadrado de 1020 px con más de la mitad en
// margen transparente; el que se usa aquí, /marca/top-miami-cars.webp, es el
// mismo con ese margen recortado (640×484), para que al pedirle 48 px de alto
// el logo mida 48 px y no 22.
//
// Trae el fondo transparente y está hecho para blanco, así que no hace falta
// ni filtro ni `mix-blend-mode` para fundirlo. Lo que SÍ hay que respetar: no
// ponerlo sobre azul ni sobre oscuro. "TOP MIAMI" es blanco con filete y
// aguanta, pero la línea del carro es azul marino y desaparece. En las
// secciones azules la marca va escrita (<Rotulo />), no en imagen.
//
// Tres formas, según el sitio:
//
//   <Logo />         el logotipo pequeño + el nombre escrito. Cabecera y pie.
//   <LogoGrande />   el logotipo solo, grande, para portadas.
//   <LogoChapa />    el logotipo a cualquier alto.
//
// A tamaño de cabecera el rótulo de dentro del logotipo no se lee —son 9 px de
// letra—, y por eso <Logo /> lo repite escrito al lado, con el mismo reparto
// del original: "TOP MIAMI" y, debajo, "CARS".
// -----------------------------------------------------------------------------

const ARCHIVO = "/marca/top-miami-cars.webp";
const ANCHO = 640;
const ALTO = 484;

/** El logotipo, tal cual. `alto` admite píxeles o cualquier medida CSS. */
export function LogoChapa({ alto = 44, className = "", prioridad = false }) {
  // La puerta le pasa un `clamp()` para que encoja con el alto de la pantalla.
  const medida = typeof alto === "number" ? `${alto}px` : alto;
  // Next necesita un número para elegir qué archivo servir; con una medida CSS
  // se le pide el mayor que puede llegar a valer.
  const servir = typeof alto === "number" ? Math.round((alto * ANCHO) / ALTO) * 2 : 448;

  return (
    <span
      className={`relative block shrink-0 ${className}`}
      style={{ height: medida, aspectRatio: `${ANCHO} / ${ALTO}` }}
    >
      <Image
        src={ARCHIVO}
        alt={config.appName}
        width={ANCHO}
        height={ALTO}
        sizes={`${servir}px`}
        priority={prioridad}
        className="block h-full w-full object-contain"
      />
    </span>
  );
}

/**
 * El nombre escrito, con el reparto del logotipo: "TOP MIAMI" arriba y "CARS"
 * debajo, centrado y un punto más pequeño.
 *
 * A este tamaño NO lleva filete: por debajo de unos 22 px el contorno empasta
 * y la letra se vuelve una mancha. Va en el azul de la casa, liso.
 *
 * @param {"claro"|"azul"} sobre  el fondo encima del que va
 */
export function Rotulo({ className = "", sobre = "claro" }) {
  const color = sobre === "azul" ? "text-white" : "text-primary";

  return (
    <span className={`display inline-flex flex-col items-center leading-none ${color} ${className}`}>
      <span className="whitespace-nowrap">Top Miami</span>
      <span className="mt-[0.12em] text-[0.78em] tracking-[0.16em]">Cars</span>
    </span>
  );
}

/** Logotipo + nombre, para la cabecera y el pie. */
export default function Logo({ className = "", alto = 44 }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoChapa alto={alto} />
      <Rotulo className="text-[0.95rem]" />
    </span>
  );
}

/** Grande y centrado: el logotipo y, debajo, a qué se dedican. */
export function LogoGrande({ className = "" }) {
  return (
    <span className={`inline-flex flex-col items-center ${className}`}>
      <LogoChapa alto={180} />
      <span className="cifra mt-3 text-[0.6rem] uppercase tracking-[0.34em] text-base-content/50">
        {config.business.categoria} · {config.business.ciudad}
      </span>
    </span>
  );
}

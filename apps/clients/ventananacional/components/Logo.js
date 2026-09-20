import Image from "next/image";
import Marca, { MarcaAlada } from "@/components/Marca";

// -----------------------------------------------------------------------------
// La marca de Venta Nacional.
//
// El logotipo original junta tres cosas: el hexágono con el monograma VN, el
// nombre en dos pesos —"Venta" fina, "Nacional" gruesa— y, debajo, la línea de
// lo que hacen. Aquí se respeta esa estructura y se usa en tres tamaños:
//
//   <Logo />        signo + nombre, en una línea. Cabecera y pie.
//   <LogoGrande />  el signo con alas, el nombre y la línea de servicios.
//   <LogoFoto />    la imagen original enmarcada, solo para la puerta de la
//                   demo, donde lo que importa es reconocer la cuenta.
//
// El color sale de `tono`: el signo se pinta con currentColor, así que sirve
// igual sobre el grafito de la casa que sobre una foto clara.
// -----------------------------------------------------------------------------

const ARCHIVO = "/marca/ventanacional.jpg";
const SERVICIOS = "Compra y venta de carros e inmuebles";

/** El nombre, con el reparto de pesos del logotipo. */
function Nombre({ className = "" }) {
  return (
    <span className={`font-display leading-none tracking-tight ${className}`}>
      <span className="font-medium">Venta</span>
      <span className="font-extrabold">Nacional</span>
    </span>
  );
}

/**
 * @param {"claro"|"oscuro"} tono  sobre el fondo de la casa, o sobre una foto
 *   clara donde hace falta tinta oscura
 */
export default function Logo({ className = "", tono = "claro" }) {
  const color = tono === "oscuro" ? "text-grafito" : "text-base-content";

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Marca className={`h-7 w-8 shrink-0 ${color}`} />
      <Nombre className={`text-[1.05rem] ${color}`} />
    </span>
  );
}

/** Grande y centrado: el signo con alas, el nombre y la línea de servicios. */
export function LogoGrande({ className = "", tono = "claro" }) {
  const color = tono === "oscuro" ? "text-grafito" : "text-base-content";

  return (
    <span className={`inline-flex flex-col items-center gap-4 ${className}`}>
      <MarcaAlada className={`h-20 w-60 ${color}`} />
      <Nombre className={`text-4xl sm:text-5xl ${color}`} />
      <span className="cifra text-[0.6rem] uppercase tracking-[0.26em] text-base-content/45">
        {SERVICIOS}
      </span>
    </span>
  );
}

/**
 * La foto de perfil tal cual, enmarcada.
 *
 * No lleva `mix-blend-mode`: el original viene sobre un degradado gris de
 * chapa, no sobre negro, así que no hay fusión que lo recorte. Se enseña
 * entero dentro de un marco de cristal, que es además como se reconoce una
 * cuenta de Instagram.
 */
export function LogoFoto({ lado = 160, className = "", prioridad = false }) {
  // `lado` admite un número de píxeles o cualquier medida CSS —la puerta le pasa
  // un `clamp()` para que el logo encoja con el alto de la pantalla—. Al
  // navegador le vale cualquiera de las dos; Next necesita un número para
  // elegir qué archivo servir, y ahí va el mayor que puede llegar a medir.
  const medida = typeof lado === "number" ? `${lado}px` : lado;
  const servir = typeof lado === "number" ? lado : 200;

  return (
    <span
      className={`vidrio inline-block overflow-hidden p-1.5 ${className}`}
      style={{ lineHeight: 0 }}
    >
      <Image
        src={ARCHIVO}
        alt="Venta Nacional"
        width={servir}
        height={servir}
        priority={prioridad}
        className="block rounded-[0.7rem]"
        style={{ width: medida, height: medida }}
      />
    </span>
  );
}

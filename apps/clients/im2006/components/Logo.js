import Image from "next/image";
import MarcaLM from "@/components/MarcaLM";

// -----------------------------------------------------------------------------
// La marca de LM 2006 puesta en la página.
//
// Hay dos piezas y se usan para cosas distintas:
//
//   · <MarcaLM />, que es el logotipo dibujado en vector (components/MarcaLM.js).
//     Es la que manda: limpia a cualquier tamaño y hereda el color del texto.
//   · La CHAPA, que es su foto de perfil de Instagram tal cual, recortada en
//     círculo. Trae su propio fondo grafito, y sobre el fondo de esta página
//     ese círculo se lee como un emblema. Se reserva para donde hace falta que
//     se reconozca "la cuenta": la cabecera y la puerta.
//
// Tres formas, según el sitio:
//
//   <Logo />         la chapa pequeña + el logotipo. Para la cabecera y el pie.
//   <LogoGrande />   el logotipo apilado, grande, para portadas.
//   <LogoChapa />    solo el círculo, a cualquier tamaño.
// -----------------------------------------------------------------------------

const ARCHIVO = "/marca/lm2006-logo.jpg";
const LADO_ORIGINAL = 256;

/** El círculo del logotipo, tal cual. */
export function LogoChapa({ lado = 36, className = "", prioridad = false }) {
  // `lado` admite un número de píxeles o cualquier medida CSS: la puerta le
  // pasa un `clamp()` para que la chapa encoja con el alto de la pantalla.
  const medida = typeof lado === "number" ? `${lado}px` : lado;

  return (
    <Image
      src={ARCHIVO}
      alt="LM 2006"
      width={LADO_ORIGINAL}
      height={LADO_ORIGINAL}
      priority={prioridad}
      className={`block shrink-0 rounded-full ${className}`}
      style={{ width: medida, height: medida }}
    />
  );
}

/**
 * @param {"claro"|"oscuro"} tono  sobre fondo claro o sobre fondo oscuro
 */
export default function Logo({ className = "", tono = "oscuro", lado = 34 }) {
  const color = tono === "oscuro" ? "text-base-content" : "text-base-100";

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoChapa lado={lado} />
      <span className="leading-none">
        {/* El nombre no se escribe con texto al lado del dibujo: el dibujo YA
            dice "LM 2006". Repetirlo daba "LM 2006 LM 2006" en la cabecera. */}
        <MarcaLM className={`block h-[1.15rem] w-auto ${color}`} />
        <span className="cifra mt-1 block text-[0.5rem] tracking-[0.3em] text-base-content/40">
          Concesionario · Caracas
        </span>
      </span>
    </span>
  );
}

/** Grande y centrado: el logotipo apilado, como su foto de perfil. */
export function LogoGrande({ className = "" }) {
  return (
    <span className={`inline-flex flex-col items-center ${className}`}>
      <MarcaLM disposicion="apilada" className="h-24 w-auto text-base-content" />
      <span className="cifra mt-3 text-[0.6rem] tracking-[0.42em] text-base-content/40">
        Concesionario Caracas
      </span>
    </span>
  );
}

import Image from "next/image";
import MarcaHB from "@/components/MarcaHB";

// -----------------------------------------------------------------------------
// La marca de HB Inversiones.
//
// Su logotipo es un círculo de mármol blanco con el trazo del deportivo encima
// y "HB INVERSIONES C.A." debajo. Sobre el negro de esta página, ese círculo
// blanco funciona como una chapa y no hace falta recortarlo ni fundirlo con
// ningún `mix-blend-mode`: contrasta solo.
//
// Tres formas, según el sitio:
//
//   <Logo />         la chapa pequeña + el nombre. Para la cabecera y el pie.
//   <LogoGrande />   el trazo dibujado encima del nombre, para portadas.
//   <LogoChapa />    solo el círculo, a cualquier tamaño.
//
// El archivo es la foto de perfil de @hb_inversiones_12 recortada en círculo.
// Es pequeña (116 px) porque es la resolución que hay; por eso nunca se usa
// más grande que eso, y cuando hace falta algo grande se dibuja el trazo con
// <MarcaHB />, que es vector y no se despeina.
// -----------------------------------------------------------------------------

const ARCHIVO = "/marca/hb-logo.png";
const LADO_ORIGINAL = 116;

/** El círculo del logotipo, tal cual. */
export function LogoChapa({ lado = 36, className = "", prioridad = false }) {
  // `lado` admite un número de píxeles o cualquier medida CSS: la puerta le
  // pasa un `clamp()` para que la chapa encoja con el alto de la pantalla.
  const medida = typeof lado === "number" ? `${lado}px` : lado;

  return (
    <Image
      src={ARCHIVO}
      alt="HB Inversiones C.A."
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
        <span className={`display block text-[1.15rem] leading-none ${color}`}>
          HB <span className="text-primary">Inversiones</span>
        </span>
        <span className="cifra mt-0.5 block text-[0.5rem] tracking-[0.3em] text-base-content/40">
          C.A. · {`Barquisimeto`}
        </span>
      </span>
    </span>
  );
}

/** Grande y centrado: el trazo dibujado y el nombre debajo. */
export function LogoGrande({ className = "" }) {
  return (
    <span className={`inline-flex flex-col items-center ${className}`}>
      <MarcaHB className="h-14 w-44 text-base-content" />
      <span className="display mt-1 text-4xl leading-none text-base-content sm:text-5xl">
        HB <span className="text-primary">Inversiones</span>
      </span>
      <span className="cifra mt-2 text-[0.6rem] tracking-[0.42em] text-base-content/40">
        C.A.
      </span>
    </span>
  );
}

import Image from "next/image";
import Estrellas from "@/components/Estrellas";

// -----------------------------------------------------------------------------
// La marca de Aprovéchalo.
//
// Su identidad es blanco sobre negro y el signo es el arco de estrellas de su
// foto de perfil. Aquí se usa de dos formas, según lo que haya detrás:
//
//   <Logo />       el arco dibujado + el nombre. Se pinta con currentColor,
//                  así que sirve igual en negro sobre blanco que al revés.
//   <LogoFoto />   la imagen original, solo para fondos oscuros: el negro del
//                  JPEG se funde con `mix-blend-mode: screen`. Sobre blanco no
//                  hay blend que valga —en multiply se pierden las estrellas—,
//                  y por eso existe la versión dibujada.
// -----------------------------------------------------------------------------

const ARCHIVO = "/marca/aprovechalo.jpg";

/**
 * @param {"claro"|"oscuro"} tono  sobre fondo blanco o sobre fondo oscuro
 */
export default function Logo({ className = "", tono = "claro" }) {
  const color = tono === "oscuro" ? "text-base-100" : "text-base-content";

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Estrellas className={`h-4 w-10 shrink-0 ${color}`} />
      <span className={`display text-[1.05rem] leading-none ${color}`}>Aprovéchalo</span>
    </span>
  );
}

/** Grande y centrado, con el arco encima del nombre. */
export function LogoGrande({ className = "", tono = "oscuro" }) {
  const color = tono === "oscuro" ? "text-base-100" : "text-base-content";

  return (
    <span className={`inline-flex flex-col items-center gap-4 ${className}`}>
      <Estrellas className={`h-12 w-32 ${color}`} />
      <span className={`display text-4xl leading-none sm:text-5xl ${color}`}>
        Aprovéchalo
      </span>
    </span>
  );
}

/**
 * La foto de perfil tal cual. Solo sobre fondo oscuro.
 *
 * `mix-blend-mode: screen` hace desaparecer el negro del JPEG, así que las
 * estrellas quedan flotando sin recuadro.
 */
export function LogoFoto({ lado = 160, className = "", prioridad = false }) {
  return (
    <Image
      src={ARCHIVO}
      alt="Aprovéchalo"
      width={lado}
      height={lado}
      priority={prioridad}
      className={`block mix-blend-screen ${className}`}
      style={{ width: lado, height: lado }}
    />
  );
}

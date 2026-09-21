import Image from "next/image";
import MarcaDealernauta from "@/components/MarcaDealernauta";

// -----------------------------------------------------------------------------
// La marca de DealerNauta Cars.
//
// Su emblema es el suyo, tal cual, tomado de la foto de perfil de
// @dealernautacarsccs: el escudo naranja, plata y blanco calado sobre negro
// (public/marca/dealernauta-cars.jpg, 1080 px). Es la imagen con la que sus
// 68 mil seguidores los reconocen, así que se usa sin retocar.
//
// El fondo negro del archivo se convierte en transparencia con el filtro SVG
// `marca-alfa`, que vive en el layout raíz: hace el alfa de cada píxel a partir
// de su brillo, así que el negro desaparece y el naranja, la plata y el blanco
// del escudo se quedan intactos. Sin eso, el emblema saldría dentro de un
// cuadrado negro sobre el casi-negro de la página, que es justo el recuadro que
// se ve en cuanto hay una sombra o un degradado detrás.
//
// Se hace con filtro y no con `mix-blend-mode: screen`, que es más barato pero
// se apaga sin avisar: el blend mezcla con el contexto de apilamiento del
// padre, y en cuanto un ancestro tiene z-index, opacity o backdrop-filter —la
// puerta de acceso, sin ir más lejos— vuelve el recuadro. El filtro funciona
// igual en cualquier sitio.
//
// Tres formas, según el sitio:
//
//   <Logo />         el escudo pequeño + el nombre. Para la cabecera y el pie.
//   <LogoGrande />   el gesto dibujado encima del nombre, para portadas.
//   <LogoChapa />    solo el escudo, a cualquier tamaño.
// -----------------------------------------------------------------------------

const ARCHIVO = "/marca/dealernauta-cars.jpg";
const LADO_ORIGINAL = 1080;

/** El escudo del logotipo, tal cual. */
export function LogoChapa({ lado = 36, className = "", prioridad = false }) {
  // `lado` admite un número de píxeles o cualquier medida CSS: la puerta le
  // pasa un `clamp()` para que el escudo encoja con el alto de la pantalla.
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
        alt="DealerNauta Cars"
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
 * El rótulo escrito, con el reparto de colores del emblema: "DEALERNAUTA" en
 * naranja y "CARS" en blanco, exactamente como está en el escudo.
 */
export function Rotulo({ className = "", tono = "oscuro" }) {
  const blanco = tono === "oscuro" ? "text-base-content" : "text-base-100";

  return (
    <span className={`display leading-none ${className}`}>
      <span className="text-primary">Dealernauta</span>
      <span className={blanco}>Cars</span>
    </span>
  );
}

/**
 * @param {"claro"|"oscuro"} tono  sobre fondo claro o sobre fondo oscuro
 */
export default function Logo({ className = "", tono = "oscuro", lado = 38 }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoChapa lado={lado} />
      <span className="leading-none">
        <Rotulo tono={tono} className="block text-[1.1rem]" />
        <span className="cifra mt-0.5 block text-[0.5rem] tracking-[0.28em] text-base-content/40">
          Caracas · Los Altos
        </span>
      </span>
    </span>
  );
}

/** Grande y centrado: el gesto dibujado y el nombre debajo. */
export function LogoGrande({ className = "" }) {
  return (
    <span className={`inline-flex flex-col items-center ${className}`}>
      <MarcaDealernauta className="h-14 w-44 text-base-content" />
      <Rotulo className="mt-1 text-4xl sm:text-5xl" />
      <span className="cifra mt-2 text-[0.6rem] tracking-[0.42em] text-base-content/40">
        Compra · Venta · Consignación
      </span>
    </span>
  );
}

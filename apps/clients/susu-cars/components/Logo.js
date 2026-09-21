import Image from "next/image";
import MarcaSusu from "@/components/MarcaSusu";

// -----------------------------------------------------------------------------
// La marca de SUSU CARS.
//
// Su logotipo es un cuadrado negro con un degradado suave, el trazo de un
// deportivo en oro y "SUSU / CARS" debajo en capitales romanas. Sobre el negro
// de esta página ese cuadrado casi no se distingue del fondo, así que va
// SIEMPRE dentro de un filo de oro finísimo: eso lo convierte en una placa y le
// devuelve el canto que el fondo le quita.
//
// Se pensó en fundirlo con `mix-blend-mode: screen` —su fondo es casi negro, y
// el blend lo haría desaparecer dejando solo el oro—, y se descartó: cualquier
// ancestro con `z-index`, `filter` o `backdrop-filter` abre un contexto de
// apilamiento y apaga el blend sin avisar. Pasó en la puerta de la demo del
// proyecto del que salió esta página, y ahí el logo aparecía metido en un
// cuadrado negro solo en esa pantalla. El filo es determinista: se ve igual en
// todas.
//
// Tres formas, según el sitio:
//
//   <Logo />         la placa pequeña + el nombre. Para la cabecera y el pie.
//   <LogoGrande />   el trazo dibujado encima del nombre, para portadas.
//   <LogoPlaca />    solo el cuadrado, a cualquier tamaño.
//
// El archivo es la foto de perfil de @susucars a 320 px, que es la resolución
// que hay. Cuando hace falta algo más grande se dibuja el trazo con
// <MarcaSusu />, que es vector y no se despeina.
// -----------------------------------------------------------------------------

const ARCHIVO = "/marca/susu-logo.jpg";
const LADO_ORIGINAL = 320;

/** El cuadrado del logotipo, con su filo de oro. */
export function LogoPlaca({ lado = 36, className = "", prioridad = false }) {
  // `lado` admite un número de píxeles o cualquier medida CSS: la puerta le
  // pasa un `clamp()` para que la placa encoja con el alto de la pantalla.
  const medida = typeof lado === "number" ? `${lado}px` : lado;

  return (
    <span
      className={`block shrink-0 overflow-hidden ring-1 ring-primary/35 ${className}`}
      style={{ width: medida, height: medida }}
    >
      <Image
        src={ARCHIVO}
        alt="SUSU CARS"
        width={LADO_ORIGINAL}
        height={LADO_ORIGINAL}
        priority={prioridad}
        className="size-full object-cover"
      />
    </span>
  );
}

/**
 * @param {"claro"|"oscuro"} tono  sobre fondo claro o sobre fondo oscuro
 */
export default function Logo({ className = "", tono = "oscuro", lado = 34 }) {
  const color = tono === "oscuro" ? "text-base-content" : "text-base-100";

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* El trazo y no la placa: a 34 px el logotipo completo —carro, "SUSU" y
          "CARS" uno encima de otro— no se lee, y una marca borrosa en la
          cabecera es peor que ninguna. La foto de perfil, entera, está en la
          puerta, que es donde hay sitio para ella. */}
      <MarcaSusu
        className="shrink-0 text-primary"
        style={{ width: lado * 1.9, height: lado * 0.62 }}
      />
      <span className="leading-none">
        <span className={`display block text-[1.05rem] leading-none ${color}`}>
          Susu <span className="text-primary">Cars</span>
        </span>
        <span className="cifra mt-1 block text-[0.5rem] tracking-[0.3em] text-base-content/40">
          {`Caracas`}
        </span>
      </span>
    </span>
  );
}

/** Grande y centrado: el trazo dibujado y el nombre debajo. */
export function LogoGrande({ className = "" }) {
  return (
    <span className={`inline-flex flex-col items-center ${className}`}>
      <MarcaSusu className="h-12 w-40 text-primary" />
      <span className="display tinta-oro mt-2 text-3xl leading-none sm:text-4xl">
        Susu Cars
      </span>
      <span className="cifra mt-2 text-[0.6rem] tracking-[0.42em] text-base-content/40">
        Caracas
      </span>
    </span>
  );
}

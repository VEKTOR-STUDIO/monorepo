import MarcaCoronado from "@/components/MarcaCoronado";
import Silueta from "@/components/Silueta";
import config from "@/config";

// -----------------------------------------------------------------------------
// La marca de Coronado Carss.
//
// Su logotipo —docs/fuentes/coronadocarss-perfil.jpg, la foto de perfil de
// @coronadocarss— es el recuadro azul con "CORONADO CARSS" en amarillo, una
// 4Runner blanca que se sale por la esquina de abajo a la derecha y "Servimos
// con Excelencia" debajo. Aquí se compone igual, pero en vector: el recuadro
// es components/MarcaCoronado.js y la camioneta es la silueta genérica de
// components/Silueta.js, la misma que dibuja las fichas sin foto.
//
// El JPG no se usa en la web: es un cuadrado BLANCO con el recuadro en medio y
// sobre la noche azul de la página salía como un parche. Recortarlo partía la
// camioneta.
//
// Tres formas, según el sitio:
//
//   <Logo />         el recuadro pequeño + la ciudad. Para la cabecera y el pie.
//   <LogoGrande />   el logotipo entero, con la camioneta y el lema.
//   <LogoChapa />    el mismo, a la altura que se le pida (la puerta).
// -----------------------------------------------------------------------------

/**
 * El logotipo entero: recuadro, camioneta saliéndose y, si se pide, el lema.
 *
 * @param {string} alto   alto del recuadro, en cualquier medida CSS
 * @param {boolean} lema  con "Servimos con Excelencia" debajo
 */
export function LogoChapa({ alto = "4.5rem", lema = true, className = "" }) {
  return (
    <span className={`inline-flex flex-col items-start ${className}`}>
      <span
        className="relative block"
        style={{ height: alto, aspectRatio: "500 / 190" }}
      >
        <MarcaCoronado className="block h-full w-full" titulo={config.appName} />
        {/* La camioneta blanca, saliéndose por la esquina como en su logotipo.
            Es la silueta genérica, no el contorno de su 4Runner. */}
        <Silueta
          tipo="suv"
          className="pointer-events-none absolute text-hueso drop-shadow-[0_8px_10px_rgb(0_0_0/0.45)]"
          style={{ width: "58%", right: "-16%", bottom: "-30%" }}
        />
      </span>
      {lema && (
        <span
          className="mt-[0.9em] block font-[family-name:var(--font-exo)] font-medium text-base-content/75"
          style={{ fontSize: `calc(${alto} * 0.2)` }}
        >
          {config.business.tagline}
        </span>
      )}
    </span>
  );
}

export default function Logo({ className = "" }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      {/* En la cabecera va sin la línea pequeña de arriba ni la camioneta: a
          36 px de alto las dos se convierten en una mancha. */}
      <MarcaCoronado
        detalle={false}
        titulo={config.appName}
        className="h-9 w-auto shrink-0"
      />
      <span className="hidden leading-none sm:block">
        <span className="cifra block text-[0.5rem] tracking-[0.28em] text-base-content/45">
          {config.business.ciudad.toUpperCase()} · {config.business.estado.toUpperCase()}
        </span>
        <span className="mt-1 block font-[family-name:var(--font-exo)] text-[0.7rem] font-medium italic text-base-content/70">
          {config.business.tagline}
        </span>
      </span>
    </span>
  );
}

/** Grande: el logotipo entero, para portadas. */
export function LogoGrande({ className = "" }) {
  return <LogoChapa alto="clamp(4.5rem, 12vw, 7.5rem)" className={className} />;
}

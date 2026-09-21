import Image from "next/image";
import PlantillaPublicacion from "@/components/PlantillaPublicacion";

/**
 * El cuadro donde va la unidad.
 *
 * Cuando hay foto, se enseña entera y sin recortar (`contain` por defecto): las
 * fotos de DSS son publicaciones cuadradas maquetadas con su gráfica —el rótulo
 * arriba, el titular en medio, la pastilla de la cuota abajo— y recortarlas
 * sería tirar a la basura lo mejor que tienen. El hueco que queda alrededor lo
 * tapa el fondo de estudio, que es negro como el de la ficha, así que no se
 * nota que haya hueco.
 *
 * Cuando NO hay foto —que hoy es siempre, ver abajo— se dibuja la plantilla de
 * sus propias publicaciones: cielo dorado, la ciudad, el asfalto y la silueta
 * de la unidad encima. Así el hueco de la foto enseña exactamente dónde va a ir
 * su foto, y con su gráfica, en vez de dejar un rectángulo negro.
 */
export default function FotoVehiculo({
  vehiculo,
  className = "",
  prioridad = false,
  encajar = "contain",
  sizes = "(max-width: 768px) 100vw, 50vw",
  compacta = false,
}) {
  const foto = vehiculo.fotos?.[0] || null;

  return (
    <div className={`relative overflow-hidden estudio ${className}`}>
      {foto ? (
        <Image
          src={foto}
          alt={`${vehiculo.tituloLargo} ${vehiculo.anio}`}
          fill
          sizes={sizes}
          priority={prioridad}
          className={encajar === "cover" ? "object-cover" : "object-contain"}
        />
      ) : (
        <PlantillaPublicacion vehiculo={vehiculo} compacta={compacta} />
      )}
    </div>
  );
}

/**
 * "Aquí falta la foto real".
 *
 * No es un detalle menor y por eso se dice en voz alta: de DSS no hay ni una
 * foto en el proyecto. Instagram limitó las peticiones desde esta IP mientras
 * se montaba la página —la sesión era buena, el límite era de la red—, así que
 * lo que se ve en cada ficha es la plantilla de sus posts dibujada, no su
 * unidad.
 *
 * Meter fotos de banco de imágenes y hacerlas pasar por suyas habría quedado
 * más lucido y habría sido mentira. Desaparece en cuanto la ficha traiga
 * `fotos`.
 */
export function AvisoSinFoto({ className = "" }) {
  return (
    <span
      className={`cifra rounded-full bg-base-content/6 px-3 py-1 text-[0.65rem] text-base-content/45 ${className}`}
    >
      Aquí va tu foto
    </span>
  );
}

/**
 * "Este precio de contado todavía no es el suyo".
 *
 * DSS no publica precios de venta: sus publicaciones solo anuncian la cuota. El
 * precio de contado hace falta aquí para calcular la inicial y para ordenar el
 * catálogo, así que se puso una referencia de mercado —y se dice—. Las CUOTAS
 * de las seis unidades que salen de su Instagram sí son las suyas, tomadas del
 * propio cartel del post.
 *
 * Desaparece solo en cuanto la ficha deja de llevar `precioProvisional`.
 */
export function AvisoPrecioProvisional({ className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-base-content/15 px-3 py-1.5 text-[0.7rem] text-base-content/55 ${className}`}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" strokeLinecap="round" />
      </svg>
      Precio de contado de referencia: tus publicaciones solo llevan la cuota
    </span>
  );
}

/** "Esta unidad la puse yo de muestra", para las que no salen de su cuenta. */
export function AvisoDeMuestra({ className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-base-content/15 px-3 py-1.5 text-[0.7rem] text-base-content/55 ${className}`}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path d="M12 3v18M3 12h18" strokeLinecap="round" />
      </svg>
      Unidad de muestra, para llenar el catálogo
    </span>
  );
}

/**
 * "Esta cuota no sale de una publicación tuya".
 *
 * Las seis unidades que salen de su Instagram traen la cuota escrita en el
 * propio cartel. Las de muestra no, así que libs/catalogo.js les pone el ANCLA
 * de la casa —el "desde 75 semanales" con el que anuncian todo— y eso hay que
 * decirlo. Una cuota inventada que parezca suya es lo único de esta página que
 * podría costarle dinero a alguien.
 */
export function AvisoCuotaCalculada({ className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-base-content/15 px-3 py-1.5 text-[0.7rem] text-base-content/55 ${className}`}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 7h8M8 12h3M8 16h3" strokeLinecap="round" />
      </svg>
      Cuota de referencia: es tu «desde», no la de esta unidad
    </span>
  );
}

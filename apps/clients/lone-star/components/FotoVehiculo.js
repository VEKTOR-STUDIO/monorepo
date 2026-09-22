import Image from "next/image";
import PlantillaPublicacion from "@/components/PlantillaPublicacion";

/**
 * El cuadro donde va la unidad.
 *
 * Cuando hay foto, se enseña entera y sin recortar (`contain` por defecto): las
 * fotos de DealerNauta son publicaciones cuadradas maquetadas con su gráfica
 * —el modelo arriba, la pastilla del año abajo— y recortarlas sería tirar a la
 * basura lo mejor que tienen. El hueco que queda alrededor lo tapa el fondo de
 * estudio, que es negro como el de la ficha, así que no se nota que haya hueco.
 *
 * Cuando NO hay foto —que hoy es siempre, porque Instagram no deja descargar
 * las suyas— se dibuja la plantilla de sus propias publicaciones: cielo
 * naranja, la ciudad, el asfalto y la silueta del tipo de unidad encima. Así el
 * hueco de la foto enseña exactamente dónde va a ir su foto, y con su gráfica,
 * en vez de dejar un rectángulo negro.
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
 * No es un detalle menor y por eso se dice en voz alta: de DealerNauta no hay
 * ni una foto en el proyecto. Instagram devuelve un muro de acceso y no deja
 * descargar las publicaciones de @dealernautacars, así que lo que se ve en cada
 * ficha es la plantilla de sus posts dibujada, no su unidad.
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
 * "Este precio todavía no es el suyo".
 *
 * DealerNauta no publica precios en Instagram, y las publicaciones ni siquiera
 * se pueden leer una a una. Los precios de esta demo son referencias de
 * mercado, puestas para que la página se pueda enseñar funcionando, y decir eso
 * en voz alta es la diferencia entre una demo honesta y una que se inventa el
 * inventario de otro.
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
      Precio de referencia: tus publicaciones no llevan precio
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
      Unidad de muestra, para llenar el inventario
    </span>
  );
}

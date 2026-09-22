import Image from "next/image";
import PlantillaPublicacion from "@/components/PlantillaPublicacion";

/**
 * El cuadro donde va la unidad.
 *
 * Cuando hay foto, llena el cuadro (`cover` por defecto): las de Lone Star
 * están recortadas de sus publicaciones, ya sin el rótulo encima, y son fotos
 * de patio de subasta, que aguantan bien el recorte. El fondo de estudio queda
 * debajo por si alguna vez se pide `contain`.
 *
 * Cuando NO hay foto —las unidades de muestra— se dibuja la plantilla de su
 * pieza de la Tacoma: la noche roja, el puerto, el piso mojado y la silueta del
 * tipo de unidad encima. Así el hueco enseña dónde va a ir su foto, y con su
 * gráfica, en vez de dejar un rectángulo negro.
 */
export default function FotoVehiculo({
  vehiculo,
  className = "",
  prioridad = false,
  encajar = "cover",
  sizes = "(max-width: 768px) 100vw, 50vw",
  compacta = false,
  indice = 0,
}) {
  const foto = vehiculo.fotos?.[indice] || vehiculo.fotos?.[0] || null;

  return (
    <div className={`relative overflow-hidden estudio ${className}`}>
      {foto ? (
        <Image
          src={foto}
          alt={vehiculo.nombreCompleto}
          fill
          sizes={sizes}
          priority={prioridad}
          className={encajar === "contain" ? "object-contain" : "object-cover"}
        />
      ) : (
        <PlantillaPublicacion vehiculo={vehiculo} compacta={compacta} />
      )}
    </div>
  );
}

/**
 * "Aquí va su foto".
 *
 * Sale en las fichas que se dibujan con la plantilla: lo que se ve es la
 * gráfica de sus piezas, no su unidad. Meter fotos de banco de imágenes y
 * hacerlas pasar por suyas habría quedado más lucido y habría sido mentira.
 * Desaparece en cuanto la ficha traiga `fotos`.
 */
export function AvisoSinFoto({ className = "" }) {
  return (
    <span
      className={`cifra bg-base-content/6 px-3 py-1 text-[0.65rem] text-base-content/45 ${className}`}
    >
      Aquí va tu foto
    </span>
  );
}

/**
 * "Este precio todavía no es el suyo".
 *
 * Sus publicaciones casi nunca llevan precio —solo el Corolla, "a partir de
 * $16,000"—. El resto son referencias de mercado, puestas para que la página
 * se pueda enseñar funcionando, y decir eso en voz alta es la diferencia entre
 * una demo honesta y una que se inventa el inventario de otro.
 *
 * Desaparece solo en cuanto la ficha deja de llevar `precioProvisional`.
 */
export function AvisoPrecioProvisional({ className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 border border-base-content/15 px-3 py-1.5 text-[0.7rem] text-base-content/55 ${className}`}
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
      Precio de referencia: tu publicación no lo lleva
    </span>
  );
}

/** "Esta unidad la puse yo de muestra", para las que no salen de su cuenta. */
export function AvisoDeMuestra({ className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 border border-base-content/15 px-3 py-1.5 text-[0.7rem] text-base-content/55 ${className}`}
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
      Unidad de ejemplo, para llenar el inventario
    </span>
  );
}

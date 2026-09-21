import Image from "next/image";
import PlantillaPublicacion from "@/components/PlantillaPublicacion";

/**
 * El cuadro donde va la unidad.
 *
 * Cuando hay foto, se enseña entera y sin recortar (`contain` por defecto): un
 * usado se vende por la foto, y recortarle el morro para que encaje en la
 * tarjeta es tirar a la basura lo mejor que tiene. El hueco que queda alrededor
 * lo tapa el fondo de estudio, que es el mismo blanco de la ficha.
 *
 * Cuando NO hay foto —que hoy es siempre, porque de Top Miami Cars solo hay el
 * logotipo— se dibuja su propia pieza: el salón blanco, su escudo de acero
 * detrás y la silueta del tipo de unidad encima. Así el hueco de la foto enseña
 * exactamente dónde va a ir su foto, y con su gráfica, en vez de dejar un
 * rectángulo gris.
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
 * No es un detalle menor y por eso se dice en voz alta: de Top Miami Cars no
 * hay ni una foto de inventario en el proyecto, así que lo que se ve en cada
 * ficha es su pieza dibujada, no su unidad.
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
 * De Top Miami Cars no hay inventario publicado que se pueda leer, así que los
 * precios de esta demo son referencias de mercado, puestas para que la página
 * se pueda enseñar funcionando. Decir eso en voz alta es la diferencia entre
 * una demo honesta y una que se inventa el inventario de otro.
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
      Precio de referencia: aquí va el tuyo
    </span>
  );
}

/** "Esta unidad la puse yo de muestra": hoy son todas, porque no mandaron inventario. */
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
      Unidad de ejemplo, para enseñar la página llena
    </span>
  );
}

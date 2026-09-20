import Image from "next/image";
import Silueta from "@/components/Silueta";

/**
 * El cuadro donde va el vehículo.
 *
 * Las fotos de esta página son las trece páginas del catálogo de HB tal cual:
 * el vehículo recortado sobre el corte diagonal de la marca, con el modelo
 * arriba, las viñetas abajo a la derecha y la dirección del local abajo a la
 * izquierda. Vienen en 4:5 y se enseñan ENTERAS, sin recortar: la gráfica es
 * del cliente y recortarla sería tirar a la basura lo mejor que tiene.
 *
 * De ahí que el `object-fit` por defecto sea `contain` y no `cover`. El hueco
 * que queda alrededor lo tapa el fondo de estudio, que es negro como el de la
 * ficha, así que no se nota que haya hueco.
 *
 * Sin foto —que es lo que pasaría con un vehículo cargado desde el panel y
 * todavía sin fotografiar— dibuja la silueta del tipo, que mantiene la página
 * presentable en vez de dejar un rectángulo vacío.
 */
export default function FotoVehiculo({
  vehiculo,
  className = "",
  prioridad = false,
  encajar = "contain",
  sizes = "(max-width: 768px) 100vw, 50vw",
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
        <div className="absolute inset-0 flex items-center justify-center p-[8%]">
          <div className="relative w-full max-w-2xl">
            <Silueta tipo={vehiculo.carroceria} className="w-full text-base-content/25" />
            {/* La sombra va debajo de las ruedas, no del dibujo entero. */}
            <div className="sombra-piso absolute inset-x-[6%] bottom-[3%] h-3" aria-hidden="true" />
          </div>
        </div>
      )}
    </div>
  );
}

/** El cartelito de "aquí falta la foto real", para el modo muestra. */
export function AvisoSinFoto({ className = "" }) {
  return (
    <span
      className={`cifra bg-base-content/6 px-2.5 py-1 text-[0.65rem] text-base-content/45 ${className}`}
    >
      Foto pendiente
    </span>
  );
}

/**
 * "Este precio todavía no es el suyo".
 *
 * El catálogo en PDF que mandó HB no publica ni un precio: trae el modelo, el
 * año, el kilometraje y poco más. Los precios de esta demo son de referencia
 * de mercado, puestos para que la página se pueda enseñar funcionando, y decir
 * eso en voz alta es la diferencia entre una demo honesta y una que se inventa
 * el inventario de otro.
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
      Precio de referencia: el catálogo de HB no publica precios
    </span>
  );
}

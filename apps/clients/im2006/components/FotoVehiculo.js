import Image from "next/image";
import Silueta from "@/components/Silueta";

/**
 * El cuadro donde va la unidad.
 *
 * Las fotos de esta página son las publicaciones de @lm2006.ccs tal cual: la
 * unidad en el galpón, con el logotipo arriba a la izquierda, el modelo y la
 * línea técnica debajo y las tres barras de remate al pie. Vienen en 4:5 —el
 * formato de su feed— y se enseñan ENTERAS, sin recortar: la gráfica es del
 * cliente y recortarla sería tirar a la basura lo mejor que tiene.
 *
 * De ahí que el `object-fit` por defecto sea `contain` y no `cover`. El hueco
 * que queda alrededor lo tapa el fondo de estudio, que es el mismo grafito de
 * la ficha, así que no se nota que haya hueco.
 *
 * MIENTRAS NO HAYA FOTO dibuja la silueta del tipo. Hoy es lo que se ve en las
 * nueve fichas: las fotos se bajan de su Instagram con tools/instagram y
 * todavía no están. Una silueta dice la verdad; una foto de banco de imágenes
 * en el inventario de un concesionario, no.
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
        <>
          <div className="absolute inset-0 flex items-center justify-center p-[8%]">
            <div className="relative w-full max-w-2xl">
              <Silueta tipo={vehiculo.carroceria} className="w-full text-base-content/25" />
              {/* La sombra va debajo de las ruedas, no del dibujo entero. */}
              <div className="sombra-piso absolute inset-x-[6%] bottom-[3%] h-3" aria-hidden="true" />
            </div>
          </div>
          {/* Las tres barras al pie, como en sus publicaciones: aunque falte la
              foto, el cuadro sigue siendo suyo. */}
          <div className="banda-ancha absolute inset-x-0 bottom-0 h-1 opacity-70" aria-hidden="true" />
        </>
      )}
    </div>
  );
}

/** El cartelito de "aquí falta la foto real". */
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
 * En sus publicaciones el precio casi nunca sale: el único que han puesto es el
 * del Corolla HEV (36.500 $). Los demás son de referencia de mercado, puestos
 * para que la página se pueda enseñar funcionando, y decir eso en voz alta es
 * la diferencia entre una demo honesta y una que se inventa el inventario de
 * otro.
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
      Precio de referencia: sus publicaciones no lo traen
    </span>
  );
}

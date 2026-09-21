import Image from "next/image";
import Silueta from "@/components/Silueta";

/**
 * El cuadro donde va el vehículo.
 *
 * Las fotos que vengan de @susucars son publicaciones de Instagram, casi
 * siempre en 4:5, y se enseñan ENTERAS: son suyas, están compuestas, y
 * recortarlas a un apaisado le corta la cabeza al vehículo. De ahí que el
 * `object-fit` por defecto sea `contain` y no `cover`; el hueco que queda
 * alrededor lo tapa el fondo de estudio, que es negro como el de la ficha, así
 * que no se nota que haya hueco.
 *
 * Sin foto —que es hoy el caso de todo el catálogo de muestra— dibuja la
 * silueta del tipo, que mantiene la página presentable en vez de dejar un
 * rectángulo vacío.
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
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-[8%]">
          <div className="relative w-full max-w-2xl">
            <Silueta tipo={vehiculo.carroceria} className="w-full text-base-content/25" />
            {/* La sombra va debajo de las ruedas, no del dibujo entero. */}
            <div className="sombra-piso absolute inset-x-[6%] bottom-[3%] h-3" aria-hidden="true" />
          </div>
          {/* Sin esto, el hueco se lee como una foto que no cargó. Con el
              cartel se lee como lo que es: el sitio de la foto real. */}
          <AvisoSinFoto />
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
 * "Este vehículo no es suyo todavía".
 *
 * Mientras no se carguen las publicaciones reales de @susucars, las fichas son
 * inventadas para poder enseñar la página funcionando. Decirlo en voz alta, en
 * la propia tarjeta, es la diferencia entre una demo honesta y una que se
 * inventa el inventario de un negocio delante de su dueño.
 *
 * Desaparece solo en cuanto la ficha deja de llevar `muestra`.
 */
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
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" strokeLinecap="round" />
      </svg>
      Ficha de muestra: aquí va tu inventario real
    </span>
  );
}

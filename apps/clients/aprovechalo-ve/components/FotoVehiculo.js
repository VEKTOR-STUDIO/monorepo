import Image from "next/image";
import Silueta from "@/components/Silueta";

/**
 * El cuadro donde va el vehículo.
 *
 * Con fotos, enseña la primera sobre el fondo de estudio. Sin fotos —que es lo
 * que pasa mientras no se carguen las publicaciones reales— dibuja la silueta
 * del tipo de vehículo, que mantiene la página presentable en vez de dejar un
 * rectángulo vacío.
 *
 * El fondo de estudio y la sombra del suelo están en globals.css (.estudio,
 * .estudio-oscuro, .sombra-piso).
 */
export default function FotoVehiculo({
  vehiculo,
  className = "",
  tono = "claro",
  prioridad = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
}) {
  const foto = vehiculo.fotos?.[0] || null;
  const fondo = tono === "oscuro" ? "estudio-oscuro" : "estudio";

  return (
    <div className={`relative overflow-hidden ${fondo} ${className}`}>
      {foto ? (
        <Image
          src={foto}
          alt={`${vehiculo.tituloLargo} ${vehiculo.anio}`}
          fill
          sizes={sizes}
          priority={prioridad}
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center p-[8%]">
          <div className="relative w-full max-w-2xl">
            <Silueta
              tipo={vehiculo.carroceria}
              className={`w-full ${tono === "oscuro" ? "text-base-100/45" : "text-base-content/25"}`}
            />
            {/* La sombra va debajo de las ruedas, no del dibujo entero. */}
            <div
              className="sombra-piso absolute inset-x-[6%] bottom-[3%] h-3"
              aria-hidden="true"
            />
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
      className={`cifra rounded-lg bg-base-content/6 px-2.5 py-1 text-[0.65rem] text-base-content/45 ${className}`}
    >
      Foto pendiente
    </span>
  );
}

/**
 * "Esta foto es del modelo, no de este vehículo".
 *
 * Va en las fichas que todavía llevan una foto de banco de imágenes. Es una
 * cuestión de honestidad, no de estilo: quien compra un carro tiene que saber
 * que lo que está viendo no es la unidad que se vende. Desaparece solo en
 * cuanto la ficha lleva fotos propias (`fotoStock` fuera del JSON).
 */
export function AvisoFotoStock({ className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg bg-base-content/6 px-3 py-1.5 text-[0.7rem] text-base-content/55 ${className}`}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" strokeLinecap="round" />
      </svg>
      Foto de referencia del modelo, no del vehículo en venta
    </span>
  );
}

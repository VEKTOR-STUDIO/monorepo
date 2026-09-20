import Link from "next/link";
import FotoVehiculo from "@/components/FotoVehiculo";
import { enDolares, kilometrajeDe } from "@/libs/formato";
import { ESTADOS } from "@/libs/vehiculos";

/**
 * La tarjeta del inventario.
 *
 * La foto es la página entera del catálogo de HB, así que la tarjeta no repite
 * lo que ya dice la imagen: debajo solo van la condición, el modelo, el precio
 * y el kilometraje. El nombre del modelo se escribe aunque esté impreso en la
 * foto porque una imagen no la lee ni Google ni un lector de pantalla.
 *
 * Nada se le superpone a la foto. Se probó con la etiqueta de "0 KM" en la
 * esquina de arriba a la izquierda y ahí es justo donde el catálogo pone el
 * año y el modelo en grande, así que se tapaban entre ellos. Las cuatro
 * esquinas de esas fichas están ocupadas —modelo, logo de la marca, viñetas y
 * dirección—, así que lo que se añada va fuera de la imagen.
 *
 * El vehículo vendido se atenúa pero sigue en su sitio: en este negocio,
 * enseñar lo que ya se vendió es parte del argumento de venta.
 */
export default function FichaVehiculo({ vehiculo, prioridad = false }) {
  const estado = ESTADOS[vehiculo.estado] || ESTADOS.disponible;
  const vendido = vehiculo.estado === "vendido";

  return (
    <Link
      href={`/vehiculo/${vehiculo.slug}`}
      className={`ficha group block overflow-hidden ${vendido ? "opacity-60" : ""}`}
    >
      <div className="relative">
        <FotoVehiculo
          vehiculo={vehiculo}
          prioridad={prioridad}
          className="aspect-4/5 w-full"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Lo único que sí se superpone, y solo cuando hace falta: que una
            unidad esté reservada o vendida cambia la decisión de quien mira y
            no puede esperar a leerse la letra pequeña. */}
        {vehiculo.estado !== "disponible" && (
          <span className="absolute right-3 top-3 flex items-center gap-1.5 bg-base-100/85 px-2.5 py-1 text-[0.7rem] font-medium backdrop-blur-sm">
            <span className={`size-1.5 rounded-full ${estado.punto}`} aria-hidden="true" />
            <span className={estado.clase}>{estado.texto}</span>
          </span>
        )}
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex items-center gap-2.5">
          <span className="bisel shrink-0">
            <span
              className={`block px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider ${
                vehiculo.esNuevo
                  ? "bg-primary text-primary-content"
                  : "bg-base-content/12 text-base-content/75"
              }`}
            >
              {vehiculo.esNuevo ? "0 km" : `Usado ${vehiculo.anio}`}
            </span>
          </span>
          <h3 className="display-recto min-w-0 truncate text-sm tracking-wide text-base-content/70">
            {vehiculo.tituloLargo}
          </h3>
        </div>

        <div className="mt-3 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="cifra text-2xl font-bold leading-none text-base-content">
              {enDolares(vehiculo.precio)}
            </p>
            <p className="cifra mt-1.5 truncate text-xs text-base-content/45">
              {kilometrajeDe(vehiculo)}
              {vehiculo.financiado && " · Financiado"}
            </p>
          </div>

          <span
            className="display shrink-0 text-xs text-primary transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden="true"
          >
            Ver ficha →
          </span>
        </div>
      </div>
    </Link>
  );
}

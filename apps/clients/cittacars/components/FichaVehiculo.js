import Link from "next/link";
import FotoVehiculo from "@/components/FotoVehiculo";
import { enDolares, enKilometros } from "@/libs/formato";
import { ESTADOS } from "@/libs/vehiculos";

/**
 * La tarjeta del listado.
 *
 * Enseña solo lo que decide si merece la pena entrar: foto, qué es, año,
 * kilometraje y precio. Todo lo demás está en la ficha.
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
      className={`ficha group block overflow-hidden ${vendido ? "opacity-65" : ""}`}
    >
      <div className="relative">
        <FotoVehiculo
          vehiculo={vehiculo}
          prioridad={prioridad}
          className="aspect-4/3 w-full"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-lg bg-base-100/85 px-2.5 py-1 text-[0.7rem] font-medium backdrop-blur-sm">
          <span className={`size-1.5 rounded-full ${estado.punto}`} aria-hidden="true" />
          <span className={estado.clase}>{estado.texto}</span>
        </span>

        <span className="cifra absolute right-3 top-3 rounded-lg bg-base-content/90 px-2.5 py-1 text-[0.7rem] font-semibold text-base-100">
          {vehiculo.anio}
        </span>
      </div>

      <div className="p-5">
        <h3 className="display text-base leading-tight text-base-content">
          {vehiculo.marca} {vehiculo.modelo}
        </h3>
        {vehiculo.version && (
          <p className="mt-1 truncate text-sm text-base-content/55">{vehiculo.version}</p>
        )}

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="cifra text-xl font-bold text-base-content">
              {enDolares(vehiculo.precio)}
            </p>
            <p className="cifra mt-0.5 text-xs text-base-content/45">
              {enKilometros(vehiculo.km)}
            </p>
          </div>

          <span className="text-xs font-semibold uppercase tracking-wider text-primary transition-transform group-hover:translate-x-0.5">
            Ver ficha →
          </span>
        </div>
      </div>
    </Link>
  );
}

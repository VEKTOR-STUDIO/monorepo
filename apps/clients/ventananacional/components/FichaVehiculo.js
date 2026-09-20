import Link from "next/link";
import FotoVehiculo from "@/components/FotoVehiculo";
import { enDolares, enKilometros } from "@/libs/formato";
import { ESTADOS } from "@/libs/vehiculos";

/**
 * La tarjeta del listado.
 *
 * Enseña solo lo que decide si merece la pena entrar: foto, qué es, año,
 * kilometraje, en qué sala está y precio. Todo lo demás está en la ficha.
 *
 * Las etiquetas van sobre la foto en cristal —no en cajas opacas— para que la
 * imagen se siga viendo por debajo, que es lo que se vino a mirar.
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
      className={`ficha group block ${vendido ? "opacity-60" : ""}`}
    >
      <div className="relative">
        <FotoVehiculo
          vehiculo={vehiculo}
          prioridad={prioridad}
          className="aspect-4/3 w-full"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        <span className="vidrio-denso absolute left-3 top-3 flex items-center gap-1.5 rounded-xl border border-white/15 px-2.5 py-1 text-[0.7rem] font-medium backdrop-blur-md">
          <span className={`size-1.5 rounded-full ${estado.punto}`} aria-hidden="true" />
          <span className={estado.clase}>{estado.texto}</span>
        </span>

        <span className="cifra vidrio-denso absolute right-3 top-3 rounded-xl border border-white/15 px-2.5 py-1 text-[0.7rem] font-semibold text-base-content backdrop-blur-md">
          {vehiculo.anio}
        </span>

        {vehiculo.origen === "Importado" && (
          <span className="cifra absolute bottom-3 left-3 rounded-xl bg-secondary/85 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-secondary-content backdrop-blur-md">
            Importado
          </span>
        )}
      </div>

      <div className="p-5">
        <h3 className="display text-base leading-tight">
          {vehiculo.marca} {vehiculo.modelo}
        </h3>
        {vehiculo.version && (
          <p className="mt-1 truncate text-sm text-base-content/55">{vehiculo.version}</p>
        )}

        <p className="cifra mt-2 text-[0.7rem] uppercase tracking-wider text-base-content/40">
          {vehiculo.ubicacion}
        </p>

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

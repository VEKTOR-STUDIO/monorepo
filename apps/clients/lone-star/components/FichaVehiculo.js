import Link from "next/link";
import FotoVehiculo from "@/components/FotoVehiculo";
import { enDolares, millajeDe } from "@/libs/formato";
import { ESTADOS } from "@/libs/vehiculos";

/**
 * La tarjeta del inventario.
 *
 * Arriba la foto —la suya cuando la haya, y mientras tanto la plantilla de su
 * pieza de la Tacoma, que ya lleva el modelo y los datos escritos—. Debajo, lo
 * que se compara: si está en subasta o es a pedido, el modelo, el precio con
 * su etiqueta ("puja estimada" o "desde", que no son lo mismo) y las millas.
 *
 * La unidad vendida se atenúa pero sigue en su sitio: en este negocio, enseñar
 * lo que ya se exportó es parte del argumento de venta.
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
            unidad esté reservada o vendida cambia la decisión de quien mira. */}
        {vehiculo.estado !== "disponible" && (
          <span className="absolute right-3 top-3 flex items-center gap-1.5 bg-base-100/85 px-2.5 py-1 text-[0.7rem] font-medium backdrop-blur-sm">
            <span className={`size-1.5 rounded-full ${estado.punto}`} aria-hidden="true" />
            <span className={estado.clase}>{estado.texto}</span>
          </span>
        )}
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <span
            className={`shrink-0 px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider ${
              vehiculo.enSubasta ? "pastilla" : "pastilla pastilla-apagada"
            }`}
          >
            {vehiculo.enSubasta ? `Subasta ${vehiculo.anioTexto}` : "A pedido"}
          </span>
          <h3 className="display-recto min-w-0 truncate text-sm tracking-wide text-base-content/70">
            {vehiculo.tituloLargo}
          </h3>
        </div>

        <div className="mt-3 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[0.6rem] uppercase tracking-wider text-base-content/40">
              {vehiculo.segmentoInfo.etiquetaPrecio}
            </p>
            <p className="cifra mt-0.5 text-2xl font-bold leading-none text-base-content">
              {enDolares(vehiculo.precio)}
            </p>
            <p className="cifra mt-1.5 truncate text-xs text-base-content/45">
              {millajeDe(vehiculo)}
              {vehiculo.corre && " · Run & Drive"}
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

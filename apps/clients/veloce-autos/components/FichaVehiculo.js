import Link from "next/link";
import FotoVehiculo, { SelloMuestra } from "@/components/FotoVehiculo";
import { enDolares, kilometrajeDe } from "@/libs/formato";
import { ESTADOS } from "@/libs/vehiculos";

/**
 * La tarjeta del inventario.
 *
 * Lleva encima los dos datos que de verdad deciden si alguien escribe o no, y
 * que en una web de concesionario normal no están: DE DÓNDE viene la unidad y
 * SI ESTÁ AQUÍ. En Veloce esas dos cosas son el negocio —"Importación Directa
 * • Dubái | Europa | China | USA" es literalmente su primera línea de bio—, y
 * un comprador que ve "Dubái · a pedido" ya sabe que no va a venir mañana a
 * buscarlo.
 *
 * El resto se queda debajo, sobre el fondo de la tarjeta: modelo, precio y
 * kilometraje. Sobre la imagen solo va lo que cambia la decisión de un
 * vistazo, que es el estado de la unidad y, mientras dure la demo, el sello de
 * que es un ejemplo.
 *
 * El vehículo vendido se atenúa pero sigue en su sitio: en este negocio,
 * enseñar lo que ya se colocó es parte del argumento de venta.
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
          className="aspect-4/3 w-full"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Arriba a la izquierda, la procedencia: es la marca de la casa. */}
        {vehiculo.origenInfo && (
          <span className="cifra absolute left-3 top-3 bg-base-100/85 px-2 py-1 text-[0.6rem] uppercase tracking-wider text-base-content/75 backdrop-blur-sm">
            {vehiculo.origenInfo.nombre}
          </span>
        )}

        {/* Arriba a la derecha, lo que cambia la decisión y no puede esperar a
            la letra pequeña: reservado, vendido o "es un ejemplo". */}
        <div className="absolute right-3 top-3 flex flex-col items-end gap-1.5">
          {vehiculo.estado !== "disponible" && (
            <span className="flex items-center gap-1.5 bg-base-100/85 px-2.5 py-1 text-[0.7rem] font-medium backdrop-blur-sm">
              <span className={`size-1.5 rounded-full ${estado.punto}`} aria-hidden="true" />
              <span className={estado.clase}>{estado.texto}</span>
            </span>
          )}
          {vehiculo.muestra && <SelloMuestra />}
        </div>

        {/* Abajo, cruzando la foto: si está aquí o si hay que traerlo. */}
        <span
          className={`absolute bottom-0 left-0 px-3 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.18em] ${
            vehiculo.enShowroom
              ? "bg-primary text-primary-content"
              : "bg-base-100/85 text-base-content/75 backdrop-blur-sm"
          }`}
        >
          {vehiculo.entregaInfo.corto}
        </span>
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex items-center gap-2.5">
          <span className="cifra shrink-0 text-[0.65rem] text-base-content/45">
            {vehiculo.anio}
          </span>
          <h3 className="display-recto min-w-0 truncate text-sm text-base-content/75">
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
              {vehiculo.sedeInfo && ` · ${vehiculo.sedeInfo.corto}`}
            </p>
          </div>

          <span
            className="display shrink-0 text-xs text-base-content/70 transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden="true"
          >
            Ver ficha →
          </span>
        </div>
      </div>
    </Link>
  );
}

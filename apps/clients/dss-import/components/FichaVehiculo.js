import Link from "next/link";
import FotoVehiculo from "@/components/FotoVehiculo";
import { enDolares, enCuota } from "@/libs/formato";
import { ESTADOS } from "@/libs/catalogo";

/**
 * La tarjeta del catálogo.
 *
 * LA CUOTA ES LA CIFRA GRANDE, y el precio de contado va debajo en gris. No es
 * una preferencia de maquetación: es el negocio. DSS no vende carros al
 * contado, vende planes de crédito, y quien entra aquí no se pregunta "¿cuánto
 * cuesta?" sino "¿cuánto pago por semana?". Poner el precio total arriba
 * convertiría la página en la de un concesionario y espantaría justo a quien
 * viene a financiar.
 *
 * La imagen es una publicación de DSS —la suya cuando la haya, y mientras tanto
 * la plantilla dibujada— y ya lleva el modelo, el año y la cuota escritos
 * encima, así que la tarjeta no los repite por gusto: el nombre se escribe
 * igualmente porque una imagen no la lee ni Google ni un lector de pantalla.
 *
 * Nada se le superpone a la imagen salvo el estado. Sus publicaciones tienen
 * las cuatro esquinas ocupadas —rótulo arriba, titular en medio, pastilla
 * abajo—, así que lo que se añada va fuera.
 *
 * La unidad entregada se atenúa pero sigue en su sitio: en este negocio,
 * enseñar lo que ya se entregó es parte del argumento de venta —prueba que el
 * crédito llega hasta el final—.
 */
export default function FichaVehiculo({ vehiculo, prioridad = false }) {
  const estado = ESTADOS[vehiculo.estado] || ESTADOS.disponible;
  const entregado = vehiculo.estado === "entregado";
  const cuota = enCuota(vehiculo.cuota);

  return (
    <Link
      href={`/unidad/${vehiculo.slug}`}
      className={`ficha group block overflow-hidden ${entregado ? "opacity-60" : ""}`}
    >
      <div className="relative">
        <FotoVehiculo
          vehiculo={vehiculo}
          prioridad={prioridad}
          className="aspect-4/5 w-full"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Lo único que sí se superpone, y solo cuando hace falta: que una
            unidad esté reservada o entregada cambia la decisión de quien mira y
            no puede esperar a leerse la letra pequeña. */}
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
              vehiculo.esNuevo ? "pastilla" : "pastilla pastilla-apagada"
            }`}
          >
            {vehiculo.esNuevo ? `${vehiculo.anio} · 0 km` : `Usado ${vehiculo.anio}`}
          </span>
          {vehiculo.esMoto && (
            <span className="rotulo shrink-0 text-[0.55rem] tracking-[0.2em] text-base-content/45">
              Moto
            </span>
          )}
          <h3 className="display-recto min-w-0 truncate text-sm tracking-wide text-base-content/70">
            {vehiculo.tituloLargo}
          </h3>
        </div>

        <div className="mt-3 flex items-end justify-between gap-3">
          <div className="min-w-0">
            {/* La cuota, que es a lo que se viene. */}
            <p className="flex items-baseline gap-1.5">
              <span className="cuota text-2xl leading-none">{cuota.cifra}</span>
              <span className="cuota-periodo text-[0.7rem]">{cuota.periodo}</span>
            </p>
            {/* El contado, en pequeño y sin competir. Se dice "de contado"
                explícitamente para que nadie confunda las dos cifras. */}
            <p className="cifra mt-1.5 truncate text-xs text-base-content/45">
              {enDolares(vehiculo.precio)} de contado
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

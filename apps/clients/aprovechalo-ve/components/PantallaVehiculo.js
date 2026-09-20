import Link from "next/link";
import FotoVehiculo from "@/components/FotoVehiculo";
import BotonContacto from "@/components/BotonContacto";
import { enDolares, enKilometros } from "@/libs/formato";

/**
 * Una pantalla del escaparate de la portada.
 *
 * Un vehículo por pantalla completa: el nombre arriba, la foto ocupando el
 * centro y los botones abajo. Sin cajas, sin bordes y con una sola cosa que
 * mirar. El encaje al hacer scroll lo da la clase .pantalla de globals.css.
 *
 * `tono="oscuro"` alterna el fondo para que diez pantallas seguidas no se
 * conviertan en una sola mancha blanca.
 */
export default function PantallaVehiculo({
  vehiculo,
  tono = "claro",
  prioridad = false,
  demo = false,
}) {
  const oscuro = tono === "oscuro";

  return (
    <section
      className={`pantalla ${oscuro ? "bg-base-content text-base-100" : "bg-base-100"}`}
    >
      {/* Encabezado: qué es y cuánto cuesta. */}
      <div className="relative z-10 px-4 pt-14 text-center sm:pt-20">
        <p className={`cifra text-xs tracking-[0.22em] uppercase ${oscuro ? "text-base-100/55" : "text-base-content/45"}`}>
          {vehiculo.anio} · {vehiculo.tipo.nombre} · {vehiculo.ubicacion}
        </p>

        <h2 className={`display-fino mt-3 text-4xl sm:text-5xl lg:text-6xl ${oscuro ? "text-base-100" : "text-base-content"}`}>
          {vehiculo.marca} {vehiculo.modelo}
        </h2>

        <p className={`mt-3 text-sm sm:text-base ${oscuro ? "text-base-100/65" : "text-base-content/55"}`}>
          {vehiculo.version && `${vehiculo.version} · `}
          {enKilometros(vehiculo.km)} · {vehiculo.motor}
        </p>
      </div>

      {/* La foto, en un rectángulo con su proporción fija y centrado en lo
          que sobre de la pantalla. 3:2 es lo que miden las fotos del catálogo,
          así que el recorte es mínimo y el vehículo se ve entero.

          El tamaño se lo da el aspect-ratio, no el hueco: es el mismo patrón
          que usan la tarjeta del listado y la ficha. A FotoVehiculo no se le
          pasa nunca posicionamiento —ya trae `relative` de fábrica, que es lo
          que necesita la imagen `fill` de dentro— porque las dos utilidades
          pesan igual en Tailwind y ganaría la que la hoja escribe después. */}
      <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
        <FotoVehiculo
          vehiculo={vehiculo}
          tono={tono}
          prioridad={prioridad}
          className="aspect-3/2 w-full max-w-4xl rounded-lg"
          sizes="(max-width: 896px) 100vw, 896px"
        />
      </div>

      {/* Pie: precio y las dos acciones. */}
      <div className="relative z-10 px-4 pb-16 sm:pb-20">
        <p className={`cifra text-center text-3xl font-bold sm:text-4xl ${oscuro ? "text-base-100" : "text-base-content"}`}>
          {enDolares(vehiculo.precio)}
        </p>

        <div className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
          <Link
            href={`/vehiculo/${vehiculo.slug}`}
            className="btn btn-primary flex-1"
          >
            Ver ficha completa
          </Link>
          <BotonContacto
            vehiculo={vehiculo}
            demo={demo}
            className={`btn flex-1 ${oscuro ? "btn-sobre-foto" : "btn-ghost border border-base-content/15"}`}
          />
        </div>
      </div>
    </section>
  );
}

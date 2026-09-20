import Link from "next/link";
import FotoVehiculo from "@/components/FotoVehiculo";
import BotonContacto from "@/components/BotonContacto";
import { enDolares, enKilometros } from "@/libs/formato";

/**
 * Un vehículo del escaparate de la portada.
 *
 * El nombre arriba, la foto en un rectángulo 3:2 dentro de un marco de cristal
 * y, debajo, el precio y las dos acciones sobre un panel translúcido. Una sola
 * cosa que mirar por sección.
 *
 * Antes cada uno ocupaba una pantalla entera (.pantalla, 100svh, con encaje al
 * hacer scroll). Se quitó porque obligaba a meter título, foto, precio y dos
 * botones dentro del alto de la ventana, y en un portátil eso dejaba la foto en
 * poco más de 300px de ancho. Ahora la sección mide lo que mida su contenido y
 * la foto va siempre a su tamaño, que es lo que se vino a enseñar.
 *
 * `tono="hondo"` hunde el fondo un paso para que varios seguidos no se
 * conviertan en una sola mancha.
 */
export default function PantallaVehiculo({
  vehiculo,
  tono = "claro",
  prioridad = false,
  demo = false,
}) {
  const hondo = tono === "hondo";

  return (
    <section
      className={`relative overflow-hidden border-t border-white/8 px-4 py-20 sm:px-6 sm:py-24 ${
        hondo ? "bg-base-200/45" : ""
      }`}
    >
      <div className="textura absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto max-w-4xl">
        {/* Encabezado: qué es. */}
        <div className="text-center">
          <p className="cifra text-xs uppercase tracking-[0.22em] text-primary">
            {vehiculo.anio} · {vehiculo.tipo.nombre} · {vehiculo.ubicacion}
          </p>

          <h2 className="display-fino mt-3 text-4xl sm:text-5xl lg:text-6xl">
            {vehiculo.marca} {vehiculo.modelo}
          </h2>

          <p className="mt-3 text-sm text-base-content/55 sm:text-base">
            {vehiculo.version && `${vehiculo.version} · `}
            {enKilometros(vehiculo.km)} · {vehiculo.motor}
          </p>
        </div>

        {/* La foto: rectángulo 3:2, que es el formato de las del catálogo, así
            que apenas hay que recortar para encajarla. El marco de cristal va
            fuera y no en el propio cuadro, porque a FotoVehiculo no se le pasa
            nunca posicionamiento: ya trae `relative` de fábrica —lo necesita la
            imagen `fill` de dentro— y las dos utilidades pesan igual en
            Tailwind, así que ganaría la que la hoja escribe después. */}
        <div className="vidrio mt-10 overflow-hidden p-1.5">
          <FotoVehiculo
            vehiculo={vehiculo}
            tono={hondo ? "hondo" : "claro"}
            prioridad={prioridad}
            className="aspect-3/2 w-full rounded-[0.7rem]"
            sizes="(max-width: 896px) 100vw, 896px"
          />
        </div>

        {/* Pie: precio y las dos acciones. */}
        <div className="mt-8">
          <p className="cifra text-center text-3xl font-bold sm:text-4xl">
            {enDolares(vehiculo.precio)}
          </p>

          <div className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
            <Link href={`/vehiculo/${vehiculo.slug}`} className="btn btn-primary flex-1">
              Ver ficha completa
            </Link>
            <BotonContacto
              vehiculo={vehiculo}
              demo={demo}
              className="btn btn-vidrio flex-1"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

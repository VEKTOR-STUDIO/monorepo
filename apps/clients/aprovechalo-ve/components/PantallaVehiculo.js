import Link from "next/link";
import FotoVehiculo from "@/components/FotoVehiculo";
import BotonContacto from "@/components/BotonContacto";
import { enDolares, enKilometros } from "@/libs/formato";

/**
 * Un vehículo del escaparate de la portada.
 *
 * El nombre arriba, la foto en un rectángulo 3:2 y los botones abajo. Sin
 * cajas, sin bordes y con una sola cosa que mirar.
 *
 * Antes cada uno ocupaba una pantalla entera (.pantalla, 100svh, con encaje al
 * hacer scroll). Se quitó porque obligaba a meter título, foto, precio y dos
 * botones dentro del alto de la ventana, y en un portátil eso dejaba la foto en
 * poco más de 300px de ancho. Ahora la sección mide lo que mida su contenido y
 * la foto va siempre a su tamaño, que es lo que se vino a enseñar.
 *
 * `tono="oscuro"` alterna el fondo para que varios seguidos no se conviertan en
 * una sola mancha blanca.
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
      className={`px-4 py-24 sm:px-6 ${oscuro ? "bg-base-content text-base-100" : "bg-base-100"}`}
    >
      <div className="mx-auto max-w-4xl">
        {/* Encabezado: qué es. */}
        <div className="text-center">
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

        {/* La foto: rectángulo 3:2, que es el formato de las del catálogo, así
            que apenas hay que recortar para encajarla.

            A FotoVehiculo no se le pasa nunca posicionamiento: ya trae
            `relative` de fábrica —lo necesita la imagen `fill` de dentro— y las
            dos utilidades pesan igual en Tailwind, así que ganaría la que la
            hoja escribe después, no la que se pasara aquí. */}
        <FotoVehiculo
          vehiculo={vehiculo}
          tono={tono}
          prioridad={prioridad}
          className="mt-10 aspect-3/2 w-full rounded-lg"
          sizes="(max-width: 896px) 100vw, 896px"
        />

        {/* Pie: precio y las dos acciones. */}
        <div className="mt-10">
          <p className={`cifra text-center text-3xl font-bold sm:text-4xl ${oscuro ? "text-base-100" : "text-base-content"}`}>
            {enDolares(vehiculo.precio)}
          </p>

          {/* Sobre fondo oscuro los botones se invierten. El color principal
              del tema es casi negro, así que un btn-primary sobre la sección
              oscura desaparecía: el botón que manda pasa a ser el claro, y el
              secundario se queda en un contorno. */}
          <div className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
            <Link
              href={`/vehiculo/${vehiculo.slug}`}
              className={`btn flex-1 ${
                oscuro
                  ? "bg-base-100 text-base-content hover:bg-base-100/90"
                  : "btn-primary"
              }`}
            >
              Ver ficha completa
            </Link>
            <BotonContacto
              vehiculo={vehiculo}
              demo={demo}
              className={`btn btn-ghost flex-1 ${
                oscuro
                  ? "border border-base-100/25 text-base-100 hover:bg-base-100/10"
                  : "border border-base-content/15"
              }`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

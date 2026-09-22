import Link from "next/link";
import FotoVehiculo from "@/components/FotoVehiculo";
import BotonContacto from "@/components/BotonContacto";
import Escenario from "@/components/Escenario";
import TituloAnimado from "@/components/TituloAnimado";
import Revelar from "@/components/Revelar";
import Parallax from "@/components/Parallax";
import { enDolares, millajeDe } from "@/libs/formato";

/**
 * Una unidad del escaparate de la portada.
 *
 * Está montada como su pieza de la Tacoma puesta de lado: el modelo grande en
 * itálica a un lado, la imagen al otro, y la noche roja y las bandas de la
 * casa cruzando por detrás. El año va enorme y translúcido detrás del titular, que
 * es el truco de cartel de toda la vida y aquí además informa.
 *
 * `invertido` alterna de qué lado va la foto para que cuatro seguidos no se
 * lean como cuatro veces la misma pantalla.
 *
 * Antes cada uno ocupaba una pantalla entera con encaje al hacer scroll. Se
 * quitó porque obligaba a meter título, foto, precio y dos botones dentro del
 * alto de la ventana, y en un portátil eso dejaba la foto en poco más de
 * 300 px. Ahora la sección mide lo que mida su contenido.
 */
export default function PantallaVehiculo({
  vehiculo,
  invertido = false,
  prioridad = false,
  demo = false,
}) {
  return (
    <section className="relative overflow-hidden border-t border-base-content/8 px-4 py-20 sm:px-6 sm:py-28">
      <Escenario variante={invertido ? "sutil" : "seccion"} />
      <div className="textura absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {/* ---------------- La foto ---------------- */}
        <Revelar desde="corte" className={invertido ? "lg:order-2" : ""}>
          <Parallax desde={-5} hasta={5}>
            {/* Sus fotos son de patio de subasta, apaisadas; la plantilla
                dibujada es vertical, como sus piezas. */}
            <FotoVehiculo
              vehiculo={vehiculo}
              prioridad={prioridad}
              className={`${vehiculo.fotos?.length ? "aspect-4/3" : "aspect-4/5"} w-full`}
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
          </Parallax>
        </Revelar>

        {/* ---------------- Lo que dice ---------------- */}
        <div className="relative">
          {/* El año, enorme y al fondo. Decorativo: el dato de verdad está
              escrito abajo, en la línea de especificaciones. */}
          <span
            className="display pointer-events-none absolute -top-10 left-0 select-none text-[8rem] leading-none text-base-content/5 sm:text-[11rem] lg:-top-16"
            aria-hidden="true"
          >
            {vehiculo.anio || ""}
          </span>

          <div className="relative">
            <Revelar>
              <span className="bisel">
                <span
                  className={`block px-3 py-1 text-[0.7rem] font-bold uppercase tracking-wider ${
                    vehiculo.enSubasta
                      ? "bg-primary text-primary-content"
                      : "bg-base-content/12 text-base-content"
                  }`}
                >
                  {vehiculo.enSubasta
                    ? `Unidad disponible en subasta${vehiculo.corre ? " · Run & Drive" : ""}`
                    : "A pedido · la buscamos por ti"}
                </span>
              </span>
            </Revelar>

            <TituloAnimado
              as="h2"
              retraso={120}
              className="display mt-5 text-5xl text-base-content sm:text-6xl lg:text-7xl"
            >
              {vehiculo.marca}
              <br />
              <span className="text-primary">
                {[vehiculo.modelo, vehiculo.version].filter(Boolean).join(" ")}
              </span>
            </TituloAnimado>

            <Revelar retraso={180}>
              <p className="cifra mt-5 text-sm text-base-content/50">
                {[
                  vehiculo.anioTexto,
                  vehiculo.enSubasta && millajeDe(vehiculo),
                  vehiculo.danio && `Daño ${vehiculo.danio}`,
                  vehiculo.motor,
                  vehiculo.traccion,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </Revelar>

            <Revelar retraso={240}>
              <p className="mt-6 max-w-md leading-relaxed text-base-content/65">
                {vehiculo.descripcion}
              </p>
            </Revelar>

            <Revelar retraso={300}>
              <div className="mt-9">
                <p className="text-[0.7rem] uppercase tracking-wider text-base-content/45">
                  {vehiculo.segmentoInfo.etiquetaPrecio}
                </p>
                <p className="cifra mt-1 text-4xl font-bold leading-none text-primary sm:text-5xl">
                  {enDolares(vehiculo.precio)}
                </p>
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link href={`/vehiculo/${vehiculo.slug}`} className="btn btn-primary flex-1">
                  Ver ficha completa
                </Link>
                <BotonContacto vehiculo={vehiculo} demo={demo} className="btn btn-filo flex-1" />
              </div>
            </Revelar>
          </div>
        </div>
      </div>
    </section>
  );
}

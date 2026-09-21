import Link from "next/link";
import FotoVehiculo from "@/components/FotoVehiculo";
import BotonContacto from "@/components/BotonContacto";
import Escenario from "@/components/Escenario";
import TituloAnimado from "@/components/TituloAnimado";
import Revelar from "@/components/Revelar";
import Parallax from "@/components/Parallax";
import { enDolares, enCuota, kilometrajeDe } from "@/libs/formato";

/**
 * Una unidad del escaparate de la portada.
 *
 * Está montada como una publicación suya puesta de lado: el modelo grande en
 * itálica a un lado, la imagen al otro, y el cielo y las vetas de oro de la
 * casa cruzando por detrás. El año va enorme y translúcido detrás del titular,
 * que es el truco de cartel de toda la vida y aquí además informa.
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
            <FotoVehiculo
              vehiculo={vehiculo}
              prioridad={prioridad}
              className="aspect-4/5 w-full"
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
            {vehiculo.anio}
          </span>

          <div className="relative">
            <Revelar>
              <span className="bisel">
                <span
                  className={`block px-3 py-1 text-[0.7rem] font-bold uppercase tracking-wider ${
                    vehiculo.esNuevo
                      ? "bg-primary text-primary-content"
                      : "bg-base-content/12 text-base-content"
                  }`}
                >
                  {vehiculo.esNuevo ? "0 km · sin rodar" : "Usado y revisado"}
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
              <span className="text-primary">{vehiculo.modelo}</span>
            </TituloAnimado>

            <Revelar retraso={180}>
              <p className="cifra mt-5 text-sm text-base-content/50">
                {[
                  vehiculo.version,
                  kilometrajeDe(vehiculo),
                  vehiculo.motor,
                  vehiculo.transmision,
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
              {/* La cuota manda; el contado va debajo y en gris. Es la misma
                  jerarquía de sus publicaciones y la de toda la página. */}
              <div className="mt-9">
                <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="cuota text-4xl leading-none sm:text-5xl">
                    {enCuota(vehiculo.cuota).cifra}
                  </span>
                  <span className="cuota-periodo text-base">
                    {enCuota(vehiculo.cuota).periodo}
                  </span>
                </p>
                <p className="cifra mt-2.5 text-sm text-base-content/45">
                  {enDolares(vehiculo.precio)} de contado · {vehiculo.cuota.inicialPct}% de
                  inicial · hasta {Math.round(vehiculo.cuota.plazoMeses / 12)} años
                </p>
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link href={`/unidad/${vehiculo.slug}`} className="btn btn-primary flex-1">
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

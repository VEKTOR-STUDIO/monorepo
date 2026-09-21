import Link from "next/link";
import FotoVehiculo from "@/components/FotoVehiculo";
import BotonContacto from "@/components/BotonContacto";
import Escenario from "@/components/Escenario";
import TituloAnimado from "@/components/TituloAnimado";
import Revelar from "@/components/Revelar";
import Parallax from "@/components/Parallax";
import { enDolares, kilometrajeDe } from "@/libs/formato";

/**
 * Una unidad del escaparate de la portada.
 *
 * Está montada como su logotipo puesto de lado: el modelo grande con el filete
 * y la sombra de sus letras a un lado, la imagen al otro, y el escudo de acero
 * cruzando por detrás. El año va enorme y translúcido detrás del titular, que
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
    <section
      className={`relative overflow-hidden border-t border-base-content/8 px-4 py-20 sm:px-6 sm:py-28 ${
        invertido ? "bg-base-200" : ""
      }`}
    >
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
            className="display pointer-events-none absolute -top-10 left-0 select-none text-[6.5rem] leading-none text-primary/6 sm:text-[9rem] lg:-top-16"
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
                      : "bg-base-content/10 text-base-content"
                  }`}
                >
                  {vehiculo.esNuevo ? "0 km · sin rodar" : `Usado · ${vehiculo.anio}`}
                </span>
              </span>
            </Revelar>

            <TituloAnimado
              as="h2"
              retraso={120}
              className="display mt-6 text-4xl leading-[1.12] sm:text-5xl lg:text-6xl"
            >
              <span className="rotulo-marca">{vehiculo.marca}</span>
              <br />
              <span className="rotulo-marca-inverso">{vehiculo.modelo}</span>
            </TituloAnimado>

            <Revelar retraso={180}>
              <p className="cifra mt-6 text-sm text-base-content/60">
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
              <p className="mt-6 max-w-md leading-relaxed text-base-content/70">
                {vehiculo.descripcion}
              </p>
            </Revelar>

            <Revelar retraso={300}>
              <div className="mt-9 flex flex-wrap items-end gap-x-6 gap-y-2">
                <p className="display text-4xl leading-none text-primary sm:text-5xl">
                  {enDolares(vehiculo.precio)}
                </p>
                <p className="text-sm text-base-content/60">
                  {vehiculo.deMuestra ? "Unidad de ejemplo · precio de referencia" : vehiculo.ubicacion}
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link href={`/vehiculo/${vehiculo.slug}`} className="btn btn-primary sm:flex-1">
                  Ver ficha completa
                </Link>
                <BotonContacto vehiculo={vehiculo} demo={demo} className="btn btn-filo sm:flex-1" />
              </div>
            </Revelar>
          </div>
        </div>
      </div>
    </section>
  );
}

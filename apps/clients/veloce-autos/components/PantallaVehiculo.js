import Link from "next/link";
import FotoVehiculo, { AvisoMuestra } from "@/components/FotoVehiculo";
import BotonContacto from "@/components/BotonContacto";
import Alas from "@/components/Alas";
import TituloAnimado from "@/components/TituloAnimado";
import Revelar from "@/components/Revelar";
import Parallax from "@/components/Parallax";
import { enDolares, kilometrajeDe } from "@/libs/formato";

/**
 * Una unidad del escaparate de la portada.
 *
 * Está montada como una ficha de showroom: el modelo enorme a un lado, la
 * unidad al otro y las alas de la casa cruzando por detrás. El año va grande y
 * translúcido detrás del titular, que es el truco de cartel de toda la vida y
 * aquí además informa.
 *
 * `invertido` alterna de qué lado va la unidad para que cuatro seguidas no se
 * lean como cuatro veces la misma pantalla.
 *
 * Antes cada una ocupaba una pantalla entera con encaje al hacer scroll. Se
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
      <Alas variante={invertido ? "sutil" : "seccion"} />
      <div className="textura absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {/* ---------------- La unidad ---------------- */}
        <Revelar desde="corte" className={invertido ? "lg:order-2" : ""}>
          <Parallax desde={-5} hasta={5}>
            <FotoVehiculo
              vehiculo={vehiculo}
              prioridad={prioridad}
              className="aspect-4/3 w-full"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
          </Parallax>
        </Revelar>

        {/* ---------------- Lo que dice ---------------- */}
        <div className="relative">
          {/* El año, enorme y al fondo. Decorativo: el dato de verdad está
              escrito abajo, en la línea de especificaciones. */}
          <span
            className="display pointer-events-none absolute -top-10 left-0 select-none text-[7rem] leading-none text-base-content/5 sm:text-[10rem] lg:-top-16"
            aria-hidden="true"
          >
            {vehiculo.anio}
          </span>

          <div className="relative">
            <Revelar>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] ${
                    vehiculo.enShowroom
                      ? "bg-primary text-primary-content"
                      : "border border-base-content/25 text-base-content/80"
                  }`}
                >
                  {vehiculo.entregaInfo.nombre}
                </span>
                {vehiculo.origenInfo && (
                  <span className="cifra border border-base-content/15 px-3 py-1 text-[0.65rem] uppercase tracking-wider text-base-content/60">
                    {vehiculo.origenInfo.nombre}
                  </span>
                )}
                <span className="cifra border border-base-content/15 px-3 py-1 text-[0.65rem] uppercase tracking-wider text-base-content/60">
                  {vehiculo.esNuevo ? "0 km" : "Usado"}
                </span>
              </div>
            </Revelar>

            <TituloAnimado
              as="h2"
              retraso={120}
              className="display mt-6 text-4xl text-base-content sm:text-5xl lg:text-6xl"
            >
              {vehiculo.marca}
              <br />
              <span className="text-base-content/55">{vehiculo.modelo}</span>
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
              <div className="mt-9 flex flex-wrap items-end gap-x-6 gap-y-2">
                <p className="cifra text-4xl font-bold leading-none text-base-content sm:text-5xl">
                  {enDolares(vehiculo.precio)}
                </p>
                {vehiculo.sedeInfo && (
                  <p className="text-sm text-base-content/55">{vehiculo.sedeInfo.nombre}</p>
                )}
              </div>

              {vehiculo.muestra && <AvisoMuestra className="mt-5" />}

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

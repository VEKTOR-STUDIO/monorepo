import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FotoVehiculo, { AvisoSinFoto, AvisoPrecioProvisional } from "@/components/FotoVehiculo";
import BotonContacto from "@/components/BotonContacto";
import Especificaciones, { EspecificacionesCompletas } from "@/components/Especificaciones";
import RejillaVehiculos from "@/components/RejillaVehiculos";
import Revelar from "@/components/Revelar";
import TituloAnimado from "@/components/TituloAnimado";
import Diagonales from "@/components/Diagonales";
import AvisoBloqueado from "@/components/demo/AvisoBloqueado";
import BloqueVenta from "@/components/demo/BloqueVenta";
import { leerVehiculos, vehiculoPorSlug, ESTADOS } from "@/libs/vehiculos";
import { obtenerTasa } from "@/libs/bcv";
import { enDolares, enBolivares, aBolivares, kilometrajeDe } from "@/libs/formato";
import { esDemo } from "@/libs/demo";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

export const revalidate = 1800;

/** Una página por vehículo, generada al construir: entra instantánea. */
export function generateStaticParams() {
  return leerVehiculos().map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const vehiculo = vehiculoPorSlug(slug);
  if (!vehiculo) return getSEOTags();

  const condicion = vehiculo.esNuevo ? "0 km" : kilometrajeDe(vehiculo);

  return getSEOTags({
    title: `${vehiculo.tituloLargo} ${vehiculo.anio} | ${config.appName}`,
    description: `${vehiculo.tituloLargo} ${vehiculo.anio}, ${condicion}, ${vehiculo.motor}. ${enDolares(vehiculo.precio)} en ${config.business.ciudad}.`,
    canonicalUrlRelative: `/vehiculo/${vehiculo.slug}`,
  });
}

export default async function Vehiculo({ params }) {
  const { slug } = await params;
  const vehiculo = vehiculoPorSlug(slug);
  if (!vehiculo) notFound();

  // La tasa es un extra: si la API no responde, se enseña el precio en dólares
  // y ya está. Nunca debe tumbar la página.
  const tasa = await obtenerTasa();
  const enBs = aBolivares(vehiculo.precio, tasa?.valor);

  const estado = ESTADOS[vehiculo.estado] || ESTADOS.disponible;
  const demo = esDemo();

  // Parecidos: primero los de la misma carrocería dentro del mismo segmento,
  // que es lo que de verdad ayuda a quien todavía no se ha decidido; si no
  // salen tres, se completa con el resto del segmento.
  //
  // El filtro de segmento no es opcional: ofrecerle un Corolla a quien está
  // mirando un chasis de quince toneladas no es una sugerencia, es ruido.
  const resto = leerVehiculos().filter((v) => v.slug !== vehiculo.slug);
  const mismoSegmento = resto.filter((v) => v.segmento === vehiculo.segmento);
  const parecidos = [
    ...mismoSegmento.filter((v) => v.carroceria === vehiculo.carroceria),
    ...mismoSegmento.filter((v) => v.carroceria !== vehiculo.carroceria),
  ].slice(0, 3);

  return (
    <>
      <Header />

      <main>
        {/* Migas: volver al inventario sin usar el botón del navegador. */}
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
          <Link
            href="/vehiculos"
            className="display-recto text-xs tracking-widest text-base-content/50 transition-colors hover:text-primary"
          >
            ← Volver al inventario
          </Link>
        </div>

        <article className="relative overflow-hidden">
          <Diagonales variante="sutil" />

          <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
              {/* La foto, lo primero y lo más grande. Es su publicación de
                  Instagram entera, así que no se recorta. */}
              <div>
                <Revelar desde="corte">
                  <FotoVehiculo
                    vehiculo={vehiculo}
                    prioridad
                    className="aspect-4/5 w-full"
                    sizes="(max-width: 1024px) 100vw, 55vw"
                  />
                </Revelar>

                {vehiculo.fotos?.length > 1 && (
                  <div className="mt-3 grid grid-cols-4 gap-3">
                    {vehiculo.fotos.slice(1, 5).map((foto) => (
                      <FotoVehiculo
                        key={foto}
                        vehiculo={{ ...vehiculo, fotos: [foto] }}
                        className="aspect-4/5 w-full"
                        sizes="20vw"
                      />
                    ))}
                  </div>
                )}

                {!vehiculo.fotos?.length && (
                  <div className="mt-3 flex justify-center">
                    <AvisoSinFoto />
                  </div>
                )}
              </div>

              {/* La columna de decisión: qué es, cuánto cuesta y cómo se pregunta. */}
              <div className="lg:pt-2">
                <Revelar>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="bisel">
                      <span
                        className={`block px-3 py-1 text-[0.7rem] font-bold uppercase tracking-wider ${
                          vehiculo.esNuevo
                            ? "bg-primary text-primary-content"
                            : "bg-base-content/12 text-base-content"
                        }`}
                      >
                        {vehiculo.condicionInfo.nombre}
                      </span>
                    </span>
                    <span className="flex items-center gap-1.5 text-sm font-medium">
                      <span className={`size-2 rounded-full ${estado.punto}`} aria-hidden="true" />
                      <span className={estado.clase}>{estado.texto}</span>
                    </span>
                    <span className="text-sm text-base-content/50">
                      · {config.business.ciudad}
                    </span>
                  </div>
                </Revelar>

                <TituloAnimado
                  as="h1"
                  retraso={100}
                  className="display mt-5 text-5xl sm:text-6xl"
                >
                  {vehiculo.marca} <span className="text-primary">{vehiculo.modelo}</span>
                </TituloAnimado>

                <Revelar retraso={180}>
                  <p className="cifra mt-4 text-base text-base-content/50">
                    {[vehiculo.anio, vehiculo.version, vehiculo.transmision]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>

                  <div className="mt-8">
                    <p className="cifra text-5xl font-bold leading-none text-primary sm:text-6xl">
                      {enDolares(vehiculo.precio)}
                    </p>
                    {enBs && (
                      <p className="cifra mt-3 text-sm text-base-content/45">
                        ≈ {enBolivares(enBs)} · tasa BCV {tasa.valor.toFixed(2)}
                      </p>
                    )}
                    {vehiculo.financiado && (
                      <p className="mt-2 text-sm text-base-content/60">
                        Con opción de financiamiento
                      </p>
                    )}
                  </div>
                </Revelar>

                <Revelar retraso={240}>
                  <Especificaciones vehiculo={vehiculo} className="mt-8" />
                </Revelar>

                <Revelar retraso={300}>
                  <div className="mt-8">
                    {demo ? (
                      <AvisoBloqueado titulo="El contacto está desactivado en la demo">
                        En la página entregada, este botón abre WhatsApp con el mensaje
                        ya escrito —«me interesa el {vehiculo.tituloLargo} {vehiculo.anio},
                        ¿sigue disponible?»— para que el comprador no tenga que explicar
                        nada y en LM 2006 sepan de entrada por cuál unidad preguntan.
                      </AvisoBloqueado>
                    ) : (
                      <BotonContacto
                        vehiculo={vehiculo}
                        demo={false}
                        className="btn btn-primary btn-lg w-full"
                      >
                        Me interesa esta unidad
                      </BotonContacto>
                    )}
                  </div>

                  {vehiculo.detalles?.length > 0 && (
                    <ul className="mt-8 space-y-3">
                      {vehiculo.detalles.map((detalle) => (
                        <li key={detalle} className="flex gap-3 text-sm leading-snug">
                          <span
                            className="mt-1 h-3 w-2 shrink-0 bg-primary"
                            style={{ transform: "skewX(var(--angulo-lm))" }}
                            aria-hidden="true"
                          />
                          <span className="display-recto tracking-wide text-base-content/80">
                            {detalle}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {vehiculo.precioProvisional && (
                    <div className="mt-7">
                      <AvisoPrecioProvisional />
                    </div>
                  )}
                </Revelar>
              </div>
            </div>

            {/* Debajo del pliegue: el texto largo y la tabla completa. */}
            <div className="mt-20 grid gap-12 border-t border-base-content/10 pt-12 lg:grid-cols-2 lg:gap-20">
              <Revelar>
                <p className="rotulo">Sobre esta unidad</p>
                <p className="mt-5 text-lg leading-relaxed text-base-content/70">
                  {vehiculo.descripcion}
                </p>
                <p className="mt-8 text-sm leading-relaxed text-base-content/45">
                  Se ve y se prueba en {config.business.direccion}, {config.business.ciudad}.
                </p>
              </Revelar>

              <Revelar retraso={120}>
                <p className="rotulo">Ficha técnica</p>
                <EspecificacionesCompletas vehiculo={vehiculo} className="mt-3" />
              </Revelar>
            </div>
          </div>
        </article>

        {parecidos.length > 0 && (
          <section className="relative overflow-hidden border-t border-base-content/8 bg-base-200 px-4 py-20 sm:px-6">
            <div className="textura absolute inset-0" aria-hidden="true" />
            <div className="relative mx-auto max-w-7xl">
              <Revelar>
                <p className="rotulo">También te puede servir</p>
              </Revelar>
              <TituloAnimado as="h2" className="display mt-4 text-3xl sm:text-4xl">
                {vehiculo.esCamion ? "Otros camiones del local" : "Otras unidades del local"}
              </TituloAnimado>
              <RejillaVehiculos vehiculos={parecidos} className="mt-10" />
            </div>
          </section>
        )}

        <BloqueVenta />
      </main>

      <Footer />
    </>
  );
}

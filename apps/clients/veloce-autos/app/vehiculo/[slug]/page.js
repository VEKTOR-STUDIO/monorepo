import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FotoVehiculo, { AvisoSinFoto, AvisoMuestra } from "@/components/FotoVehiculo";
import BotonContacto from "@/components/BotonContacto";
import Especificaciones, { EspecificacionesCompletas } from "@/components/Especificaciones";
import RejillaVehiculos from "@/components/RejillaVehiculos";
import Revelar from "@/components/Revelar";
import TituloAnimado from "@/components/TituloAnimado";
import Alas from "@/components/Alas";
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
  const procedencia = vehiculo.origenInfo ? `importado de ${vehiculo.origenInfo.nombre}` : "importado";

  return getSEOTags({
    title: `${vehiculo.tituloLargo} ${vehiculo.anio} | ${config.appName}`,
    description: `${vehiculo.tituloLargo} ${vehiculo.anio}, ${condicion}, ${procedencia}, ${vehiculo.motor}. ${enDolares(vehiculo.precio)} en ${config.business.ciudad}.`,
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

  // Parecidos: primero la misma carrocería con la misma forma de entrega —que
  // es lo que de verdad ayuda a quien duda entre dos—, y si no salen tres, se
  // completa con el resto de la misma carrocería.
  const resto = leerVehiculos().filter((v) => v.slug !== vehiculo.slug);
  const parecidos = [
    ...resto.filter(
      (v) => v.carroceria === vehiculo.carroceria && v.entrega === vehiculo.entrega
    ),
    ...resto.filter(
      (v) => v.carroceria === vehiculo.carroceria && v.entrega !== vehiculo.entrega
    ),
    ...resto.filter((v) => v.carroceria !== vehiculo.carroceria),
  ].slice(0, 3);

  return (
    <>
      <Header />

      <main>
        {/* Migas: volver al inventario sin usar el botón del navegador. */}
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
          <Link
            href="/vehiculos"
            className="display-recto text-xs text-base-content/50 transition-colors hover:text-base-content"
          >
            ← Volver al inventario
          </Link>
        </div>

        <article className="relative overflow-hidden">
          <Alas variante="sutil" />

          <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
              {/* La unidad, lo primero y lo más grande. */}
              <div>
                <Revelar desde="corte">
                  <FotoVehiculo
                    vehiculo={vehiculo}
                    prioridad
                    className="aspect-4/3 w-full"
                    sizes="(max-width: 1024px) 100vw, 55vw"
                  />
                </Revelar>

                {vehiculo.fotos?.length > 1 && (
                  <div className="mt-3 grid grid-cols-4 gap-3">
                    {vehiculo.fotos.slice(1, 5).map((foto) => (
                      <FotoVehiculo
                        key={foto}
                        vehiculo={{ ...vehiculo, fotos: [foto] }}
                        className="aspect-4/3 w-full"
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
                    <span className="flex items-center gap-1.5 text-sm font-medium">
                      <span className={`size-2 rounded-full ${estado.punto}`} aria-hidden="true" />
                      <span className={estado.clase}>{estado.texto}</span>
                    </span>
                    {vehiculo.sedeInfo && (
                      <span className="text-sm text-base-content/50">
                        · {vehiculo.sedeInfo.corto}
                      </span>
                    )}
                  </div>
                </Revelar>

                <TituloAnimado
                  as="h1"
                  retraso={100}
                  className="display mt-5 text-5xl sm:text-6xl"
                >
                  {vehiculo.marca}{" "}
                  <span className="text-base-content/55">{vehiculo.modelo}</span>
                </TituloAnimado>

                <Revelar retraso={180}>
                  <p className="cifra mt-4 text-base text-base-content/50">
                    {[vehiculo.anio, vehiculo.version, vehiculo.transmision]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>

                  <div className="mt-8">
                    <p className="cifra text-5xl font-bold leading-none text-base-content sm:text-6xl">
                      {enDolares(vehiculo.precio)}
                    </p>
                    {enBs && (
                      <p className="cifra mt-3 text-sm text-base-content/45">
                        ≈ {enBolivares(enBs)} · tasa BCV {tasa.valor.toFixed(2)}
                      </p>
                    )}
                    {!vehiculo.enShowroom && (
                      <p className="mt-2 text-sm text-base-content/60">
                        Precio puesto en Venezuela: flete, nacionalización y documentos
                        incluidos.
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
                        nada y en Veloce sepan de entrada por cuál unidad y por cuál sede
                        preguntan.
                      </AvisoBloqueado>
                    ) : (
                      <BotonContacto
                        vehiculo={vehiculo}
                        demo={false}
                        className="btn btn-primary btn-lg w-full"
                      >
                        Me interesa este vehículo
                      </BotonContacto>
                    )}
                  </div>

                  {vehiculo.detalles?.length > 0 && (
                    <ul className="mt-8 space-y-3">
                      {vehiculo.detalles.map((detalle) => (
                        <li key={detalle} className="flex gap-3 text-sm leading-snug">
                          <span
                            className="mt-1 h-3 w-2 shrink-0 bg-base-content/70"
                            style={{ transform: "skewX(var(--angulo-veloce))" }}
                            aria-hidden="true"
                          />
                          <span className="display-recto text-base-content/80">
                            {detalle}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {vehiculo.muestra && (
                    <div className="mt-7">
                      <AvisoMuestra />
                    </div>
                  )}
                </Revelar>
              </div>
            </div>

            {/* Debajo del pliegue: el texto largo y la tabla completa. */}
            <div className="mt-20 grid gap-12 border-t border-base-content/10 pt-12 lg:grid-cols-2 lg:gap-20">
              <Revelar>
                <p className="rotulo">Sobre este vehículo</p>
                <p className="mt-5 text-lg leading-relaxed text-base-content/70">
                  {vehiculo.descripcion}
                </p>
                <p className="mt-8 text-sm leading-relaxed text-base-content/45">
                  {vehiculo.enShowroom
                    ? `Se ve y se prueba en ${vehiculo.sedeInfo?.direccion || config.business.direccion}, ${config.business.ciudad}.`
                    : `Se encarga a ${vehiculo.origenInfo?.nombre || "origen"} y se entrega en ${vehiculo.sedeInfo?.nombre || "cualquiera de las dos sedes"}, nacionalizado y con sus papeles.`}
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
                Otras {vehiculo.tipo.plural} del inventario
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

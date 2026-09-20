import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FotoVehiculo, { AvisoSinFoto, AvisoFotoStock } from "@/components/FotoVehiculo";
import BotonContacto from "@/components/BotonContacto";
import Especificaciones, { EspecificacionesCompletas } from "@/components/Especificaciones";
import RejillaVehiculos from "@/components/RejillaVehiculos";
import AvisoBloqueado from "@/components/demo/AvisoBloqueado";
import BloqueVenta from "@/components/demo/BloqueVenta";
import { leerVehiculos, vehiculoPorSlug, ESTADOS } from "@/libs/vehiculos";
import { obtenerTasa } from "@/libs/bcv";
import { enDolares, enBolivares, aBolivares } from "@/libs/formato";
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

  return getSEOTags({
    title: `${vehiculo.tituloLargo} ${vehiculo.anio} | ${config.appName}`,
    description: `${vehiculo.tituloLargo} ${vehiculo.anio}, ${vehiculo.km.toLocaleString("es-VE")} km, ${vehiculo.motor}. ${enDolares(vehiculo.precio)} en ${config.business.nombre}.`,
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

  // Parecidos: mismo tipo, distinto vehículo. Es lo que de verdad ayuda a
  // quien todavía no se ha decidido.
  const parecidos = leerVehiculos()
    .filter((v) => v.slug !== vehiculo.slug && v.carroceria === vehiculo.carroceria)
    .slice(0, 3);

  return (
    <>
      <Header />

      <main>
        {/* Migas: volver al inventario sin usar el botón del navegador. */}
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
          <Link
            href="/vehiculos"
            className="text-sm text-base-content/50 transition-colors hover:text-primary"
          >
            ← Volver al inventario
          </Link>
        </div>

        <article className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-14">
            {/* La foto, lo primero y lo más grande. */}
            <div>
              <FotoVehiculo
                vehiculo={vehiculo}
                prioridad
                className="aspect-4/3 w-full rounded-lg"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />

              {vehiculo.fotos?.length > 1 && (
                <div className="mt-3 grid grid-cols-4 gap-3">
                  {vehiculo.fotos.slice(1, 5).map((foto) => (
                    <FotoVehiculo
                      key={foto}
                      vehiculo={{ ...vehiculo, fotos: [foto] }}
                      className="aspect-4/3 w-full rounded-md"
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

              {vehiculo.fotoStock && vehiculo.fotos?.length > 0 && (
                <div className="mt-3 flex justify-center">
                  <AvisoFotoStock />
                </div>
              )}
            </div>

            {/* La columna de decisión: qué es, cuánto cuesta y cómo se pregunta. */}
            <div className="lg:pt-2">
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5 text-sm font-medium">
                  <span className={`size-2 rounded-full ${estado.punto}`} aria-hidden="true" />
                  <span className={estado.clase}>{estado.texto}</span>
                </span>
                <span className="text-sm text-base-content/40">·</span>
                <span className="text-sm text-base-content/55">{vehiculo.ubicacion}</span>
              </div>

              <h1 className="display mt-4 text-4xl sm:text-5xl">
                {vehiculo.marca} {vehiculo.modelo}
              </h1>
              {vehiculo.version && (
                <p className="mt-2 text-lg text-base-content/55">{vehiculo.version}</p>
              )}

              <div className="mt-7">
                <p className="cifra text-4xl font-bold text-base-content sm:text-5xl">
                  {enDolares(vehiculo.precio)}
                </p>
                {enBs && (
                  <p className="cifra mt-2 text-sm text-base-content/45">
                    ≈ {enBolivares(enBs)} · tasa BCV {tasa.valor.toFixed(2)}
                  </p>
                )}
              </div>

              <Especificaciones vehiculo={vehiculo} className="mt-8" />

              <div className="mt-8">
                {demo ? (
                  <AvisoBloqueado titulo="El contacto está desactivado en la demo">
                    En la página entregada, este botón abre WhatsApp con el mensaje
                    ya escrito —«me interesa el {vehiculo.tituloLargo} {vehiculo.anio},
                    ¿sigue disponible?»— para que el comprador no tenga que explicar
                    nada y el vendedor sepa de entrada por cuál vehículo preguntan.
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
                <ul className="mt-8 space-y-2.5">
                  {vehiculo.detalles.map((detalle) => (
                    <li key={detalle} className="flex gap-3 text-sm leading-snug">
                      <span className="mt-0.5 shrink-0 text-primary" aria-hidden="true">
                        ✓
                      </span>
                      <span className="text-base-content/70">{detalle}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Debajo del pliegue: el texto largo y la tabla completa. */}
          <div className="mt-16 grid gap-12 border-t border-base-content/10 pt-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="rotulo">Sobre este vehículo</p>
              <p className="mt-5 leading-relaxed text-base-content/70">
                {vehiculo.descripcion}
              </p>
            </div>

            <div>
              <p className="rotulo">Ficha técnica</p>
              <EspecificacionesCompletas vehiculo={vehiculo} className="mt-3" />
            </div>
          </div>
        </article>

        {parecidos.length > 0 && (
          <section className="border-t border-base-content/10 bg-base-200 px-4 py-20 sm:px-6">
            <div className="mx-auto max-w-7xl">
              <p className="rotulo">También te puede servir</p>
              <h2 className="display mt-4 text-2xl sm:text-3xl">
                Otras {vehiculo.tipo.plural}
              </h2>
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

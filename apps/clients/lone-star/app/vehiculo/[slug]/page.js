import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FotoVehiculo, {
  AvisoSinFoto,
  AvisoPrecioProvisional,
  AvisoDeMuestra,
} from "@/components/FotoVehiculo";
import BotonContacto from "@/components/BotonContacto";
import Especificaciones, { EspecificacionesCompletas } from "@/components/Especificaciones";
import RejillaVehiculos from "@/components/RejillaVehiculos";
import Revelar from "@/components/Revelar";
import TituloAnimado from "@/components/TituloAnimado";
import Escenario from "@/components/Escenario";
import AvisoBloqueado from "@/components/demo/AvisoBloqueado";
import BloqueVenta from "@/components/demo/BloqueVenta";
import { leerVehiculos, vehiculoPorSlug, ESTADOS } from "@/libs/vehiculos";
import { enDolares, millajeDe } from "@/libs/formato";
import { esDemo, mensajePorVehiculo } from "@/libs/demo";
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

  const detalle = vehiculo.enSubasta
    ? [`en subasta`, millajeDe(vehiculo), vehiculo.danio && `daño ${vehiculo.danio}`]
    : [`a pedido`, `desde ${enDolares(vehiculo.precio)}`];

  return getSEOTags({
    title: `${vehiculo.nombreCompleto} | ${config.appName}`,
    description: `${vehiculo.nombreCompleto}, ${detalle
      .filter(Boolean)
      .join(
        ", "
      )}. Comprado en USA, reparado y exportado a Venezuela, Panamá, Colombia y toda Latinoamérica.`,
    canonicalUrlRelative: `/vehiculo/${vehiculo.slug}`,
  });
}

export default async function Vehiculo({ params }) {
  const { slug } = await params;
  const vehiculo = vehiculoPorSlug(slug);
  if (!vehiculo) notFound();

  const estado = ESTADOS[vehiculo.estado] || ESTADOS.disponible;
  const demo = esDemo();
  const conFoto = vehiculo.fotos?.length > 0;

  // Parecidos: primero los del mismo segmento y carrocería, que es lo que de
  // verdad ayuda a quien todavía no se ha decidido; si no salen tres, se
  // completa con los del mismo segmento. A quien mira un lote en subasta se le
  // proponen otros lotes, no modelos a pedido: son dos preguntas distintas.
  const resto = leerVehiculos().filter((v) => v.slug !== vehiculo.slug);
  const parecidos = [
    ...resto.filter(
      (v) => v.segmento === vehiculo.segmento && v.carroceria === vehiculo.carroceria
    ),
    ...resto.filter(
      (v) => v.segmento === vehiculo.segmento && v.carroceria !== vehiculo.carroceria
    ),
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
          <Escenario variante="sutil" />

          <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
              {/* La imagen, lo primero y lo más grande. Sus fotos son de patio
                  de subasta, apaisadas; la plantilla dibujada es vertical, como
                  sus piezas. Cada una va en su proporción. */}
              <div>
                <Revelar desde="corte">
                  <FotoVehiculo
                    vehiculo={vehiculo}
                    prioridad
                    className={`${conFoto ? "aspect-4/3" : "aspect-4/5"} w-full`}
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

                {!conFoto && (
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
                          vehiculo.enSubasta
                            ? "bg-primary text-primary-content"
                            : "bg-base-content/12 text-base-content"
                        }`}
                      >
                        {vehiculo.enSubasta ? "Disponible en subasta" : "A pedido"}
                      </span>
                    </span>
                    {vehiculo.condicionInfo && (
                      <span className="display-recto text-sm tracking-wide text-base-content/80">
                        {vehiculo.condicionInfo.nombre}
                      </span>
                    )}
                    {vehiculo.estado !== "disponible" && (
                      <span className="flex items-center gap-1.5 text-sm font-medium">
                        <span
                          className={`size-2 rounded-full ${estado.punto}`}
                          aria-hidden="true"
                        />
                        <span className={estado.clase}>{estado.texto}</span>
                      </span>
                    )}
                    {vehiculo.ubicacion && (
                      <span className="text-sm text-base-content/50">· {vehiculo.ubicacion}</span>
                    )}
                  </div>
                </Revelar>

                <TituloAnimado as="h1" retraso={100} className="display mt-5 text-5xl sm:text-6xl">
                  {vehiculo.marca}{" "}
                  <span className="text-primary">
                    {[vehiculo.modelo, vehiculo.version].filter(Boolean).join(" ")}
                  </span>
                </TituloAnimado>

                <Revelar retraso={180}>
                  <p className="cifra mt-4 text-base text-base-content/50">
                    {[vehiculo.anioTexto || "Año a elegir", vehiculo.traccion, vehiculo.transmision]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>

                  <div className="mt-8">
                    <p className="text-[0.7rem] uppercase tracking-wider text-base-content/45">
                      {vehiculo.segmentoInfo.etiquetaPrecio}
                    </p>
                    <p className="cifra mt-1 text-5xl font-bold leading-none text-primary sm:text-6xl">
                      {enDolares(vehiculo.precio)}
                    </p>
                    <p className="mt-3 text-sm text-base-content/60">
                      {vehiculo.enSubasta
                        ? "Lo que se estima pagar en la subasta. Reparación y envío se cotizan según tu país."
                        : "Comprado, reparado y exportado. El envío se cotiza según tu país."}
                    </p>
                  </div>
                </Revelar>

                <Revelar retraso={240}>
                  <Especificaciones vehiculo={vehiculo} className="mt-8" />
                </Revelar>

                <Revelar retraso={300}>
                  <div className="mt-8">
                    {demo ? (
                      <AvisoBloqueado titulo="El contacto está desactivado en la demo">
                        En la página entregada, este botón abre WhatsApp con el{" "}
                        {config.business.whatsappVisible} y el mensaje ya escrito —«
                        {mensajePorVehiculo(vehiculo)}»— para que el comprador no tenga que explicar
                        nada.
                      </AvisoBloqueado>
                    ) : (
                      <BotonContacto
                        vehiculo={vehiculo}
                        demo={false}
                        className="btn btn-primary btn-lg w-full"
                      >
                        {vehiculo.enSubasta ? "Quiero pujar por esta" : "Quiero cotizar uno así"}
                      </BotonContacto>
                    )}
                  </div>

                  {vehiculo.detalles?.length > 0 && (
                    <ul className="mt-8 space-y-3">
                      {vehiculo.detalles.map((detalle) => (
                        <li key={detalle} className="flex gap-3 text-sm leading-snug">
                          <span
                            className="mt-1 h-3 w-2 shrink-0 bg-primary"
                            style={{ transform: "skewX(var(--angulo-ls))" }}
                            aria-hidden="true"
                          />
                          <span className="display-recto tracking-wide text-base-content/80">
                            {detalle}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {(vehiculo.precioProvisional || vehiculo.muestra) && (
                    <div className="mt-7 flex flex-wrap gap-3">
                      {vehiculo.precioProvisional && <AvisoPrecioProvisional />}
                      {vehiculo.muestra && <AvisoDeMuestra />}
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

                {/* Los cinco pasos, en corto: es lo que pregunta todo el que llega
                    a una ficha de subasta por primera vez. */}
                <ol className="mt-10 space-y-3">
                  {config.compra.pasos.map((paso, i) => (
                    <li key={paso.titulo} className="flex items-baseline gap-4 text-sm">
                      <span className="cifra shrink-0 text-primary">{i + 1}</span>
                      <span className="display-recto tracking-wide text-base-content/75">
                        {paso.titulo}
                      </span>
                    </li>
                  ))}
                </ol>
                <Link
                  href="/#como-funciona"
                  className="mt-5 inline-block text-sm text-base-content/50 underline-offset-4 transition-colors hover:text-primary hover:underline"
                >
                  Cómo funciona, paso a paso →
                </Link>
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
                {vehiculo.enSubasta ? "Otros lotes en subasta" : "Otros modelos a pedido"}
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

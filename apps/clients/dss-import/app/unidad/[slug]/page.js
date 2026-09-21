import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FotoVehiculo, {
  AvisoSinFoto,
  AvisoPrecioProvisional,
  AvisoDeMuestra,
  AvisoCuotaCalculada,
} from "@/components/FotoVehiculo";
import BotonContacto from "@/components/BotonContacto";
import Especificaciones, { EspecificacionesCompletas } from "@/components/Especificaciones";
import SimuladorCuota from "@/components/SimuladorCuota";
import RejillaVehiculos from "@/components/RejillaVehiculos";
import Revelar from "@/components/Revelar";
import TituloAnimado from "@/components/TituloAnimado";
import Escenario from "@/components/Escenario";
import AvisoBloqueado from "@/components/demo/AvisoBloqueado";
import BloqueVenta from "@/components/demo/BloqueVenta";
import { leerVehiculos, vehiculoPorSlug, ESTADOS } from "@/libs/catalogo";
import { obtenerTasa } from "@/libs/bcv";
import { enDolares, enBolivares, aBolivares, enCuota, kilometrajeDe } from "@/libs/formato";
import { esDemo, hayWhatsapp } from "@/libs/demo";
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
  const donde = vehiculo.ubicacion || config.business.ciudad;
  const cuota = enCuota(vehiculo.cuota);

  // El título y la descripción llevan la CUOTA y no el precio: quien busca en
  // Google escribe "moto en cuotas Maracay", no "moto 1.450 dólares".
  return getSEOTags({
    title: `${vehiculo.tituloLargo} ${vehiculo.anio} desde ${cuota.texto} | ${config.appName}`,
    description: `${vehiculo.tituloLargo} ${vehiculo.anio}, ${condicion}. Cuotas de ${cuota.texto}, ${vehiculo.cuota.inicialPct}% de inicial y hasta ${Math.round(vehiculo.cuota.plazoMeses / 12)} años para pagar, en ${donde}.`,
    canonicalUrlRelative: `/unidad/${vehiculo.slug}`,
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
  const cuota = enCuota(vehiculo.cuota);

  // Parecidos: primero los del mismo segmento y carrocería, que es lo que de
  // verdad ayuda a quien todavía no se ha decidido; si no salen tres, se
  // completa con los del mismo segmento. Una moto nunca se propone junto a un
  // sedán: son compradores distintos.
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
            href="/catalogo"
            className="display-recto text-xs tracking-widest text-base-content/50 transition-colors hover:text-primary"
          >
            ← Volver al catálogo
          </Link>
        </div>

        <article className="relative overflow-hidden">
          <Escenario variante="sutil" />

          <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
              {/* La imagen, lo primero y lo más grande. Es una publicación
                  cuadrada suya, así que no se recorta. */}
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
                      · {vehiculo.ubicacion}
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

                  {/* La cuota es la cifra grande de la ficha. El precio de
                      contado va debajo, en gris, junto a su equivalente en
                      bolívares: hace falta para entender el plan, pero no es lo
                      que se vende aquí. */}
                  <div className="mt-8">
                    <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="cuota text-5xl leading-none sm:text-6xl">
                        {cuota.cifra}
                      </span>
                      <span className="cuota-periodo text-lg">{cuota.periodo}</span>
                    </p>
                    <p className="cifra mt-3 text-sm text-base-content/50">
                      {enDolares(vehiculo.inicial)} de inicial ({vehiculo.cuota.inicialPct} %)
                      · hasta {Math.round(vehiculo.cuota.plazoMeses / 12)} años
                    </p>
                    <p className="cifra mt-1.5 text-sm text-base-content/40">
                      {enDolares(vehiculo.precio)} de contado
                      {enBs && <> · ≈ {enBolivares(enBs)} a tasa BCV {tasa.valor.toFixed(2)}</>}
                    </p>
                    <p className="mt-3 text-sm text-base-content/60">
                      Se ve y se firma en {vehiculo.ubicacion}, estado {config.business.estado}
                    </p>
                  </div>
                </Revelar>

                <Revelar retraso={240}>
                  <Especificaciones vehiculo={vehiculo} className="mt-8" />
                </Revelar>

                <Revelar retraso={300}>
                  <div className="mt-8">
                    {demo ? (
                      <AvisoBloqueado titulo="La solicitud está desactivada en la demo">
                        En la página entregada, este botón abre{" "}
                        {hayWhatsapp() ? "WhatsApp" : "tu Instagram"} con el mensaje ya
                        escrito —«me interesa {vehiculo.esMoto ? "la" : "el"}{" "}
                        {vehiculo.tituloLargo} {vehiculo.anio}, vi que la cuota es de{" "}
                        {cuota.texto}, ¿qué necesito para aplicar?»— para que quien
                        pregunta llegue sabiendo su plan y tú no tengas que empezar de
                        cero cada conversación. Aquí está cortado a propósito: lo que
                        entra por este botón son solicitudes de crédito con datos de
                        personas, y un desconocido probando la demo no te las va a meter
                        en la bandeja.
                      </AvisoBloqueado>
                    ) : (
                      <BotonContacto
                        vehiculo={vehiculo}
                        demo={false}
                        className="btn btn-primary btn-lg w-full"
                      >
                        Solicitar este crédito
                      </BotonContacto>
                    )}
                  </div>

                  {vehiculo.detalles?.length > 0 && (
                    <ul className="mt-8 space-y-3">
                      {vehiculo.detalles.map((detalle) => (
                        <li key={detalle} className="flex gap-3 text-sm leading-snug">
                          <span
                            className="mt-1 h-3 w-2 shrink-0 bg-primary"
                            style={{ transform: "skewX(var(--angulo-dss))" }}
                            aria-hidden="true"
                          />
                          <span className="display-recto tracking-wide text-base-content/80">
                            {detalle}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {(vehiculo.precioProvisional ||
                    vehiculo.deMuestra ||
                    vehiculo.cuota.calculada) && (
                    <div className="mt-7 flex flex-wrap gap-3">
                      {vehiculo.deMuestra && <AvisoDeMuestra />}
                      {vehiculo.cuota.calculada && <AvisoCuotaCalculada />}
                      {vehiculo.precioProvisional && <AvisoPrecioProvisional />}
                    </div>
                  )}
                </Revelar>
              </div>
            </div>

            {/* El simulador, a todo lo ancho y justo después de la decisión:
                es la pieza que contesta "¿y si no puedo pagar esa cuota?" sin
                que nadie tenga que escribir. */}
            <div className="mt-16 border-t border-base-content/10 pt-12">
              <Revelar>
                <SimuladorCuota vehiculo={vehiculo} className="mx-auto max-w-2xl" />
              </Revelar>
            </div>

            {/* Debajo del pliegue: el texto largo y la tabla completa. */}
            <div className="mt-16 grid gap-12 border-t border-base-content/10 pt-12 lg:grid-cols-2 lg:gap-20">
              <Revelar>
                <p className="rotulo">
                  Sobre {vehiculo.esMoto ? "esta moto" : "este vehículo"}
                </p>
                <p className="mt-5 text-lg leading-relaxed text-base-content/70">
                  {vehiculo.descripcion}
                </p>
                <p className="mt-8 text-sm leading-relaxed text-base-content/45">
                  Se ve y se firma en la oficina de {config.business.ciudad}, estado{" "}
                  {config.business.estado}. Escribe antes por Instagram y te la apartan
                  mientras se arma el plan.
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
                {vehiculo.esMoto ? "Otras motos" : "Otros vehículos"}
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

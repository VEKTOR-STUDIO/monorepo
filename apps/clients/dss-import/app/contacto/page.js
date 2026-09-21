import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Revelar from "@/components/Revelar";
import TituloAnimado from "@/components/TituloAnimado";
import Escenario from "@/components/Escenario";
import FormularioContacto from "@/components/FormularioContacto";
import BotonContacto from "@/components/BotonContacto";
import BloqueVenta from "@/components/demo/BloqueVenta";
import { esDemo, hayWhatsapp } from "@/libs/demo";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

const { business, credito } = config;

export const metadata = getSEOTags({
  title: `Solicitar crédito · ${config.appName}`,
  description: `Escríbenos por Instagram o pásate por la oficina en ${business.ciudad}, estado ${business.estado}. Planes de crédito para vehículos y motos, cuotas desde $${credito.cuotaDesde} ${credito.cuotaDesdePeriodo}.`,
  canonicalUrlRelative: "/contacto",
});

export default function Contacto() {
  const demo = esDemo();

  return (
    <>
      <Header />

      <main>
        <section className="relative overflow-hidden border-b border-base-content/8 px-4 py-20 sm:px-6">
          <Escenario variante="seccion" />
          <div className="textura absolute inset-0" aria-hidden="true" />

          <div className="relative mx-auto max-w-7xl">
            <Revelar>
              <span className="filete" aria-hidden="true" />
            </Revelar>
            <TituloAnimado as="h1" className="display mt-6 text-5xl sm:text-6xl lg:text-7xl">
              Arma tu crédito
            </TituloAnimado>
            <Revelar retraso={200}>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-base-content/60">
                Dinos qué buscas y cuánto puedes pagar por semana o por mes, y te armamos
                el plan. Si prefieres hablar antes, escríbenos por Instagram o pásate por
                la oficina.
              </p>
            </Revelar>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
            {/* Canales */}
            <div className="min-w-0 space-y-4">
              <Revelar>
                <div className="ficha p-6">
                  <p className="rotulo">La oficina</p>
                  <address className="display mt-3 not-italic text-2xl leading-tight">
                    {business.ciudad}
                  </address>
                  <p className="cifra mt-2 text-sm text-primary">
                    Estado {business.estado}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-base-content/55">
                    Aquí se firma el crédito y se hace el seguimiento. Tener oficina es
                    una de las tres razones que publicamos, y es la que más tranquiliza a
                    quien va a entregar una inicial.
                  </p>
                  <p className="mt-5 text-sm text-base-content/45">{business.horario}</p>
                </div>
              </Revelar>

              <Revelar retraso={80}>
                <div className="ficha p-6">
                  <p className="rotulo">Por dónde escribirnos</p>

                  <dl className="mt-4 space-y-4">
                    <div className="min-w-0">
                      <dt className="text-[0.65rem] uppercase tracking-wider text-base-content/40">
                        Instagram
                      </dt>
                      <dd className="mt-1 text-base font-semibold">
                        <a
                          href={business.instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transition-colors hover:text-primary"
                        >
                          @{business.instagram}
                        </a>
                        <span className="cifra ml-2 text-xs text-base-content/40">
                          {business.seguidores} seguidores
                        </span>
                      </dd>
                    </div>

                    {hayWhatsapp() && (
                      <div className="min-w-0">
                        <dt className="text-[0.65rem] uppercase tracking-wider text-base-content/40">
                          WhatsApp
                        </dt>
                        <dd className="cifra mt-1 text-base font-semibold">
                          {business.whatsappVisible}
                        </dd>
                      </div>
                    )}

                    <div className="min-w-0">
                      <dt className="text-[0.65rem] uppercase tracking-wider text-base-content/40">
                        Todos nuestros enlaces
                      </dt>
                      <dd className="mt-1 truncate text-base font-semibold">
                        <a
                          href={business.enlaces}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transition-colors hover:text-primary"
                        >
                          beacons.ai/dssimport
                        </a>
                      </dd>
                    </div>
                  </dl>

                  <BotonContacto demo={demo} className="btn btn-primary btn-sm mt-6">
                    Escribirnos ahora
                  </BotonContacto>
                </div>
              </Revelar>

              <Revelar retraso={160}>
                <div className="ficha p-6">
                  <p className="rotulo">Las condiciones</p>
                  <dl className="mt-4 space-y-3 text-sm">
                    <div className="flex items-baseline justify-between gap-4">
                      <dt className="text-base-content/55">Inicial</dt>
                      <dd className="cifra font-semibold">{credito.inicialPct} %</dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-4">
                      <dt className="text-base-content/55">Plazo máximo</dt>
                      <dd className="cifra font-semibold">{credito.plazoMesesMax} meses</dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-4">
                      <dt className="text-base-content/55">Cuota desde</dt>
                      <dd className="cifra font-semibold text-primary">
                        ${credito.cuotaDesde} {credito.cuotaDesdePeriodo}
                      </dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-4">
                      <dt className="text-base-content/55">Motos desde</dt>
                      <dd className="cifra font-semibold text-primary">
                        ${credito.cuotaMotoDesde} {credito.cuotaMotoDesdePeriodo}
                      </dd>
                    </div>
                  </dl>
                  <p className="mt-5 text-sm leading-relaxed text-base-content/45">
                    Las cuotas se adaptan a tu presupuesto: si esa no te sirve, se mueve
                    la inicial o el plazo hasta que entre.
                  </p>
                </div>
              </Revelar>
            </div>

            {/* Formulario */}
            <Revelar desde="corte" retraso={120} className="min-w-0">
              <div className="ficha p-7 sm:p-9">
                <p className="rotulo">Solicitud de crédito</p>
                <h2 className="display mt-3 text-3xl">Cuéntanos qué buscas</h2>
                <p className="mt-4 text-sm leading-relaxed text-base-content/55">
                  Con esto basta para empezar: qué quieres financiar y cuánto puedes
                  pagar. Si no ves la unidad que quieres en el catálogo, dilo igual —se
                  consigue—.
                </p>

                <div className="mt-7">
                  <FormularioContacto />
                </div>
              </div>
            </Revelar>
          </div>
        </section>

        <section className="border-t border-base-content/8 px-4 py-16 text-center sm:px-6">
          <p className="text-base-content/55">¿Prefieres mirar primero?</p>
          <Link href="/catalogo" className="btn btn-filo mt-5">
            Ver el catálogo
          </Link>
        </section>

        <BloqueVenta />
      </main>

      <Footer />
    </>
  );
}

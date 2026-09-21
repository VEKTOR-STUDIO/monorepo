import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Revelar from "@/components/Revelar";
import TituloAnimado from "@/components/TituloAnimado";
import Escenario from "@/components/Escenario";
import FormularioContacto from "@/components/FormularioContacto";
import BotonContacto from "@/components/BotonContacto";
import BloqueVenta from "@/components/demo/BloqueVenta";
import { esDemo } from "@/libs/demo";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

const { business } = config;

export const metadata = getSEOTags({
  title: `Contacto · ${config.appName}`,
  description: `Escríbenos por WhatsApp o pásate por el salón: ${business.direccionLarga}.`,
  canonicalUrlRelative: "/contacto",
});

export default function Contacto() {
  const demo = esDemo();

  return (
    <>
      <Header />

      <main>
        <section className="relative overflow-hidden border-b border-base-content/8 bg-base-200 px-4 py-20 sm:px-6">
          <Escenario variante="seccion" />
          <div className="textura absolute inset-0" aria-hidden="true" />

          <div className="relative mx-auto max-w-7xl">
            <Revelar>
              <span className="filete" aria-hidden="true" />
            </Revelar>
            <TituloAnimado as="h1" className="display mt-6 text-4xl sm:text-5xl lg:text-6xl">
              <span className="rotulo-marca-inverso">Hablemos</span>
            </TituloAnimado>
            <Revelar retraso={200}>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-base-content/70">
                Lo más rápido es WhatsApp: te contesta quien tiene la unidad delante. Si
                prefieres, déjanos qué buscas y te escribimos nosotros, o pásate por el
                salón de la {business.sedes[0].zona}.
              </p>
            </Revelar>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
            {/* Canales */}
            <div className="min-w-0 space-y-4">
              {business.sedes.map((sede, i) => (
                <Revelar key={sede.slug} retraso={i * 80}>
                  <div className="ficha p-6">
                    <p className="rotulo">El salón · {sede.estado}</p>
                    <p className="display mt-3 text-2xl leading-tight text-primary">{sede.zona}</p>
                    <address className="mt-2 not-italic text-sm leading-relaxed text-base-content/70">
                      {business.direccionLarga}
                    </address>
                    <p className="mt-4 text-sm leading-relaxed text-base-content/65">
                      {sede.resumen}
                    </p>

                    <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
                      <div className="min-w-0">
                        <dt className="text-[0.65rem] uppercase tracking-wider text-base-content/50">
                          Teléfono y WhatsApp
                        </dt>
                        <dd className="cifra mt-1 text-base font-semibold">{sede.telefono}</dd>
                      </div>
                      {sede.instagram && (
                        <div className="min-w-0">
                          <dt className="text-[0.65rem] uppercase tracking-wider text-base-content/50">
                            Instagram
                          </dt>
                          <dd className="mt-1 text-base font-semibold">
                            <a
                              href={sede.instagramUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="transition-colors hover:text-primary"
                            >
                              @{sede.instagram}
                            </a>
                          </dd>
                        </div>
                      )}
                    </dl>

                    <BotonContacto
                      demo={demo}
                      vehiculo={{ sede: sede.slug }}
                      className="btn btn-primary btn-sm mt-6"
                    >
                      Escribir por WhatsApp
                    </BotonContacto>
                  </div>
                </Revelar>
              ))}

              <Revelar retraso={240}>
                <div className="ficha p-6">
                  <p className="rotulo">Qué hacemos</p>
                  <ul className="mt-4 space-y-2.5 text-sm text-base-content/70">
                    {business.servicios.map((servicio) => (
                      <li key={servicio} className="flex gap-3">
                        <span
                          className="mt-1 h-3 w-2.5 shrink-0 bg-primary"
                          style={{ clipPath: "var(--escudo)" }}
                          aria-hidden="true"
                        />
                        {servicio}
                      </li>
                    ))}
                  </ul>
                  {business.horario && (
                    <p className="mt-5 text-sm text-base-content/55">{business.horario}</p>
                  )}
                </div>
              </Revelar>
            </div>

            {/* Formulario */}
            <Revelar desde="corte" retraso={120} className="min-w-0">
              <div className="ficha p-7 sm:p-9">
                <p className="rotulo">Déjanos tus datos</p>
                <h2 className="display mt-3 text-2xl text-primary">Cuéntanos qué buscas</h2>
                <p className="mt-4 text-sm leading-relaxed text-base-content/65">
                  Si no ves lo que quieres en el inventario, dilo aquí: se consigue. Y si
                  vas a dar tu carro como parte de pago, también se arregla por aquí.
                </p>

                <div className="mt-7">
                  <FormularioContacto />
                </div>
              </div>
            </Revelar>
          </div>
        </section>

        <section className="border-t border-base-content/8 px-4 py-16 text-center sm:px-6">
          <p className="text-base-content/65">¿Prefieres mirar primero?</p>
          <Link href="/vehiculos" className="btn btn-filo mt-5">
            Ver el inventario
          </Link>
        </section>

        <BloqueVenta />
      </main>

      <Footer />
    </>
  );
}

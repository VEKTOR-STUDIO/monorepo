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
  description: `Escríbenos por WhatsApp (${business.whatsappVisible}) o por Instagram. Estamos en el ${business.centroLargo}, Valencia, Carabobo.`,
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
              <span className="filo" aria-hidden="true" />
            </Revelar>
            <TituloAnimado as="h1" className="display mt-6 text-5xl sm:text-6xl lg:text-7xl">
              Hablemos
            </TituloAnimado>
            <Revelar retraso={200}>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-base-content/60">
                Lo más rápido es escribirnos por WhatsApp, que es el enlace directo de
                nuestra bio. Si prefieres, déjanos aquí qué buscas y te escribimos
                nosotros con lo que haya en el local.
              </p>
            </Revelar>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
            {/* Canales */}
            <div className="min-w-0 space-y-4">
              {/* Una sola tarjeta: hay un solo local, dentro del Grupo Autos del
                  Centro. El horario está en una destacada suya que no se pudo
                  leer, así que no se publica uno inventado. */}
              <Revelar>
                <div className="ficha p-6">
                  <p className="rotulo">{business.ciudad}</p>
                  <address className="display mt-3 not-italic text-2xl leading-tight">
                    {business.centroLargo}
                  </address>
                  <p className="cifra mt-2 text-sm text-primary">{business.estado} · Venezuela</p>
                  <p className="mt-4 text-sm leading-relaxed text-base-content/55">
                    {business.direccionLarga}. Escríbenos antes de venir y te confirmamos
                    que la unidad sigue disponible y está lista para verla.
                  </p>

                  <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
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
                      </dd>
                    </div>
                    {business.whatsappVisible && (
                      <div className="min-w-0">
                        <dt className="text-[0.65rem] uppercase tracking-wider text-base-content/40">
                          WhatsApp
                        </dt>
                        <dd className="cifra mt-1 text-base font-semibold">
                          {business.whatsappVisible}
                        </dd>
                      </div>
                    )}
                  </dl>

                  <BotonContacto demo={demo} className="btn btn-primary btn-sm mt-5">
                    Escribir por WhatsApp
                  </BotonContacto>
                </div>
              </Revelar>

              {/* Quien viene a vender no viene a lo mismo, y este es el sitio
                  donde más se nota: se le manda a su página en vez de meterle
                  el formulario de compra. */}
              <Revelar retraso={80}>
                <div className="ficha p-6">
                  <p className="rotulo">¿Vas a vender?</p>
                  <p className="display mt-3 text-2xl leading-tight">
                    Te lo compramos o lo <span className="text-primary">consignamos</span>
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-base-content/55">
                    Avalúo, sesión de fotos en el local, publicación y acompañamiento hasta
                    el traspaso. Es otra conversación, así que tiene su propia página.
                  </p>
                  <Link href="/vender" className="btn btn-azul btn-sm mt-5">
                    Cómo funciona
                  </Link>
                </div>
              </Revelar>

              <Revelar retraso={240}>
                <div className="ficha p-6">
                  <p className="rotulo">Qué hacemos</p>
                  <ul className="mt-4 space-y-2.5 text-sm text-base-content/70">
                    {business.servicios.map((servicio) => (
                      <li key={servicio} className="flex gap-3">
                        <span
                          className="mt-1.5 h-2.5 w-1.5 shrink-0 bg-primary"
                          style={{ transform: "skewX(var(--angulo-cc))" }}
                          aria-hidden="true"
                        />
                        {servicio}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 text-sm text-base-content/45">{business.horario}</p>
                </div>
              </Revelar>
            </div>

            {/* Formulario */}
            <Revelar desde="corte" retraso={120} className="min-w-0">
              <div className="ficha p-7 sm:p-9">
                <p className="rotulo">Déjanos tus datos</p>
                <h2 className="display mt-3 text-3xl">Cuéntanos qué buscas</h2>
                <p className="mt-4 text-sm leading-relaxed text-base-content/55">
                  Si no ves lo que quieres en el inventario, dilo aquí: se consigue. Y si
                  vas a dar tu vehículo como parte de pago, también se arregla por aquí.
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

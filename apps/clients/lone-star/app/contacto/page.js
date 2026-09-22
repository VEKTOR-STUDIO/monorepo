import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Revelar from "@/components/Revelar";
import TituloAnimado from "@/components/TituloAnimado";
import Escenario from "@/components/Escenario";
import FormularioContacto from "@/components/FormularioContacto";
import BotonContacto from "@/components/BotonContacto";
import Bandera from "@/components/Bandera";
import BloqueVenta from "@/components/demo/BloqueVenta";
import { esDemo } from "@/libs/demo";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

const { business } = config;

export const metadata = getSEOTags({
  title: `Contacto · ${config.appName}`,
  description: `Escríbenos por WhatsApp al ${business.whatsappVisible} o por DM en Instagram. Compramos en subasta, reparamos y exportamos a Venezuela, Panamá, Colombia y toda Latinoamérica.`,
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
              <span className="ala" aria-hidden="true" />
            </Revelar>
            <TituloAnimado as="h1" className="display mt-6 text-5xl sm:text-6xl lg:text-7xl">
              Hablemos
            </TituloAnimado>
            <Revelar retraso={200}>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-base-content/60">
                Lo más rápido es WhatsApp. Pregunta sin compromiso: por un lote que viste, por un
                modelo que quieres traer o por cómo funciona. Si prefieres, déjanos qué buscas y te
                escribimos nosotros.
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
                  <p className="rotulo">WhatsApp</p>
                  <p className="cifra mt-3 text-3xl font-bold">{business.whatsappVisible}</p>
                  <p className="mt-3 text-sm leading-relaxed text-base-content/55">
                    Mándanos el enlace del lote que te interesa, o dinos qué buscas, año y
                    presupuesto. Te respondemos con la puja estimada y lo que cuesta ponerlo en tu
                    país.
                  </p>
                  <BotonContacto demo={demo} className="btn btn-primary btn-sm mt-5">
                    Escribir por WhatsApp
                  </BotonContacto>
                </div>
              </Revelar>

              <Revelar retraso={80}>
                <div className="ficha p-6">
                  <p className="rotulo">Instagram</p>
                  <a
                    href={business.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="display mt-3 inline-block text-2xl transition-colors hover:text-primary"
                  >
                    @{business.instagram}
                  </a>
                  <p className="mt-2 text-sm text-base-content/55">Escríbenos por DM.</p>
                </div>
              </Revelar>

              <Revelar retraso={160}>
                <div className="ficha p-6">
                  <p className="rotulo">Qué hacemos</p>
                  <ul className="mt-4 space-y-2.5 text-sm text-base-content/70">
                    {business.servicios.map((servicio) => (
                      <li key={servicio.slug} className="flex gap-3">
                        <span
                          className="mt-1.5 h-2.5 w-1.5 shrink-0 bg-primary"
                          style={{ transform: "skewX(var(--angulo-ls))" }}
                          aria-hidden="true"
                        />
                        <span>
                          <span className="font-semibold text-base-content">
                            {servicio.titulo}.
                          </span>{" "}
                          {servicio.detalle}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 flex items-center gap-2">
                    {business.destinos.map((d) => (
                      <Bandera
                        key={d.slug}
                        codigo={d.bandera}
                        nombre={d.nombre}
                        className="size-6"
                      />
                    ))}
                    <span className="ml-1 text-sm text-base-content/45">
                      {business.destinosNota}
                    </span>
                  </div>
                </div>
              </Revelar>
            </div>

            {/* Formulario */}
            <Revelar desde="corte" retraso={120} className="min-w-0">
              <div className="ficha p-7 sm:p-9">
                <p className="rotulo">Déjanos tus datos</p>
                <h2 className="display mt-3 text-3xl">Cuéntanos qué buscas</h2>
                <p className="mt-4 text-sm leading-relaxed text-base-content/55">
                  Si no ves lo que quieres en el inventario, dilo aquí: lo buscamos en subasta.
                  Dinos modelo, años, presupuesto y a qué país va.
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

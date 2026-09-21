import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Revelar from "@/components/Revelar";
import TituloAnimado from "@/components/TituloAnimado";
import Alas from "@/components/Alas";
import FormularioContacto from "@/components/FormularioContacto";
import BotonContacto from "@/components/BotonContacto";
import BloqueVenta from "@/components/demo/BloqueVenta";
import { esDemo } from "@/libs/demo";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

const { business } = config;

export const metadata = getSEOTags({
  title: `Contacto · ${config.appName}`,
  description: `Escríbenos por WhatsApp o Instagram, o pásate por el showroom de ${business.direccion}, ${business.ciudad}.`,
  canonicalUrlRelative: "/contacto",
});

export default function Contacto() {
  const demo = esDemo();

  return (
    <>
      <Header />

      <main>
        <section className="relative overflow-hidden border-b border-base-content/8 px-4 py-20 sm:px-6">
          <Alas variante="seccion" />
          <div className="textura absolute inset-0" aria-hidden="true" />

          <div className="relative mx-auto max-w-7xl">
            <Revelar>
              <span className="banda" aria-hidden="true" />
            </Revelar>
            <TituloAnimado as="h1" className="display mt-6 text-5xl sm:text-6xl lg:text-7xl">
              Hablemos
            </TituloAnimado>
            <Revelar retraso={200}>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-base-content/60">
                Lo más rápido es WhatsApp. Si prefieres, déjanos qué buscas —esté o no
                en el inventario— y te cotizamos. Y si estás por {business.ciudad}, pásate
                por cualquiera de las dos sedes.
              </p>
            </Revelar>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
            {/* Canales */}
            <div className="space-y-4">
              {business.sedes.map((sede, i) => (
                <Revelar key={sede.slug} retraso={i * 80}>
                  <div className="ficha p-6">
                    <p className="rotulo">{sede.nombre}</p>
                    <address className="display mt-3 not-italic text-2xl leading-tight">
                      {sede.direccion}
                    </address>
                    <a
                      href={sede.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cifra mt-2 inline-block text-sm text-base-content/70 underline-offset-4 transition-colors hover:text-base-content hover:underline"
                    >
                      @{sede.instagram}
                    </a>
                    <p className="mt-4 text-sm text-base-content/55">{business.horario}</p>
                  </div>
                </Revelar>
              ))}

              <Revelar retraso={80}>
                <div className="ficha p-6">
                  <p className="rotulo">WhatsApp</p>
                  {business.whatsappVisible ? (
                    <p className="cifra mt-3 text-xl font-bold">{business.whatsappVisible}</p>
                  ) : (
                    <p className="mt-3 text-base text-base-content/60">
                      Atención directa, todos los días.
                    </p>
                  )}
                  <BotonContacto demo={demo} className="btn btn-primary btn-sm mt-5">
                    Escribir ahora
                  </BotonContacto>
                </div>
              </Revelar>

              <Revelar retraso={160}>
                <a
                  href={business.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ficha group block p-6"
                >
                  <p className="rotulo">Instagram</p>
                  <p className="display mt-3 text-2xl transition-colors group-hover:text-base-content/60">
                    @{business.instagram}
                  </p>
                  <p className="cifra mt-2 text-sm text-base-content/55">
                    {business.seguidores} seguidores · {business.publicaciones} publicaciones
                  </p>
                </a>
              </Revelar>

              <Revelar retraso={240}>
                <div className="ficha p-6">
                  <p className="rotulo">Qué hacemos</p>
                  <ul className="mt-4 space-y-2.5 text-sm text-base-content/70">
                    {business.servicios.map((servicio) => (
                      <li key={servicio} className="flex gap-3">
                        <span
                          className="mt-1.5 h-2.5 w-1.5 shrink-0 bg-base-content/70"
                          style={{ transform: "skewX(var(--angulo-veloce))" }}
                          aria-hidden="true"
                        />
                        {servicio}
                      </li>
                    ))}
                  </ul>
                </div>
              </Revelar>
            </div>

            {/* Formulario */}
            <Revelar desde="corte" retraso={120}>
              <div className="ficha p-7 sm:p-9">
                <p className="rotulo">Déjanos tus datos</p>
                <h2 className="display mt-3 text-3xl">Cuéntanos qué buscas</h2>
                <p className="mt-4 text-sm leading-relaxed text-base-content/55">
                  Si no ves lo que quieres en el inventario, dilo aquí: se importa. Di la
                  marca, el modelo, el año y el presupuesto, y te decimos de dónde sale
                  mejor y cuánto tarda.
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

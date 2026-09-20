import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Revelar from "@/components/Revelar";
import FormularioContacto from "@/components/FormularioContacto";
import BotonContacto from "@/components/BotonContacto";
import BloqueVenta from "@/components/demo/BloqueVenta";
import { esDemo } from "@/libs/demo";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

const { business } = config;

export const metadata = getSEOTags({
  title: `Contacto · ${config.appName}`,
  description: `Escríbenos por WhatsApp o Instagram para comprar, vender o tasar tu vehículo en ${business.ciudad}.`,
  canonicalUrlRelative: "/contacto",
});

export default function Contacto() {
  const demo = esDemo();

  return (
    <>
      <Header />

      <main>
        <section className="relative overflow-hidden border-b border-base-content/10 bg-base-content px-4 py-20 text-base-100 sm:px-6">
          <Image
            src="/landing/contacto.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-base-content/60" aria-hidden="true" />

          <div className="relative mx-auto max-w-7xl">
            <Revelar>
              <span className="banda" aria-hidden="true" />
              <h1 className="display mt-5 text-4xl sm:text-5xl">Hablemos</h1>
              <p className="mt-4 max-w-lg text-lg text-base-100/70">
                Lo más rápido es WhatsApp. Si prefieres, déjanos qué buscas y te
                escribimos nosotros.
              </p>
            </Revelar>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
            {/* Canales */}
            <div>
              <div className="space-y-4">
                <Revelar>
                  <div className="ficha p-6">
                    <p className="rotulo">WhatsApp</p>
                    {business.whatsappVisible ? (
                      <p className="cifra mt-3 text-xl font-bold">{business.whatsappVisible}</p>
                    ) : (
                      <p className="mt-3 text-base text-base-content/60">
                        Atención directa, todos los días.
                      </p>
                    )}
                    <p className="mt-2 text-sm text-base-content/55">{business.horario}</p>
                    <BotonContacto demo={demo} className="btn btn-primary btn-sm mt-5">
                      Escribir ahora
                    </BotonContacto>
                  </div>
                </Revelar>

                <Revelar retraso={80}>
                  <a
                    href={business.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ficha group block p-6"
                  >
                    <p className="rotulo">Instagram</p>
                    <p className="mt-3 text-xl font-semibold transition-colors group-hover:text-primary">
                      @{business.instagram}
                    </p>
                    <p className="cifra mt-2 text-sm text-base-content/55">
                      {business.seguidores} seguidores
                    </p>
                  </a>
                </Revelar>

                <Revelar retraso={160}>
                  <div className="ficha p-6">
                    <p className="rotulo">Qué hacemos</p>
                    <ul className="mt-3 space-y-2 text-sm text-base-content/70">
                      {business.servicios.map((servicio) => (
                        <li key={servicio} className="flex gap-2.5">
                          <span className="text-primary" aria-hidden="true">
                            ·
                          </span>
                          {servicio}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Revelar>
              </div>
            </div>

            {/* Formulario */}
            <Revelar retraso={120}>
              <div className="ficha p-7 sm:p-9">
                <p className="rotulo">Déjanos tus datos</p>
                <h2 className="display mt-3 text-2xl">Cuéntanos qué buscas</h2>
                <p className="mt-3 text-sm leading-relaxed text-base-content/55">
                  Si no ves lo que quieres en el inventario, dilo aquí: se consigue.
                  También tasamos el vehículo que quieras vender.
                </p>

                <div className="mt-7">
                  <FormularioContacto />
                </div>
              </div>
            </Revelar>
          </div>
        </section>

        <section className="border-t border-base-content/10 px-4 py-16 text-center sm:px-6">
          <p className="text-base-content/55">¿Prefieres mirar primero?</p>
          <Link href="/vehiculos" className="btn btn-ghost mt-4 border border-base-content/15">
            Ver el inventario
          </Link>
        </section>

        <BloqueVenta />
      </main>

      <Footer />
    </>
  );
}

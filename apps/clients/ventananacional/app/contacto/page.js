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

const { business, sedes } = config;

export const metadata = getSEOTags({
  title: `Contacto · ${config.appName}`,
  description:
    "Escríbenos por WhatsApp o Instagram para comprar, vender, consignar o importar tu vehículo. Sala en El Rosal (Caracas) y Barcelona (Anzoátegui).",
  canonicalUrlRelative: "/contacto",
});

export default function Contacto() {
  const demo = esDemo();

  return (
    <>
      <Header />

      <main>
        <section className="relative overflow-hidden border-b border-white/10 px-4 py-20 sm:px-6">
          <Image
            src="/landing/contacto.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-38"
          />
          {/* La foto es clara: sin velo, el titular no se lee. */}
          <div className="absolute inset-0 bg-base-100/72" aria-hidden="true" />
          <div className="textura absolute inset-0" aria-hidden="true" />

          <div className="relative mx-auto max-w-7xl">
            <Revelar>
              <span className="banda" aria-hidden="true" />
              <h1 className="display mt-5 text-4xl sm:text-5xl">
                <span className="cromo">Hablemos</span>
              </h1>
              <p className="mt-4 max-w-lg text-lg text-base-content/65">
                Lo más rápido es WhatsApp. Si prefieres, déjanos qué buscas —o qué
                quieres vender— y te escribimos nosotros.
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
                  <div className="vidrio p-6">
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
                    <p className="rotulo">Instagram · vehículos</p>
                    <p className="mt-3 text-xl font-semibold transition-colors group-hover:text-primary">
                      @{business.instagram}
                    </p>
                    <p className="cifra mt-2 text-sm text-base-content/55">
                      {business.seguidores} seguidores · {business.publicaciones} publicaciones
                    </p>
                  </a>
                </Revelar>

                <Revelar retraso={140}>
                  <a
                    href={business.instagramInmueblesUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ficha group block p-6"
                  >
                    <p className="rotulo">Instagram · inmuebles</p>
                    <p className="mt-3 text-xl font-semibold transition-colors group-hover:text-primary">
                      @{business.instagramInmuebles}
                    </p>
                    <p className="mt-2 text-sm text-base-content/55">
                      La cuenta hermana, para la parte inmobiliaria.
                    </p>
                  </a>
                </Revelar>

                <Revelar retraso={200}>
                  <div className="vidrio p-6">
                    <p className="rotulo">Las salas</p>
                    <ul className="mt-3 space-y-3 text-sm">
                      {sedes.map((sede) => (
                        <li key={sede.zona}>
                          <p className="font-medium text-base-content/85">{sede.zona}</p>
                          <p className="text-base-content/50">{sede.detalle}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Revelar>

                <Revelar retraso={260}>
                  <div className="vidrio p-6">
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
              <div className="vidrio p-7 sm:p-9">
                <p className="rotulo">Déjanos tus datos</p>
                <h2 className="display mt-3 text-2xl">Cuéntanos qué buscas</h2>
                <p className="mt-3 text-sm leading-relaxed text-base-content/55">
                  Si no ves lo que quieres en el inventario, dilo aquí: se busca o se
                  importa. También tasamos el vehículo que quieras vender o dejar en
                  consignación.
                </p>

                <div className="mt-7">
                  <FormularioContacto />
                </div>
              </div>
            </Revelar>
          </div>
        </section>

        <section className="border-t border-white/10 px-4 py-16 text-center sm:px-6">
          <p className="text-base-content/55">¿Prefieres mirar primero?</p>
          <Link href="/vehiculos" className="btn btn-vidrio mt-4">
            Ver el inventario
          </Link>
        </section>

        <BloqueVenta />
      </main>

      <Footer />
    </>
  );
}

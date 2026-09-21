import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Revelar from "@/components/Revelar";
import TituloAnimado from "@/components/TituloAnimado";
import Filetes from "@/components/Filetes";
import FormularioContacto from "@/components/FormularioContacto";
import BotonContacto from "@/components/BotonContacto";
import BloqueVenta from "@/components/demo/BloqueVenta";
import { esDemo } from "@/libs/demo";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

const { business } = config;

export const metadata = getSEOTags({
  title: `Contacto · ${config.appName}`,
  description: `Escríbenos por WhatsApp o Instagram, o pásate por la sede en ${business.direccion}, ${business.ciudad}. También recibimos vehículos en consignación.`,
  canonicalUrlRelative: "/contacto",
});

export default async function Contacto({ searchParams }) {
  const params = await searchParams;
  const demo = esDemo();

  // `?motivo=consignar` abre el formulario ya en la pestaña de consignación.
  // Es lo que llevan los botones de la portada y de la cabecera: quien pulsa
  // "consignar mi vehículo" no debería tener que volver a decirlo al llegar.
  const consignando = params?.motivo === "consignar";

  return (
    <>
      <Header />

      <main>
        <section className="relative overflow-hidden border-b border-base-content/8 px-4 py-20 sm:px-6">
          <Filetes variante="seccion" />
          <div className="textura absolute inset-0" aria-hidden="true" />

          <div className="relative mx-auto max-w-7xl">
            <Revelar>
              <span className="banda" aria-hidden="true" />
            </Revelar>
            <TituloAnimado as="h1" className="display mt-6 text-3xl sm:text-4xl">
              {consignando ? "Vende el tuyo" : "Hablemos"}
            </TituloAnimado>
            <Revelar retraso={200}>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-base-content/60">
                {consignando ? (
                  <>
                    Dinos marca, año y kilometraje y te decimos en qué precio
                    sale y cuánto suele tardar. El vehículo sigue siendo tuyo
                    hasta que se venda.
                  </>
                ) : (
                  <>
                    Lo más rápido es WhatsApp. Si prefieres, déjanos qué buscas y
                    te escribimos nosotros. Y si estás por {business.ciudad},
                    pásate por la sede a verlos.
                  </>
                )}
              </p>
            </Revelar>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
            {/* Canales */}
            <div className="space-y-4">
              <Revelar>
                <div className="ficha p-6">
                  <p className="rotulo">La sede</p>
                  <address className="display mt-3 not-italic text-2xl leading-tight">
                    {business.direccion}
                  </address>
                  <p className="cifra mt-2 text-sm text-primary">
                    {business.ciudad}, {business.estado}
                  </p>
                  <p className="mt-4 text-sm text-base-content/55">{business.horario}</p>
                </div>
              </Revelar>

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
                  <p className="display mt-3 text-2xl transition-colors group-hover:text-primary">
                    @{business.instagram}
                  </p>
                  {/* Las cifras del perfil solo salen si están puestas. Sin
                      ellas se enseña la segunda cuenta, que es un dato que sí
                      tenemos y que además anuncian ellos mismos. */}
                  <p className="cifra mt-2 text-sm text-base-content/55">
                    {business.seguidores
                      ? `${business.seguidores} seguidores · ${business.publicaciones} publicaciones`
                      : `También en @${business.instagramSecundario}`}
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
                          className="mt-2 h-px w-4 shrink-0 bg-primary"
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
                <h2 className="display mt-3 text-2xl">
                  {consignando ? "Cuéntanos del vehículo" : "Cuéntanos qué buscas"}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-base-content/55">
                  {consignando
                    ? "Con la marca, el año y el kilometraje ya se puede hablar de precio. El resto —fotos, revisión y publicación— lo hacemos nosotros cuando traigas el vehículo a la sede."
                    : "Si no ves lo que quieres en el catálogo, dilo aquí: entran unidades cada semana y te avisamos cuando llegue algo parecido."}
                </p>

                <div className="mt-7">
                  <FormularioContacto motivoInicial={consignando ? "consignar" : "comprar"} />
                </div>
              </div>
            </Revelar>
          </div>
        </section>

        <section className="border-t border-base-content/8 px-4 py-16 text-center sm:px-6">
          <p className="text-base-content/55">¿Prefieres mirar primero?</p>
          <Link href="/vehiculos" className="btn btn-filo mt-5">
            Ver el catálogo
          </Link>
        </section>

        <BloqueVenta />
      </main>

      <Footer />
    </>
  );
}

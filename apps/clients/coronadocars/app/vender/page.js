import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Revelar from "@/components/Revelar";
import TituloAnimado from "@/components/TituloAnimado";
import Escenario from "@/components/Escenario";
import MarcaCoronado from "@/components/MarcaCoronado";
import FormularioVender from "@/components/FormularioVender";
import BotonContacto from "@/components/BotonContacto";
import BloqueVenta from "@/components/demo/BloqueVenta";
import { esDemo } from "@/libs/demo";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

const { business } = config;

export const metadata = getSEOTags({
  title: `Vende o consigna tu carro · ${config.appName}`,
  description:
    "Compramos tu carro o lo vendemos por ti en consignación: avalúo, sesión de fotos en nuestro centro de publicaciones, publicación y acompañamiento hasta el traspaso. Grupo Autos del Centro, Valencia.",
  canonicalUrlRelative: "/vender",
});

/**
 * «¿Quieres vender tu carro?».
 *
 * Es su primera publicación fijada y la mitad de lo que dice su logotipo
 * —"Compra - Venta y Consignación de Vehículos"—, así que tiene página propia
 * y no un párrafo al final del contacto. La página contesta lo que trae quien
 * está pensando en vender —qué hacéis por mí, cómo sale publicado, cuánto
 * tarda— antes de pedirle un solo dato.
 *
 * Lo que NO dice es cuánto cobran por consignar: no lo publican, y no se
 * inventa. Cuando lo den, va en `config.business.consignar`.
 */
export default function Vender() {
  const demo = esDemo();

  return (
    <>
      <Header />

      <main>
        {/* ------------------------------------------------------------------
            Portada de la página.
           ---------------------------------------------------------------- */}
        <section className="relative overflow-hidden border-b border-base-content/8 px-4 py-20 sm:px-6">
          <Escenario variante="seccion" />
          <div className="textura absolute inset-0" aria-hidden="true" />

          <div className="relative mx-auto max-w-7xl">
            <Revelar>
              <span className="filo" aria-hidden="true" />
            </Revelar>

            <TituloAnimado as="h1" className="display mt-6 text-5xl sm:text-6xl lg:text-7xl">
              ¿Quieres vender tu <span className="text-primary">carro</span>?
            </TituloAnimado>

            <Revelar retraso={220}>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-base-content/60">
                Te lo compramos o lo vendemos por ti en{" "}
                <span className="font-semibold text-base-content">consignación</span>.
                Nos encargamos del avalúo, de la sesión de fotos en nuestro centro
                de publicaciones, de ponerlo delante de nuestra cuenta y de
                acompañarte hasta el traspaso.
              </p>
            </Revelar>

            <Revelar retraso={300}>
              <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-base-content/10 pt-7">
                <div className="min-w-0">
                  <p className="cifra text-3xl font-bold text-base-content">
                    {business.seguidores}
                  </p>
                  <p className="mt-1 text-[0.7rem] uppercase tracking-wider text-base-content/40">
                    seguidores lo verán
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="cifra text-3xl font-bold text-base-content">
                    {business.publicaciones}
                  </p>
                  <p className="mt-1 text-[0.7rem] uppercase tracking-wider text-base-content/40">
                    publicaciones hechas
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="display text-3xl text-primary">Valencia</p>
                  <p className="mt-1 text-[0.7rem] uppercase tracking-wider text-base-content/40">
                    {business.centroLargo}
                  </p>
                </div>
              </div>
            </Revelar>
          </div>
        </section>

        {/* ------------------------------------------------------------------
            Qué hacemos por ti.
           ---------------------------------------------------------------- */}
        <section className="relative overflow-hidden px-4 py-20 sm:px-6">
          <div className="textura absolute inset-0" aria-hidden="true" />
          <div className="textura-diagonal absolute inset-0" aria-hidden="true" />

          <div className="relative mx-auto max-w-6xl">
            <Revelar>
              <p className="rotulo">Qué hacemos nosotros</p>
            </Revelar>

            <TituloAnimado as="h2" className="display mt-4 text-4xl sm:text-5xl">
              Tú traes el carro. Lo demás es nuestro
            </TituloAnimado>

            <div className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-box)] border border-base-content/10 bg-base-content/10 sm:grid-cols-2 lg:grid-cols-4">
              {business.consignar.map((paso, i) => (
                <Revelar key={paso.titulo} retraso={i * 110}>
                  <div className="flex h-full flex-col bg-base-100 p-7">
                    <span className="cifra text-xs text-primary">0{i + 1}</span>
                    <h3 className="display mt-4 text-2xl">{paso.titulo}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-base-content/60">
                      {paso.detalle}
                    </p>
                  </div>
                </Revelar>
              ))}
            </div>

            {/* Por qué sus fotos venden: es lo que se dicen a sí mismos en la bio
                ("Centro de publicaciones 📷") y lo que se ve en cada ficha. Quien
                va a dejar su carro en manos ajenas quiere saber cómo va a salir. */}
            <Revelar retraso={200}>
              <div className="panel mt-10 flex flex-col gap-5 p-7 sm:flex-row sm:items-center">
                <MarcaCoronado detalle={false} className="h-12 w-auto shrink-0" />
                <p className="text-sm leading-relaxed text-base-content/60">
                  <span className="font-semibold text-base-content">
                    Un centro de publicaciones, no un anuncio más.
                  </span>{" "}
                  Llevamos {business.publicaciones} publicaciones hechas igual: el
                  carro contra la misma pared, su año, su modelo, su kilometraje y
                  su transmisión a la vista. Quien sigue la cuenta ya sabe leerlas,
                  y por eso un carro nuestro se entiende de un vistazo.
                </p>
              </div>
            </Revelar>
          </div>
        </section>

        {/* ------------------------------------------------------------------
            El formulario. En demo la ruta del servidor lo corta.
           ---------------------------------------------------------------- */}
        <section
          id="avaluo"
          className="relative overflow-hidden border-t border-base-content/8 bg-base-200 px-4 py-20 sm:px-6"
        >
          <div className="textura absolute inset-0" aria-hidden="true" />

          <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <div className="min-w-0">
              <Revelar>
                <span className="filo" aria-hidden="true" />
                <p className="rotulo mt-5">Empieza por aquí</p>
              </Revelar>

              <TituloAnimado as="h2" className="display mt-4 text-4xl sm:text-5xl">
                Pide tu avalúo
              </TituloAnimado>

              <Revelar retraso={180}>
                <p className="mt-6 leading-relaxed text-base-content/60">
                  Con la marca, el año y el kilometraje ya podemos decirte en cuánto se
                  está vendiendo hoy un carro como el tuyo en Valencia. Si el número
                  te cuadra, lo traes al {business.centroLargo}, lo vemos, le hacemos
                  las fotos y sale publicado.
                </p>
              </Revelar>

              <Revelar retraso={240}>
                <ul className="mt-8 space-y-3 border-t border-base-content/10 pt-7 text-sm text-base-content/60">
                  <li className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-2.5 shrink-0 -skew-x-12 bg-primary" />
                    Compra directa o consignación: tú eliges.
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-2.5 shrink-0 -skew-x-12 bg-primary" />
                    Las fotos y los videos los hacemos nosotros, en el local.
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-2.5 shrink-0 -skew-x-12 bg-primary" />
                    Filtramos a los interesados: no te pasamos curiosos.
                  </li>
                </ul>
              </Revelar>

              <Revelar retraso={300}>
                <div className="mt-8">
                  <BotonContacto demo={demo} vender className="btn btn-filo w-full sm:w-auto">
                    Prefiero escribir por WhatsApp
                  </BotonContacto>
                </div>
              </Revelar>
            </div>

            <Revelar desde="corte" retraso={140} className="min-w-0">
              <div className="panel p-7 sm:p-8">
                <FormularioVender />
                <p className="mt-5 text-xs leading-relaxed text-base-content/40">
                  Solo lo usamos para hacerte el avalúo y contactarte. Ver la{" "}
                  <Link href="/privacy-policy" className="underline hover:text-base-content/70">
                    política de privacidad
                  </Link>
                  .
                </p>
              </div>
            </Revelar>
          </div>
        </section>

        <BloqueVenta />
      </main>

      <Footer />
    </>
  );
}

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Revelar from "@/components/Revelar";
import TituloAnimado from "@/components/TituloAnimado";
import Escenario from "@/components/Escenario";
import MarcaCorona from "@/components/MarcaCorona";
import FormularioVender from "@/components/FormularioVender";
import BotonContacto from "@/components/BotonContacto";
import BloqueVenta from "@/components/demo/BloqueVenta";
import { esDemo } from "@/libs/demo";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

const { business } = config;

export const metadata = getSEOTags({
  title: `Publica tu vehículo gratis · ${config.appName}`,
  description:
    "Ponemos tu carro a la venta sin cobrarte: avalúo, fotos y videos, promoción en nuestra cuenta y seguimiento hasta que se cierre el trato. En el C.C.C.T., Caracas.",
  canonicalUrlRelative: "/vender",
});

/**
 * «Publica tu vehículo gratis».
 *
 * Es la segunda línea de su bio y lo que más repiten en sus publicaciones, así
 * que tiene página propia y no un párrafo al final del contacto. La página
 * contesta las tres preguntas que trae quien está pensando en vender —qué
 * hacéis por mí, qué me cuesta, cuánto tarda— antes de pedirle un solo dato.
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
              ¿Vas a vender tu <span className="text-primary">carro</span>?
            </TituloAnimado>

            <Revelar retraso={220}>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-base-content/60">
                Nosotros te ayudamos. Nos encargamos del avalúo, de las fotos y los
                videos, de publicarlo y promocionarlo, y del seguimiento de la venta.{" "}
                <span className="font-semibold text-base-content">
                  Completamente gratis
                </span>
                : no cobramos por publicar y no hay cuota de entrada.
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
                    vehículos publicados
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="cifra text-3xl font-bold text-primary">$0</p>
                  <p className="mt-1 text-[0.7rem] uppercase tracking-wider text-base-content/40">
                    lo que cuesta publicar
                  </p>
                </div>
              </div>
            </Revelar>
          </div>
        </section>

        {/* ------------------------------------------------------------------
            Qué hacemos por ti, que es lo que enumera su publicación fijada.
           ---------------------------------------------------------------- */}
        <section className="relative overflow-hidden px-4 py-20 sm:px-6">
          <div className="textura absolute inset-0" aria-hidden="true" />
          <div className="textura-rombos absolute inset-0" aria-hidden="true" />

          <div className="relative mx-auto max-w-6xl">
            <Revelar>
              <p className="rotulo">Qué hacemos nosotros</p>
            </Revelar>

            <TituloAnimado as="h2" className="display mt-4 text-4xl sm:text-5xl">
              Tú traes el carro. Lo demás es nuestro
            </TituloAnimado>

            <div className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-box)] border border-base-content/10 bg-base-content/10 sm:grid-cols-2 lg:grid-cols-4">
              {business.publicarGratis.map((paso, i) => (
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

            {/* Lo que casi nadie dice y conviene decir: por qué es gratis. Quien
                va a dejar su carro en manos ajenas se lo pregunta, y si no se lo
                contestas aquí se lo contesta él solo, casi siempre mal. */}
            <Revelar retraso={200}>
              <div className="panel mt-10 flex flex-col gap-5 p-7 sm:flex-row sm:items-center">
                <MarcaCorona
                  className="h-12 w-16 shrink-0 text-base-content/35"
                  detalle={false}
                />
                <p className="text-sm leading-relaxed text-base-content/60">
                  <span className="font-semibold text-base-content">
                    ¿Y por qué es gratis?
                  </span>{" "}
                  Porque vivimos de vender carros, no de cobrar por publicarlos.
                  Cuando el tuyo se vende, ganamos los dos; si no se vende, no nos
                  has pagado nada. Por eso el avalúo es honesto: poner un precio
                  inflado solo consigue que el carro se quede meses parado.
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
                  está vendiendo hoy un carro como el tuyo. Si el número te cuadra,
                  agendamos la cita en el {business.centro}, lo vemos, le hacemos las
                  fotos y sale publicado.
                </p>
              </Revelar>

              <Revelar retraso={240}>
                <ul className="mt-8 space-y-3 border-t border-base-content/10 pt-7 text-sm text-base-content/60">
                  <li className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-primary" />
                    No cobramos por publicar ni por el avalúo.
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-primary" />
                    Las fotos y los videos los hacemos nosotros.
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-primary" />
                    Filtramos a los interesados: no te pasamos curiosos.
                  </li>
                </ul>
              </Revelar>

              <Revelar retraso={300}>
                <div className="mt-8">
                  <BotonContacto demo={demo} vender className="btn btn-filo w-full sm:w-auto">
                    Prefiero escribir por Instagram
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

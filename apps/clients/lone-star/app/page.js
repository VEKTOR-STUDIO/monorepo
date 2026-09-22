import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Revelar from "@/components/Revelar";
import TituloAnimado from "@/components/TituloAnimado";
import Escenario from "@/components/Escenario";
import Parallax from "@/components/Parallax";
import Cifra from "@/components/Cifra";
import MarcaDealernauta from "@/components/MarcaDealernauta";
import FotoVehiculo from "@/components/FotoVehiculo";
import PantallaVehiculo from "@/components/PantallaVehiculo";
import CarruselCatalogo from "@/components/CarruselCatalogo";
import BotonContacto from "@/components/BotonContacto";
import SeccionPanel from "@/components/SeccionPanel";
import Cintillo from "@/components/Cintillo";
import SeccionPorQue from "@/components/SeccionPorQue";
import BloqueVenta from "@/components/demo/BloqueVenta";
import {
  leerVehiculos,
  facetasDe,
  filtrar,
  hayPreciosProvisionales,
  totalVerificadas,
  SEGMENTOS,
} from "@/libs/vehiculos";
import { esDemo } from "@/libs/demo";
import { enDolares } from "@/libs/formato";
import config from "@/config";

// El inventario se toca a mano y cambia un par de veces por semana: media hora
// de caché es de sobra y ahorra leer el JSON en cada visita.
export const revalidate = 1800;

export default function Inicio() {
  const vehiculos = leerVehiculos();
  const facetas = facetasDe(vehiculos);
  const demo = esDemo();

  // El escaparate: los marcados como destacados, y si no hay, los más nuevos.
  const escaparate = vehiculos.filter((v) => v.destacado && v.disponible).slice(0, 4);
  const portada = escaparate[0] || vehiculos[0];
  const desde = Math.min(...vehiculos.map((v) => v.precio));

  // Los dos negocios de la casa: cuántas unidades hay de cada uno y desde
  // cuánto arranca cada lado.
  const caminos = SEGMENTOS.map((segmento) => {
    const lista = filtrar(vehiculos, { segmento: segmento.slug, orden: "precio-asc" });
    return { ...segmento, total: lista.length, desde: lista[0]?.precio, muestra: lista[0] };
  }).filter((c) => c.total > 0);

  return (
    <>
      <Header />

      <main>
        {/* ------------------------------------------------------------------
            Portada.
            Es la escena de sus publicaciones a pantalla completa: cielo
            naranja, la ciudad recortada, el asfalto abajo. Lo único que cambia
            es que aquí el titular es la frase con la que se presentan.
           ---------------------------------------------------------------- */}
        <section className="relative flex min-h-svh items-center overflow-hidden px-4 pb-16 pt-10 sm:px-6">
          <Escenario variante="portada" />
          <div className="textura absolute inset-0" aria-hidden="true" />

          <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            {/* ---- Lo que dice ---- */}
            <div className="min-w-0">
              <Revelar desde="izquierda">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <MarcaDealernauta className="h-7 w-24 shrink-0 text-base-content" />
                  <span className="cifra text-[0.65rem] tracking-[0.28em] text-base-content/45">
                    CARACAS · SAN ANTONIO DE LOS ALTOS
                  </span>
                </div>
              </Revelar>

              <TituloAnimado
                as="h1"
                retraso={150}
                className="display mt-7 text-5xl leading-[0.88] sm:text-6xl lg:text-7xl xl:text-8xl"
              >
                Tu vehículo soñado <span className="text-primary">convertido en realidad</span>
              </TituloAnimado>

              <Revelar retraso={420}>
                <p className="mt-7 max-w-lg text-base leading-relaxed text-base-content/60 sm:text-lg">
                  {config.business.lema}. Unidades 0 km, usados en perfectas condiciones y
                  camiones nuevos y usados, cada uno con su ficha completa y su precio a
                  la vista.
                </p>
              </Revelar>

              <Revelar retraso={520}>
                <div className="mt-9 flex w-full max-w-md flex-col gap-3 sm:flex-row">
                  <Link href="/vehiculos" className="btn btn-primary flex-1">
                    Ver el inventario
                  </Link>
                  <BotonContacto demo={demo} className="btn btn-filo flex-1">
                    Escribir por WhatsApp
                  </BotonContacto>
                </div>
              </Revelar>

              {/* Las cifras que dan confianza de entrada. Suben contando cuando
                  entran en pantalla; el HTML del servidor ya trae el número
                  final escrito, así que sin JavaScript se leen igual.

                  En móvil van más pequeñas y con menos hueco a propósito: a
                  tamaño de escritorio, "$18.900" no cabe en un tercio de 390 px
                  y se montaba encima de la cifra de al lado. El `min-w-0` es lo
                  que deja a las columnas encogerse; sin él, la anchura mínima
                  del contenido manda sobre el reparto de la rejilla. */}
              <Revelar retraso={620}>
                <dl className="mt-14 grid w-full max-w-xl grid-cols-3 gap-3 border-t border-base-content/10 pt-7 sm:gap-6">
                  <div className="min-w-0">
                    <dt className="cifra text-2xl font-bold text-base-content sm:text-3xl">
                      <Cifra valor={vehiculos.length} />
                    </dt>
                    <dd className="mt-1.5 text-[0.6rem] uppercase tracking-wider text-base-content/40 sm:text-[0.7rem]">
                      en inventario
                    </dd>
                  </div>
                  <div className="min-w-0">
                    <dt className="cifra text-2xl font-bold text-primary sm:text-3xl">
                      <Cifra valor={desde} formato="dolaresRedondos" />
                    </dt>
                    <dd className="mt-1.5 text-[0.6rem] uppercase tracking-wider text-base-content/40 sm:text-[0.7rem]">
                      desde
                    </dd>
                  </div>
                  <div className="min-w-0">
                    <dt className="cifra text-2xl font-bold text-base-content sm:text-3xl">
                      {config.business.seguidores}
                    </dt>
                    <dd className="mt-1.5 text-[0.6rem] uppercase tracking-wider text-base-content/40 sm:text-[0.7rem]">
                      en Instagram
                    </dd>
                  </div>
                </dl>
              </Revelar>
            </div>

            {/* ---- La unidad de portada ---- */}
            {portada && (
              <Revelar desde="corte" retraso={260} className="hidden lg:block">
                <Parallax desde={-6} hasta={6}>
                  <Link href={`/vehiculo/${portada.slug}`} className="group block">
                    <FotoVehiculo
                      vehiculo={portada}
                      prioridad
                      className="aspect-4/5 w-full"
                      sizes="45vw"
                    />
                    <p className="display mt-4 flex items-baseline justify-between gap-4 text-lg">
                      <span className="text-base-content/70">
                        {portada.marca} {portada.modelo}
                      </span>
                      <span className="cifra text-xl font-bold text-primary">
                        {enDolares(portada.precio)}
                      </span>
                    </p>
                  </Link>
                </Parallax>
              </Revelar>
            )}
          </div>

          {/* La flecha de "sigue bajando". */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center"
            aria-hidden="true"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="animate-[flecha_2.2s_ease-in-out_infinite] text-base-content/50"
            >
              <path d="M12 5v14M6 13l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </section>

        {/* ------------------------------------------------------------------
            El inventario entero, desfilando de lado.
           ---------------------------------------------------------------- */}
        <CarruselCatalogo vehiculos={vehiculos} />

        {/* ------------------------------------------------------------------
            Los dos caminos: vehículos o camiones. Es el corte que de verdad
            hace este negocio —dos sedes, dos cuentas de Instagram— y la
            primera pregunta de cualquiera que llega.
           ---------------------------------------------------------------- */}
        <section className="relative overflow-hidden border-t border-base-content/8 px-4 py-24 sm:px-6">
          <Escenario variante="seccion" />
          <div className="textura absolute inset-0" aria-hidden="true" />

          <div className="relative mx-auto max-w-7xl">
            <Revelar>
              <span className="ala" aria-hidden="true" />
              <p className="rotulo mt-5">Qué buscas</p>
            </Revelar>

            <TituloAnimado as="h2" className="display mt-4 text-4xl sm:text-5xl">
              Dos negocios, una sola casa
            </TituloAnimado>

            <div className="mt-14 grid gap-6 lg:grid-cols-2">
              {caminos.map((camino, i) => (
                <Revelar key={camino.slug} desde="corte" retraso={i * 140}>
                  <Link
                    href={`/vehiculos?segmento=${camino.slug}`}
                    className="ficha group flex h-full flex-col overflow-hidden"
                  >
                    <div className="relative">
                      <FotoVehiculo
                        vehiculo={camino.muestra}
                        className="aspect-16/10 w-full"
                        encajar="cover"
                        compacta
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                      <div
                        className="absolute inset-0 bg-linear-to-t from-base-200 via-base-200/20 to-transparent"
                        aria-hidden="true"
                      />
                    </div>

                    <div className="flex flex-1 flex-col p-6 sm:p-7">
                      <p className="display text-3xl sm:text-4xl">
                        {camino.slug === "camion" ? (
                          <>
                            <span className="text-primary">Camiones</span> nuevos y usados
                          </>
                        ) : (
                          <>
                            Vehículos <span className="text-primary">0 km y usados</span>
                          </>
                        )}
                      </p>
                      <p className="mt-4 flex-1 leading-relaxed text-base-content/60">
                        {camino.resumen}
                      </p>

                      <div className="mt-7 flex items-end justify-between gap-4 border-t border-base-content/10 pt-5">
                        <div className="min-w-0">
                          <p className="cifra text-2xl font-bold text-base-content">
                            {enDolares(camino.desde)}
                          </p>
                          <p className="mt-1 text-[0.7rem] uppercase tracking-wider text-base-content/40">
                            desde · {camino.total}{" "}
                            {camino.total === 1 ? "unidad" : "unidades"}
                          </p>
                        </div>
                        <span
                          className="display shrink-0 text-sm text-primary transition-transform duration-300 group-hover:translate-x-1.5"
                          aria-hidden="true"
                        >
                          Verlos →
                        </span>
                      </div>
                    </div>
                  </Link>
                </Revelar>
              ))}
            </div>

            {/* Las marcas que mueven, que es la tira que encabeza sus piezas. */}
            <Revelar retraso={180}>
              <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-base-content/10 pt-8">
                <p className="rotulo">Marcas que movemos</p>
                {facetas.marcas.map((m) => (
                  <Link
                    key={m.valor}
                    href={`/vehiculos?marca=${encodeURIComponent(m.valor)}`}
                    className="display-recto text-lg tracking-wide text-base-content/45 transition-colors hover:text-primary"
                  >
                    {m.valor}
                    <span className="cifra ml-1.5 text-xs opacity-60">{m.total}</span>
                  </Link>
                ))}
              </div>
            </Revelar>
          </div>
        </section>

        {/* ------------------------------------------------------------------
            El escaparate: los destacados, uno por pantalla, alternando lado.
           ---------------------------------------------------------------- */}
        {escaparate.map((vehiculo, i) => (
          <PantallaVehiculo
            key={vehiculo.slug}
            vehiculo={vehiculo}
            invertido={i % 2 === 1}
            demo={demo}
          />
        ))}

        {/* ------------------------------------------------------------------
            Cómo se compra. Es el recorrido que hoy se hace entre el Instagram,
            el WhatsApp y las dos sedes, puesto por escrito para que el
            comprador sepa a qué atenerse.
           ---------------------------------------------------------------- */}
        <section
          id="como-comprar"
          className="relative overflow-hidden border-t border-base-content/8 bg-base-200 px-4 py-24 sm:px-6"
        >
          <div className="textura absolute inset-0" aria-hidden="true" />
          <div className="textura-via absolute inset-0" aria-hidden="true" />

          <div className="relative mx-auto max-w-5xl">
            <Revelar className="text-center">
              <p className="rotulo">Cómo comprar</p>
            </Revelar>

            <TituloAnimado as="h2" className="display mt-4 text-center text-4xl sm:text-5xl">
              Tres pasos, sin vueltas
            </TituloAnimado>

            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {config.compra.pasos.map((paso, i) => (
                <Revelar key={paso.titulo} desde="giro" retraso={i * 130}>
                  <div className="relative h-full border-t-2 border-primary/40 pt-6">
                    <span className="display absolute -top-11 left-0 text-5xl text-base-content/12">
                      0{i + 1}
                    </span>
                    <h3 className="display text-xl">{paso.titulo}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-base-content/60">
                      {paso.detalle}
                    </p>
                  </div>
                </Revelar>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------
            Las dos sedes. Va con sección propia porque es lo que de verdad
            distingue a DealerNauta: dos locales, dos cuentas y dos teléfonos,
            uno para carros y otro para camiones.
           ---------------------------------------------------------------- */}
        <section
          id="sedes"
          className="relative overflow-hidden border-t border-base-content/8 px-4 py-24 sm:px-6"
        >
          <Escenario variante="seccion" />
          <div className="textura absolute inset-0" aria-hidden="true" />

          <div className="relative mx-auto max-w-6xl">
            <Revelar>
              <span className="ala" aria-hidden="true" />
              <p className="rotulo mt-5">Dónde estamos</p>
            </Revelar>

            <TituloAnimado as="h2" className="display mt-4 text-4xl sm:text-5xl lg:text-6xl">
              Dos sedes, dos especialidades
            </TituloAnimado>

            <Revelar retraso={180}>
              <p className="mt-6 max-w-xl leading-relaxed text-base-content/60">
                Los vehículos se ven en Caracas y los camiones en San Antonio de los
                Altos. Cada sede tiene su equipo, su teléfono y su cuenta, así que
                escribes directo a quien te va a atender.
              </p>
            </Revelar>

            <div className="mt-14 grid gap-6 lg:grid-cols-2">
              {config.business.sedes.map((sede, i) => (
                <Revelar key={sede.slug} desde="corte" retraso={i * 140}>
                  <div className="ficha flex h-full flex-col p-7 sm:p-8">
                    <p className="rotulo">{sede.estado}</p>
                    <h3 className="display mt-3 text-3xl sm:text-4xl">{sede.nombre}</h3>
                    <p className="cifra mt-2 text-sm text-primary">{sede.zona}</p>

                    <p className="mt-5 flex-1 leading-relaxed text-base-content/60">
                      {sede.resumen}
                    </p>

                    <dl className="mt-7 grid grid-cols-2 gap-4 border-t border-base-content/10 pt-5">
                      <div className="min-w-0">
                        <dt className="text-[0.65rem] uppercase tracking-wider text-base-content/40">
                          Teléfono
                        </dt>
                        <dd className="cifra mt-1 truncate text-base font-semibold text-base-content">
                          {sede.telefono}
                        </dd>
                      </div>
                      <div className="min-w-0">
                        <dt className="text-[0.65rem] uppercase tracking-wider text-base-content/40">
                          Instagram
                        </dt>
                        <dd className="mt-1 truncate text-base font-semibold">
                          <a
                            href={sede.instagramUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-base-content transition-colors hover:text-primary"
                          >
                            @{sede.instagram}
                          </a>
                        </dd>
                      </div>
                    </dl>

                    <BotonContacto
                      demo={demo}
                      vehiculo={{ sede: sede.slug }}
                      className="btn btn-primary mt-6 w-full"
                    >
                      Escribir a {sede.nombre}
                    </BotonContacto>
                  </div>
                </Revelar>
              ))}
            </div>

            {/* Lo que hacen, tal como lo dice el arco de su emblema. */}
            <Revelar retraso={200}>
              <ul className="mt-12 divide-y divide-base-content/10 border-y border-base-content/10">
                {config.business.servicios.map((servicio, i) => (
                  <li key={servicio} className="flex items-center gap-5 py-6">
                    <span className="cifra shrink-0 text-xs text-primary">0{i + 1}</span>
                    <span className="display text-2xl text-base-content/85">{servicio}</span>
                  </li>
                ))}
              </ul>

              <dl className="mt-8 grid grid-cols-2 gap-4">
                <div className="min-w-0">
                  <dt className="cifra text-3xl font-bold text-base-content">
                    {config.business.publicaciones}
                  </dt>
                  <dd className="mt-1 text-[0.7rem] uppercase tracking-wider text-base-content/40">
                    publicaciones
                  </dd>
                </div>
                <div className="min-w-0">
                  <dt className="cifra text-3xl font-bold text-base-content">
                    {config.business.seguidores}
                  </dt>
                  <dd className="mt-1 text-[0.7rem] uppercase tracking-wider text-base-content/40">
                    seguidores
                  </dd>
                </div>
              </dl>
            </Revelar>
          </div>
        </section>

        {/* ------------------------------------------------------------------
            Aquí cambia el interlocutor: lo que viene le habla al dueño de
            DealerNauta, no a quien vino a comprar un carro. El cintillo lo
            avisa.
           ---------------------------------------------------------------- */}
        {/* El panel se queda aunque se apague la demo: al comprador le explica
            por qué el inventario está al día. Lo que sí desaparece con la demo
            son los cintillos y la comparación. */}
        {demo && <Cintillo variante="venta" />}
        <SeccionPanel />
        {demo && <SeccionPorQue />}
        {demo && <Cintillo variante="cliente" />}

        {/* Aviso honesto sobre de dónde sale este inventario. */}
        {hayPreciosProvisionales() && (
          <section className="border-t border-base-content/8 px-4 py-14 sm:px-6">
            <div className="panel mx-auto max-w-3xl p-7 text-center">
              <p className="rotulo">Sobre este inventario</p>
              <p className="mt-4 text-sm leading-relaxed text-base-content/60">
                Las {totalVerificadas()} primeras unidades salen de la cuadrícula de{" "}
                <a
                  href={config.business.instagramCaracasUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline"
                >
                  @{config.business.instagramCaracas}
                </a>
                : son tus modelos, tus años y tus kilometrajes. El resto son unidades de
                muestra entre las marcas que tú mueves, puestas para que la página se
                pueda enseñar llena. Ningún precio es tuyo —tus publicaciones no llevan
                precio—, así que todos son referencias de mercado y se sustituyen desde
                el panel. Las fotos tampoco: Instagram no deja descargarlas, así que
                cada ficha dibuja la plantilla de tus propias publicaciones hasta que
                subas las tuyas.
              </p>
            </div>
          </section>
        )}

        {demo && <Cintillo variante="venta" />}
        <BloqueVenta />
      </main>

      <Footer />
    </>
  );
}

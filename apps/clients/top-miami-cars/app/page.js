import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Revelar from "@/components/Revelar";
import TituloAnimado from "@/components/TituloAnimado";
import Escenario from "@/components/Escenario";
import Parallax from "@/components/Parallax";
import Cifra from "@/components/Cifra";
import { LogoChapa } from "@/components/Logo";
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
  const sede = config.business.sedes[0];

  // El escaparate: los marcados como destacados, y si no hay, los más nuevos.
  const escaparate = vehiculos.filter((v) => v.destacado && v.disponible).slice(0, 4);
  const portada = escaparate[0] || vehiculos[0];
  const desde = Math.min(...vehiculos.map((v) => v.precio));

  // Los caminos de entrada: las tres carrocerías con más unidades, cada una
  // con su total, desde cuánto arranca y una unidad para enseñar.
  const caminos = facetas.tipos
    .map((tipo) => {
      const lista = filtrar(vehiculos, { tipo: tipo.slug, orden: "precio-asc" });
      return { ...tipo, desde: lista[0]?.precio, muestra: lista.find((v) => v.disponible) || lista[0] };
    })
    .sort((a, b) => b.total - a.total)
    .slice(0, 3);

  return (
    <>
      <Header />

      <main>
        {/* ------------------------------------------------------------------
            Portada.
            Es su logotipo a pantalla completa: el salón blanco, el escudo de
            acero a la derecha con la línea del deportivo dibujándose encima, y
            el titular con los dos tratamientos de su rótulo —blanco con filete
            azul, y azul con filete blanco—.
           ---------------------------------------------------------------- */}
        <section className="relative flex min-h-svh items-center overflow-hidden px-4 pb-16 pt-10 sm:px-6">
          <Escenario variante="portada" />
          <div className="textura absolute inset-0" aria-hidden="true" />

          <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            {/* ---- Lo que dice ---- */}
            <div className="min-w-0">
              <Revelar desde="izquierda">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <LogoChapa alto={64} prioridad />
                  <span className="cifra text-[0.65rem] uppercase tracking-[0.28em] text-base-content/55">
                    {config.business.categoria}
                    <br />
                    {config.business.ciudad} · Venezuela
                  </span>
                </div>
              </Revelar>

              <TituloAnimado
                as="h1"
                retraso={150}
                className="display mt-8 text-[2.6rem] leading-[1.08] sm:text-6xl lg:text-[4.1rem] xl:text-[4.75rem]"
              >
                <span className="rotulo-marca">Usados top,</span>{" "}
                <span className="rotulo-marca-inverso">listos para rodar</span>
              </TituloAnimado>

              <Revelar retraso={420}>
                <p className="mt-7 max-w-lg text-base leading-relaxed text-base-content/70 sm:text-lg">
                  {config.business.lema}. Camionetas, sedanes y pick-ups revisados, cada uno
                  con su ficha completa, su kilometraje y su precio a la vista.
                </p>
              </Revelar>

              <Revelar retraso={520}>
                <div className="mt-9 flex w-full max-w-md flex-col gap-4 sm:flex-row">
                  <Link href="/vehiculos" className="btn btn-primary sm:flex-1">
                    Ver el inventario
                  </Link>
                  <BotonContacto demo={demo} className="btn btn-filo sm:flex-1">
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
                      <Cifra valor={facetas.marcas.length} />
                    </dt>
                    <dd className="mt-1.5 text-[0.6rem] uppercase tracking-wider text-base-content/50 sm:text-[0.7rem]">
                      marcas
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
            Los caminos de entrada: por carrocería, que es la primera pregunta
            de cualquiera que entra a un salón de usados.
           ---------------------------------------------------------------- */}
        <section className="relative overflow-hidden border-t border-base-content/8 bg-base-200 px-4 py-24 sm:px-6">
          <Escenario variante="seccion" />
          <div className="textura absolute inset-0" aria-hidden="true" />

          <div className="relative mx-auto max-w-7xl">
            <Revelar>
              <span className="filete" aria-hidden="true" />
              <p className="rotulo mt-5">Qué buscas</p>
            </Revelar>

            <TituloAnimado as="h2" className="display mt-4 text-3xl sm:text-4xl lg:text-5xl">
              Empieza por la carrocería
            </TituloAnimado>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {caminos.map((camino, i) => (
                <Revelar key={camino.slug} desde="corte" retraso={i * 140}>
                  <Link
                    href={`/vehiculos?tipo=${camino.slug}`}
                    className="ficha group flex h-full flex-col overflow-hidden"
                  >
                    <FotoVehiculo
                      vehiculo={camino.muestra}
                      className="aspect-16/10 w-full"
                      encajar="cover"
                      compacta
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />

                    <div className="flex flex-1 flex-col p-6">
                      <p className="display text-2xl text-primary">{camino.nombre}</p>
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-base-content/65">
                        {camino.resumen}
                      </p>

                      <div className="mt-6 flex items-end justify-between gap-4 border-t border-base-content/10 pt-5">
                        <div className="min-w-0">
                          <p className="cifra text-xl font-bold text-base-content">
                            {enDolares(camino.desde)}
                          </p>
                          <p className="mt-1 text-[0.7rem] uppercase tracking-wider text-base-content/50">
                            desde · {camino.total}{" "}
                            {camino.total === 1 ? "unidad" : "unidades"}
                          </p>
                        </div>
                        <span
                          className="display shrink-0 text-xs text-primary transition-transform duration-300 group-hover:translate-x-1.5"
                          aria-hidden="true"
                        >
                          Verlas →
                        </span>
                      </div>
                    </div>
                  </Link>
                </Revelar>
              ))}
            </div>

            {/* Las marcas que hay en el salón, cada una con su enlace al filtro. */}
            <Revelar retraso={180}>
              <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-base-content/10 pt-8">
                <p className="rotulo">Marcas en el salón</p>
                {facetas.marcas.map((m) => (
                  <Link
                    key={m.valor}
                    href={`/vehiculos?marca=${encodeURIComponent(m.valor)}`}
                    className="display-recto text-base text-base-content/55 transition-colors hover:text-primary"
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
            Cómo se compra. Es el recorrido normal en un salón de usados, puesto
            por escrito para que el comprador sepa a qué atenerse.
           ---------------------------------------------------------------- */}
        <section
          id="como-comprar"
          className="sobre-azul relative overflow-hidden px-4 py-24 sm:px-6"
        >
          <div className="textura-brillo absolute inset-0" aria-hidden="true" />

          <div className="relative mx-auto max-w-5xl">
            <Revelar className="text-center">
              <p className="rotulo">Cómo comprar</p>
            </Revelar>

            <TituloAnimado as="h2" className="display mt-4 text-center text-3xl sm:text-4xl lg:text-5xl">
              Tres pasos, sin vueltas
            </TituloAnimado>

            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {config.compra.pasos.map((paso, i) => (
                <Revelar key={paso.titulo} desde="giro" retraso={i * 130}>
                  <div className="relative h-full border-t-2 border-base-content/30 pt-6">
                    <span className="display absolute -top-11 left-0 text-4xl text-base-content/25">
                      0{i + 1}
                    </span>
                    <h3 className="display text-lg">{paso.titulo}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-base-content/75">
                      {paso.detalle}
                    </p>
                  </div>
                </Revelar>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------
            Dónde están. Un solo salón, así que va entero: dirección, teléfono
            y lo que hacen. El dato sale de su ficha de Google, tal cual.
           ---------------------------------------------------------------- */}
        <section
          id="sedes"
          className="relative overflow-hidden border-t border-base-content/8 px-4 py-24 sm:px-6"
        >
          <Escenario variante="seccion" />
          <div className="textura absolute inset-0" aria-hidden="true" />

          <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <div className="min-w-0">
              <Revelar>
                <span className="filete" aria-hidden="true" />
                <p className="rotulo mt-5">Dónde estamos</p>
              </Revelar>

              <TituloAnimado as="h2" className="display mt-4 text-3xl sm:text-4xl lg:text-5xl">
                El salón, en <span className="text-primary">Caracas</span>
              </TituloAnimado>

              <Revelar retraso={180}>
                <p className="mt-6 max-w-xl leading-relaxed text-base-content/65">
                  {sede.resumen}
                </p>
              </Revelar>

              {/* Lo que hacen. */}
              <Revelar retraso={240}>
                <ul className="mt-10 divide-y divide-base-content/10 border-y border-base-content/10">
                  {config.business.servicios.map((servicio, i) => (
                    <li key={servicio} className="flex items-center gap-5 py-4">
                      <span className="cifra shrink-0 text-xs text-primary">0{i + 1}</span>
                      <span className="display-recto text-sm text-base-content/85 sm:text-base">
                        {servicio}
                      </span>
                    </li>
                  ))}
                </ul>
              </Revelar>
            </div>

            <Revelar desde="corte" retraso={140} className="min-w-0">
              <div className="ficha flex h-full flex-col p-7 sm:p-9">
                <p className="rotulo">{sede.estado}</p>
                <h3 className="display mt-3 text-2xl text-primary sm:text-3xl">{sede.zona}</h3>
                <address className="mt-3 not-italic leading-relaxed text-base-content/70">
                  {config.business.direccionLarga}
                </address>

                <dl className="mt-8 grid flex-1 content-start gap-5 border-t border-base-content/10 pt-6 sm:grid-cols-2">
                  <div className="min-w-0">
                    <dt className="text-[0.65rem] uppercase tracking-wider text-base-content/50">
                      Teléfono y WhatsApp
                    </dt>
                    <dd className="cifra mt-1 truncate text-lg font-semibold text-base-content">
                      {sede.telefono}
                    </dd>
                  </div>
                  <div className="min-w-0">
                    <dt className="text-[0.65rem] uppercase tracking-wider text-base-content/50">
                      Visitas
                    </dt>
                    <dd className="mt-1 text-base font-semibold text-base-content">
                      {config.business.horario || "Con cita previa por WhatsApp"}
                    </dd>
                  </div>
                  {sede.instagram && (
                    <div className="min-w-0">
                      <dt className="text-[0.65rem] uppercase tracking-wider text-base-content/50">
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
                  )}
                </dl>

                <BotonContacto
                  demo={demo}
                  vehiculo={{ sede: sede.slug }}
                  className="btn btn-primary mt-8 w-full"
                >
                  Pedir cita en el salón
                </BotonContacto>
                {/* Sale hacia Google Maps, no hacia el negocio: en demo no hay
                    nada que cortar aquí. */}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${config.business.nombre}, ${config.business.direccionLarga}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-filo mt-4 w-full"
                >
                  Cómo llegar
                </a>
              </div>
            </Revelar>
          </div>
        </section>

        {/* ------------------------------------------------------------------
            Aquí cambia el interlocutor: lo que viene le habla al dueño de Top
            Miami Cars, no a quien vino a comprar un carro. El cintillo lo
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
              <p className="mt-4 text-sm leading-relaxed text-base-content/70">
                Lo tuyo aquí es tu logotipo y los datos de tu ficha de Google: el nombre, la
                dirección en la Av. Los Mangos y el teléfono. El inventario, no: las{" "}
                {vehiculos.length} unidades son de ejemplo —usados de los que se mueven en
                Caracas—, puestas para que la página se pueda enseñar llena, y cada una lo
                dice en su ficha. Ningún precio es tuyo; son referencias de mercado. Las
                fotos tampoco: cada ficha dibuja tu escudo y tu rótulo hasta que subas las
                tuyas desde el panel, y ese día los avisos desaparecen solos.
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

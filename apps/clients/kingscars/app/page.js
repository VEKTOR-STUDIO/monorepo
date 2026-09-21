import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Revelar from "@/components/Revelar";
import TituloAnimado from "@/components/TituloAnimado";
import Escenario from "@/components/Escenario";
import Parallax from "@/components/Parallax";
import Cifra from "@/components/Cifra";
import MarcaCorona from "@/components/MarcaCorona";
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

  // Para la tarjeta de comprar: cuántos usados y cuántos 0 km, y desde cuánto
  // arranca cada lado. Es el corte que ellos mismos hacen en su post fijado.
  const usados = filtrar(vehiculos, { condicion: "usado", orden: "precio-asc" });
  const cero = filtrar(vehiculos, { condicion: "nuevo", orden: "precio-asc" });

  return (
    <>
      <Header />

      <main>
        {/* ------------------------------------------------------------------
            Portada.
            El titular es su bio, palabra por palabra: "¿Comprar o vender tu
            vehículo? Para eso estamos". No hacía falta escribir nada mejor,
            porque esa frase ya dice de qué va el negocio entero.
           ---------------------------------------------------------------- */}
        <section className="relative flex min-h-svh items-center overflow-hidden px-4 pb-16 pt-10 sm:px-6">
          <Escenario variante="portada" />
          <div className="textura absolute inset-0" aria-hidden="true" />

          <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            {/* ---- Lo que dice ---- */}
            <div className="min-w-0">
              <Revelar desde="izquierda">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <MarcaCorona className="h-8 w-12 shrink-0 text-base-content" />
                  <span className="cifra text-[0.65rem] tracking-[0.28em] text-base-content/45">
                    {config.business.centro.toUpperCase()} · {config.business.ciudad.toUpperCase()}
                  </span>
                </div>
              </Revelar>

              {/* El rojo cae sobre UNA palabra y no sobre la frase entera.
                  Es como lo hacen ellos: en su post fijado, "¿VAS A VENDER TU
                  CARRO?" va en blanco con "CARRO" en rojo. Teñir la segunda
                  oración completa llenaba dos líneas de rojo en el móvil y se
                  cargaba la regla de la casa en el primer pantallazo. */}
              <TituloAnimado
                as="h1"
                retraso={150}
                className="display mt-7 text-[2.6rem] leading-[0.94] sm:text-6xl lg:text-7xl"
              >
                ¿Comprar o <span className="text-primary">vender</span> tu vehículo?
                Para eso estamos
              </TituloAnimado>

              <Revelar retraso={420}>
                <p className="mt-7 max-w-lg text-base leading-relaxed text-base-content/60 sm:text-lg">
                  Concesionario de vehículos en el {config.business.centro}, Caracas.
                  Usados revisados uno a uno y unidades 0 km, cada una con su
                  kilometraje, su transmisión y su precio a la vista. Se atiende con
                  cita previa.
                </p>
              </Revelar>

              <Revelar retraso={520}>
                <div className="mt-9 flex w-full max-w-md flex-col gap-3 sm:flex-row">
                  <Link href="/vehiculos" className="btn btn-primary flex-1">
                    Ver el inventario
                  </Link>
                  {/* El rojo se gasta aquí y casi en ningún otro sitio: vender
                      el carro propio es lo que esta casa hace gratis y lo que
                      más le interesa que alguien pulse. */}
                  <Link href="/vender" className="btn btn-rojo flex-1">
                    Vende tu carro
                  </Link>
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
                      {config.business.publicaciones}
                    </dt>
                    <dd className="mt-1.5 text-[0.6rem] uppercase tracking-wider text-base-content/40 sm:text-[0.7rem]">
                      publicaciones
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
            Los dos caminos: comprar o vender. Es literalmente la primera línea
            de su bio, y es la pregunta que trae todo el que entra: unos vienen
            a llevarse un carro y otros a soltar el suyo.
           ---------------------------------------------------------------- */}
        <section className="relative overflow-hidden border-t border-base-content/8 px-4 py-24 sm:px-6">
          <Escenario variante="seccion" />
          <div className="textura absolute inset-0" aria-hidden="true" />

          <div className="relative mx-auto max-w-7xl">
            <Revelar>
              <span className="filo" aria-hidden="true" />
              <p className="rotulo mt-5">A qué vienes</p>
            </Revelar>

            <TituloAnimado as="h2" className="display mt-4 text-4xl sm:text-5xl">
              Comprar o vender
            </TituloAnimado>

            <div className="mt-14 grid gap-6 lg:grid-cols-2">
              {/* --- Comprar --- */}
              <Revelar desde="corte">
                <Link
                  href="/vehiculos"
                  className="ficha group flex h-full flex-col overflow-hidden"
                >
                  <div className="relative">
                    <FotoVehiculo
                      vehiculo={usados[0] || vehiculos[0]}
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
                      Comprar un <span className="text-primary">carro</span>
                    </p>
                    <p className="mt-4 flex-1 leading-relaxed text-base-content/60">
                      {usados.length} usados revisados uno a uno y {cero.length} unidades
                      0 km. Cada ficha lleva el kilometraje, la transmisión y el precio
                      como los publicas tú: sin llamar para preguntar lo básico.
                    </p>

                    <div className="mt-7 flex items-end justify-between gap-4 border-t border-base-content/10 pt-5">
                      <div className="min-w-0">
                        <p className="cifra text-2xl font-bold text-base-content">
                          {enDolares(desde)}
                        </p>
                        <p className="mt-1 text-[0.7rem] uppercase tracking-wider text-base-content/40">
                          desde · {vehiculos.length} unidades
                        </p>
                      </div>
                      <span
                        className="display shrink-0 text-sm text-primary transition-transform duration-300 group-hover:translate-x-1.5"
                        aria-hidden="true"
                      >
                        Ver todo →
                      </span>
                    </div>
                  </div>
                </Link>
              </Revelar>

              {/* --- Vender --- */}
              <Revelar desde="corte" retraso={140}>
                <Link
                  href="/vender"
                  className="ficha group flex h-full flex-col overflow-hidden"
                >
                  {/* Aquí no va una foto de carro: quien viene a vender ya tiene
                      el suyo. Va la corona, que es lo que le da confianza de que
                      lo van a tratar bien. */}
                  <div className="relative aspect-16/10 w-full overflow-hidden estudio">
                    <div className="piedra absolute inset-0" aria-hidden="true" />
                    <div className="piedra-vetas absolute inset-0" aria-hidden="true" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <MarcaCorona className="h-1/2 w-auto text-base-content/25" />
                    </div>
                    <span className="pastilla pastilla-roja absolute left-5 top-5 px-4 py-1.5 text-[0.7rem] uppercase tracking-wider">
                      Gratis
                    </span>
                    <div
                      className="absolute inset-0 bg-linear-to-t from-base-200 via-base-200/20 to-transparent"
                      aria-hidden="true"
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-6 sm:p-7">
                    <p className="display text-3xl sm:text-4xl">
                      Vender el <span className="text-primary">tuyo</span>
                    </p>
                    <p className="mt-4 flex-1 leading-relaxed text-base-content/60">
                      {config.business.lema}. Nos encargamos del avalúo, de las fotos y
                      los videos, de publicarlo y promocionarlo, y del seguimiento hasta
                      que se venda. Completamente gratis.
                    </p>

                    <div className="mt-7 flex items-end justify-between gap-4 border-t border-base-content/10 pt-5">
                      <div className="min-w-0">
                        <p className="cifra text-2xl font-bold text-base-content">
                          {config.business.seguidores}
                        </p>
                        <p className="mt-1 text-[0.7rem] uppercase tracking-wider text-base-content/40">
                          lo verán en Instagram
                        </p>
                      </div>
                      <span
                        className="display shrink-0 text-sm text-primary transition-transform duration-300 group-hover:translate-x-1.5"
                        aria-hidden="true"
                      >
                        Cómo funciona →
                      </span>
                    </div>
                  </div>
                </Link>
              </Revelar>
            </div>

            {/* Las marcas que hay en el salón. */}
            <Revelar retraso={180}>
              <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-base-content/10 pt-8">
                <p className="rotulo">Marcas en el salón</p>
                {facetas.marcas.map((m) => (
                  <Link
                    key={m.valor}
                    href={`/vehiculos?marca=${encodeURIComponent(m.valor)}`}
                    className="display-abierto text-lg text-base-content/45 transition-colors hover:text-primary"
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
            Cómo se compra. Aquí se atiende CON CITA PREVIA, que es una cosa que
            el comprador tiene que saber antes de subir al C.C.C.T. y no cuando
            ya esté en el estacionamiento.
           ---------------------------------------------------------------- */}
        <section
          id="como-comprar"
          className="relative overflow-hidden border-t border-base-content/8 bg-base-200 px-4 py-24 sm:px-6"
        >
          <div className="textura absolute inset-0" aria-hidden="true" />
          <div className="textura-rombos absolute inset-0" aria-hidden="true" />

          <div className="relative mx-auto max-w-5xl">
            <Revelar className="text-center">
              <p className="rotulo">Cómo comprar</p>
            </Revelar>

            <TituloAnimado as="h2" className="display mt-4 text-center text-4xl sm:text-5xl">
              Tres pasos, con cita
            </TituloAnimado>

            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {config.compra.pasos.map((paso, i) => (
                <Revelar key={paso.titulo} desde="giro" retraso={i * 130}>
                  <div className="relative h-full border-t-2 border-primary/50 pt-6">
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
            Publica tu vehículo gratis.
            Es su mejor argumento y el que repite su publicación fijada, así que
            va con sección propia y no escondido en una lista de servicios.
           ---------------------------------------------------------------- */}
        <section
          id="vender"
          className="relative overflow-hidden border-t border-base-content/8 px-4 py-24 sm:px-6"
        >
          <Escenario variante="seccion" />
          <div className="textura absolute inset-0" aria-hidden="true" />

          <div className="relative mx-auto max-w-6xl">
            <Revelar>
              <span className="filo" aria-hidden="true" />
              <p className="rotulo mt-5">Si vas a vender</p>
            </Revelar>

            <TituloAnimado as="h2" className="display mt-4 text-4xl sm:text-5xl lg:text-6xl">
              Publica tu vehículo <span className="text-primary">gratis</span>
            </TituloAnimado>

            <Revelar retraso={180}>
              <p className="mt-6 max-w-2xl leading-relaxed text-base-content/60">
                No cobramos por publicar. Nos encargamos de todo lo que hace que un
                carro se venda —y que casi nadie hace bien vendiéndolo por su cuenta—:
                ponerle el precio que de verdad tiene, fotografiarlo, promocionarlo y
                atender a los interesados.
              </p>
            </Revelar>

            <div className="mt-14 grid gap-px overflow-hidden rounded-[var(--radius-box)] border border-base-content/10 bg-base-content/10 sm:grid-cols-2 lg:grid-cols-4">
              {config.business.publicarGratis.map((paso, i) => (
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

            <Revelar retraso={200}>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link href="/vender" className="btn btn-rojo sm:w-auto">
                  Quiero publicar mi vehículo
                </Link>
                <BotonContacto demo={demo} vender className="btn btn-filo sm:w-auto">
                  Escribir por Instagram
                </BotonContacto>
              </div>
            </Revelar>
          </div>
        </section>

        {/* ------------------------------------------------------------------
            Dónde estamos. El C.C.C.T. no es un dato de contacto cualquiera aquí:
            está metido en el nombre de su cuenta.
           ---------------------------------------------------------------- */}
        <section
          id="ubicacion"
          className="relative overflow-hidden border-t border-base-content/8 bg-base-200 px-4 py-24 sm:px-6"
        >
          <div className="textura absolute inset-0" aria-hidden="true" />

          <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <div className="min-w-0">
              <Revelar>
                <span className="filo" aria-hidden="true" />
                <p className="rotulo mt-5">Dónde estamos</p>
              </Revelar>

              <TituloAnimado as="h2" className="display mt-4 text-4xl sm:text-5xl lg:text-6xl">
                En el {config.business.centro}
              </TituloAnimado>

              <Revelar retraso={180}>
                <p className="mt-6 leading-relaxed text-base-content/60">
                  {config.business.direccionLarga}. Se atiende{" "}
                  <span className="font-semibold text-base-content">con cita previa</span>
                  : se aparta la hora, la unidad está lista y no se pierde la mañana
                  esperando a que alguien se desocupe.
                </p>
              </Revelar>

              <Revelar retraso={260}>
                <dl className="mt-9 grid grid-cols-2 gap-6 border-t border-base-content/10 pt-7">
                  <div className="min-w-0">
                    <dt className="text-[0.65rem] uppercase tracking-wider text-base-content/40">
                      Instagram
                    </dt>
                    <dd className="mt-1.5 truncate text-base font-semibold">
                      <a
                        href={config.business.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base-content transition-colors hover:text-primary"
                      >
                        @{config.business.instagram}
                      </a>
                    </dd>
                  </div>
                  <div className="min-w-0">
                    <dt className="text-[0.65rem] uppercase tracking-wider text-base-content/40">
                      Seguidores
                    </dt>
                    <dd className="cifra mt-1.5 text-base font-semibold text-base-content">
                      {config.business.seguidores}
                    </dd>
                  </div>
                </dl>
              </Revelar>

              <Revelar retraso={320}>
                <BotonContacto demo={demo} className="btn btn-primary mt-8 w-full sm:w-auto">
                  Agendar una cita
                </BotonContacto>
              </Revelar>
            </div>

            {/* Lo que hacen, que son sus propias destacadas de Instagram. */}
            <Revelar desde="corte" retraso={140} className="min-w-0">
              <ul className="divide-y divide-base-content/10 border-y border-base-content/10">
                {config.business.servicios.map((servicio, i) => (
                  <li key={servicio} className="flex items-center gap-5 py-6">
                    <span className="cifra shrink-0 text-xs text-primary">0{i + 1}</span>
                    <span className="display text-xl text-base-content/85 sm:text-2xl">
                      {servicio}
                    </span>
                  </li>
                ))}
              </ul>
            </Revelar>
          </div>
        </section>

        {/* ------------------------------------------------------------------
            Aquí cambia el interlocutor: lo que viene le habla al dueño de Kings
            Cars, no a quien vino a comprar un carro. El cintillo lo avisa.
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
                {totalVerificadas() === 1
                  ? "Solo una unidad de las que ves es tuya de verdad"
                  : `Solo ${totalVerificadas()} unidades de las que ves son tuyas de verdad`}
                : el Corolla GLI 2006, con su kilometraje, su transmisión y su precio
                leídos de tu propia publicación en{" "}
                <a
                  href={config.business.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline"
                >
                  @{config.business.instagram}
                </a>
                . El resto son unidades de muestra, puestas para que la página se pueda
                enseñar llena, y sus precios son referencias de mercado. Instagram
                limitó las peticiones mientras se montaba esto; con tus{" "}
                {config.business.publicaciones} publicaciones sale el catálogo entero,
                con fotos. Las de ahora tampoco son tuyas: cada ficha dibuja la
                plantilla de tus propios posts hasta que se carguen las reales.
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

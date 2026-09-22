import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Revelar from "@/components/Revelar";
import TituloAnimado from "@/components/TituloAnimado";
import Escenario from "@/components/Escenario";
import Parallax from "@/components/Parallax";
import Cifra from "@/components/Cifra";
import Bandera from "@/components/Bandera";
import { Estrella } from "@/components/Logo";
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

/** Los iconos de los tres verbos del emblema: el mazo, las herramientas y el buque. */
const ICONOS = {
  compramos: <path d="M14 4l6 6M11 7l6 6M9.5 8.5l6 6M4 20l7-7M15.5 3.5l5 5-3 3-5-5z" />,
  reparamos: (
    <path d="M14.7 6.3a4 4 0 0 0 5 5L21 13l-8 8-3-3 8-8-1.3-1.3a4 4 0 0 0-5-5L13 5zM3 21l6-6M7 3l4 4-2 2-4-4z" />
  ),
  exportamos: (
    <path d="M3 17l2 4h14l2-4H3zM6 17V9h12v8M9 9V5h6v4M12 5V2M2 22c2-1 4-1 6 0s4 1 6 0 4-1 6 0" />
  ),
};

export default function Inicio() {
  const vehiculos = leerVehiculos();
  const facetas = facetasDe(vehiculos);
  const demo = esDemo();
  const { business } = config;

  // El escaparate: los marcados como destacados, y si no hay, los primeros.
  const escaparate = vehiculos.filter((v) => v.destacado && v.disponible).slice(0, 4);
  const portada = escaparate[0] || vehiculos[0];
  const desde = Math.min(...vehiculos.map((v) => v.precio));

  // Los dos caminos: el lote que está en subasta o el modelo a pedido.
  const caminos = SEGMENTOS.map((segmento) => {
    const lista = filtrar(vehiculos, { segmento: segmento.slug, orden: "precio-asc" });
    // La foto de muestra de cada camino: la primera con foto de verdad, y si
    // no hay, la más barata.
    const conFoto = lista.find((v) => v.fotos?.length);
    return {
      ...segmento,
      total: lista.length,
      desde: lista[0]?.precio,
      muestra: conFoto || lista[0],
    };
  }).filter((c) => c.total > 0);

  return (
    <>
      <Header />

      <main>
        {/* ------------------------------------------------------------------
            Portada.
            Es su emblema a pantalla completa: la noche con el humo rojo, la
            bandera arriba, el puerto al fondo y el piso mojado abajo. El
            titular es la frase del emblema.
           ---------------------------------------------------------------- */}
        <section className="relative flex min-h-svh items-center overflow-hidden px-4 pb-16 pt-10 sm:px-6">
          <Escenario variante="portada" />
          <div className="textura absolute inset-0" aria-hidden="true" />

          <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            {/* ---- Lo que dice ---- */}
            <div className="min-w-0">
              <Revelar desde="izquierda">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <Estrella className="size-6 shrink-0 text-base-content" />
                  <span className="cifra text-[0.65rem] tracking-[0.28em] text-base-content/55">
                    TEXAS · USA → LATINOAMÉRICA
                  </span>
                </div>
              </Revelar>

              <TituloAnimado
                as="h1"
                retraso={150}
                className="display mt-7 text-5xl leading-[0.88] sm:text-6xl lg:text-7xl xl:text-8xl"
              >
                Tu vehículo, <span className="text-primary">nuestro compromiso</span>
              </TituloAnimado>

              <Revelar retraso={420}>
                <p className="mt-7 max-w-lg text-base leading-relaxed text-base-content/65 sm:text-lg">
                  Compramos en las subastas de Estados Unidos, lo reparamos en Texas y lo exportamos
                  hasta tu país. Tú eliges la unidad; nosotros nos encargamos de todo.
                </p>
              </Revelar>

              <Revelar retraso={520}>
                <div className="mt-9 flex w-full max-w-md flex-col gap-3 sm:flex-row">
                  <Link href="/vehiculos" className="btn btn-primary flex-1">
                    Ver unidades
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
                  tamaño de escritorio, "$11,900" no cabe en un tercio de 390 px
                  y se montaba encima de la cifra de al lado. El `min-w-0` es lo
                  que deja a las columnas encogerse. */}
              <Revelar retraso={620}>
                <dl className="mt-14 grid w-full max-w-xl grid-cols-3 gap-3 border-t border-base-content/10 pt-7 sm:gap-6">
                  <div className="min-w-0">
                    <dt className="cifra text-2xl font-bold text-base-content sm:text-3xl">
                      <Cifra valor={vehiculos.length} />
                    </dt>
                    <dd className="mt-1.5 text-[0.6rem] uppercase tracking-wider text-base-content/40 sm:text-[0.7rem]">
                      unidades hoy
                    </dd>
                  </div>
                  <div className="min-w-0">
                    <dt className="cifra text-2xl font-bold text-primary sm:text-3xl">
                      {enDolares(desde)}
                    </dt>
                    <dd className="mt-1.5 text-[0.6rem] uppercase tracking-wider text-base-content/40 sm:text-[0.7rem]">
                      desde
                    </dd>
                  </div>
                  <div className="min-w-0">
                    <dt className="flex items-center gap-1.5">
                      {business.destinos.map((d) => (
                        <Bandera
                          key={d.slug}
                          codigo={d.bandera}
                          nombre={d.nombre}
                          className="size-6 sm:size-7"
                        />
                      ))}
                    </dt>
                    <dd className="mt-2 text-[0.6rem] uppercase tracking-wider text-base-content/40 sm:text-[0.7rem]">
                      y toda Latam
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
                    <div className="relative">
                      <FotoVehiculo
                        vehiculo={portada}
                        prioridad
                        className="aspect-4/3 w-full"
                        sizes="45vw"
                      />
                      {/* La banda de "unidad disponible en subasta" de su pieza. */}
                      {portada.enSubasta && (
                        <span className="display absolute right-0 top-5 bg-primary py-1.5 pl-5 pr-4 text-sm text-primary-content [clip-path:polygon(0.8rem_0,100%_0,100%_100%,0_100%)]">
                          Unidad disponible en subasta
                        </span>
                      )}
                    </div>
                    <p className="display mt-4 flex items-baseline justify-between gap-4 text-lg">
                      <span className="text-base-content/75">{portada.nombreCompleto}</span>
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
            Los tres verbos del emblema, uno por columna. Es lo primero que
            dice su logotipo y lo primero que hay que entender: no venden
            carros de un salón, los traen.
           ---------------------------------------------------------------- */}
        <section className="relative overflow-hidden border-t border-base-content/8 bg-base-200 px-4 py-16 sm:px-6">
          <div className="textura absolute inset-0" aria-hidden="true" />
          <div className="relative mx-auto grid max-w-7xl gap-px overflow-hidden border border-base-content/10 bg-base-content/10 md:grid-cols-3">
            {business.servicios.map((servicio, i) => (
              <Revelar key={servicio.slug} retraso={i * 120} className="bg-base-200">
                <div className="flex h-full gap-5 p-7 sm:p-8">
                  <span
                    className="grid size-12 shrink-0 place-items-center rounded-full border border-base-content/25 text-base-content"
                    aria-hidden="true"
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {ICONOS[servicio.slug]}
                    </svg>
                  </span>
                  <div className="min-w-0">
                    <h2 className="display text-3xl">{servicio.titulo}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-base-content/60">
                      {servicio.detalle}
                    </p>
                  </div>
                </div>
              </Revelar>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------------------
            El inventario entero, desfilando de lado.
           ---------------------------------------------------------------- */}
        <CarruselCatalogo vehiculos={vehiculos} />

        {/* ------------------------------------------------------------------
            Los dos caminos: el lote que ya está en subasta, o el modelo que
            se busca a pedido. Es la primera pregunta de cualquiera que llega.
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
              La que está en subasta, <span className="text-primary">o la que tú pidas</span>
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
                        {camino.slug === "subasta" ? (
                          <>
                            <span className="text-primary">En subasta</span> ahora
                          </>
                        ) : (
                          <>
                            <span className="text-primary">A pedido</span>, a tu medida
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
                            {camino.total === 1 ? camino.singular : camino.plural}
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

            {/* Las marcas que hay hoy en el inventario. */}
            <Revelar retraso={180}>
              <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-base-content/10 pt-8">
                <p className="rotulo">Marcas de hoy</p>
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
            Cómo funciona. Los cinco pasos de su pieza del Corolla, de la
            subasta a tu país, puestos por escrito para que quien pregunta por
            DM llegue con la respuesta.
           ---------------------------------------------------------------- */}
        <section
          id="como-funciona"
          className="relative overflow-hidden border-t border-base-content/8 bg-base-200 px-4 py-24 sm:px-6"
        >
          <div className="textura absolute inset-0" aria-hidden="true" />
          <div className="textura-via absolute inset-0" aria-hidden="true" />

          <div className="relative mx-auto max-w-6xl">
            <Revelar className="text-center">
              <p className="rotulo">Cómo funciona</p>
            </Revelar>

            <TituloAnimado as="h2" className="display mt-4 text-center text-4xl sm:text-5xl">
              De la subasta <span className="text-primary">a tu país</span>
            </TituloAnimado>

            <Revelar retraso={140}>
              <p className="mx-auto mt-5 max-w-xl text-center leading-relaxed text-base-content/60">
                Compra, repara, exporta: nosotros nos encargamos de todo. {business.remate}.
              </p>
            </Revelar>

            <ol className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
              {config.compra.pasos.map((paso, i) => (
                <Revelar
                  key={paso.titulo}
                  as="li"
                  desde="giro"
                  retraso={i * 110}
                  className="relative h-full border-t-2 border-primary/50 pt-6"
                >
                  <div>
                    <span className="display absolute -top-11 left-0 text-5xl text-base-content/12">
                      {i + 1}
                    </span>
                    <h3 className="display text-xl leading-tight">{paso.titulo}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-base-content/60">
                      {paso.detalle}
                    </p>
                  </div>
                </Revelar>
              ))}
            </ol>
          </div>
        </section>

        {/* ------------------------------------------------------------------
            Las subastas y la inversión. Son dos piezas suyas —"¿Tienes dudas
            cómo funcionan las subastas?" y "¿Quieres invertir en vehículos?"—
            y aquí van juntas porque contestan lo mismo: por qué comprar en
            subasta y no en un lote.
           ---------------------------------------------------------------- */}
        <section
          id="subastas"
          className="relative overflow-hidden border-t border-base-content/8 px-4 py-24 sm:px-6"
        >
          <Escenario variante="sutil" />
          <div className="textura absolute inset-0" aria-hidden="true" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2 lg:gap-20">
            <div className="min-w-0">
              <Revelar>
                <span className="ala" aria-hidden="true" />
                <p className="rotulo mt-5">Las subastas</p>
              </Revelar>

              <TituloAnimado as="h2" className="display mt-4 text-4xl sm:text-5xl">
                ¿Tienes dudas <span className="text-primary">de cómo funcionan?</span>
              </TituloAnimado>

              <Revelar retraso={140}>
                <p className="mt-6 max-w-lg leading-relaxed text-base-content/60">
                  Te explicamos todo el proceso paso a paso para que compres tu vehículo con
                  seguridad y confianza. En {business.nombre} te ofrecemos:
                </p>
              </Revelar>

              <ul className="mt-8 divide-y divide-base-content/10 border-y border-base-content/10">
                {business.subastas.map((punto, i) => (
                  <Revelar
                    key={punto}
                    as="li"
                    retraso={i * 80}
                    className="flex items-center gap-5 py-4"
                  >
                    <span className="cifra shrink-0 text-xs text-primary">0{i + 1}</span>
                    <span className="display-recto text-lg tracking-wide text-base-content/85">
                      {punto}
                    </span>
                  </Revelar>
                ))}
              </ul>
            </div>

            {/* La inversión, con la foto del Corolla negro en el patio. */}
            <Revelar desde="corte" retraso={120}>
              <div className="ficha overflow-hidden">
                <div className="relative aspect-16/10">
                  <Image
                    src="/vehiculos/corolla-negro.jpg"
                    alt="Toyota Corolla negro en el patio de una subasta"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div
                    className="absolute inset-0 bg-linear-to-t from-base-200 via-transparent to-transparent"
                    aria-hidden="true"
                  />
                </div>
                <div className="p-7 sm:p-8">
                  <p className="display text-3xl sm:text-4xl">
                    ¿Quieres <span className="text-primary">invertir?</span>
                  </p>
                  <p className="display-recto mt-2 text-base tracking-wide text-base-content/70">
                    {business.inversion.bajada}
                  </p>
                  <ul className="mt-6 grid grid-cols-2 gap-3">
                    {business.inversion.puntos.map((punto) => (
                      <li
                        key={punto}
                        className="flex items-center gap-2.5 text-sm text-base-content/75"
                      >
                        <span
                          className="h-3 w-2 shrink-0 bg-primary"
                          style={{ transform: "skewX(var(--angulo-ls))" }}
                          aria-hidden="true"
                        />
                        {punto}
                      </li>
                    ))}
                  </ul>
                  <BotonContacto demo={demo} className="btn btn-primary mt-7 w-full">
                    Quiero saber más
                  </BotonContacto>
                </div>
              </div>
            </Revelar>
          </div>
        </section>

        {/* ------------------------------------------------------------------
            Métodos de pago, de su pieza "FAQ". Es la otra pregunta que llega
            por DM a diario, y la respuesta es corta: en USD, por cinco vías.
           ---------------------------------------------------------------- */}
        <section
          id="pagos"
          className="relative overflow-hidden border-t border-base-content/8 bg-base-200 px-4 py-24 sm:px-6"
        >
          <div className="textura absolute inset-0" aria-hidden="true" />

          <div className="relative mx-auto max-w-6xl">
            <Revelar className="text-center">
              <p className="rotulo">Preguntas frecuentes</p>
            </Revelar>

            <TituloAnimado as="h2" className="display mt-4 text-center text-4xl sm:text-5xl">
              Métodos <span className="text-primary">de pago</span>
            </TituloAnimado>

            <Revelar retraso={140}>
              <p className="mx-auto mt-5 max-w-xl text-center leading-relaxed text-base-content/60">
                Te ofrecemos varias opciones de pago seguras y confiables.
              </p>
            </Revelar>

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {business.pagos.metodos.map((metodo, i) => (
                <Revelar key={metodo.slug} retraso={(i % 3) * 110}>
                  <div className="panel flex h-full flex-col p-6">
                    <p className="display text-2xl">{metodo.nombre}</p>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-base-content/60">
                      {metodo.detalle}
                    </p>
                    <p className="cifra mt-5 border-t border-base-content/10 pt-4 text-[0.65rem] uppercase tracking-[0.2em] text-base-content/45">
                      {metodo.sellos.join(" · ")}
                    </p>
                  </div>
                </Revelar>
              ))}

              {/* El aviso de su pieza, en su sitio: la casilla que sobra. */}
              <Revelar retraso={220}>
                <div className="flex h-full flex-col justify-center gap-3 bg-primary p-6 text-primary-content">
                  <p className="display text-2xl">Importante</p>
                  <p className="text-sm leading-relaxed">
                    {business.pagos.nota} Escríbenos y te decimos qué método se adapta mejor a ti.
                  </p>
                </div>
              </Revelar>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------
            A dónde mandan. Las banderas de su emblema y el número en grande,
            como la banda de abajo de todas sus piezas.
           ---------------------------------------------------------------- */}
        <section
          id="destinos"
          className="relative overflow-hidden border-t border-base-content/8 px-4 py-24 sm:px-6"
        >
          <Escenario variante="seccion" />
          <div className="textura absolute inset-0" aria-hidden="true" />

          <div className="relative mx-auto max-w-6xl">
            <Revelar>
              <span className="ala" aria-hidden="true" />
              <p className="rotulo mt-5">Envíos</p>
            </Revelar>

            <TituloAnimado as="h2" className="display mt-4 text-4xl sm:text-5xl lg:text-6xl">
              A toda <span className="text-primary">Latinoamérica</span>
            </TituloAnimado>

            <Revelar retraso={180}>
              <p className="mt-6 max-w-xl leading-relaxed text-base-content/60">
                Salen de Texas en barco y llegan a tu país con los trámites y la aduana hechos.
                Estos son los destinos de siempre; si el tuyo no está, pregúntanos.
              </p>
            </Revelar>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {business.destinos.map((destino, i) => (
                <Revelar key={destino.slug} desde="corte" retraso={i * 120}>
                  <div className="ficha flex items-center gap-4 p-6">
                    <Bandera codigo={destino.bandera} nombre={destino.nombre} className="size-11" />
                    <div className="min-w-0">
                      <p className="display text-2xl">{destino.nombre}</p>
                      <p className="cifra mt-1 text-[0.65rem] uppercase tracking-[0.2em] text-base-content/45">
                        USA → {destino.nombre}
                      </p>
                    </div>
                  </div>
                </Revelar>
              ))}
            </div>

            <Revelar retraso={200}>
              <div className="panel mt-10 flex flex-col items-center gap-6 p-7 text-center sm:flex-row sm:justify-between sm:p-8 sm:text-left">
                <div className="min-w-0">
                  <p className="display text-3xl">
                    ¿Tienes dudas? <span className="text-primary">Escríbenos</span>
                  </p>
                  <p className="cifra mt-2 text-2xl font-bold text-base-content sm:text-3xl">
                    {business.whatsappVisible}
                  </p>
                  <p className="mt-1 text-sm text-base-content/50">
                    Por WhatsApp o por DM en @{business.instagram}. Pregunta sin compromiso.
                  </p>
                </div>
                <BotonContacto demo={demo} className="btn btn-primary shrink-0 px-8">
                  Escribir por WhatsApp
                </BotonContacto>
              </div>
            </Revelar>
          </div>
        </section>

        {/* ------------------------------------------------------------------
            Aquí cambia el interlocutor: lo que viene le habla al dueño de
            Lone Star, no a quien vino a traer un carro. El cintillo lo avisa.
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
                  ? "Una unidad sale"
                  : `${totalVerificadas()} unidades salen`}{" "}
                de tus publicaciones de{" "}
                <a
                  href={business.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline"
                >
                  @{business.instagram}
                </a>
                : la Tacoma Off-Road 2026 en subasta, con sus fotos, sus millas y su daño, y el
                Corolla a pedido desde $16,000. El resto son unidades de ejemplo, puestas para que
                la página se pueda enseñar llena, y cada una lo dice en su ficha. La Tacoma no
                publica puja, así que la suya y la de los ejemplos son referencias; al cargar las
                tuyas desde el panel, los avisos se van solos.
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

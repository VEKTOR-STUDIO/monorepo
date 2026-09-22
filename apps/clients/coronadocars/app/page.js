import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Revelar from "@/components/Revelar";
import TituloAnimado from "@/components/TituloAnimado";
import Escenario from "@/components/Escenario";
import Parallax from "@/components/Parallax";
import Cifra from "@/components/Cifra";
import MarcaCoronado from "@/components/MarcaCoronado";
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
  // arranca cada lado.
  const usados = filtrar(vehiculos, { condicion: "usado", orden: "precio-asc" });
  const cero = filtrar(vehiculos, { condicion: "nuevo", orden: "precio-asc" });

  return (
    <>
      <Header />

      <main>
        {/* ------------------------------------------------------------------
            Portada.
            El titular es su lema, palabra por palabra: "Servimos con
            Excelencia", lo que va debajo del recuadro de su logotipo. Encima,
            el recuadro mismo, que ya dice a qué se dedican.
           ---------------------------------------------------------------- */}
        <section className="relative flex min-h-svh items-center overflow-hidden px-4 pb-16 pt-10 sm:px-6">
          <Escenario variante="portada" />
          <div className="textura absolute inset-0" aria-hidden="true" />

          <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            {/* ---- Lo que dice ---- */}
            <div className="min-w-0">
              <Revelar desde="izquierda">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <MarcaCoronado detalle={false} className="h-10 w-auto shrink-0" />
                  <span className="cifra text-[0.65rem] tracking-[0.28em] text-base-content/50">
                    {config.business.centroLargo.toUpperCase()} · {config.business.ciudad.toUpperCase()}
                  </span>
                </div>
              </Revelar>

              {/* El amarillo cae sobre UNA palabra y no sobre la frase entera,
                  como el "VENDIDO!" de sus piezas: una palabra que grita y el
                  resto en blanco. Teñir el titular entero llenaba media
                  pantalla de neón en el móvil. */}
              <TituloAnimado
                as="h1"
                retraso={150}
                className="display mt-7 text-[2.6rem] leading-[0.94] sm:text-6xl lg:text-7xl"
              >
                Servimos con <span className="text-primary">excelencia</span>
              </TituloAnimado>

              <Revelar retraso={420}>
                <p className="mt-7 max-w-lg text-base leading-relaxed text-base-content/60 sm:text-lg">
                  Compra, venta y consignación de vehículos en Valencia, dentro del{" "}
                  {config.business.centroLargo}. Usados y unidades 0 km, cada una con
                  su año, su modelo, su kilometraje y su transmisión a la vista, como
                  en nuestras publicaciones.
                </p>
              </Revelar>

              <Revelar retraso={520}>
                <div className="mt-9 flex w-full max-w-md flex-col gap-3 sm:flex-row">
                  <Link href="/vehiculos" className="btn btn-primary w-full sm:w-auto sm:flex-1">
                    Ver el inventario
                  </Link>
                  {/* El segundo camino va en la caja azul de sus posts: vender
                      o consignar el carro propio es la otra mitad de lo que
                      dice su logotipo. */}
                  <Link href="/vender" className="btn btn-azul w-full sm:w-auto sm:flex-1">
                    Vende o consigna
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
            Los dos caminos: comprar o vender. Es literalmente lo que dice el
            recuadro de su logotipo, "Compra - Venta y Consignación", y es la
            pregunta que trae todo el que entra: unos vienen a llevarse un carro
            y otros a soltar el suyo.
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
                      {usados.length} usados y {cero.length} unidades 0 km. Cada ficha
                      lleva el año, el modelo, el kilometraje y la transmisión como en
                      nuestras publicaciones: sin escribir para preguntar lo básico.
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
                      el suyo. Va la pared de su local con el recuadro delante,
                      que es donde su carro va a salir fotografiado. */}
                  <div className="relative aspect-16/10 w-full overflow-hidden estudio">
                    <div className="pared absolute inset-0" aria-hidden="true" />
                    <div className="pared-logos absolute inset-0 opacity-20!" aria-hidden="true" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <MarcaCoronado className="h-2/5 w-auto shadow-2xl" />
                    </div>
                    <span className="pastilla pastilla-lima absolute left-5 top-5 px-4 py-1.5 text-[0.7rem] uppercase tracking-wider">
                      Consignación
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
                      Te lo compramos o lo vendemos por ti. Avalúo, sesión de fotos en
                      nuestro centro de publicaciones, publicación en la cuenta y
                      acompañamiento hasta el traspaso.
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
            Cómo se compra. El canal es el WhatsApp de su bio ("Link Directo al
            WhatsApp 👇"), así que el paso del medio es ese y no un formulario.
           ---------------------------------------------------------------- */}
        <section
          id="como-comprar"
          className="relative overflow-hidden border-t border-base-content/8 bg-base-200 px-4 py-24 sm:px-6"
        >
          <div className="textura absolute inset-0" aria-hidden="true" />
          <div className="textura-diagonal absolute inset-0" aria-hidden="true" />

          <div className="relative mx-auto max-w-5xl">
            <Revelar className="text-center">
              <p className="rotulo">Cómo comprar</p>
            </Revelar>

            <TituloAnimado as="h2" className="display mt-4 text-center text-4xl sm:text-5xl">
              Tres pasos
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
            Vende o consigna.
            Es su primera publicación fijada ("¿Quieres vender tú…?"), así que
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
              ¿Quieres vender tu <span className="text-primary">carro</span>?
            </TituloAnimado>

            <Revelar retraso={180}>
              <p className="mt-6 max-w-2xl leading-relaxed text-base-content/60">
                Te lo compramos, o lo ponemos en consignación y nos encargamos de
                todo lo que hace que un carro se venda —y que casi nadie hace bien
                vendiéndolo por su cuenta—: ponerle el precio que de verdad tiene,
                fotografiarlo, publicarlo y atender a los interesados.
              </p>
            </Revelar>

            <div className="mt-14 grid gap-px overflow-hidden rounded-[var(--radius-box)] border border-base-content/10 bg-base-content/10 sm:grid-cols-2 lg:grid-cols-4">
              {config.business.consignar.map((paso, i) => (
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
                <Link href="/vender" className="btn btn-azul sm:w-auto">
                  Quiero vender mi carro
                </Link>
                <BotonContacto demo={demo} vender className="btn btn-filo sm:w-auto">
                  Escribir por WhatsApp
                </BotonContacto>
              </div>
            </Revelar>
          </div>
        </section>

        {/* ------------------------------------------------------------------
            Dónde estamos. Son parte de un grupo —@autosdel.centro— y lo dicen
            en la bio y en una publicación fijada: es de dónde sale la confianza.
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
                En {config.business.ciudad}
              </TituloAnimado>

              <Revelar retraso={180}>
                <p className="mt-6 leading-relaxed text-base-content/60">
                  {config.business.direccionLarga}. Somos parte del{" "}
                  <a
                    href={config.business.grupoInstagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-base-content hover:text-primary"
                  >
                    {config.business.centroLargo}
                  </a>
                  : un local con varias marcas, taller de fotos propio y el
                  inventario a la vista.
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
                  Escribir por WhatsApp
                </BotonContacto>
              </Revelar>
            </div>

            {/* Lo que hacen, que es lo que dice el recuadro de su logotipo. */}
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
            Aquí cambia el interlocutor: lo que viene le habla al dueño de
            Coronado Carss, no a quien vino a comprar un carro. El cintillo lo
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
                {totalVerificadas() === 1
                  ? "Solo una unidad de las que ves es tuya de verdad"
                  : `Solo ${totalVerificadas()} unidades de las que ves son tuyas de verdad`}
                : el Toyota Yaris Belta 2008, con su año, su modelo, su kilometraje
                y su transmisión leídos de tu propia publicación en{" "}
                <a
                  href={config.business.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline"
                >
                  @{config.business.instagram}
                </a>
                . Como no publicas precios, el suyo es de referencia. El resto son
                unidades de muestra, puestas para que la página se pueda enseñar
                llena. Con tus {config.business.publicaciones} publicaciones sale el
                catálogo entero, con fotos; mientras tanto, cada ficha dibuja la
                plantilla de tus propios posts —la pared, la etiqueta y las cajas de
                año, modelo, kilometraje y transmisión— hasta que se carguen las
                reales.
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

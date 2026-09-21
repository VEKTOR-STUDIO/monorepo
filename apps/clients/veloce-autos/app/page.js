import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Revelar from "@/components/Revelar";
import TituloAnimado from "@/components/TituloAnimado";
import Alas from "@/components/Alas";
import Parallax from "@/components/Parallax";
import Cifra from "@/components/Cifra";
import MarcaVeloce from "@/components/MarcaVeloce";
import FotoVehiculo, { AvisoMuestra } from "@/components/FotoVehiculo";
import PantallaVehiculo from "@/components/PantallaVehiculo";
import CarruselCatalogo from "@/components/CarruselCatalogo";
import BotonContacto from "@/components/BotonContacto";
import SeccionPanel from "@/components/SeccionPanel";
import SeccionCanales from "@/components/SeccionCanales";
import Cintillo from "@/components/Cintillo";
import SeccionPorQue from "@/components/SeccionPorQue";
import BloqueVenta from "@/components/demo/BloqueVenta";
import {
  leerVehiculos,
  facetasDe,
  filtrar,
  hayMuestras,
  ENTREGAS,
  ORIGENES,
} from "@/libs/vehiculos";
import { esDemo } from "@/libs/demo";
import { enDolares } from "@/libs/formato";
import config from "@/config";

// El inventario se toca a mano y cambia varias veces por semana: media hora
// de caché es de sobra y ahorra leer el JSON en cada visita.
export const revalidate = 1800;

export default function Inicio() {
  const vehiculos = leerVehiculos();
  const facetas = facetasDe(vehiculos);
  const demo = esDemo();

  // El escaparate: los marcados como destacados, y si no hay, los primeros.
  const escaparate = vehiculos.filter((v) => v.destacado && v.disponible).slice(0, 4);
  const portada = escaparate[0] || vehiculos[0];
  const desde = Math.min(...vehiculos.map((v) => v.precio));

  // Los dos caminos: lo que está hoy en el showroom y lo que se trae. Para
  // cada uno, cuántos hay y desde cuánto arranca.
  const caminos = ENTREGAS.map((entrega) => {
    const lista = filtrar(vehiculos, { entrega: entrega.slug, orden: "precio-asc" });
    return { ...entrega, total: lista.length, desde: lista[0]?.precio, muestra: lista[0] };
  }).filter((c) => c.total > 0);

  // Las cuatro procedencias de su bio, con lo que hay de cada una.
  const origenes = ORIGENES.map((origen) => ({
    ...origen,
    total: vehiculos.filter((v) => v.origen === origen.slug).length,
  }));

  return (
    <>
      <Header />

      <main>
        {/* ------------------------------------------------------------------
            Portada.
            El titular es la primera línea de su bio, que es además lo único
            que los distingue de cualquier otro concesionario de Caracas: no
            venden carros, los TRAEN. Las cuatro procedencias van justo debajo
            porque son la prueba de esa frase.
           ---------------------------------------------------------------- */}
        <section className="relative flex min-h-svh items-center overflow-hidden px-4 pb-16 pt-10 sm:px-6">
          <Alas variante="portada" />
          <div className="textura absolute inset-0" aria-hidden="true" />

          <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            {/* ---- Lo que dice ---- */}
            <div>
              <Revelar desde="izquierda">
                <div className="flex items-center gap-3">
                  <MarcaVeloce className="h-6 w-auto text-base-content" />
                  <span className="cifra text-[0.65rem] tracking-[0.3em] text-base-content/45">
                    {config.business.ciudad.toUpperCase()} · VENEZUELA
                  </span>
                </div>
              </Revelar>

              <TituloAnimado
                as="h1"
                retraso={150}
                className="display mt-7 text-5xl leading-[0.95] sm:text-6xl lg:text-7xl"
              >
                Importación <span className="text-base-content/55">directa</span>
              </TituloAnimado>

              <Revelar retraso={420}>
                <p className="mt-7 max-w-lg text-base leading-relaxed text-base-content/60 sm:text-lg">
                  {config.business.lema}, traídos por nosotros desde Dubái, Europa, China y
                  Estados Unidos. Lo que está en el showroom se ve hoy; lo que no, se
                  encarga con la versión y el color que quieras.
                </p>
              </Revelar>

              <Revelar retraso={520}>
                {/* `max-w-xl` y no `max-w-md`: con el tracking de esta
                    tipografía, "COTIZAR POR WHATSAPP" no cabe en la mitad de
                    448 px y el segundo botón salía a dos líneas, más alto que
                    el primero. */}
                <div className="mt-9 flex w-full max-w-xl flex-col gap-3 sm:flex-row">
                  <Link href="/vehiculos" className="btn btn-primary flex-1">
                    Ver el inventario
                  </Link>
                  <BotonContacto demo={demo} className="btn btn-filo flex-1">
                    Cotizar por WhatsApp
                  </BotonContacto>
                </div>
              </Revelar>

              {/* Las cifras que dan confianza de entrada. Suben contando
                  cuando entran en pantalla; el HTML del servidor ya trae el
                  número final escrito, así que sin JavaScript se leen igual.

                  En móvil van más pequeñas y con menos hueco a propósito: a
                  tamaño de escritorio, "$27.900" no cabe en un tercio de
                  390 px y se montaba encima de la cifra de al lado. El
                  `min-w-0` es lo que deja a las columnas encogerse; sin él, la
                  anchura mínima del contenido manda sobre el reparto. */}
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
                    <dt className="cifra text-2xl font-bold text-base-content sm:text-3xl">
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
                      className="aspect-4/3 w-full"
                      sizes="45vw"
                    />
                    <p className="display mt-4 flex items-baseline justify-between gap-4 text-lg">
                      <span className="text-base-content/70">
                        {portada.marca} {portada.modelo}
                      </span>
                      <span className="cifra text-xl font-bold text-base-content">
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
            Las cuatro procedencias.
            Es la línea uno de su bio convertida en navegación. Va antes que
            nada porque es lo que este negocio tiene y los demás no, y porque
            un comprador que sabe que quiere "algo de Dubái" llega aquí y en
            un clic está filtrando.
           ---------------------------------------------------------------- */}
        <section className="relative overflow-hidden border-t border-base-content/8 bg-base-200 px-4 py-16 sm:px-6">
          <div className="textura absolute inset-0" aria-hidden="true" />

          <div className="relative mx-auto max-w-7xl">
            <Revelar>
              <p className="rotulo text-center">Traemos de</p>
            </Revelar>

            <div className="mt-10 grid gap-px border border-base-content/10 bg-base-content/10 sm:grid-cols-2 lg:grid-cols-4">
              {origenes.map((origen, i) => (
                <Revelar key={origen.slug} retraso={i * 90}>
                  <Link
                    href={`/vehiculos?origen=${origen.slug}`}
                    className="group flex h-full flex-col bg-base-200 p-7 transition-colors hover:bg-base-300"
                  >
                    <p className="display text-3xl sm:text-4xl">{origen.nombre}</p>
                    <p className="mt-4 flex-1 text-sm leading-relaxed text-base-content/55">
                      {origen.detalle}
                    </p>
                    <p className="cifra mt-6 flex items-center gap-2 text-xs text-base-content/40">
                      <span className="text-base-content/75">
                        {origen.total}{" "}
                        {origen.total === 1 ? "unidad" : "unidades"}
                      </span>
                      <span
                        className="transition-transform duration-300 group-hover:translate-x-1"
                        aria-hidden="true"
                      >
                        →
                      </span>
                    </p>
                  </Link>
                </Revelar>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------
            El inventario entero, desfilando de lado.
           ---------------------------------------------------------------- */}
        <CarruselCatalogo vehiculos={vehiculos} />

        {/* ------------------------------------------------------------------
            Los dos caminos: lo que está aquí y lo que se trae. Es la primera
            pregunta de cualquiera que escribe, y en un Instagram no tiene
            respuesta posible sin preguntar.
           ---------------------------------------------------------------- */}
        <section className="relative overflow-hidden border-t border-base-content/8 px-4 py-24 sm:px-6">
          <Alas variante="seccion" />
          <div className="textura absolute inset-0" aria-hidden="true" />

          <div className="relative mx-auto max-w-7xl">
            <Revelar>
              <span className="banda" aria-hidden="true" />
              <p className="rotulo mt-5">Cómo la consigues</p>
            </Revelar>

            <TituloAnimado as="h2" className="display mt-4 text-4xl sm:text-5xl">
              Está aquí, o te la traemos
            </TituloAnimado>

            <div className="mt-14 grid gap-6 lg:grid-cols-2">
              {caminos.map((camino, i) => (
                <Revelar key={camino.slug} desde="corte" retraso={i * 140}>
                  <Link
                    href={`/vehiculos?entrega=${camino.slug}`}
                    className="ficha group flex h-full flex-col overflow-hidden"
                  >
                    <div className="relative">
                      <FotoVehiculo
                        vehiculo={camino.muestra}
                        className="aspect-16/10 w-full"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                      <div
                        className="absolute inset-0 bg-linear-to-t from-base-200 via-base-200/20 to-transparent"
                        aria-hidden="true"
                      />
                    </div>

                    <div className="flex flex-1 flex-col p-6 sm:p-7">
                      <p className="display text-3xl sm:text-4xl">
                        {camino.slug === "showroom" ? (
                          <>
                            En <span className="text-base-content/55">showroom</span>
                          </>
                        ) : (
                          <>
                            A <span className="text-base-content/55">pedido</span>
                          </>
                        )}
                      </p>
                      <p className="mt-4 flex-1 leading-relaxed text-base-content/60">
                        {camino.resumen}
                      </p>

                      <div className="mt-7 flex items-end justify-between gap-4 border-t border-base-content/10 pt-5">
                        <div>
                          <p className="cifra text-2xl font-bold text-base-content">
                            {enDolares(camino.desde)}
                          </p>
                          <p className="mt-1 text-[0.7rem] uppercase tracking-wider text-base-content/40">
                            desde · {camino.total}{" "}
                            {camino.total === 1 ? "unidad" : "unidades"}
                          </p>
                        </div>
                        <span
                          className="display text-sm text-base-content/70 transition-transform duration-300 group-hover:translate-x-1.5"
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

            {/* Las marcas que hoy están en inventario. */}
            <Revelar retraso={180}>
              <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-base-content/10 pt-8">
                <p className="rotulo">Marcas</p>
                {facetas.marcas.map((m) => (
                  <Link
                    key={m.valor}
                    href={`/vehiculos?marca=${encodeURIComponent(m.valor)}`}
                    className="display-recto text-lg text-base-content/45 transition-colors hover:text-base-content"
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
            Cómo se compra. El recorrido que hoy se hace entre el Instagram, el
            WhatsApp y el showroom, puesto por escrito para que el comprador
            sepa a qué atenerse antes de escribir.
           ---------------------------------------------------------------- */}
        <section
          id="como-comprar"
          className="relative overflow-hidden border-t border-base-content/8 bg-base-200 px-4 py-24 sm:px-6"
        >
          <div className="textura absolute inset-0" aria-hidden="true" />
          <div className="textura-galon absolute inset-0" aria-hidden="true" />

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
                  <div className="relative h-full border-t-2 border-base-content/25 pt-6">
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
            Las dos sedes.
            No es un detalle de pie de página: La Florida y Chacao tienen
            cuentas de Instagram distintas, así que quien ve una publicación de
            una y escribe a la otra acaba rebotando. Aquí cada sede lleva su
            dirección, su cuenta y las unidades que tiene.
           ---------------------------------------------------------------- */}
        <section
          id="sedes"
          className="relative overflow-hidden border-t border-base-content/8 px-4 py-24 sm:px-6"
        >
          <Alas variante="seccion" />
          <div className="textura absolute inset-0" aria-hidden="true" />

          <div className="relative mx-auto max-w-6xl">
            <Revelar>
              <span className="banda" aria-hidden="true" />
              <p className="rotulo mt-5">Dónde estamos</p>
            </Revelar>

            <TituloAnimado as="h2" className="display mt-4 text-4xl sm:text-5xl">
              Dos sedes en Caracas
            </TituloAnimado>

            <div className="mt-14 grid gap-6 lg:grid-cols-2">
              {config.business.sedes.map((sede, i) => {
                const total = vehiculos.filter((v) => v.sede === sede.slug).length;
                return (
                  <Revelar key={sede.slug} desde={i === 0 ? "izquierda" : "derecha"} retraso={i * 120}>
                    <div className="panel flex h-full flex-col p-7 sm:p-8">
                      <p className="display text-3xl sm:text-4xl">{sede.corto}</p>
                      <address className="mt-4 not-italic leading-relaxed text-base-content/60">
                        {sede.direccion}
                        <br />
                        {sede.ciudad}, Venezuela
                      </address>
                      <p className="mt-4 text-sm text-base-content/45">{sede.nota}</p>

                      <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-base-content/10 pt-6">
                        <p className="cifra text-sm text-base-content/70">
                          {total} {total === 1 ? "unidad" : "unidades"}
                        </p>
                        <a
                          href={sede.instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cifra text-sm text-base-content/70 underline-offset-4 transition-colors hover:text-base-content hover:underline"
                        >
                          @{sede.instagram}
                        </a>
                        <Link
                          href={`/vehiculos?sede=${sede.slug}`}
                          className="display ml-auto text-xs text-base-content/70"
                        >
                          Ver las suyas →
                        </Link>
                      </div>
                    </div>
                  </Revelar>
                );
              })}
            </div>

            <Revelar retraso={200}>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <BotonContacto demo={demo} className="btn btn-primary">
                  Cotizar por WhatsApp
                </BotonContacto>
                <a
                  href={config.business.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-filo"
                >
                  @{config.business.instagram}
                </a>
                <p className="text-sm text-base-content/45">{config.business.horario}</p>
              </div>
            </Revelar>
          </div>
        </section>

        {/* ------------------------------------------------------------------
            Los canales oficiales, del comunicado fijado de su Instagram.
           ---------------------------------------------------------------- */}
        <SeccionCanales />

        {/* ------------------------------------------------------------------
            Aquí cambia el interlocutor: lo que viene le habla a Veloce, no a
            quien vino a comprar un carro. El cintillo lo avisa.
           ---------------------------------------------------------------- */}
        {/* El panel se queda aunque se apague la demo: al comprador le explica
            por qué el inventario está al día. Lo que sí desaparece con la demo
            son los cintillos y la comparación. */}
        {demo && <Cintillo variante="venta" />}
        <SeccionPanel />
        {demo && <SeccionPorQue />}
        {demo && <Cintillo variante="cliente" />}

        {/* Aviso honesto mientras el inventario sea de muestra. */}
        {hayMuestras() && (
          <section className="border-t border-base-content/8 px-4 py-14 sm:px-6">
            <div className="panel mx-auto max-w-3xl p-7 text-center">
              <p className="rotulo">Sobre estas unidades</p>
              <p className="mt-4 text-sm leading-relaxed text-base-content/60">
                Las {vehiculos.length} unidades que ves son de ejemplo, no el inventario
                real de{" "}
                <a
                  href={config.business.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-base-content hover:underline"
                >
                  @{config.business.instagram}
                </a>
                . Están para que la página se pueda recorrer funcionando. Lo que sí es
                suyo y está tomado de lo que publican: el logotipo, las cuatro
                procedencias, las dos sedes, los canales oficiales, la dirección y el
                WhatsApp. El inventario de verdad se carga desde su Instagram y sustituye
                a este en un solo paso.
              </p>
              <AvisoMuestra corto className="mt-5" />
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

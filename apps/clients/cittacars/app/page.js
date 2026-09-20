import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Revelar from "@/components/Revelar";
import Barras from "@/components/Barras";
import PantallaVehiculo from "@/components/PantallaVehiculo";
import RejillaVehiculos from "@/components/RejillaVehiculos";
import BotonContacto from "@/components/BotonContacto";
import SeccionPanel from "@/components/SeccionPanel";
import Cintillo from "@/components/Cintillo";
import SeccionLinktree from "@/components/SeccionLinktree";
import BloqueVenta from "@/components/demo/BloqueVenta";
import { leerVehiculos, facetasDe, filtrar, hayMuestra } from "@/libs/vehiculos";
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
  const recientes = filtrar(vehiculos, { orden: "anio-desc" }).slice(0, 6);
  const desde = Math.min(...vehiculos.map((v) => v.precio));

  return (
    <>
      <Header />

      <main className="escaparate">
        {/* ------------------------------------------------------------------
            Portada. Una sola idea, a pantalla completa: esto es un
            concesionario, y de aquí sales con la camioneta que quieres.
           ---------------------------------------------------------------- */}
        <section className="pantalla items-center justify-center overflow-hidden bg-base-200">
          {/* La fotografía ocupa el fondo entero, anclada abajo para que el
              vehículo quede bajo el texto y no detrás de él. */}
          <Image
            src="/landing/hero.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-bottom"
          />

          {/* El velo que hace legible el titular: negro arriba, donde va el
              texto, y transparente en la franja del vehículo. */}
          <div
            className="absolute inset-0 bg-linear-to-b from-base-100 via-base-100/85 via-45% to-transparent"
            aria-hidden="true"
          />

          <div className="relative z-10 mx-auto flex max-w-3xl flex-1 flex-col items-center justify-center px-4 py-24 text-center">
            <span className="banda mb-7" aria-hidden="true" />

            <p className="rotulo">Concesionario · {config.business.ciudad}</p>

            <h1 className="display mt-5 text-5xl sm:text-6xl lg:text-7xl">
              Arma la camioneta
              <br />
              de tus <span className="text-primary">sueños</span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-base-content/65 sm:text-lg">
              Camionetas, pick-up y carros revisados, con su ficha completa y su
              precio a la vista. Y si quieres montarle accesorios, el taller
              está en la misma casa.
            </p>

            <div className="mt-9 flex w-full max-w-md flex-col gap-3 sm:flex-row">
              <Link href="/vehiculos" className="btn btn-primary flex-1">
                Ver inventario
              </Link>
              <BotonContacto
                demo={demo}
                className="btn btn-ghost flex-1 border border-base-content/20"
              >
                Escribir por WhatsApp
              </BotonContacto>
            </div>

            {/* Las cifras que dan confianza de entrada.

                En móvil van más pequeñas y con menos hueco a propósito: a
                tamaño de escritorio, "USD 9.800" no cabe en un tercio de 390px
                y se montaba encima de la cifra de al lado. El `min-w-0` es lo
                que deja a las columnas encogerse; sin él, la anchura mínima
                del contenido manda sobre el reparto de la rejilla. */}
            <dl className="mt-14 grid w-full max-w-lg grid-cols-3 gap-2 sm:gap-4">
              {[
                { valor: vehiculos.length, etiqueta: "en inventario" },
                { valor: enDolares(desde), etiqueta: "desde" },
                { valor: config.business.seguidores, etiqueta: "en Instagram" },
              ].map((dato) => (
                <div key={dato.etiqueta} className="min-w-0">
                  <dt className="cifra text-lg font-bold text-base-content sm:text-2xl">
                    {dato.valor}
                  </dt>
                  <dd className="mt-1 text-[0.65rem] uppercase tracking-wide text-base-content/45 sm:text-[0.7rem] sm:tracking-wider">
                    {dato.etiqueta}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* La flecha de "sigue bajando". */}
          <div className="relative z-10 flex justify-center pb-8" aria-hidden="true">
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
            El escaparate: un vehículo por pantalla, alternando fondo.
           ---------------------------------------------------------------- */}
        {escaparate.map((vehiculo, i) => (
          <PantallaVehiculo
            key={vehiculo.slug}
            vehiculo={vehiculo}
            tono={i % 2 === 0 ? "oscuro" : "claro"}
            prioridad={i === 0}
            demo={demo}
          />
        ))}

        {/* ------------------------------------------------------------------
            Por tipo de vehículo.
           ---------------------------------------------------------------- */}
        <section className="relative overflow-hidden border-t border-base-content/10 px-4 py-24 sm:px-6">
          <div className="textura absolute inset-0" aria-hidden="true" />
          <div className="textura-barras absolute inset-0" aria-hidden="true" />

          <div className="relative mx-auto max-w-7xl">
            <Revelar className="text-center">
              <p className="rotulo">Qué buscas</p>
              <h2 className="display mt-4 text-3xl sm:text-4xl">Elige por tipo</h2>
            </Revelar>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {facetas.tipos.map((tipo, i) => (
                <Revelar key={tipo.slug} retraso={i * 80}>
                  <Link
                    href={`/vehiculos?tipo=${tipo.slug}`}
                    className="ficha group block h-full overflow-hidden"
                  >
                    <div className="relative aspect-4/3 overflow-hidden">
                      <Image
                        src={`/landing/tipo-${tipo.slug}.jpg`}
                        alt={tipo.nombre}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-5 text-center">
                      <h3 className="display text-lg">{tipo.nombre}</h3>
                      <p className="cifra mt-1.5 text-sm text-base-content/45">
                        {tipo.total} {tipo.total === 1 ? "disponible" : "disponibles"}
                      </p>
                    </div>
                  </Link>
                </Revelar>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------
            Los últimos que entraron.
           ---------------------------------------------------------------- */}
        <section className="relative overflow-hidden bg-base-200 px-4 py-24 sm:px-6">
          <div className="textura absolute inset-0" aria-hidden="true" />

          <div className="relative mx-auto max-w-7xl">
            {/* En móvil el título y el enlace se apilan y se centran; desde
                sm vuelven a ir uno a cada lado. */}
            <Revelar className="flex flex-col items-center gap-4 text-center sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:text-left">
              <div>
                <p className="rotulo">Recién publicados</p>
                <h2 className="display mt-4 text-3xl sm:text-4xl">Lo último que entró</h2>
              </div>
              <Link href="/vehiculos" className="btn btn-ghost btn-sm border border-base-content/20">
                Ver todo
              </Link>
            </Revelar>

            <Revelar retraso={100}>
              <RejillaVehiculos vehiculos={recientes} className="mt-12" />
            </Revelar>
          </div>
        </section>

        {/* ------------------------------------------------------------------
            El taller. Es la segunda pata del negocio y lo que los separa de un
            concesionario cualquiera: el vehículo sale de aquí ya armado.
           ---------------------------------------------------------------- */}
        <section
          id="taller"
          className="relative overflow-hidden border-t border-base-content/10 px-4 py-24 sm:px-6"
        >
          <div className="textura absolute inset-0" aria-hidden="true" />
          <div className="textura-barras-color absolute inset-0" aria-hidden="true" />
          <div className="malla absolute inset-0 opacity-60" aria-hidden="true" />

          <div className="relative mx-auto max-w-7xl">
            <Revelar className="text-center">
              <Barras className="mx-auto h-5 w-16" />
              <p className="rotulo mt-6">Taller propio</p>
              <h2 className="display mt-4 text-3xl sm:text-4xl lg:text-5xl">
                {config.taller.titulo}
              </h2>
              <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-base-content/60">
                {config.taller.entrada}
              </p>
            </Revelar>

            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {config.taller.servicios.map((servicio, i) => (
                <Revelar key={servicio.nombre} retraso={i * 70}>
                  <div className="ficha h-full p-6">
                    <span className="banda" aria-hidden="true" />
                    <h3 className="display mt-5 text-lg">{servicio.nombre}</h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-base-content/60">
                      {servicio.detalle}
                    </p>
                  </div>
                </Revelar>
              ))}
            </div>

            <Revelar retraso={140}>
              <div className="mt-12 flex flex-wrap justify-center gap-3">
                <BotonContacto demo={demo} className="btn btn-primary">
                  Cotizar accesorios
                </BotonContacto>
                <a
                  href={config.business.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sobre-foto"
                >
                  Ver trabajos en @{config.business.instagram}
                </a>
              </div>
            </Revelar>
          </div>
        </section>

        {/* ------------------------------------------------------------------
            Cómo se compra. Es el recorrido que hoy se hace por WhatsApp,
            puesto por escrito para que el comprador sepa a qué atenerse.
           ---------------------------------------------------------------- */}
        <section id="como-comprar" className="relative overflow-hidden bg-base-200 px-4 py-24 sm:px-6">
          <div className="textura absolute inset-0" aria-hidden="true" />

          <div className="relative mx-auto max-w-7xl">
            <Revelar className="text-center">
              <p className="rotulo">Cómo comprar</p>
              <h2 className="display mt-4 text-3xl sm:text-4xl">Tres pasos, sin vueltas</h2>
            </Revelar>

            <div className="mt-14 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <Revelar desde="izquierda">
                <div className="relative aspect-4/3 overflow-hidden rounded-lg">
                  <Image
                    src="/landing/comprar.jpg"
                    alt="Entrega de las llaves al comprador"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </Revelar>

              <div>
                {config.compra.pasos.map((paso, i) => (
                  <Revelar key={paso.titulo} retraso={i * 110}>
                    <div className="flex gap-5 border-b border-base-content/10 py-6 last:border-0">
                      <span className="cifra shrink-0 text-2xl font-bold text-primary/50">
                        0{i + 1}
                      </span>
                      <div>
                        <h3 className="display text-lg">{paso.titulo}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-base-content/60">
                          {paso.detalle}
                        </p>
                      </div>
                    </div>
                  </Revelar>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------
            Consignación. Sale de una de sus historias destacadas: "¿Quieres
            dejar tu vehículo a consignación?". Es la vía por la que entra
            inventario, así que tiene su propio sitio y su propio botón.
           ---------------------------------------------------------------- */}
        <section
          id="consignacion"
          className="relative overflow-hidden border-y border-base-content/10 px-4 py-20 sm:px-6"
        >
          <div className="textura absolute inset-0" aria-hidden="true" />

          <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-8 text-center lg:flex-row lg:justify-between lg:text-left">
            <Revelar>
              <p className="rotulo">¿Vas a vender el tuyo?</p>
              <h2 className="display mt-4 text-3xl sm:text-4xl">
                Déjalo en <span className="text-primary">consignación</span>
              </h2>
              <p className="mt-5 max-w-xl leading-relaxed text-base-content/60">
                Tu vehículo se publica aquí y en el Instagram del concesionario, se
                enseña en el showroom y se atiende a los interesados. Tú no
                contestas mensajes ni coordinas citas: solo firmas cuando se
                vende.
              </p>
            </Revelar>

            <Revelar retraso={120} desde="derecha">
              <BotonContacto demo={demo} className="btn btn-primary btn-lg shrink-0">
                Consignar mi vehículo
              </BotonContacto>
            </Revelar>
          </div>
        </section>

        {/* ------------------------------------------------------------------
            Quién publica esto. Va justo después de "cómo comprar" a propósito:
            primero se explica cómo se compra y enseguida por qué lo que se
            acaba de ver está al día.
           ---------------------------------------------------------------- */}
        {/* El panel se queda aunque se apague la demo: al comprador le explica
            por qué el inventario está al día. Lo que sí desaparece con la demo
            son los cintillos y la comparación, que le hablan a quien todavía
            está decidiendo si compra la página. */}
        {demo && <Cintillo variante="venta" />}
        <SeccionPanel />
        {demo && <SeccionLinktree />}
        {demo && <Cintillo variante="cliente" />}

        {/* Aviso honesto mientras el catálogo lleve datos inventados. */}
        {hayMuestra() && (
          <section className="px-4 py-12 sm:px-6">
            <div className="panel mx-auto max-w-3xl p-6 text-center">
              <p className="rotulo">Catálogo de muestra</p>
              <p className="mt-3 text-sm leading-relaxed text-base-content/60">
                Los vehículos que ves son de ejemplo y las fotos son de banco de
                imágenes: corresponden al modelo de cada ficha, pero no son la unidad
                en venta. Al cargar las publicaciones reales de{" "}
                <a
                  href={config.business.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline"
                >
                  @{config.business.instagram}
                </a>{" "}
                —con sus fotos, precios y kilometrajes— todo esto se sustituye solo.
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

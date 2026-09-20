import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Revelar from "@/components/Revelar";
import PantallaVehiculo from "@/components/PantallaVehiculo";
import RejillaVehiculos from "@/components/RejillaVehiculos";
import BotonContacto from "@/components/BotonContacto";
import SeccionPanel from "@/components/SeccionPanel";
import Cintillo from "@/components/Cintillo";
import SeccionInstagram from "@/components/SeccionInstagram";
import BloqueVenta from "@/components/demo/BloqueVenta";
import { MarcaAlada } from "@/components/Marca";
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
            Portada. Una sola idea, a pantalla completa: esto es una
            concesionaria, hace cuatro cosas y tiene el inventario publicado.
           ---------------------------------------------------------------- */}
        <section className="pantalla items-center justify-center overflow-hidden">
          {/* La fotografía ocupa el fondo entero, anclada abajo para que el
              vehículo quede bajo el texto y no detrás de él. */}
          <Image
            src="/landing/hero.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-bottom opacity-55"
          />

          {/* Dos velos sobre la foto. Sin ellos, el titular claro se pierde
              contra el cielo: el primero hunde la imagen en el grafito de la
              casa por arriba y por abajo, el segundo la enfría entera. */}
          <div
            className="absolute inset-0 bg-linear-to-b from-base-100 via-base-100/62 via-45% to-base-100"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-base-100/25" aria-hidden="true" />
          <div className="malla absolute inset-0 opacity-50" aria-hidden="true" />

          <div className="relative z-10 mx-auto flex max-w-4xl flex-1 flex-col items-center justify-center px-4 py-24 text-center">
            <MarcaAlada className="h-14 w-44 text-base-content" />

            <p className="rotulo mt-7">
              {config.business.categoria} · {config.business.ciudad}
            </p>

            <h1 className="display mt-5 text-4xl sm:text-5xl lg:text-6xl">
              <span className="cromo">Compra. Venta.</span>
              <br />
              <span className="text-primary">Consignación</span> e{" "}
              <span className="text-primary">importación</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-base-content/65 sm:text-lg">
              Sala en El Rosal, Caracas y en Barcelona, Anzoátegui. Todo el
              inventario publicado con su precio, su kilometraje y su ficha: lo
              que ves es lo que hay.
            </p>

            <div className="mt-9 flex w-full max-w-md flex-col gap-3 sm:flex-row">
              <Link href="/vehiculos" className="btn btn-primary flex-1">
                Ver inventario
              </Link>
              <BotonContacto demo={demo} className="btn btn-vidrio flex-1">
                Escribir por WhatsApp
              </BotonContacto>
            </div>

            {/* Las cifras que dan confianza de entrada, sobre un panel de
                cristal para que se lean encima de la foto.

                En móvil van más pequeñas y con menos hueco a propósito: a
                tamaño de escritorio, "USD 9.800" no cabe en un cuarto de 390px
                y se montaba encima de la cifra de al lado. El `min-w-0` es lo
                que deja a las columnas encogerse; sin él, la anchura mínima del
                contenido manda sobre el reparto de la rejilla. */}
            <dl className="vidrio mt-12 grid w-full max-w-2xl grid-cols-2 gap-x-2 gap-y-5 px-5 py-5 sm:grid-cols-4 sm:gap-4">
              {[
                { valor: vehiculos.length, etiqueta: "en inventario" },
                { valor: enDolares(desde), etiqueta: "desde" },
                { valor: config.sedes.length, etiqueta: "salas" },
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
            El escaparate: un vehículo por sección, alternando fondo.
           ---------------------------------------------------------------- */}
        {escaparate.map((vehiculo, i) => (
          <PantallaVehiculo
            key={vehiculo.slug}
            vehiculo={vehiculo}
            tono={i % 2 === 0 ? "hondo" : "claro"}
            prioridad={i === 0}
            demo={demo}
          />
        ))}

        {/* ------------------------------------------------------------------
            Las cuatro operaciones. Es lo que el perfil resume en una línea
            —COMPRA / VENTA / CONSIGNACIÓN / IMPORTACIÓN— explicado para quien
            no sabe qué significa cada palabra.
           ---------------------------------------------------------------- */}
        <section
          id="operaciones"
          className="relative overflow-hidden border-t border-white/10 px-4 py-24 sm:px-6"
        >
          <div className="textura absolute inset-0" aria-hidden="true" />
          <div className="textura-hex absolute inset-0" aria-hidden="true" />

          <div className="relative mx-auto max-w-7xl">
            <Revelar className="text-center">
              <p className="rotulo">Cuatro formas de hacer negocio</p>
              <h2 className="display mt-4 text-3xl sm:text-4xl">
                <span className="cromo">No solo vendemos</span>
              </h2>
              <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-base-content/60">
                La mayoría llega buscando un carro, pero la mitad del movimiento
                de la casa es al revés: gente que quiere vender el suyo, dejarlo
                en consignación o traer de afuera un modelo que aquí no se
                consigue.
              </p>
            </Revelar>

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {config.operaciones.map((operacion, i) => (
                <Revelar key={operacion.clave} retraso={i * 80}>
                  <div className="vidrio h-full p-6">
                    <span className="banda" aria-hidden="true" />
                    <h3 className="display mt-5 text-xl">{operacion.titulo}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-base-content/60">
                      {operacion.detalle}
                    </p>
                  </div>
                </Revelar>
              ))}
            </div>

            <Revelar retraso={360} className="mt-10 text-center">
              <BotonContacto demo={demo} className="btn btn-vidrio">
                Consultar por mi caso
              </BotonContacto>
            </Revelar>
          </div>
        </section>

        {/* ------------------------------------------------------------------
            Por tipo de vehículo.
           ---------------------------------------------------------------- */}
        <section className="relative overflow-hidden border-t border-white/10 bg-base-200/40 px-4 py-24 sm:px-6">
          <div className="textura absolute inset-0" aria-hidden="true" />

          <div className="relative mx-auto max-w-7xl">
            <Revelar className="text-center">
              <p className="rotulo">Qué buscas</p>
              <h2 className="display mt-4 text-3xl sm:text-4xl">Elige por tipo</h2>
            </Revelar>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {facetas.tipos.map((tipo, i) => (
                <Revelar key={tipo.slug} retraso={i * 80}>
                  <Link
                    href={`/vehiculos?tipo=${tipo.slug}`}
                    className="ficha group block h-full"
                  >
                    <div className="relative aspect-4/3 overflow-hidden">
                      <Image
                        src={`/landing/tipo-${tipo.slug}.jpg`}
                        alt={tipo.nombre}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover opacity-85 transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Velo inferior: sobre una foto clara, el nombre en
                          blanco del pie de la tarjeta se perdería. */}
                      <div
                        className="absolute inset-0 bg-linear-to-t from-base-100/90 to-transparent"
                        aria-hidden="true"
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
        <section className="relative overflow-hidden px-4 py-24 sm:px-6">
          <div className="textura absolute inset-0" aria-hidden="true" />

          <div className="relative mx-auto max-w-7xl">
            <Revelar className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="rotulo">Recién publicados</p>
                <h2 className="display mt-4 text-3xl sm:text-4xl">Lo último que entró</h2>
              </div>
              <Link href="/vehiculos" className="btn btn-vidrio btn-sm">
                Ver todo
              </Link>
            </Revelar>

            <Revelar retraso={100}>
              <RejillaVehiculos vehiculos={recientes} className="mt-12" />
            </Revelar>
          </div>
        </section>

        {/* ------------------------------------------------------------------
            Las dos salas. Es el dato que más preguntan y lo que distingue a
            una concesionaria de alguien que vende por Instagram.
           ---------------------------------------------------------------- */}
        <section
          id="sedes"
          className="relative overflow-hidden border-t border-white/10 bg-base-200/40 px-4 py-24 sm:px-6"
        >
          <div className="textura absolute inset-0" aria-hidden="true" />
          <div className="textura-hex absolute inset-0" aria-hidden="true" />

          <div className="relative mx-auto max-w-5xl">
            <Revelar className="text-center">
              <p className="rotulo">Dónde estamos</p>
              <h2 className="display mt-4 text-3xl sm:text-4xl">Dos salas</h2>
              <p className="mx-auto mt-5 max-w-xl leading-relaxed text-base-content/60">
                Los vehículos se ven en persona. Cada ficha del inventario dice
                en cuál de las dos está, para que nadie cruce el país por un
                carro que estaba en la otra punta.
              </p>
            </Revelar>

            <div className="mt-12 grid gap-5 sm:grid-cols-2">
              {config.sedes.map((sede, i) => (
                <Revelar key={sede.zona} retraso={i * 100}>
                  <div className="vidrio flex h-full flex-col p-7">
                    <p className="cifra text-xs uppercase tracking-[0.22em] text-primary">
                      {sede.detalle}
                    </p>
                    <h3 className="display mt-4 text-2xl">{sede.zona}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-base-content/60">
                      Visitas con cita previa. Se coordina por WhatsApp y se
                      aparta el vehículo para que esté listo cuando llegues.
                    </p>
                    <Link
                      href={`/vehiculos?sede=${encodeURIComponent(sede.ciudad)}`}
                      className="btn btn-vidrio btn-sm mt-6 self-start"
                    >
                      Ver lo que hay aquí
                    </Link>
                  </div>
                </Revelar>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------
            Cómo se compra. Es el recorrido que hoy se hace por WhatsApp,
            puesto por escrito para que el comprador sepa a qué atenerse.
           ---------------------------------------------------------------- */}
        <section id="como-comprar" className="relative overflow-hidden px-4 py-24 sm:px-6">
          <div className="textura absolute inset-0" aria-hidden="true" />

          <div className="relative mx-auto max-w-7xl">
            <Revelar className="text-center">
              <p className="rotulo">Cómo comprar</p>
              <h2 className="display mt-4 text-3xl sm:text-4xl">Tres pasos, sin vueltas</h2>
            </Revelar>

            <div className="mt-14 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <Revelar desde="izquierda">
                <div className="vidrio relative aspect-4/3 overflow-hidden p-0">
                  <Image
                    src="/landing/comprar.jpg"
                    alt="Entrega de las llaves al comprador"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover opacity-90"
                  />
                </div>
              </Revelar>

              <div>
                {config.compra.pasos.map((paso, i) => (
                  <Revelar key={paso.titulo} retraso={i * 110}>
                    <div className="flex gap-5 border-b border-white/10 py-6 last:border-0">
                      <span className="cifra shrink-0 text-2xl font-bold text-primary/45">
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
            Quién publica esto. Va justo después de "cómo comprar" a propósito:
            primero se explica cómo se compra y enseguida por qué lo que se
            acaba de ver está al día.

            El panel se queda aunque se apague la demo: al comprador le explica
            por qué el inventario está al día. Lo que sí desaparece con la demo
            son los cintillos y la comparación, que le hablan a quien todavía
            está decidiendo si compra la página.
           ---------------------------------------------------------------- */}
        {demo && <Cintillo variante="venta" />}
        <SeccionPanel />
        {demo && <SeccionInstagram />}
        {demo && <Cintillo variante="cliente" />}

        {/* ------------------------------------------------------------------
            La otra pata del negocio. El logotipo dice "compra y venta de
            carros e inmobiliarios" y el perfil remite a su cuenta hermana:
            ignorarlo sería enseñar medio negocio.
           ---------------------------------------------------------------- */}
        <section
          id="inmuebles"
          className="relative overflow-hidden border-y border-white/10 px-4 py-24 sm:px-6"
        >
          <Image
            src="/landing/inmuebles.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-35"
          />
          {/* La foto es muy clara; sin este velo el texto no se lee. */}
          <div className="absolute inset-0 bg-base-100/70" aria-hidden="true" />
          <div className="textura-hex absolute inset-0" aria-hidden="true" />

          <div className="relative mx-auto max-w-4xl text-center">
            <Revelar>
              <p className="cifra text-xs uppercase tracking-[0.24em] text-primary">
                También
              </p>
              <h2 className="display mt-4 text-3xl sm:text-4xl">Inmuebles</h2>
              <p className="mx-auto mt-5 max-w-xl leading-relaxed text-base-content/65">
                La misma casa lleva la parte inmobiliaria en su propia cuenta:
                compra, venta y alquiler, con el mismo acompañamiento en el
                papeleo que con los vehículos.
              </p>

              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <a
                  href={config.business.instagramInmueblesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  Ver @{config.business.instagramInmuebles}
                </a>
                <BotonContacto demo={demo} className="btn btn-vidrio">
                  Consultar por un inmueble
                </BotonContacto>
              </div>
            </Revelar>
          </div>
        </section>

        {/* Aviso honesto mientras el catálogo lleve datos inventados. */}
        {hayMuestra() && (
          <section className="px-4 py-12 sm:px-6">
            <div className="panel mx-auto max-w-3xl p-6 text-center">
              <p className="rotulo">Catálogo de muestra</p>
              <p className="mt-3 text-sm leading-relaxed text-base-content/60">
                Los vehículos que ves son de ejemplo y las fotos son de banco de
                imágenes: corresponden al modelo de cada ficha, pero no son la
                unidad en venta. Al cargar las publicaciones reales de{" "}
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

import Link from "next/link";
import Image from "next/image";
import Revelar from "@/components/Revelar";
import { enBolivares } from "@/libs/formato";

/**
 * Portada.
 *
 * Las cifras no son adorno: salen del catálogo importado, así que si el PDF
 * trae 240 productos la portada dice 240 sin que nadie lo toque.
 */
export default function HeroTienda({ total, marcas, categorias, tasa, destacados = [] }) {
  const datos = [
    { valor: total, etiqueta: "productos en lista" },
    { valor: marcas, etiqueta: "marcas" },
    { valor: categorias, etiqueta: "categorías" },
    { valor: "3", etiqueta: "formas de pago" },
  ];

  return (
    <section className="relative overflow-hidden">
      <div className="humo absolute inset-0" aria-hidden="true" />
      <div className="malla absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pb-16 pt-16 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:pb-24 lg:pt-24">
        <div>
          <Revelar>
            <p className="rotulo">Caracas · Centro Lido, El Rosal</p>
          </Revelar>

          <Revelar retraso={80}>
            <h1 className="display mt-5 text-5xl sm:text-6xl lg:text-7xl">
              TODO LO QUE
              <br />
              TU ENTRENO
              <br />
              <span className="text-primary texto-glow">NECESITA.</span>
            </h1>
          </Revelar>

          <Revelar retraso={160}>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-base-content/65">
              Proteínas, creatina, pre-entreno, vitaminas, accesorios de gimnasio, natación y
              bolsos. Lista actualizada, stock real y tres formas de pago.
            </p>
          </Revelar>

          <Revelar retraso={240}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/tienda" className="btn btn-primary btn-lg">
                Ver catálogo
              </Link>
              <Link href="/tienda?ofertas=1" className="btn btn-lg btn-outline">
                Ofertas flash
              </Link>
            </div>
          </Revelar>

          <Revelar retraso={320}>
            <dl className="mt-12 grid max-w-lg grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4">
              {datos.map((dato) => (
                <div key={dato.etiqueta}>
                  <dt className="cifra text-3xl font-bold leading-none text-primary">{dato.valor}</dt>
                  <dd className="mt-1.5 text-[0.7rem] uppercase tracking-wider text-base-content/45">
                    {dato.etiqueta}
                  </dd>
                </div>
              ))}
            </dl>
          </Revelar>

          {tasa && (
            <Revelar retraso={400}>
              <p className="cifra mt-8 inline-flex items-center gap-2 rounded-lg border border-base-content/10 bg-base-200/50 px-3.5 py-2 text-xs text-base-content/55">
                <span className="inline-block size-1.5 animate-[latido_3.5s_ease-in-out_infinite] rounded-full bg-success" />
                Tasa BCV {enBolivares(tasa.valor)} · {tasa.fechaValor}
              </p>
            </Revelar>
          )}
        </div>

        {/* Collage de productos reales del catálogo. */}
        {destacados.length > 0 && (
          <Revelar retraso={200} className="relative">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {destacados.slice(0, 4).map((producto, i) => (
                <Link
                  key={producto.slug}
                  href={`/producto/${producto.slug}`}
                  className={`ficha group relative overflow-hidden ${
                    i % 2 === 1 ? "mt-8" : ""
                  }`}
                >
                  <div className="foto-producto relative aspect-square">
                    {producto.imagen && (
                      <Image
                        src={producto.imagen}
                        alt={producto.nombre}
                        fill
                        sizes="(max-width: 1024px) 40vw, 220px"
                        className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                        priority={i < 2}
                      />
                    )}
                  </div>
                  <p className="truncate px-3 py-2.5 text-xs text-base-content/60">
                    {producto.nombre}
                  </p>
                </Link>
              ))}
            </div>
          </Revelar>
        )}
      </div>
    </section>
  );
}

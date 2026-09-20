import Link from "next/link";
import Image from "next/image";
import Revelar from "@/components/Revelar";

/**
 * Las grandes familias del catálogo, cada una con la foto de uno de sus
 * productos como fondo. Es la forma más rápida de entrar a la tienda sin
 * pasar por la búsqueda.
 */
export default function RejillaFamilias({ familias }) {
  if (!familias?.length) return null;

  return (
    <section className="relative mx-auto max-w-7xl overflow-hidden px-4 py-20 sm:px-6">
      <div className="textura absolute inset-0" aria-hidden="true" />
      <div className="textura-rayas absolute inset-0" aria-hidden="true" />
      <Revelar className="text-center sm:text-left">
        <p className="rotulo">Qué hay</p>
        <h2 className="cromo display mt-3 text-3xl sm:text-4xl">POR CATEGORÍA</h2>
      </Revelar>

      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {familias.map((familia, i) => (
          <Revelar key={familia.slug} retraso={i * 50}>
            <Link
              href={`/tienda?familia=${familia.slug}`}
              className="ficha group relative flex h-40 items-end overflow-hidden p-5"
            >
              {familia.imagen && (
                <Image
                  src={familia.imagen}
                  alt=""
                  width={160}
                  height={160}
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-4 top-1/2 size-36 -translate-y-1/2 object-contain opacity-25 mix-blend-screen transition-all duration-500 group-hover:scale-110 group-hover:opacity-45"
                />
              )}

              <div className="relative">
                <h3 className="display text-xl">{familia.nombre}</h3>
                <p className="cifra mt-1.5 text-xs text-base-content/45">
                  {familia.total} {familia.total === 1 ? "producto" : "productos"}
                </p>
              </div>

              <span
                className="absolute right-4 top-4 text-primary opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
                aria-hidden="true"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          </Revelar>
        ))}
      </div>
    </section>
  );
}

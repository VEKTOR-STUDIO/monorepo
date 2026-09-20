import Image from "next/image";
import Link from "next/link";
import { PreciosCompactos } from "@/components/Precios";
import BotonAgregar from "@/components/BotonAgregar";
import { ESTADOS } from "@/libs/formato";

/**
 * La tarjeta de la cuadrícula.
 *
 * Las fotos salen del PDF y son pequeñas (unos 90×126 px), así que se
 * presentan contenidas sobre un cuadro claro en vez de a sangre: ampliarlas
 * las deja borrosas. Cuando Hardcore suba fotos mejores desde el panel, la
 * misma tarjeta las aprovecha sin tocar nada.
 */
export default function FichaProducto({ producto, prioridad = false }) {
  const estado = ESTADOS[producto.estado] || ESTADOS.disponible;

  return (
    <article className="ficha group flex flex-col overflow-hidden">
      {/* La luz que cruza la tarjeta al pasar por encima (ver .reflejo). */}
      <span className="reflejo" aria-hidden="true" />

      <Link
        href={`/producto/${producto.slug}`}
        className="relative block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <div className="foto-producto relative aspect-4/3 overflow-hidden">
          {producto.imagen ? (
            <Image
              src={producto.imagen}
              alt={producto.nombre}
              fill
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 260px"
              className="object-contain p-5 transition-transform duration-500 group-hover:scale-105"
              priority={prioridad}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-4xl text-base-300">
              <span aria-hidden="true">📦</span>
            </div>
          )}

          {producto.ofertaFlash && (
            // Insignia sesgada de filo duro, como las de los envases.
            <span className="insignia absolute left-2.5 top-2.5 bg-primary px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-wider text-primary-content">
              <span>Oferta flash</span>
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex-1">
          <p className="rotulo mb-1.5 truncate" title={producto.categoria}>
            {producto.categoria}
          </p>
          <h3 className="text-sm font-semibold leading-snug">
            <Link
              href={`/producto/${producto.slug}`}
              className="line-clamp-2 transition-colors hover:text-primary"
              title={producto.nombre}
            >
              {producto.nombre}
            </Link>
          </h3>

          <p className={`mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[0.7rem] ${estado.clase}`}>
            <span className={`inline-block size-1.5 rounded-full ${estado.punto}`} aria-hidden="true" />
            {estado.texto}
            {producto.variaciones?.length > 1 && (
              <span className="text-base-content/40">
                · {producto.variaciones.length} presentaciones
              </span>
            )}
          </p>
        </div>

        <PreciosCompactos producto={producto} />

        <BotonAgregar
          producto={producto}
          // Con varias presentaciones hay que elegir en la ficha; con una sola
          // (o ninguna) se puede agregar directamente desde la cuadrícula.
          variacionElegida={producto.variaciones?.length === 1 ? producto.variaciones[0] : null}
          className={producto.variaciones?.length > 1 ? "hidden" : "w-full"}
          tamano="sm"
        />

        {producto.variaciones?.length > 1 && (
          <Link href={`/producto/${producto.slug}`} className="btn btn-sm btn-outline w-full">
            Elegir presentación
          </Link>
        )}
      </div>
    </article>
  );
}

/**
 * Cinta de marcas que corre sin parar.
 *
 * La lista sale del catálogo, no de una lista escrita a mano: son las marcas
 * que Hardcore tiene de verdad. Se duplica el contenido para que el bucle
 * encaje sin salto (la animación desplaza justo la mitad).
 */
export default function CintaMarcas({ marcas }) {
  if (!marcas?.length) return null;

  const tira = [...marcas, ...marcas];

  return (
    <section
      className="relative overflow-hidden border-y border-base-content/10 bg-base-200/30 py-5"
      aria-label="Marcas disponibles"
    >
      <div className="flex w-max animate-[cinta_42s_linear_infinite] items-center gap-10 hover:[animation-play-state:paused]">
        {tira.map((marca, i) => (
          <span
            key={`${marca}-${i}`}
            className="display shrink-0 whitespace-nowrap text-lg text-base-content/25 transition-colors hover:text-primary"
            aria-hidden={i >= marcas.length ? "true" : undefined}
          >
            {marca}
          </span>
        ))}
      </div>

      {/* Desvanecido en los bordes para que las marcas entren y salgan. */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-linear-to-r from-base-100 to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-linear-to-l from-base-100 to-transparent"
        aria-hidden="true"
      />
    </section>
  );
}

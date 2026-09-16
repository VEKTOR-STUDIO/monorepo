import Link from "next/link";

// -----------------------------------------------------------------------------
// Hero de la landing. Sin video de fondo: la atmósfera la dan capas de CSS
// (rejilla, rayas diagonales, cuña roja y resplandor), como un póster impreso.
// Pesa cero, no parpadea al cargar y se ve igual en móvil.
// -----------------------------------------------------------------------------

const HIGHLIGHTS = [
  { number: "01", label: "Sesiones en video" },
  { number: "02", label: "Plan semanal" },
  { number: "03", label: "Progreso medible" },
];

const HeroFrank = () => {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col overflow-hidden pt-28"
      aria-label="Hero"
    >
      {/* --- Fondo: capas geométricas, ningún archivo de video --- */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="hero-grid absolute inset-0 opacity-70" />
        <div className="hero-wedge absolute inset-0 bg-primary/10" />
        <div className="hero-stripes absolute inset-0" />
        <div className="hero-glow absolute inset-0 opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-base-100/60 via-transparent to-base-100" />
      </div>

      {/* Palabra gigante contorneada de fondo */}
      <span
        aria-hidden="true"
        className="display text-stroke pointer-events-none absolute -top-4 right-0 select-none text-[7rem] leading-none opacity-70 md:text-[16rem]"
      >
        FIGHT
      </span>

      {/* Etiqueta vertical en el borde, tipo lateral de camiseta */}
      <span
        aria-hidden="true"
        className="vertical-label pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 select-none text-xs font-bold uppercase tracking-[0.35em] text-base-content/35 lg:block"
      >
        Alto rendimiento
      </span>

      <div className="container relative z-10 mx-auto flex flex-1 items-center px-6 sm:px-8">
        <div className="max-w-4xl py-16">
          <div className="rise rise-1">
            <span className="tag-skew bg-primary px-3 py-1 text-xs text-primary-content">
              <span>VOD · Preparación física · Rendimiento</span>
            </span>
          </div>

          <h1 className="display rise rise-2 mt-6 text-[2.6rem] text-base-content sm:text-6xl md:text-8xl lg:text-9xl">
            Tu próximo nivel
            <br />
            <span className="slash-block mt-3">
              <span>empieza aquí</span>
            </span>
          </h1>

          <p className="rise rise-3 mt-8 max-w-xl border-l-2 border-primary pl-5 text-lg font-medium leading-relaxed text-base-content/70">
            Entrena con método: sesiones en video, planificación y contenido
            pensado para deportistas que buscan constancia, recuperación y
            resultados medibles.
          </p>

          <div className="rise rise-4 mt-10 flex flex-wrap items-center gap-4">
            <Link href="/entrenamientos" className="btn btn-primary btn-lg px-10">
              Entrar al área de atletas
            </Link>
            <Link href="/signin" className="btn btn-outline btn-lg">
              Ya tengo cuenta
            </Link>
          </div>
        </div>
      </div>

      {/* Barra de datos al pie del hero: cierra la composición sobre el marquee */}
      <div className="relative z-10 border-t border-base-300 bg-base-300">
        <div className="grid grid-cols-3 gap-px">
          {HIGHLIGHTS.map((item) => (
            <div
              key={item.number}
              className="flex items-center gap-3 bg-base-100 px-4 py-5 sm:px-8"
            >
              <span className="display text-stroke shrink-0 text-2xl leading-none sm:text-3xl">
                {item.number}
              </span>
              <span className="text-[0.65rem] font-bold uppercase leading-tight tracking-[0.14em] text-base-content/70 sm:text-sm">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroFrank;

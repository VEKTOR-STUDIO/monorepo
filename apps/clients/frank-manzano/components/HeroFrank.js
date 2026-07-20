"use client";

import Link from "next/link";

const HeroFrank = () => {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden pt-24 pb-16"
      aria-label="Hero"
    >
      {/* Fondo en video con capa oscura para contraste */}
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-40"
        autoPlay
        muted
        loop
        playsInline
        poster=""
      >
        <source src="/hero-background.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-base-100/70 via-base-100/50 to-base-100" />

      {/* Palabra gigante contorneada de fondo */}
      <span
        aria-hidden="true"
        className="display text-stroke pointer-events-none absolute -top-4 right-0 select-none text-[7rem] leading-none opacity-70 md:text-[16rem]"
      >
        FIGHT
      </span>

      <div className="container relative z-10 mx-auto w-full px-6 sm:px-8">
        <div className="max-w-4xl">
          <div className="rise rise-1">
            <span className="tag-skew bg-primary px-3 py-1 text-xs text-primary-content">
              <span>VOD · Preparación física · Rendimiento</span>
            </span>
          </div>

          <h1 className="display rise rise-2 mt-6 text-6xl text-base-content sm:text-7xl md:text-8xl lg:text-9xl">
            Tu próximo nivel
            <br />
            <span className="text-primary">empieza aquí</span>
          </h1>

          <p className="rise rise-3 mt-8 max-w-xl text-lg font-medium leading-relaxed text-base-content/70">
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

      <div className="absolute bottom-0 left-0 right-0 h-px bg-base-300" />
    </section>
  );
};

export default HeroFrank;

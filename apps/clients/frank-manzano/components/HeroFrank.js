"use client";

import Link from "next/link";

const HeroFrank = () => {
  return (
    <section
      id="hero"
      className="hero-section relative min-h-screen flex flex-col lg:flex-row items-center pt-24 pb-16 lg:pt-28 lg:pb-20 bg-gradient-to-b from-base-100 to-base-200/60 overflow-hidden"
      aria-label="Hero"
    >
      <div className="container relative z-10 mx-auto px-6 sm:px-8 w-full flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-12 lg:gap-10">
        <div className="max-w-3xl lg:max-w-2xl mx-auto lg:mx-0 text-center lg:text-left order-2 lg:order-1">
          <p className="text-primary text-xs uppercase tracking-widest mb-4 font-semibold text-base-content/80">
            VOD · Preparación física · Rendimiento
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight text-base-content mb-5">
            Tu próximo nivel empieza aquí
          </h1>
          <p className="text-lg md:text-xl text-base-content/80 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
            Entrena con método: sesiones en video, planificación y contenido pensado para deportistas que buscan
            constancia, recuperación y resultados medibles.
          </p>
          <Link
            href="/signin"
            className="btn btn-primary rounded-md border border-primary/80 shadow-sm inline-flex items-center gap-2 px-8"
          >
            Entrar al área de atletas
          </Link>
          <p className="mt-8 text-base-content/50 text-xs uppercase tracking-wide">
            Demo · Sustituye sede y ciudad en config
          </p>
        </div>
        <div className="relative w-full max-w-md lg:max-w-lg flex-shrink-0 order-1 lg:order-2">
          <div
            className="aspect-square w-full max-h-[420px] lg:max-h-[520px] mx-auto rounded-md border border-base-300 bg-base-200 shadow-sm flex items-center justify-center text-base-content/30 text-sm font-medium"
            role="img"
            aria-label="Espacio para imagen o video de entrenamiento"
          >
            16:9 / sesión
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-base-300" />
    </section>
  );
};

export default HeroFrank;

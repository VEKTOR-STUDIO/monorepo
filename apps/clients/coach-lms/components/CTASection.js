import Link from "next/link";

const CTASection = () => {
  return (
    <section
      id="acceso"
      className="border-t border-base-300 bg-base-100 px-6 py-20 sm:px-8 md:py-28"
      aria-labelledby="cta-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden border border-base-300 bg-base-200 p-10 md:p-16">
          <span
            aria-hidden="true"
            className="display text-stroke pointer-events-none absolute -bottom-8 -right-2 select-none text-[8rem] leading-none md:text-[12rem]"
          >
            GO
          </span>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Zona de atletas
          </p>
          <h2
            id="cta-heading"
            className="display max-w-2xl text-4xl text-base-content sm:text-5xl md:text-6xl"
          >
            Entrena con la mente.
            <br />
            <span className="text-primary">Gana</span> en el ring.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-base-content/60">
            Explora los programas de entrenamiento funcional, rutinas por sesión
            y videos guiados. Pronto detrás de tu cuenta; por ahora, acceso
            libre para la demo.
          </p>
          <Link
            href="/entrenamientos"
            className="btn btn-primary btn-lg mt-8 px-10"
          >
            Ver entrenamientos
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

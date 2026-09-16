const ManifiestoSection = () => {
  return (
    <section
      id="intro"
      className="relative overflow-hidden border-t border-base-300 bg-base-100 px-6 py-20 sm:px-8 md:py-28"
      aria-labelledby="intro-heading"
    >
      <span
        aria-hidden="true"
        className="display text-stroke pointer-events-none absolute -left-2 top-6 select-none text-[6rem] leading-none opacity-60 md:text-[11rem]"
      >
        01
      </span>

      <div className="relative mx-auto max-w-4xl">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">
          El sistema
        </p>
        <h2
          id="intro-heading"
          className="display mb-10 text-4xl text-base-content sm:text-5xl md:text-6xl"
        >
          La ciencia detrás<span className="text-primary">.</span> del rendimiento
        </h2>

        <div className="grid gap-8 border-l-2 border-primary pl-6 md:pl-10">
          <p className="text-lg leading-relaxed text-base-content/80 md:text-xl">
            Ningún plan empieza por los ejercicios. Empieza por el atleta: su
            récord, su peso y su categoría, su estilo y la estrategia que quiere
            imponer. De ahí sale el objetivo del bloque y el de cada semana.
          </p>
          <p className="text-lg leading-relaxed text-base-content/80 md:text-xl">
            En fuerza y potencia la regla es calidad neuromuscular sobre cantidad
            de trabajo: cada repetición explosiva, la serie termina cuando baja
            la velocidad y nunca se llega al fallo.
          </p>
          <p className="text-lg leading-relaxed text-base-content/80 md:text-xl">
            El conditioning no es solo cardio. Los sprints y los rounds simulan
            intercambios, flurries y derribos defensivos, para que la potencia
            se repita cuando la pelea lo exige.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ManifiestoSection;

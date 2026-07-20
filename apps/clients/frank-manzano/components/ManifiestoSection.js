import config from "@/config";

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
          El método
        </p>
        <h2
          id="intro-heading"
          className="display mb-10 text-4xl text-base-content sm:text-5xl md:text-6xl"
        >
          Filosofía de<span className="text-primary">.</span> entrenamiento
        </h2>

        <div className="grid gap-8 border-l-2 border-primary pl-6 md:pl-10">
          <p className="text-lg leading-relaxed text-base-content/80 md:text-xl">
            El progreso no es casualidad: es la suma de sesiones bien hechas,
            descanso inteligente y nutrición acorde a tu objetivo. Aquí
            priorizamos técnica, volumen adecuado y recuperación.
          </p>
          <p className="text-lg leading-relaxed text-base-content/80 md:text-xl">
            Ya compitas, entrenes por salud o prepares un evento, necesitas un
            sistema claro: qué hacer, cuándo y por qué. Ese es el espíritu de
            esta plataforma.
          </p>
          <p className="text-base leading-relaxed text-base-content/50">
            En {config.appName} el contenido es de demostración: reemplázalo por
            tu metodología y valores de marca.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ManifiestoSection;

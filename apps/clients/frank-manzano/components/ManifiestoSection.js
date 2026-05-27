import config from "@/config";

const ManifiestoSection = () => {
  return (
    <section
      id="intro"
      className="py-16 md:py-24 px-6 sm:px-8 bg-base-100 border-t border-base-300"
      aria-labelledby="intro-heading"
    >
      <div className="max-w-4xl mx-auto">
        <h2 id="intro-heading" className="text-2xl sm:text-3xl font-bold text-base-content mb-10">
          Filosofía de entrenamiento
        </h2>
        <article className="border border-base-300 p-8 md:p-10 bg-base-200/80 rounded-md shadow-sm">
          <p className="text-base md:text-lg text-base-content/90 leading-relaxed mb-6">
            El progreso no es casualidad: es la suma de sesiones bien hechas, descanso inteligente y nutrición acorde
            a tu objetivo. Aquí priorizamos técnica, volumen adecuado y recuperación.
          </p>
          <p className="text-base md:text-lg text-base-content/90 leading-relaxed mb-6">
            Ya compitas, entrenes por salud o prepares un evento, necesitas un sistema claro: qué hacer, cuándo y por
            qué. Ese es el espíritu de esta plantilla deportiva.
          </p>
          <p className="text-base md:text-lg text-base-content/90 leading-relaxed">
            En {config.business?.organizationName ?? "tu organización"} el contenido es de demostración: reemplázalo por
            tu metodología y valores de marca.
          </p>
        </article>
      </div>
    </section>
  );
};

export default ManifiestoSection;

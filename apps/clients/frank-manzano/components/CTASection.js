import Link from "next/link";

const CTASection = () => {
  return (
    <section
      id="acceso"
      className="py-20 md:py-28 px-6 sm:px-8 bg-base-100 border-t border-base-300"
      aria-labelledby="cta-heading"
    >
      <div className="max-w-2xl mx-auto text-center">
        <h2 id="cta-heading" className="text-2xl sm:text-3xl md:text-4xl font-bold text-base-content mb-4">
          Zona de atletas
        </h2>
        <p className="text-base-content/70 mb-8">
          Explora los programas de entrenamiento funcional, rutinas por sesión y videos guiados. Pronto detrás de tu
          cuenta; por ahora, acceso libre para la demo.
        </p>
        <Link href="/entrenamientos" className="btn btn-primary rounded-md border border-primary/80 shadow-sm px-8">
          Ver entrenamientos
        </Link>
      </div>
    </section>
  );
};

export default CTASection;

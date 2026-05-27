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
          Accede con tu cuenta para ver sesiones en video, material descargable y el estado de tus reservas (según
          integres tu backend).
        </p>
        <Link href="/signin" className="btn btn-primary rounded-md border border-primary/80 shadow-sm px-8">
          Iniciar sesión
        </Link>
      </div>
    </section>
  );
};

export default CTASection;

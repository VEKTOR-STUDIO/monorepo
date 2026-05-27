import Link from "next/link";
import config from "@/config";

const CTA = () => {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-base-200">
      {/* Glows */}
      <div className="absolute top-0 left-0 w-1/2 h-full bg-primary/4 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-1/3 h-1/2 bg-accent/4 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-8 relative z-10">

        {/* Framed card */}
        <div className="relative border border-primary/20 overflow-hidden">

          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/60" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/60" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary/60" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/60" />

          {/* Content */}
          <div className="p-10 md:p-16 lg:p-20 text-center space-y-8">

            {/* Ornament */}
            <div className="flex items-center justify-center gap-4">
              <div className="h-px flex-1 max-w-16 bg-primary/25" />
              <div className="w-4 h-4 border border-primary/60 rotate-45" />
              <div className="h-px flex-1 max-w-16 bg-primary/25" />
            </div>

            <p
              className="text-primary font-medium text-xs uppercase"
              style={{ letterSpacing: "0.35em" }}
            >
              ¿Lista para empezar?
            </p>

            <h2 className="font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight leading-tight">
              ¿Lista para tu{" "}
              <span className="text-primary italic">transformación?</span>
            </h2>

            <p className="text-base-content/60 max-w-lg mx-auto leading-relaxed text-base md:text-lg">
              Reserva tu cita hoy y da el primer paso hacia la versión más
              segura y radiante de ti misma.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link
                href={config.auth?.loginUrl ?? "/signin"}
                className="btn btn-primary btn-lg w-full sm:w-auto"
                style={{
                  borderRadius: 0,
                  letterSpacing: "0.18em",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  paddingLeft: "2.5rem",
                  paddingRight: "2.5rem",
                }}
              >
                AGENDAR MI CITA
              </Link>

              {config.business?.whatsapp && (
                <a
                  href={config.business.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost btn-lg w-full sm:w-auto"
                  style={{
                    borderRadius: 0,
                    letterSpacing: "0.15em",
                    fontSize: "0.75rem",
                    color: "oklch(72% 0.1 65)",
                    border: "1px solid oklch(72% 0.1 65 / 0.35)",
                  }}
                >
                  ESCRIBIR POR WHATSAPP
                </a>
              )}
            </div>

            <p
              className="text-base-content/35 text-xs uppercase"
              style={{ letterSpacing: "0.25em" }}
            >
              Atención personalizada &nbsp;·&nbsp; Resultados que duran
            </p>

          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;

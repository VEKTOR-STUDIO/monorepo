import config from "@/config";

const CTA = () => {
  const date = new Date(config.event.date)
    .toLocaleDateString("es-VE", { weekday: "long", day: "numeric", month: "long" })
    .toUpperCase();

  return (
    <section className="relative overflow-hidden bg-base-100 text-base-content border-y-4 border-primary">
      {/* Diagonal gold slashes background */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-45deg, var(--color-primary) 0 2px, transparent 2px 16px)",
        }}
        aria-hidden
      />

      {/* Soft gold radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(212,175,55,0.12) 0%, transparent 60%)",
        }}
        aria-hidden
      />

      <div className="relative max-w-6xl mx-auto px-6 lg:px-10 py-20 lg:py-28 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-3 mb-6">
          <span className="w-10 h-px bg-primary" />
          <p className="text-primary font-bold text-xs sm:text-sm tracking-[0.5em] uppercase">
            No te lo pierdas
          </p>
          <span className="w-10 h-px bg-primary" />
        </div>

        <h2
          className="font-display leading-[0.9] mb-4 legion-gold-sheen"
          style={{ fontSize: "clamp(3rem, 9vw, 7rem)" }}
        >
          {date}
        </h2>
        <p className="text-base sm:text-lg tracking-[0.25em] uppercase font-bold text-base-content/80 mb-10">
          {config.event.venue} · {config.event.city}
        </p>
        <a
          href={config.event.ticketUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-primary text-primary-content px-12 py-4 font-display text-lg tracking-[0.3em] uppercase hover:bg-accent transition-colors duration-200"
        >
          Comprar Entradas
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="square" d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </section>
  );
};

export default CTA;

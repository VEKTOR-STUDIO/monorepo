"use client";

import Link from "next/link";

export default function CitasSection() {
  return (
    <section
      id="citas"
      className="relative py-24 lg:py-32 scroll-mt-20"
      aria-labelledby="citas-heading"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="max-w-2xl mx-auto px-8 text-center">
        <h2
          id="citas-heading"
          className="text-2xl md:text-4xl font-bold tracking-tight text-base-content mb-4"
        >
          Reserva tu cita
        </h2>
        <p className="text-base-content/70 text-base md:text-lg mb-8">
          Inicia sesión o regístrate para agendar tu sesión de fisioterapia.
          Te confirmaremos disponibilidad a la brevedad.
        </p>
        <Link
          href="/signin"
          className="btn btn-primary"
          style={{
            borderRadius: "var(--radius-box)",
            letterSpacing: "0.12em",
            fontSize: "0.8rem",
            fontWeight: 700,
            paddingLeft: "2rem",
            paddingRight: "2rem",
          }}
        >
          Agendar cita
        </Link>
      </div>
    </section>
  );
}

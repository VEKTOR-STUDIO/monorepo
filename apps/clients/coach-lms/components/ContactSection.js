"use client";

import config from "@/config";

const ContactSection = () => {
  const { business } = config;
  const mailto = `mailto:${business?.email ?? ""}`;
  const tel = business?.phone?.replace(/\s/g, "") ?? "";
  const whatsapp = business?.whatsapp?.replace(/\s/g, "") ?? "";

  return (
    <section
      id="contacto"
      className="relative py-24 lg:py-32 scroll-mt-20"
      aria-labelledby="contacto-heading"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-8">
        <h2
          id="contacto-heading"
          className="text-2xl md:text-3xl font-bold tracking-tight text-base-content mb-2"
        >
          Contacto
        </h2>
        <p className="text-base-content/60 text-sm md:text-base mb-12 max-w-xl">
          Consultorio en {business?.totalElite ?? "Total Elite Training"}. Terapia a domicilio disponible. Síguenos en @dtamayo_ft.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14">
          {/* Ubicación / Consultorio */}
          <div className="flex gap-4">
            <div
              className="shrink-0 w-10 h-10 flex items-center justify-center rounded bg-primary/10 text-primary"
              aria-hidden
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-base-content/90 text-sm uppercase tracking-wider mb-2">
                Consultorio
              </p>
              <address className="text-base-content/70 text-sm leading-relaxed not-italic">
                {business?.totalElite ?? "Total Elite Training"}, Caracas, Venezuela
              </address>
              <p className="text-base-content/50 text-xs mt-1">Terapia a domicilio disponible</p>
            </div>
          </div>

          {/* Teléfono / WhatsApp */}
          <div className="flex gap-4">
            <div
              className="shrink-0 w-10 h-10 flex items-center justify-center rounded bg-primary/10 text-primary"
              aria-hidden
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-base-content/90 text-sm uppercase tracking-wider mb-2">
                {whatsapp ? "WhatsApp / Teléfono" : "Teléfono"}
              </p>
              {tel ? (
                <a
                  href={`tel:${tel}`}
                  className="text-primary hover:text-primary/80 transition-colors text-sm font-medium"
                >
                  {business?.phone}
                </a>
              ) : (
                <span className="text-base-content/50 text-sm">(completar en config)</span>
              )}
              {whatsapp && (
                <a
                  href={`https://wa.me/${whatsapp}`}
                  className="block mt-1 text-primary hover:text-primary/80 transition-colors text-sm font-medium"
                >
                  Enviar mensaje
                </a>
              )}
            </div>
          </div>

          {/* Redes / Email */}
          <div className="flex gap-4">
            <div
              className="shrink-0 w-10 h-10 flex items-center justify-center rounded bg-primary/10 text-primary"
              aria-hidden
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-base-content/90 text-sm uppercase tracking-wider mb-2">
                Email / Instagram
              </p>
              {business?.email && (
                <a
                  href={mailto}
                  className="text-primary hover:text-primary/80 transition-colors text-sm font-medium break-all block"
                >
                  {business.email}
                </a>
              )}
              <a
                href={business?.instagram ?? "https://instagram.com/dtamayo_ft"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors text-sm font-medium"
              >
                @dtamayo_ft
              </a>
            </div>
          </div>
        </div>

        {/* CTA row */}
        <div className="mt-14 flex flex-col sm:flex-row gap-4">
          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp}`}
              className="btn btn-primary"
              style={{
                borderRadius: "var(--radius-box)",
                letterSpacing: "0.1em",
                fontWeight: 600,
              }}
            >
              Mensaje por WhatsApp
            </a>
          )}
          {tel && (
            <a
              href={`tel:${tel}`}
              className="btn btn-primary"
              style={{
                borderRadius: "var(--radius-box)",
                letterSpacing: "0.1em",
                fontWeight: 600,
              }}
            >
              Llamar ahora
            </a>
          )}
          {business?.email && (
            <a
              href={mailto}
              className="btn btn-outline border-primary/40 hover:border-primary hover:bg-primary/10"
              style={{
                borderRadius: "var(--radius-box)",
                letterSpacing: "0.1em",
                fontWeight: 600,
              }}
            >
              Enviar email
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

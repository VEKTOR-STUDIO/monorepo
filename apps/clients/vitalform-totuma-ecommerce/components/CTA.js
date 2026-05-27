"use client";

import config from "@/config";
import { useTheme } from "@/contexts/ThemeContext";

export default function CTA() {
  const { activeProfile } = useTheme();

  const whatsappVitalform = config.business?.whatsapp
    ? `${config.business.whatsapp}?text=${encodeURIComponent(config.business.whatsappMessageVitalform || "Hola, me gustaría agendar una consulta nutricional con VitalForm Fit.")}`
    : "#";
  const whatsappTotuma = config.business?.whatsapp
    ? `${config.business.whatsapp}?text=${encodeURIComponent(config.business.whatsappMessageTotuma || "Hola, quiero hacer un pedido de Totuma Mealpreps (delivery/pick up).")}`
    : "#";

  const isVitalform = activeProfile === "vitalform";

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-base-200">
      <div className="absolute top-0 left-0 w-1/2 h-full bg-primary/4 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-1/3 h-1/2 bg-accent/4 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-8 relative z-10">
        <div className="relative border border-primary/20 overflow-hidden">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/60" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/60" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary/60" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/60" />

          <div className="p-10 md:p-16 lg:p-20 text-center space-y-8">
            <div className="flex items-center justify-center gap-4">
              <div className="h-px flex-1 max-w-16 bg-primary/25" />
              <div className="w-4 h-4 border border-primary/60 rotate-45" />
              <div className="h-px flex-1 max-w-16 bg-primary/25" />
            </div>

            <p className="text-primary font-medium text-xs uppercase" style={{ letterSpacing: "0.35em" }}>
              {isVitalform ? "¿Listo para dar el primer paso?" : "¿Listo para comer bien en la semana?"}
            </p>

            <h2 className="font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight leading-tight">
              {isVitalform ? (
                <>
                  Da el primer paso hacia un <span className="text-primary italic">plan nutricional a tu medida.</span>
                </>
              ) : (
                <>
                  Pedí tus <span className="text-primary italic">totumas.</span>
                </>
              )}
            </h2>

            <p className="text-base-content/60 max-w-lg mx-auto leading-relaxed text-base md:text-lg">
              {isVitalform
                ? "Nutrición basada en evidencia y Real Fooding. Agendá tu consulta por WhatsApp."
                : "Totumas listas para la semana. Comida real, delivery o pick up. Escribinos por WhatsApp."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <a
                href={isVitalform ? whatsappVitalform : whatsappTotuma}
                target="_blank"
                rel="noopener noreferrer"
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
                {isVitalform ? "AGENDAR CONSULTA" : "PEDIR POR WHATSAPP"}
              </a>

              {config.business?.instagram && (
                <a
                  href={config.business.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost btn-lg w-full sm:w-auto border border-primary/35"
                  style={{ borderRadius: 0, letterSpacing: "0.15em", fontSize: "0.75rem" }}
                >
                  Instagram
                </a>
              )}
            </div>

            <p className="text-base-content/35 text-xs uppercase" style={{ letterSpacing: "0.25em" }}>
              {isVitalform ? "VitalForm Fit · Nutrición · Real Fooding" : "Totuma Mealpreps · Comida real · No procesados"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

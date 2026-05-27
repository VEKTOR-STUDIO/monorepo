"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";
import config from "@/config";

export default function SeminariosSection() {
  const { activeProfile } = useTheme();

  if (activeProfile !== "athlete") return null;

  const url = config.business?.whatsapp
    ? `${config.business.whatsapp}?text=${encodeURIComponent(config.business.whatsappMessageAthlete || "Hola, me interesa agendar seminario/clase de BJJ con Barbara Felizola")}`
    : "#";

  return (
    <section id="seminarios" className="relative py-24 md:py-32 bg-base-100 border-t border-primary/10">
      <div className="max-w-4xl mx-auto px-8 text-center">
        <p className="text-primary font-medium text-xs uppercase mb-4" style={{ letterSpacing: "0.35em" }}>
          Próximos seminarios
        </p>
        <h2 className="font-bold text-3xl md:text-4xl tracking-tight mb-6">
          Agenda tu <span className="text-primary italic">seminario o clase</span>
        </h2>
        <p className="text-base-content/60 max-w-lg mx-auto mb-8">
          Entrena con una campeona. Seminarios y clases de BJJ con Barbara Felizola. Consulta fechas y disponibilidad por WhatsApp.
        </p>
        <motion.a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary btn-lg"
          style={{ borderRadius: 0, letterSpacing: "0.18em", fontSize: "0.75rem" }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          AGENDAR SEMINARIO / CLASE
        </motion.a>
      </div>
    </section>
  );
}

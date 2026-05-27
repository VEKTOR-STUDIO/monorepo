"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";
import { Stethoscope, Repeat, CalendarCheck } from "lucide-react";
import config from "@/config";

const servicios = [
  {
    icon: Stethoscope,
    title: "Consulta inicial",
    description: "Evaluación completa: hábitos, objetivos y plan personalizado. Sin dietas milagro; enfoque en resultados sostenibles.",
  },
  {
    icon: Repeat,
    title: "Control / Seguimiento",
    description: "Sesiones de seguimiento para ajustar tu plan, resolver dudas y mantener el rumbo.",
  },
  {
    icon: CalendarCheck,
    title: "Pack mensual",
    description: "Asesoría continua durante un mes: consulta + controles. Ideal para consolidar hábitos.",
  },
];

export default function ServiciosSection() {
  const { activeProfile } = useTheme();

  if (activeProfile !== "vitalform") return null;

  const whatsappUrl = config.business?.whatsapp
    ? `${config.business.whatsapp}?text=${encodeURIComponent(config.business.whatsappMessageVitalform || "Hola, me gustaría agendar una consulta nutricional con VitalForm Fit.")}`
    : "#";

  return (
    <section id="servicios" className="relative py-24 md:py-32 bg-base-200 overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <p className="text-primary font-medium text-xs uppercase mb-4" style={{ letterSpacing: "0.35em" }}>
          Servicios
        </p>
        <h2 className="font-bold text-4xl md:text-5xl tracking-tight mb-4">
          Qué incluye <span className="text-primary italic">tu plan</span>
        </h2>
        <p className="text-base-content/60 max-w-xl mb-12">
          Planes personalizados, Real Fooding, consulta online o presencial. Mealpreps como referido a Totuma si te interesa.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {servicios.map((s, i) => (
            <motion.article
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="border border-primary/15 bg-base-100 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <s.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-xl text-base-content mb-2">{s.title}</h3>
              <p className="text-base-content/60 text-sm leading-relaxed">{s.description}</p>
            </motion.article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ borderRadius: 0, letterSpacing: "0.15em", fontSize: "0.7rem" }}
          >
            AGENDAR CONSULTA
          </a>
        </div>
      </div>
    </section>
  );
}

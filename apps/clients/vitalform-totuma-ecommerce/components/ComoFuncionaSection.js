"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";
import config from "@/config";

const pasos = [
  { num: 1, title: "Elegí tu servicio", desc: "Consulta inicial, control o pack mensual." },
  { num: 2, title: "Reservá y pagá", desc: "Te confirmamos fecha y forma de pago." },
  { num: 3, title: "Asistí", desc: "Presencial u online, según acordemos." },
];

export default function ComoFuncionaSection() {
  const { activeProfile } = useTheme();

  if (activeProfile !== "vitalform") return null;

  const whatsappUrl = config.business?.whatsapp
    ? `${config.business.whatsapp}?text=${encodeURIComponent(config.business.whatsappMessageVitalform || "Hola, me gustaría agendar una consulta nutricional con VitalForm Fit.")}`
    : "#";

  return (
    <section id="como-funciona" className="relative py-24 md:py-32 bg-base-100 border-t border-primary/10">
      <div className="max-w-4xl mx-auto px-8 text-center">
        <p className="text-primary font-medium text-xs uppercase mb-4" style={{ letterSpacing: "0.35em" }}>
          Cómo funciona
        </p>
        <h2 className="font-bold text-3xl md:text-4xl tracking-tight mb-8">
          Tres pasos para tu <span className="text-primary italic">consulta</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
          {pasos.map((p, i) => (
            <motion.article
              key={p.num}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="relative"
            >
              <div className="w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center mx-auto mb-4 text-primary font-bold">
                {p.num}
              </div>
              <h3 className="font-bold text-lg text-base-content mb-2">{p.title}</h3>
              <p className="text-base-content/60 text-sm">{p.desc}</p>
              {i < pasos.length - 1 && (
                <div className="hidden sm:block absolute top-6 left-[60%] w-[80%] h-px bg-primary/20" />
              )}
            </motion.article>
          ))}
        </div>

        <p className="text-base-content/60 max-w-lg mx-auto mb-8">
          No hacemos envíos: son servicios de consulta y asesoría. Solo datos de contacto y pago para reservar.
        </p>

        <motion.a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary btn-lg"
          style={{ borderRadius: 0, letterSpacing: "0.18em", fontSize: "0.75rem" }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          AGENDAR CONSULTA
        </motion.a>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import config from "@/config";

const whatsappVitalform = () => {
  const base = config.business?.whatsapp || "#";
  const text = config.business?.whatsappMessageVitalform || "Hola, me gustaría agendar una consulta nutricional con VitalForm Fit.";
  return `${base}?text=${encodeURIComponent(text)}`;
};

const whatsappTotuma = () => {
  const base = config.business?.whatsapp || "#";
  const text = config.business?.whatsappMessageTotuma || "Hola, quiero hacer un pedido de Totuma Mealpreps (delivery/pick up).";
  return `${base}?text=${encodeURIComponent(text)}`;
};

const transition = { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] };

function HeroVitalForm() {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center hero-lights-bg">
      <div className="absolute inset-0 pointer-events-none">
        <span className="hero-orb hero-orb-1" aria-hidden />
        <span className="hero-orb hero-orb-2" aria-hidden />
        <span className="hero-orb hero-orb-3" aria-hidden />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24 px-8 pt-32 pb-24 lg:pt-40 lg:pb-32 w-full">
        <div className="flex-1 space-y-8 text-center lg:text-left max-w-xl">
          <p className="text-primary font-medium text-xs uppercase" style={{ letterSpacing: "0.35em" }}>
            Nutrición basada en evidencia · Real Fooding
          </p>
          <h1
            className="font-bold leading-[1.05] tracking-tight"
            style={{ fontSize: "clamp(2.75rem, 6vw, 5rem)" }}
          >
            <span className="text-base-content block">Carga combustible</span>
            <span className="text-primary block" style={{ fontStyle: "italic" }}>
              y mantente en movimiento.
            </span>
          </h1>
          <p className="text-base-content/70 text-lg md:text-xl leading-relaxed max-w-md mx-auto lg:mx-0">
            Juan Francisco Vielma, Nutricionista ULA. Planes personalizados, sin modas pasajeras.
            <span className="text-primary/90"> Consulta inicial, control y pack mensual.</span>
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <a
              href={whatsappVitalform()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary w-full sm:w-auto"
              style={{ borderRadius: 0, letterSpacing: "0.18em", fontSize: "0.72rem", fontWeight: 700, paddingLeft: "2rem", paddingRight: "2rem" }}
            >
              AGENDAR CONSULTA
            </a>
            <Link
              href="#servicios"
              className="btn btn-ghost w-full sm:w-auto border border-primary/40"
              style={{ borderRadius: 0, letterSpacing: "0.18em", fontSize: "0.72rem", fontWeight: 500 }}
            >
              VER SERVICIOS
            </Link>
          </div>
          <p className="text-base-content/40 text-xs uppercase" style={{ letterSpacing: "0.3em" }}>
            Sin envíos — Solo consulta y asesoría
          </p>
        </div>
        <div className="flex-1 w-full flex items-center justify-center max-w-sm lg:max-w-md">
          <div className="relative w-full aspect-[3/4] max-h-[500px] rounded-lg overflow-hidden border border-primary/20 bg-base-200">
            <Image
              src="/juan.png"
              alt="Juan Francisco Vielma — Nutricionista ULA, VitalForm Fit"
              fill
              priority
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-base-100/20 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </section>
  );
}

function HeroTotuma() {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center hero-lights-bg">
      <div className="absolute inset-0 pointer-events-none">
        <span className="hero-orb hero-orb-1" aria-hidden />
        <span className="hero-orb hero-orb-2" aria-hidden />
        <span className="hero-orb hero-orb-3" aria-hidden />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24 px-8 pt-32 pb-24 lg:pt-40 lg:pb-32 w-full">
        <div className="flex-1 order-2 lg:order-1 w-full flex items-center justify-center max-w-sm lg:max-w-md">
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border-2 border-primary/20 bg-base-200 shadow-xl">
            <Image
              src="/mealprep.png"
              alt="Totuma Mealpreps — Comida real, listas para la semana"
              fill
              priority
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-base-100/25 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
        <div className="flex-1 space-y-8 text-center lg:text-right max-w-xl order-1 lg:order-2">
          <p className="text-primary font-medium text-xs uppercase" style={{ letterSpacing: "0.35em" }}>
            Delivery / Pick up
          </p>
          <h1
            className="font-bold leading-[1.05] tracking-tight"
            style={{ fontSize: "clamp(2.75rem, 6vw, 5rem)" }}
          >
            <span className="text-base-content block">No son bowls, ni poke.</span>
            <span className="text-primary block" style={{ fontStyle: "italic" }}>
              Totumas listas para la semana.
            </span>
          </h1>
          <p className="text-base-content/70 text-lg md:text-xl leading-relaxed max-w-md mx-auto lg:mx-0">
            Soluciones saludables. No procesados. Comida real para llevar.
            <span className="text-primary/90"> Pedí por WhatsApp — delivery o recogida.</span>
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-end gap-4 pt-2">
            <a
              href={whatsappTotuma()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary w-full sm:w-auto"
              style={{ borderRadius: 0.5, letterSpacing: "0.12em", fontSize: "0.72rem", fontWeight: 700, paddingLeft: "2rem", paddingRight: "2rem" }}
            >
              PEDIR POR WHATSAPP
            </a>
            <Link
              href="#productos"
              className="btn btn-ghost w-full sm:w-auto border border-primary/40"
              style={{ borderRadius: 0.5, letterSpacing: "0.12em", fontSize: "0.72rem", fontWeight: 500 }}
            >
              VER TOTUMAS
            </Link>
          </div>
          <p className="text-base-content/40 text-xs uppercase" style={{ letterSpacing: "0.3em" }}>
            Comida real · No procesados
          </p>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </section>
  );
}

export default function Hero() {
  const { activeProfile } = useTheme();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeProfile}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={transition}
      >
        {activeProfile === "vitalform" ? <HeroVitalForm /> : <HeroTotuma />}
      </motion.div>
    </AnimatePresence>
  );
}

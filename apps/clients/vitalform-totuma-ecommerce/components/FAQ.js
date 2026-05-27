"use client";

import { useRef, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

const faqVitalform = [
  {
    question: "¿Qué es la consulta inicial?",
    answer: (
      <p className="leading-relaxed">
        Es la primera sesión donde evaluamos tu situación actual, objetivos y hábitos. A partir de ahí armamos un plan personalizado basado en evidencia y Real Fooding, sin dietas milagro.
      </p>
    ),
  },
  {
    question: "¿Hacen envíos de productos?",
    answer: (
      <p className="leading-relaxed">
        No. VitalForm Fit son servicios de consulta y asesoría nutricional. No enviamos productos; solo agendamos citas. Si te interesan mealpreps, te referimos a Totuma Mealpreps.
      </p>
    ),
  },
  {
    question: "¿La consulta es presencial u online?",
    answer: (
      <p className="leading-relaxed">
        Ambas opciones. Al agendar por WhatsApp te indicamos disponibilidad para presencial u online según tu preferencia.
      </p>
    ),
  },
  {
    question: "¿Qué es el pack mensual?",
    answer: (
      <p className="leading-relaxed">
        Incluye consulta inicial más sesiones de seguimiento durante un mes. Ideal para consolidar hábitos y ajustar el plan con continuidad.
      </p>
    ),
  },
  {
    question: "¿Y los mealpreps?",
    answer: (
      <p className="leading-relaxed">
        Los mealpreps (totumas listas para la semana) los ofrece Totuma Mealpreps — misma página, cambia el modo en el menú. Te referimos si te interesa.
      </p>
    ),
  },
];

const faqTotuma = [
  {
    question: "¿Cómo hago un pedido?",
    answer: (
      <p className="leading-relaxed">
        Escribinos por WhatsApp con &ldquo;Pedir por WhatsApp&rdquo;. Te pasamos opciones de totumas, precios y disponibilidad. Confirmamos el pedido por mensaje.
      </p>
    ),
  },
  {
    question: "¿Qué zonas tienen para delivery?",
    answer: (
      <p className="leading-relaxed">
        Las zonas de entrega se confirman por WhatsApp. Escribinos con tu ubicación y te decimos si llegamos o si podés retirar en punto de pick up.
      </p>
    ),
  },
  {
    question: "¿Puedo retirar en lugar de delivery?",
    answer: (
      <p className="leading-relaxed">
        Sí. Tenemos opción de pick up. Coordinamos punto y horario de retiro por WhatsApp.
      </p>
    ),
  },
  {
    question: "¿Qué ingredientes usan?",
    answer: (
      <p className="leading-relaxed">
        Comida real, no procesados. Ingredientes frescos; en cada totuma indicamos los principales. Sin conservantes innecesarios.
      </p>
    ),
  },
];

const Item = ({ item }) => {
  const accordion = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li>
      <button
        className="relative flex gap-3 items-start w-full py-5 text-left border-t border-primary/15 group"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        aria-expanded={isOpen}
      >
        <span
          className={`flex-shrink-0 mt-1 w-3 h-3 border rotate-45 transition-all duration-300 ${
            isOpen ? "border-primary bg-primary scale-110" : "border-primary/40 group-hover:border-primary/70"
          }`}
        />
        <span
          className={`flex-1 font-medium text-sm md:text-base transition-colors duration-300 ${
            isOpen ? "text-primary" : "text-base-content/80 group-hover:text-base-content"
          }`}
        >
          {item?.question}
        </span>
        <svg
          className={`flex-shrink-0 w-4 h-4 mt-1 fill-current transition-transform duration-300 ${
            isOpen ? "rotate-45 text-primary" : "text-primary/40"
          }`}
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect y="7" width="16" height="2" rx="1" />
          <rect y="7" width="16" height="2" rx="1" className={`transform origin-center rotate-90 ${isOpen ? "hidden" : ""}`} />
        </svg>
      </button>
      <div
        ref={accordion}
        className="overflow-hidden transition-all duration-300 ease-in-out text-base-content/65 text-sm"
        style={isOpen ? { maxHeight: accordion?.current?.scrollHeight, opacity: 1 } : { maxHeight: 0, opacity: 0 }}
      >
        <div className="pb-5 pl-6 pr-4">{item?.answer}</div>
      </div>
    </li>
  );
};

export default function FAQ() {
  const { activeProfile } = useTheme();
  const faqList = activeProfile === "totuma" ? faqTotuma : faqVitalform;

  return (
    <section className="relative bg-base-100" id="faq">
      <div className="absolute inset-0 bg-gradient-to-tr from-base-200/80 via-transparent to-primary/3 pointer-events-none opacity-60" />
      <div className="py-24 px-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-16 relative z-10">
        <div className="flex flex-col text-left basis-1/2 space-y-6">
          <p className="text-primary font-medium text-xs uppercase" style={{ letterSpacing: "0.35em" }}>
            FAQ
          </p>
          <h2 className="font-bold text-3xl sm:text-4xl text-base-content leading-tight">
            Preguntas<br />
            <span className="text-primary italic">frecuentes.</span>
          </h2>
          <p className="text-base-content/55 text-base leading-relaxed max-w-sm">
            ¿Tenés dudas? Acá están las respuestas más comunes. Si necesitás algo más, escribinos por WhatsApp o Instagram.
          </p>
          <div className="flex items-center gap-3 pt-4">
            <div className="w-2 h-2 border border-primary/50 rotate-45" />
            <div className="h-px flex-1 max-w-24 bg-primary/20" />
          </div>
        </div>
        <ul className="basis-1/2 space-y-0">
          {faqList.map((item, i) => (
            <Item key={i} item={item} />
          ))}
          <li className="border-t border-primary/15" />
        </ul>
      </div>
    </section>
  );
}

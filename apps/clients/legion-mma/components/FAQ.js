"use client";

import { useRef, useState } from "react";
import config from "@/config";

const faqList = [
  {
    question: "¿Los procedimientos de micropigmentación son dolorosos?",
    answer: (
      <p className="leading-relaxed">
        En la mayoría de los casos se aplica anestesia tópica para aumentar el confort. La sensación
        suele describirse como leve molestia o raspado suave. La experiencia puede variar según la
        persona; este texto es una plantilla para que tu estudio detalle su protocolo real.
      </p>
    ),
  },
  {
    question: "¿Cuánto duran los resultados aproximadamente?",
    answer: (
      <p className="leading-relaxed">
        Como referencia genérica, muchos tratamientos PMU se mantienen entre uno y dos años según
        piel, cuidados y exposición solar. Sustituye este párrafo por los plazos que apliquen a tus
        servicios específicos.
      </p>
    ),
  },
  {
    question: "¿Cómo debo prepararme para la cita?",
    answer: (
      <div className="space-y-3">
        <p className="leading-relaxed">Lista de ejemplo para personalizar:</p>
        <ul className="space-y-1.5 text-sm text-base-content/70">
          <li className="flex gap-2">
            <span className="text-primary flex-shrink-0">✦</span>
            Evitar alcohol 24 horas antes (ajusta según tu protocolo)
          </li>
          <li className="flex gap-2">
            <span className="text-primary flex-shrink-0">✦</span>
            Suspender ciertos activos en la zona según indique tu ficha técnica
          </li>
          <li className="flex gap-2">
            <span className="text-primary flex-shrink-0">✦</span>
            Llegar con la piel limpia y sin maquillaje en la zona a tratar
          </li>
          <li className="flex gap-2">
            <span className="text-primary flex-shrink-0">✦</span>
            Informar sobre medicación o condiciones médicas relevantes
          </li>
        </ul>
      </div>
    ),
  },
  {
    question: "¿Puedo agendar si estoy embarazada o en lactancia?",
    answer: (
      <p className="leading-relaxed">
        Muchos estudios posponen procedimientos electivos durante embarazo y lactancia. Usa este
        espacio para alinear la respuesta con tu criterio profesional y normativa local.
      </p>
    ),
  },
  {
    question: "¿Cuánto dura una sesión típica?",
    answer: (
      <p className="leading-relaxed">
        La duración depende del servicio. Indica aquí rangos orientativos (por ejemplo 1–3 horas)
        e incluye diseño, consentimiento y procedimiento. Tu cliente sabrá qué esperar.
      </p>
    ),
  },
  {
    question: "¿Cómo reservo o escribo para dudas?",
    answer: (
      <p className="leading-relaxed">
        Puedes reservar desde esta web usando{" "}
        <span className="text-primary font-medium">&ldquo;Agendar cita&rdquo;</span>. Para consultas
        generales escribe a{" "}
        <a className="text-primary underline" href={`mailto:${config.resend?.supportEmail ?? "contacto@tudominio.com"}`}>
          {config.resend?.supportEmail ?? "contacto@tudominio.com"}
        </a>{" "}
        o al teléfono de plantilla{" "}
        <span className="text-primary font-medium">+1 234 567 8900</span>.
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
        {/* Diamond marker */}
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

        {/* Plus / minus icon */}
        <svg
          className={`flex-shrink-0 w-4 h-4 mt-1 fill-current transition-transform duration-300 ${
            isOpen ? "rotate-45 text-primary" : "text-primary/40"
          }`}
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect y="7" width="16" height="2" rx="1" />
          <rect
            y="7"
            width="16"
            height="2"
            rx="1"
            className={`transform origin-center rotate-90 transition duration-200 ease-out ${
              isOpen ? "hidden" : ""
            }`}
          />
        </svg>
      </button>

      <div
        ref={accordion}
        className="overflow-hidden transition-all duration-300 ease-in-out text-base-content/65 text-sm"
        style={
          isOpen
            ? { maxHeight: accordion?.current?.scrollHeight, opacity: 1 }
            : { maxHeight: 0, opacity: 0 }
        }
      >
        <div className="pb-5 pl-6 pr-4">{item?.answer}</div>
      </div>
    </li>
  );
};

const FAQ = () => {
  return (
    <section className="relative bg-base-100" id="faq">
      <div className="absolute inset-0 bg-gradient-to-tr from-base-200/80 via-transparent to-primary/3 pointer-events-none opacity-60" />

      <div className="py-24 px-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-16 relative z-10">

        {/* Left: title */}
        <div className="flex flex-col text-left basis-1/2 space-y-6">
          <p
            className="text-primary font-medium text-xs uppercase"
            style={{ letterSpacing: "0.35em" }}
          >
            FAQ
          </p>
          <h2 className="font-bold text-3xl sm:text-4xl text-base-content leading-tight">
            Preguntas<br />
            <span className="text-primary italic">frecuentes.</span>
          </h2>
          <p className="text-base-content/55 text-base leading-relaxed max-w-sm">
            Respuestas tipo plantilla para tu nicho. Sustituye por tu protocolo real y políticas de
            cancelación.
          </p>

          {/* Decorative element */}
          <div className="flex items-center gap-3 pt-4">
            <div className="w-2 h-2 border border-primary/50 rotate-45" />
            <div className="h-px flex-1 max-w-24 bg-primary/20" />
          </div>
        </div>

        <ul className="basis-1/2 space-y-0">
          {faqList.map((item, i) => (
            <Item key={i} item={item} />
          ))}
          {/* Final border */}
          <li className="border-t border-primary/15" />
        </ul>
      </div>
    </section>
  );
};

export default FAQ;

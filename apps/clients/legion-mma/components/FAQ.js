"use client";

import { useRef, useState } from "react";

const faqList = [
  {
    question: "¿Dónde se realizan los eventos de Legión MMA?",
    answer: (
      <p className="leading-relaxed">
        La sede histórica es <strong>Caracas</strong> — varias ediciones se han celebrado en el Hotel Tamanaco.
        Desde la séptima edición, también hacemos eventos en otras ciudades como <strong>Maracaibo</strong>.
      </p>
    ),
  },
  {
    question: "¿Cómo asisto como espectador?",
    answer: (
      <p className="leading-relaxed">
        Las entradas se anuncian con anticipación en{" "}
        <strong>nuestras redes sociales</strong> y en la sección{" "}
        <em>Próximo Evento</em> de este sitio. Hacé clic en el botón{" "}
        <em>Comprar Entradas</em> para ir al canal de venta oficial.
      </p>
    ),
  },
  {
    question: "¿Cómo puedo pelear en Legión MMA?",
    answer: (
      <p className="leading-relaxed">
        Si sos peleador profesional o amateur con récord verificable, escribinos al correo de
        contacto o a nuestro Instagram con tu currículo deportivo, récord W-L-D y categoría de peso.
        El equipo de matchmaking revisa cada solicitud antes de cada edición.
      </p>
    ),
  },
  {
    question: "¿Tienen categorías femeninas?",
    answer: (
      <p className="leading-relaxed">
        Sí. Una de las metas de Legión es ampliar las categorías femeninas en cada edición.
        Si sos peleadora interesada, aplica el mismo proceso del punto anterior.
      </p>
    ),
  },
  {
    question: "¿Cómo me entero de los próximos eventos?",
    answer: (
      <p className="leading-relaxed">
        Seguinos en <strong>Instagram</strong> y <strong>X</strong>, donde anunciamos
        carteleras, peleadores y fechas. También podés volver aquí — el bloque{" "}
        <em>Próximo Evento</em> se mantiene actualizado.
      </p>
    ),
  },
];

const Item = ({ item }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  return (
    <li className="border-b border-base-content/15">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative flex items-center w-full py-5 text-left text-base-content gap-4"
        aria-expanded={open}
      >
        <span className="font-display text-xl tracking-wide flex-1">
          {item.question}
        </span>
        <span className={`flex-shrink-0 w-6 h-6 flex items-center justify-center transition-transform duration-300 ${open ? "rotate-45 text-primary" : "text-base-content/50"}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="square" d="M12 4v16M4 12h16" />
          </svg>
        </span>
      </button>
      <div
        ref={ref}
        className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
        style={{ maxHeight: open ? ref.current?.scrollHeight ?? "999px" : 0 }}
      >
        <div className="pb-6 text-base-content/70 leading-relaxed text-base">
          {item.answer}
        </div>
      </div>
    </li>
  );
};

const FAQ = () => (
  <section id="faq" className="bg-base-200 py-20 lg:py-28">
    <div className="max-w-4xl mx-auto px-6 lg:px-10">
      <div className="mb-12 text-center">
        <div className="inline-flex items-center gap-3 mb-4">
          <span className="w-10 h-px bg-primary" />
          <p className="text-primary font-bold text-xs uppercase tracking-[0.4em]">
            Preguntas Frecuentes
          </p>
          <span className="w-10 h-px bg-primary" />
        </div>
        <h2 className="font-display leading-none" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}>
          <span className="text-primary">FAQ</span>
        </h2>
      </div>

      <ul className="border-t border-base-content/15">
        {faqList.map((item, i) => (
          <Item key={i} item={item} />
        ))}
      </ul>
    </div>
  </section>
);

export default FAQ;

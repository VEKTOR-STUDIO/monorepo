"use client";

import { useRef, useState } from "react";

const faqList = [
  {
    question: "¿Duele el microblading?",
    answer: (
      <p className="leading-relaxed">
        Aplicamos anestesia tópica antes del procedimiento para minimizar cualquier incomodidad. La
        mayoría de las clientas describen la sensación como un ligero rasguño. La experiencia varía
        según la tolerancia individual, pero hacemos todo lo posible para que sea lo más cómoda
        posible. Tu tranquilidad es nuestra prioridad.
      </p>
    ),
  },
  {
    question: "¿Cuánto dura el microblading?",
    answer: (
      <p className="leading-relaxed">
        Con los cuidados adecuados, el microblading dura entre 1 y 2 años. Factores como el tipo
        de piel, la exposición al sol y tu rutina de skincare pueden influir en la duración.
        Recomendamos un retoque anual para mantener el resultado en su máximo esplendor.
      </p>
    ),
  },
  {
    question: "¿Cómo debo prepararme para mi cita?",
    answer: (
      <div className="space-y-3">
        <p className="leading-relaxed">Para garantizar el mejor resultado posible, por favor:</p>
        <ul className="space-y-1.5 text-sm text-base-content/70">
          <li className="flex gap-2">
            <span className="text-primary flex-shrink-0">✦</span>
            No consumas alcohol 24 horas antes
          </li>
          <li className="flex gap-2">
            <span className="text-primary flex-shrink-0">✦</span>
            Evita retinol y ácidos en la zona 2 semanas antes
          </li>
          <li className="flex gap-2">
            <span className="text-primary flex-shrink-0">✦</span>
            No realices ejercicio intenso el día de la cita
          </li>
          <li className="flex gap-2">
            <span className="text-primary flex-shrink-0">✦</span>
            Llega con el rostro limpio y sin maquillaje
          </li>
          <li className="flex gap-2">
            <span className="text-primary flex-shrink-0">✦</span>
            No depiles las cejas 2 semanas antes
          </li>
        </ul>
      </div>
    ),
  },
  {
    question: "¿Puedo agendar si estoy embarazada o lactando?",
    answer: (
      <p className="leading-relaxed">
        No recomendamos ningún procedimiento de micropigmentación durante el embarazo ni la
        lactancia. Es una precaución, ya que los anestésicos tópicos y los pigmentos no han sido
        suficientemente estudiados en estas condiciones. ¡Con mucho gusto te esperamos cuando
        puedas!
      </p>
    ),
  },
  {
    question: "¿Cuánto tiempo dura la cita?",
    answer: (
      <p className="leading-relaxed">
        Las citas de microblading y micropigmentación duran entre 2 y 3 horas, incluyendo la
        consulta inicial, el diseño personalizado y el procedimiento. El laminado de cejas toma
        aproximadamente 1 hora. Tómate tu tiempo — ¡mereces disfrutar cada momento!
      </p>
    ),
  },
  {
    question: "¿Cómo reservo mi cita?",
    answer: (
      <p className="leading-relaxed">
        Puedes reservar directamente desde esta página haciendo clic en{" "}
        <span className="text-primary font-medium">&ldquo;Agendar Cita&rdquo;</span>. También
        puedes escribirme por Instagram o WhatsApp si tienes dudas previas. Respondo lo antes
        posible y con mucho cariño.
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
            ¿Tienes dudas? Es completamente normal. Aquí encuentras las respuestas más comunes.
            Si necesitas algo más, escríbeme directamente.
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

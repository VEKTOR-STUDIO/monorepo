"use client";

import { useState, useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

// Service menu — "La Carta"
const services = [
  {
    title: "Servicio principal 1 — cejas / PMU",
    price: "Consultar",
    duration: "2 – 3 hrs",
    description:
      "Describe aquí cómo este servicio ayuda a tus clientes a mejorar su imagen con un resultado natural. Ajusta duración y propuesta según tu carta real.",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
      </svg>
    ),
  },
  {
    title: "Especialidad 2 — labios",
    price: "Consultar",
    duration: "2 hrs",
    description:
      "Plantilla para un tratamiento focal (color, definición, volumen visual). Sustituye por el nombre comercial que uses en tu estudio y detalla beneficios en dos líneas.",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
      </svg>
    ),
  },
  {
    title: "Servicio complementario 3",
    price: "Consultar",
    duration: "1 hr",
    description:
      "Texto genérico: ideal para laminados, lifting o tratamientos de mantenimiento. Explica duración del efecto y para qué tipo de cliente está pensado.",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
  },
  {
    title: "Servicio principal 4 — intensidad media / alta",
    price: "Consultar",
    duration: "2 – 2.5 hrs",
    description:
      "Describe aquí una variante más completa del servicio anterior: mayor cobertura, correcciones o perfiles distintos. Mantén el tono alineado con tu marca.",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
      </svg>
    ),
  },
  {
    title: "Mantenimiento / retoque",
    price: "Consultar",
    duration: "1.5 hrs",
    description:
      "Plantilla para comunicar cadencia de retoques y qué incluye la sesión. Ajusta tiempos y políticas según tu protocolo.",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    ),
  },
];

// Accordion item — "restaurant menu" style
const ServiceItem = ({ service, isOpen, setServiceSelected }) => {
  const accordion = useRef(null);
  const itemRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!itemRef.current) return;
    const item = itemRef.current;
    const rect = item.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(item, { x: x * 0.03, y: y * 0.03, duration: 0.4, ease: "power2.out" });
  };

  const handleMouseLeave = () => {
    if (!itemRef.current) return;
    gsap.to(itemRef.current, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
  };

  return (
    <li
      ref={itemRef}
      className="border-b border-primary/15 last:border-b-0 transition-all duration-300"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className="relative flex items-center w-full py-5 text-left gap-4 group"
        onClick={(e) => {
          e.preventDefault();
          setServiceSelected();
        }}
        aria-expanded={isOpen}
      >
        {/* Icon */}
        <span
          className={`flex-shrink-0 w-10 h-10 flex items-center justify-center border transition-all duration-300 ${
            isOpen
              ? "border-primary bg-primary text-primary-content"
              : "border-primary/30 text-primary/60 group-hover:border-primary/60 group-hover:text-primary"
          }`}
        >
          {service.svg}
        </span>

        {/* Service name */}
        <span className={`flex-1 font-medium transition-colors duration-300 ${isOpen ? "text-primary" : "text-base-content/80 group-hover:text-base-content"}`}>
          <h3 className="inline text-base">{service.title}</h3>
        </span>

        {/* Dotted line + price */}
        <span className="hidden sm:flex flex-1 items-center">
          <span className="flex-1 border-b border-dotted border-primary/20 mx-3" />
        </span>
        <span className={`text-sm font-medium transition-colors duration-300 ${isOpen ? "text-primary" : "text-primary/60"}`}>
          {service.price}
        </span>

        {/* Duration badge */}
        <span className="hidden md:inline text-xs text-base-content/40 ml-2 tabular-nums">
          {service.duration}
        </span>

        {/* Chevron */}
        <svg
          className={`flex-shrink-0 w-4 h-4 ml-2 text-primary/40 transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded description */}
      <div
        ref={accordion}
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={
          isOpen
            ? { maxHeight: accordion?.current?.scrollHeight, opacity: 1 }
            : { maxHeight: 0, opacity: 0 }
        }
      >
        <div className="pb-5 pl-14 pr-4">
          <p className="text-base-content/60 text-sm leading-relaxed mb-4">
            {service.description}
          </p>
          <Link
            href="/dashboard"
            className="btn btn-primary btn-sm"
            style={{ borderRadius: 0, letterSpacing: "0.15em", fontSize: "0.65rem", fontWeight: 700 }}
          >
            RESERVAR ESTE SERVICIO
          </Link>
        </div>
      </div>
    </li>
  );
};

const FeaturesAccordion = () => {
  const [serviceSelected, setServiceSelected] = useState(0);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const listRef = useRef(null);

  const renderWord = (word, keyPrefix) => (
    <span key={`w-${keyPrefix}`} className="inline-block whitespace-nowrap">
      {word.split("").map((ch, i) => (
        <span key={`c-${keyPrefix}-${i}`} className="char inline-block will-change-transform">
          {ch}
        </span>
      ))}
    </span>
  );

  const renderSegment = (text, keyPrefix) => {
    const words = text.split(" ");
    return words.map((w, idx) => (
      <span key={`${keyPrefix}-wrap-${idx}`} className="inline">
        {renderWord(w, `${keyPrefix}-${idx}`)}
        {idx < words.length - 1 ? " " : ""}
      </span>
    ));
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const chars = titleRef.current?.querySelectorAll?.(".char");
      if (chars && chars.length > 0) {
        gsap.set(chars, { opacity: 0, y: 30, rotationX: -90 });
        gsap.to(chars, {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 0.5,
          ease: "back.out(1.5)",
          stagger: 0.025,
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });
      }

      if (subtitleRef.current) {
        gsap.from(subtitleRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: subtitleRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });
      }

      if (listRef.current) {
        gsap.from(listRef.current, {
          opacity: 0,
          x: -30,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: listRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        });
      }
    }, titleRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      className="relative py-24 md:py-32 bg-base-200"
      id="servicios"
    >
      {/* Subtle glow */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, oklch(62% 0.09 350 / 0.08) 0%, transparent 55%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-8 relative z-10">

        {/* Header */}
        <div className="text-center mb-16">
          <p
            className="text-primary font-medium mb-4 text-xs uppercase"
            style={{ letterSpacing: "0.35em" }}
          >
            La Carta
          </p>
          <h2
            ref={titleRef}
            className="font-bold text-4xl md:text-5xl tracking-tight mb-6"
          >
            {renderSegment("Nuestros", "seg1")}{" "}
            <span className="text-primary italic">{renderSegment("Servicios", "seg2")}</span>
          </h2>
          <p ref={subtitleRef} className="text-base-content/60 text-lg max-w-xl mx-auto leading-relaxed">
            Cada servicio es una experiencia diseñada para realzar tu belleza natural y construir tu confianza.
          </p>
        </div>

        {/* Services list — full width, restaurant-menu style */}
        <div className="max-w-3xl mx-auto">
          {/* Menu header line */}
          <div className="flex items-center gap-4 mb-6 pb-4 border-b border-primary/30">
            <div className="w-2 h-2 border border-primary/50 rotate-45 flex-shrink-0" />
            <p className="text-primary/50 text-xs uppercase flex-1" style={{ letterSpacing: "0.3em" }}>
              Servicio
            </p>
            <p className="text-primary/50 text-xs uppercase hidden sm:block" style={{ letterSpacing: "0.3em" }}>
              Inversión
            </p>
            <p className="text-primary/50 text-xs uppercase hidden md:block ml-4" style={{ letterSpacing: "0.3em" }}>
              Duración
            </p>
            <div className="w-4" />
          </div>

          <ul ref={listRef} className="w-full">
            {services.map((service, i) => (
              <ServiceItem
                key={service.title}
                service={service}
                isOpen={serviceSelected === i}
                setServiceSelected={() => setServiceSelected(i)}
              />
            ))}
          </ul>

          {/* Footer note */}
          <div className="mt-8 pt-6 border-t border-primary/15 text-center">
            <p className="text-base-content/40 text-xs leading-relaxed" style={{ letterSpacing: "0.1em" }}>
              Los precios se confirman al momento de agendar · Todos los servicios incluyen consulta previa
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesAccordion;

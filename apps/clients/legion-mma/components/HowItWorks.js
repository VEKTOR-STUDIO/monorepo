"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const StepCard = ({ number, title, description, index }) => {
  const cardRef = useRef(null);
  const glowRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(card, {
      x: x * 0.06,
      y: y * 0.06,
      rotateY: x * 0.025,
      rotateX: -y * 0.025,
      duration: 0.4,
      ease: "power2.out",
    });

    if (glowRef.current) {
      gsap.to(glowRef.current, { x: x * 0.4, y: y * 0.4, duration: 0.3 });
    }
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      x: 0,
      y: 0,
      rotateY: 0,
      rotateX: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.4)",
    });
    setIsHovered(false);
  };

  const handleMouseEnter = () => setIsHovered(true);

  // Gold/amber gradient palette for each step
  const glowColors = [
    "from-amber-700/60 to-amber-900/30",
    "from-yellow-600/60 to-amber-800/30",
    "from-amber-600/60 to-yellow-800/30",
  ];

  return (
    <div
      ref={cardRef}
      className="step-card relative group"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
    >
      {/* Glow effect */}
      <div
        ref={glowRef}
        className={`absolute inset-0 bg-gradient-to-br ${glowColors[index]} opacity-0 group-hover:opacity-25 blur-3xl transition-opacity duration-500 pointer-events-none -z-10`}
      />

      {/* Card */}
      <div className="relative bg-base-100/90 backdrop-blur-xl border border-primary/15 p-8 overflow-hidden transition-all duration-500 hover:border-primary/40 h-full"
        style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)" }}
      >
        {/* Subtle grid bg */}
        <div
          className="absolute inset-0 opacity-[0.04] group-hover:opacity-[0.07] transition-opacity duration-500"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Step number */}
        <div className="relative mb-6">
          <div className="w-14 h-14 border border-primary/30 flex items-center justify-center group-hover:border-primary/70 transition-all duration-300">
            <span
              className="text-xl font-bold text-primary/70 group-hover:text-primary transition-colors duration-300 italic"
            >
              {number}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold mb-4 text-base-content/90 group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>

        {/* Description */}
        <p
          className={`text-base-content/60 leading-relaxed text-sm transition-all duration-500 ${
            isHovered ? "opacity-100 translate-y-0" : "opacity-90 translate-y-1"
          }`}
        >
          {description}
        </p>

        {/* Corner accent */}
        <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-primary/30 group-hover:border-primary/60 transition-colors duration-300" />
      </div>

      {/* Shadow */}
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-3/4 h-6 bg-black/30 blur-xl rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
    </div>
  );
};

const HowItWorks = () => {
  const titleRef = useRef(null);
  const cardsRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);

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

      const cards = cardsRef.current?.querySelectorAll?.(".step-card");
      if (cards && cards.length > 0) {
        gsap.set(cards, { opacity: 0, scale: 0.85, y: 50 });
        gsap.to(cards, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.2,
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        });
      }

      if (line1Ref.current) {
        gsap.from(line1Ref.current, {
          scaleX: 0,
          duration: 1,
          ease: "power2.inOut",
          scrollTrigger: { trigger: line1Ref.current, start: "top 80%", toggleActions: "play none none none" },
        });
      }
      if (line2Ref.current) {
        gsap.from(line2Ref.current, {
          scaleX: 0,
          duration: 1,
          delay: 0.2,
          ease: "power2.inOut",
          scrollTrigger: { trigger: line2Ref.current, start: "top 80%", toggleActions: "play none none none" },
        });
      }
    }, titleRef);

    return () => ctx.revert();
  }, []);

  const steps = [
    {
      number: "I",
      title: "Elige tu servicio",
      description:
        "Explora las categorías genéricas de tu menú y adapta los nombres a tu carta real. Este bloque guía al usuario sin atarlo a un servicio concreto.",
    },
    {
      number: "II",
      title: "Reserva en línea",
      description:
        "Selecciona fecha y hora desde el flujo ShipFast. El proceso es claro y reduce fricción: ideal para estudios que quieren agenda organizada.",
    },
    {
      number: "III",
      title: "Vive la experiencia",
      description:
        "Texto plantilla para el día de la cita: bienvenida, protocolo y sensación que quieres transmitir en sala.",
    },
  ];

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-base-100" id="how-it-works">
      {/* Decorative overlays */}
      <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-primary/4 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-primary/3 rounded-full blur-3xl" />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <p
            className="text-primary font-medium mb-4 text-xs uppercase"
            style={{ letterSpacing: "0.35em" }}
          >
            Proceso
          </p>
          <h2
            ref={titleRef}
            className="font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight mb-6"
          >
            {renderSegment("Tu cita,", "seg1")}{" "}
            <span className="text-primary italic">{renderSegment("tu magia.", "seg2")}</span>
          </h2>
          <p className="text-base-content/60 text-lg max-w-xl mx-auto leading-relaxed">
            Tres pasos simples para conectar tu oferta con la agenda de tu estudio.
          </p>
        </div>

        {/* Cards */}
        <div ref={cardsRef} className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {steps.map((step, idx) => (
            <StepCard key={idx} {...step} index={idx} />
          ))}

          {/* Connector lines — desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 -translate-y-1/2 pointer-events-none">
            <svg className="w-full h-2" preserveAspectRatio="none">
              <defs>
                <linearGradient id="lineGradPMU" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="oklch(62% 0.09 350)" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="oklch(72% 0.08 10)" stopOpacity="0.5" />
                </linearGradient>
              </defs>
              <line
                ref={line1Ref}
                x1="33%" y1="50%" x2="41%" y2="50%"
                stroke="url(#lineGradPMU)"
                strokeWidth="1"
                className="origin-left"
              />
              <line
                ref={line2Ref}
                x1="59%" y1="50%" x2="67%" y2="50%"
                stroke="url(#lineGradPMU)"
                strokeWidth="1"
                className="origin-left"
              />
            </svg>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <Link
            href="/dashboard"
            className="btn btn-primary btn-lg"
            style={{
              borderRadius: 0,
              letterSpacing: "0.18em",
              fontSize: "0.75rem",
              fontWeight: 700,
              paddingLeft: "2.5rem",
              paddingRight: "2.5rem",
            }}
          >
            AGENDAR MI CITA
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

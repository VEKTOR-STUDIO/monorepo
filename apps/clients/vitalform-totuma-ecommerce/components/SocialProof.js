"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Testimonial = ({ quote, author, role }) => {
  const cardRef = useRef(null);

  // Efecto de hover 3D sutil
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(card, {
      rotateY: x * 0.01,
      rotateX: -y * 0.01,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.5)",
    });
  };

  return (
    <div 
      ref={cardRef}
      className="testimonial-card card bg-base-100 border border-base-content/10 p-8 h-full hover:border-accent/30 hover:shadow-[0_0_30px_rgba(204,38,215,0.15)] transition-all duration-300"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px"
      }}
    >
      <div className="flex flex-col gap-4 h-full">
        {/* Quote icon decorativo */}
        <div className="flex items-start">
          <svg className="w-10 h-10 text-accent/40 -mt-2 -ml-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197L9.758 4.03c0 0-1.002.274-2.198.842-.597.268-1.303.667-2.084 1.217-.784.544-1.584 1.27-2.278 2.163C2.46 9.142 2 10.307 2 11.5 2 14.06 4.03 16 6.5 16c2.508 0 4.5-2.016 4.5-4.5S9.008 10 6.5 10zm13 0c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197L21.758 4.03c0 0-1.002.274-2.198.842-.597.268-1.303.667-2.084 1.217-.784.544-1.584 1.27-2.278 2.163C14.46 9.142 14 10.307 14 11.5c0 2.56 2.03 4.5 4.5 4.5 2.508 0 4.5-2.016 4.5-4.5S22.008 10 19.5 10z"/>
          </svg>
        </div>
        
        <div className="flex-1">
          <p className="text-base-content/90 leading-relaxed text-base font-normal">
            {quote}
          </p>
        </div>
        
        <div className="border-t border-base-content/10 pt-4 mt-2">
          <p className="font-bold text-base-content text-lg">{author}</p>
          <p className="text-sm text-base-content/60 mt-1">{role}</p>
        </div>
      </div>
    </div>
  );
};

const SocialProof = () => {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const cardsRef = useRef(null);
  const founderRef = useRef(null);

  // Render functions para animación letra por letra
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
      // Animar título letra por letra
      const chars = titleRef.current?.querySelectorAll?.(".char");
      if (chars && chars.length > 0) {
        gsap.set(chars, { opacity: 0, y: 30, scale: 0.5 });
        gsap.to(chars, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "back.out(2)",
          stagger: 0.03,
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });
      }

      // Animar subtítulo
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

      // Cards de testimonios - sin animación de entrada para que sean visibles inmediatamente
      // const cards = cardsRef.current?.querySelectorAll?.(".testimonial-card");
      // if (cards && cards.length > 0) {
      //   gsap.from(cards, {
      //     opacity: 0,
      //     y: 60,
      //     scale: 0.9,
      //     rotateX: -15,
      //     duration: 0.8,
      //     ease: "power3.out",
      //     stagger: 0.2,
      //     scrollTrigger: {
      //       trigger: cardsRef.current,
      //       start: "top 75%",
      //       toggleActions: "play none none none",
      //     },
      //   });
      // }

      // Animar sección del fundador
      if (founderRef.current) {
        gsap.from(founderRef.current, {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: founderRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });
      }
    }, titleRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-base-100" id="testimonials">
      {/* Degradado sutil hacia verde en el bottom para transición */}
      <div className="absolute inset-0 bg-gradient-to-b from-base-100 via-base-100 to-accent/30 pointer-events-none" />
      
      {/* Decorative overlays para profundidad */}
      <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-accent/20 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="text-center mb-16">
          <p className="font-semibold text-primary mb-4 animate-pulse uppercase tracking-widest">Testimonios</p>
          <h2 ref={titleRef} className="font-extrabold text-4xl md:text-5xl tracking-tight mb-6 text-base-content">
            {renderSegment("Empresas que", "seg1")}{" "}
            <span className="text-accent">{renderSegment("confían en Barbara", "seg2")}</span>
          </h2>
          <p ref={subtitleRef} className="text-lg text-base-content/80 max-w-2xl mx-auto">
            Lo que dicen quienes confían en Barbara Felizola: seminarios BJJ y repostería artesanal. The Fighter & The Baker.
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Testimonial
            quote="Seminario de BJJ con Barbara: nivel alto, muy buena organización. Repetiré sin dudarlo."
            author="Cliente"
            role="Seminario BJJ"
          />
          <Testimonial
            quote="Pedí banana bread y ponqué. Riquísimos y sin refinados. Barbara Felizola cuida cada detalle."
            author="Cliente"
            role="Repostería"
          />
          <Testimonial
            quote="The Fighter & The Baker en serio: atleta de élite y repostería de calidad. Totalmente recomendada."
            author="Cliente"
            role="BJJ y Bakery"
          />
        </div>

        <div ref={founderRef} className="text-center bg-base-100/60 backdrop-blur-md rounded-2xl p-8 border border-base-content/20">
          <p className="text-sm text-base-content/60 mb-4 uppercase tracking-widest">Liderado por</p>
          <div className="flex flex-col items-center gap-2">
            <p className="font-black text-2xl text-base-content">Barbara Felizola</p>
            <p className="text-base-content/80 max-w-2xl leading-relaxed">
              Atleta de Jiu Jitsu de élite y repostería artesanal saludable. Campeona Europea 2026 · World Master 2024 · The Fighter & The Baker.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;


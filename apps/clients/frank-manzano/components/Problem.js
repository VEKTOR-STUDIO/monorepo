"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const Pillar = ({ title, description }) => (
  <div className="pillar-item relative mb-8 last:mb-0 group flex gap-4">
    {/* Diamond marker */}
    <div className="flex-shrink-0 mt-1">
      <div className="w-5 h-5 border border-primary/40 rotate-45 group-hover:border-primary group-hover:scale-110 transition-all duration-300" />
    </div>

    {/* Content */}
    <div>
      <h3 className="font-semibold text-base text-base-content/90 group-hover:text-primary transition-colors duration-300 mb-1">
        {title}
      </h3>
      <p className="text-base-content/55 text-sm leading-relaxed">{description}</p>
    </div>
  </div>
);

const Problem = () => {
  const imgRef = useRef(null);
  const contentRef = useRef(null);
  const titleRef = useRef(null);

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
      // Animate image from left
      if (imgRef.current) {
        gsap.from(imgRef.current, {
          opacity: 0,
          x: -40,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: imgRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });
      }

      // Animate title letter by letter
      const chars = titleRef.current?.querySelectorAll?.(".char");
      if (chars && chars.length > 0) {
        gsap.set(chars, { opacity: 0, y: 40, rotationX: -90 });
        gsap.to(chars, {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 0.6,
          ease: "back.out(1.7)",
          stagger: 0.03,
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });
      }

      // Animate pillars
      const items = contentRef.current?.querySelectorAll?.(".pillar-item");
      if (items && items.length > 0) {
        gsap.from(items, {
          opacity: 0,
          x: 40,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  const pillars = [
    {
      symbol: "✦",
      title: "Arte con propósito",
      description:
        "Cada trazo es intencional. No solo aplico técnica — creo una experiencia que conecta con quién eres y quién quieres ser.",
    },
    {
      symbol: "✦",
      title: "Un espacio donde te sientes vista",
      description:
        "Desde el momento en que entras, todo está diseñado para que te sientas cómoda, segura y absolutamente cuidada.",
    },
    {
      symbol: "✦",
      title: "Resultados que te acompañan",
      description:
        "El PMU bien hecho dura años. Invertir en tu imagen es invertir en tu confianza diaria. Cada mañana, lista sin esfuerzo.",
    },
    {
      symbol: "✦",
      title: "Formación continua",
      description:
        "Me mantengo en la vanguardia de las técnicas más sofisticadas. Tu rostro merece lo mejor de lo mejor.",
    },
  ];

  return (
    <section className="relative py-24 md:py-32 bg-base-200 overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-primary/4 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">

          {/* LEFT: username full-body photo */}
          <div ref={imgRef} className="flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-xs md:max-w-sm" style={{ aspectRatio: "3/4" }}>

              {/* Offset border — mirror of Hero (offset to the left) */}
              <div
                className="absolute inset-0 border border-primary/25 pointer-events-none"
                style={{ transform: "translate(-14px, 14px)", zIndex: 0 }}
              />
              <div
                className="absolute inset-0 border border-primary/10 pointer-events-none"
                style={{ transform: "translate(-28px, 28px)", zIndex: 0 }}
              />

              {/* Image container */}
              <div
                className="relative w-full h-full overflow-hidden border border-primary/20 bg-base-300"
                style={{ zIndex: 1 }}
              >
                <Image
                  src="/username2.png"
                  alt="tu empresa — PMU Artist"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 40vw"
                  style={{
                    filter: "sepia(0.12) contrast(1.04) brightness(0.96)",
                  }}
                />

                {/* Bottom vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-base-200/30 via-transparent to-transparent pointer-events-none" />

                {/* Corner accents */}
                <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-primary/50 pointer-events-none" style={{ zIndex: 2 }} />
                <div className="absolute top-3 right-3 w-5 h-5 border-t border-r border-primary/50 pointer-events-none" style={{ zIndex: 2 }} />
                <div className="absolute bottom-3 left-3 w-5 h-5 border-b border-l border-primary/50 pointer-events-none" style={{ zIndex: 2 }} />
                <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-primary/50 pointer-events-none" style={{ zIndex: 2 }} />

                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent pointer-events-none" style={{ zIndex: 2 }} />
              </div>
            </div>
          </div>

          {/* RIGHT: Text content + pillars */}
          <div ref={contentRef} className="space-y-8">

            <div>
              <p
                className="text-primary font-medium text-xs uppercase mb-4"
                style={{ letterSpacing: "0.35em" }}
              >
                Por qué elegirme
              </p>
              <h2
                ref={titleRef}
                className="font-bold text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight"
              >
                {renderSegment("No solo", "seg1")}
                <br />
                <span className="text-primary italic">
                  {renderSegment("cejas.", "seg2")}
                </span>
              </h2>
            </div>

            <p className="text-base-content/60 text-base leading-relaxed max-w-md">
              El camino no ha sido fácil. Pero cada paso fue necesario para llegar aquí:{" "}
              <span className="text-primary/80 font-medium">
                transformando rostros, tocando vidas.
              </span>
            </p>

            {/* Decorative divider */}
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 max-w-12 bg-primary/25" />
              <div className="w-2 h-2 border border-primary/40 rotate-45" />
              <div className="h-px flex-1 max-w-12 bg-primary/25" />
              <div className="flex-1" />
            </div>

            {/* Pillars */}
            <div className="space-y-0">
              {pillars.map((pillar, idx) => (
                <Pillar key={idx} {...pillar} />
              ))}
            </div>

            {/* Quote */}
            <blockquote className="border-l-2 border-primary/40 pl-5 mt-6">
              <p className="text-base-content/45 text-sm leading-relaxed italic">
                &ldquo;Mi misión es que cada clienta salga de aquí sintiéndose poderosa.
                No solo bonita — poderosa.&rdquo;
              </p>
              <footer className="mt-2 text-primary/60 text-xs tracking-widest uppercase">
                — tu empresa
              </footer>
            </blockquote>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Problem;

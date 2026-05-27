"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import Image from "next/image";

const Hero = () => {
  const headingRef = useRef(null);
  const subRef = useRef(null);
  const ctaRef = useRef(null);
  const decorRef = useRef(null);
  const badgeRef = useRef(null);

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
      const chars = headingRef.current?.querySelectorAll?.(".char");
      if (chars && chars.length > 0) {
        gsap.set(chars, { opacity: 0, yPercent: 110 });
        gsap.to(chars, {
          opacity: 1,
          yPercent: 0,
          duration: 0.75,
          ease: "power3.out",
          stagger: 0.025,
        });
      }

      gsap.from(badgeRef.current, {
        opacity: 0,
        duration: 1,
        delay: 0.2,
        ease: "power2.out",
      });

      gsap.from(subRef.current, {
        opacity: 0,
        y: 18,
        duration: 1,
        delay: 0.7,
        ease: "power2.out",
      });

      gsap.from(ctaRef.current, {
        opacity: 0,
        y: 16,
        duration: 0.8,
        delay: 1,
        ease: "power2.out",
      });

      gsap.from(decorRef.current, {
        opacity: 0,
        x: 30,
        duration: 1.2,
        delay: 0.4,
        ease: "power2.out",
      });
    }, headingRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center">
      {/* Background soft glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24 px-8 pt-32 pb-24 lg:pt-40 lg:pb-32 w-full">

        {/* LEFT: Text content */}
        <div className="flex-1 space-y-8 text-center lg:text-left max-w-xl">

          {/* Badge / eyebrow */}
          <div ref={badgeRef}>
            <p
              className="text-primary font-medium text-xs uppercase"
              style={{ letterSpacing: "0.35em" }}
            >
              Estudio PMU &nbsp;·&nbsp; Plantilla premium
            </p>
          </div>

          {/* Headline */}
          <h1
            ref={headingRef}
            className="font-bold leading-[1.05] tracking-tight"
            style={{ fontSize: "clamp(3.5rem, 8vw, 7rem)" }}
          >
            <span className="text-base-content block overflow-hidden py-1">
              {renderSegment("Eleva", "seg1")}
            </span>
            <span
              className="text-primary block overflow-hidden py-1"
              style={{ fontStyle: "italic" }}
            >
              {renderSegment("tu imagen.", "seg2")}
            </span>
          </h1>

          {/* Subheadline */}
          <p
            ref={subRef}
            className="text-base-content/65 text-lg md:text-xl leading-relaxed max-w-md mx-auto lg:mx-0"
          >
            Micropigmentación y arte facial de alta gama. Un espacio pensado para que tus
            clientas se sientan{" "}
            <span className="text-primary/90">cuidadas, seguras y coherentes con su estilo.</span>
          </p>

          {/* CTAs */}
          <div
            ref={ctaRef}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
          >
            <Link
              href="/dashboard"
              className="btn btn-primary w-full sm:w-auto"
              style={{
                borderRadius: 0,
                letterSpacing: "0.18em",
                fontSize: "0.72rem",
                fontWeight: 700,
                paddingLeft: "2rem",
                paddingRight: "2rem",
              }}
            >
              AGENDAR CITA
            </Link>
            <Link
              href="#servicios"
              className="btn btn-ghost w-full sm:w-auto border border-primary/40 text-primary"
              style={{
                borderRadius: 0,
                letterSpacing: "0.18em",
                fontSize: "0.72rem",
                fontWeight: 500,
              }}
            >
              VER SERVICIOS
            </Link>
          </div>

          {/* Signature tagline */}
          <p
            className="text-base-content/30 text-xs uppercase"
            style={{ letterSpacing: "0.3em" }}
          >
            Resultados naturales · Experiencia memorable
          </p>
        </div>

        {/* RIGHT: Imagen de referencia (reemplaza con la de tu marca) */}
        <div ref={decorRef} className="flex-1 w-full flex items-center justify-center max-w-sm lg:max-w-md">
          <div className="relative w-full" style={{ aspectRatio: "3/4" }}>

            {/* Offset decorative borders */}
            <div
              className="absolute inset-0 border border-primary/25 pointer-events-none"
              style={{ transform: "translate(14px, 14px)", zIndex: 0 }}
            />
            <div
              className="absolute inset-0 border border-primary/10 pointer-events-none"
              style={{ transform: "translate(28px, 28px)", zIndex: 0 }}
            />

            {/* Image container */}
            <div className="relative w-full h-full overflow-hidden border border-primary/20" style={{ zIndex: 1 }}>
              <Image
                src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80"
                alt="Profesional de belleza — referencia de estudio PMU"
                fill
                priority
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{
                  filter: "sepia(0.12) contrast(1.04) brightness(0.96)",
                }}
              />

              {/* Subtle vignette overlay for text legibility if needed */}
              <div className="absolute inset-0 bg-gradient-to-t from-base-100/20 via-transparent to-transparent pointer-events-none" />

              {/* Corner accents */}
              <div className="absolute top-3 left-3 w-6 h-6 border-t border-l border-primary/60 pointer-events-none" style={{ zIndex: 2 }} />
              <div className="absolute top-3 right-3 w-6 h-6 border-t border-r border-primary/60 pointer-events-none" style={{ zIndex: 2 }} />
              <div className="absolute bottom-3 left-3 w-6 h-6 border-b border-l border-primary/60 pointer-events-none" style={{ zIndex: 2 }} />
              <div className="absolute bottom-3 right-3 w-6 h-6 border-b border-r border-primary/60 pointer-events-none" style={{ zIndex: 2 }} />

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent pointer-events-none" style={{ zIndex: 2 }} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </section>
  );
};

export default Hero;

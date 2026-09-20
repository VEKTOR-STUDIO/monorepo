"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import Image from "next/image";

const Hero = () => {
  const headingRef = useRef(null);
  const subRef = useRef(null);
  const ctaRef = useRef(null);
  const badgeRef = useRef(null);
  const dropsRef = useRef(null);
  const heroImageRef = useRef(null);

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

      if (dropsRef.current) {
        gsap.from(dropsRef.current.querySelectorAll(".drop"), {
          opacity: 0,
          scale: 0.8,
          duration: 1.2,
          delay: 0.4,
          stagger: { each: 0.08, from: "random" },
          ease: "power2.out",
        });
      }

      gsap.from(heroImageRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 1.1,
        delay: 0.9,
        ease: "power2.out",
      });
    }, headingRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center">
      {/* Efecto gotas / condensación (identidad visual logo) */}
      <div
        ref={dropsRef}
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden
      >
        <div className="absolute top-[8%] left-[8%] w-2 h-2 rounded-full bg-primary/25 drop blur-[1px]" />
        <div className="absolute top-[12%] right-[12%] w-3 h-3 rounded-full bg-secondary/20 drop blur-[1px]" />
        <div className="absolute top-[15%] left-[10%] w-3 h-3 rounded-full bg-primary/30 drop blur-[1px]" />
        <div className="absolute top-[22%] left-[45%] w-2.5 h-2.5 rounded-full bg-primary/15 drop blur-[2px]" />
        <div className="absolute top-[25%] right-[20%] w-2 h-2 rounded-full bg-secondary/25 drop blur-[1px]" />
        <div className="absolute top-[35%] left-[5%] w-4 h-4 rounded-full bg-secondary/20 drop blur-[2px]" />
        <div className="absolute top-[40%] left-[25%] w-4 h-4 rounded-full bg-primary/20 drop blur-[2px]" />
        <div className="absolute top-[48%] right-[8%] w-3 h-3 rounded-full bg-primary/25 drop blur-[1px]" />
        <div className="absolute top-[55%] right-[30%] w-2 h-2 rounded-full bg-primary/20 drop" />
        <div className="absolute top-[60%] left-[18%] w-2.5 h-2.5 rounded-full bg-secondary/25 drop blur-[1px]" />
        <div className="absolute bottom-[45%] left-[12%] w-2.5 h-2.5 rounded-full bg-secondary/30 drop blur-[1px]" />
        <div className="absolute bottom-[40%] right-[35%] w-3 h-3 rounded-full bg-primary/20 drop blur-[1px]" />
        <div className="absolute bottom-[35%] right-[15%] w-2.5 h-2.5 rounded-full bg-secondary/20 drop blur-[1px]" />
        <div className="absolute bottom-[30%] left-[38%] w-2 h-2 rounded-full bg-primary/25 drop" />
        <div className="absolute bottom-[25%] left-[30%] w-3 h-3 rounded-full bg-primary/25 drop blur-[1px]" />
        <div className="absolute bottom-[18%] right-[25%] w-2.5 h-2.5 rounded-full bg-secondary/20 drop blur-[1px]" />
        <div className="absolute bottom-[12%] left-[15%] w-2 h-2 rounded-full bg-primary/20 drop" />
        <div className="absolute top-[70%] left-[50%] w-3 h-3 rounded-full bg-secondary/15 drop blur-[2px]" />
      </div>

      {/* Gradiente de ambiente (azul del logo) */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl opacity-30"
          style={{ background: "var(--gradient-daniel)" }}
        />
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-secondary/15 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:gap-12 xl:gap-16 items-center gap-10 px-6 sm:px-8 pt-28 pb-20 lg:pt-36 lg:pb-28 w-full">
        {/* Columna texto — ancho controlado para que el nombre no se corte y buena legibilidad */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left w-full max-w-xl lg:max-w-2xl lg:min-w-0 flex-1 lg:pr-2">
          {/* Badge / eyebrow */}
          <div ref={badgeRef} className="mb-4 lg:mb-5">
            <p
              className="text-primary font-semibold text-xs uppercase tracking-[0.35em]"
            >
              Fisioterapeuta · Atleta BJJ · Caracas
            </p>
          </div>

          {/* Headline — sin overflow-hidden para que "Tamayo" siempre se vea completo */}
          <h1
            ref={headingRef}
            className="font-bold leading-[1.1] tracking-tight mb-4 lg:mb-5"
            style={{ fontSize: "clamp(2.25rem, 4.5vw + 1rem, 4rem)" }}
          >
            <span className="text-base-content block py-0.5">
              {renderSegment("Daniel", "seg1")}{" "}
              <span className="text-primary">{renderSegment("Tamayo", "seg2")}</span>
            </span>
            <span className="text-base-content/90 block py-0.5 text-xl sm:text-2xl md:text-3xl font-semibold mt-1">
              {renderSegment("Excelencia en rehabilitación y deporte.", "seg3")}
            </span>
          </h1>

          {/* Descripción — línea de longitud cómoda */}
          <p
            ref={subRef}
            className="text-base-content/70 text-base md:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0 mb-8 lg:mb-10"
          >
            Terapia a domicilio y consultorio en{" "}
            <span className="text-primary font-medium">Total Elite Training</span>.
            Para deportistas y quienes buscan el mejor cuidado.
          </p>

          {/* CTAs — agrupados con espaciado claro */}
          <div
            ref={ctaRef}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 w-full sm:w-auto"
          >
            <Link
              href="/#citas"
              className="btn btn-primary w-full sm:w-auto min-w-[11rem]"
              style={{
                borderRadius: "var(--radius-box)",
                letterSpacing: "0.12em",
                fontSize: "0.75rem",
                fontWeight: 700,
                paddingLeft: "1.75rem",
                paddingRight: "1.75rem",
              }}
            >
              Agendar cita
            </Link>
            <Link
              href="/#contacto"
              className="btn btn-ghost w-full sm:w-auto border border-primary/40 hover:border-primary hover:bg-primary/10 min-w-[11rem]"
              style={{
                borderRadius: "var(--radius-box)",
                letterSpacing: "0.12em",
                fontSize: "0.75rem",
                fontWeight: 600,
              }}
            >
              Contacto
            </Link>
          </div>

          {/* Ubicación — nivel terciario */}
          <p
            className="mt-6 lg:mt-8 text-base-content/40 text-xs uppercase tracking-[0.2em]"
          >
            Total Elite Training · Caracas
          </p>
        </div>

        {/* Retrato Daniel */}
        <div
          ref={heroImageRef}
          className="relative w-full max-w-md lg:max-w-lg flex-shrink-0 rounded-2xl overflow-hidden border border-primary/20 shadow-2xl"
        >
          <Image
            src="/daniel.png"
            alt="Daniel Tamayo — Fisioterapeuta y atleta BJJ"
            width={560}
            height={560}
            className="w-full h-auto object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 560px"
          />
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-px opacity-60"
        style={{
          background: "linear-gradient(90deg, transparent, var(--color-primary), var(--color-secondary), transparent)",
        }}
      />
    </section>
  );
};

export default Hero;

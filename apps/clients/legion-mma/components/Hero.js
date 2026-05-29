"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import Image from "next/image";
import config from "@/config";

const Hero = () => {
  const headingRef = useRef(null);
  const subRef = useRef(null);
  const ctaRef = useRef(null);
  const decorRef = useRef(null);
  const badgeRef = useRef(null);
  const videoRef = useRef(null);

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
          duration: 0.85,
          ease: "power4.out",
          stagger: 0.03,
        });
      }

      gsap.from(badgeRef.current, {
        opacity: 0,
        x: -20,
        duration: 0.9,
        delay: 0.2,
        ease: "power2.out",
      });

      gsap.from(subRef.current, {
        opacity: 0,
        y: 24,
        duration: 1,
        delay: 0.9,
        ease: "power2.out",
      });

      gsap.from(ctaRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.9,
        delay: 1.15,
        ease: "power2.out",
      });

      gsap.from(decorRef.current, {
        opacity: 0,
        scale: 0.92,
        duration: 1.4,
        delay: 0.3,
        ease: "power3.out",
      });
    }, headingRef);

    if (videoRef.current) {
      const v = videoRef.current;
      const tryPlay = () => v.play().catch(() => {});
      v.addEventListener("loadedmetadata", tryPlay);
      if (v.readyState >= 3) tryPlay();
    }

    return () => ctx.revert();
  }, []);

  const eventDate = new Date(config.event.date);
  const dateLabel = eventDate
    .toLocaleDateString("es-VE", { weekday: "long", day: "numeric", month: "long" })
    .toUpperCase();

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center bg-base-100">
      {/* Video background */}
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover opacity-45"
        aria-hidden
      >
        <source src="/hero-background.mp4" type="video/mp4" />
      </video>

      {/* Overlays: vertical fade + subtle gold wash */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-base-100/55 via-base-100/75 to-base-100" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-base-100/40 via-transparent to-primary/10 mix-blend-screen" />

      {/* Gold stripe accents */}
      <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
      <div className="absolute bottom-0 right-0 w-full h-1 bg-primary/80" />

      <div className="relative max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16 px-6 lg:px-10 pt-32 pb-20 lg:pt-40 lg:pb-28 w-full">
        {/* LEFT */}
        <div className="flex-1 space-y-7 text-center lg:text-left max-w-2xl">
          <div ref={badgeRef} className="inline-flex items-center gap-3">
            <span className="w-10 h-px bg-primary" />
            <p className="text-primary font-bold text-xs uppercase tracking-[0.4em]">
              Venezuela · Caracas · MMA
            </p>
          </div>

          <h1
            ref={headingRef}
            className="font-display leading-[0.85] tracking-tight"
            style={{ fontSize: "clamp(4.5rem, 12vw, 10rem)" }}
          >
            <span className="text-base-content block overflow-hidden py-1">
              {renderSegment("Legión", "seg1")}
            </span>
            <span className="legion-gold-sheen block overflow-hidden py-1">
              {renderSegment("MMA", "seg2")}
            </span>
          </h1>

          <p
            ref={subRef}
            className="text-base-content/75 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-sans"
          >
            La liga venezolana que está cambiando las artes marciales mixtas.
            <span className="text-base-content"> Fundada por Omar Morales</span>{" "}
            para proteger al peleador, profesionalizar el deporte y abrir las puertas al mercado internacional.
          </p>

          <div
            ref={ctaRef}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-3"
          >
            <Link
              href="#cartelera"
              className="btn btn-primary w-full sm:w-auto px-10"
            >
              Ver Cartelera
            </Link>
            <Link
              href="#sobre"
              className="btn btn-ghost w-full sm:w-auto border-2 border-base-content/40 text-base-content hover:border-primary hover:text-primary px-10"
            >
              Conoce Legión
            </Link>
          </div>

          <div className="flex items-center justify-center lg:justify-start gap-3 pt-4 text-base-content/50">
            <span className="font-display text-2xl text-primary">{config.event.edition}</span>
            <span className="w-8 h-px bg-base-content/30" />
            <span className="text-xs tracking-[0.3em] uppercase font-bold">
              {dateLabel} · {config.event.venue}
            </span>
          </div>
        </div>

        {/* RIGHT — Event poster */}
        <div ref={decorRef} className="flex-1 w-full flex items-center justify-center max-w-md">
          <div className="relative w-full" style={{ aspectRatio: "3/4" }}>
            {/* Gold offset border */}
            <div
              className="absolute inset-0 border-2 border-primary pointer-events-none"
              style={{ transform: "translate(16px, 16px)", zIndex: 0 }}
            />
            {/* Poster */}
            <div className="relative w-full h-full overflow-hidden border-2 border-primary/60" style={{ zIndex: 1 }}>
              <Image
                src={config.event.posterImage}
                alt={`Póster ${config.event.name} ${config.event.edition}`}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ filter: "grayscale(0.35) contrast(1.1)" }}
              />
              {/* Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-base-100 via-base-100/40 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/15 pointer-events-none" />

              {/* Poster footer */}
              <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                <p className="text-[0.6rem] tracking-[0.4em] text-primary uppercase font-bold mb-1">
                  Edición {config.event.edition}
                </p>
                <p className="font-display text-3xl text-base-content leading-none">
                  {dateLabel.split(",")[0]}
                </p>
                <p className="text-xs tracking-[0.2em] text-base-content/70 uppercase mt-1">
                  {config.event.venue} · {config.event.city}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

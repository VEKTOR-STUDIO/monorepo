"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const CheckIcon = ({ className = "w-5 h-5 text-primary" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" aria-hidden>
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

/**
 * Alessandrovaru shared Hero — section presentacional con foto/video, copy y CTAs.
 *
 * Props:
 *  - eyebrow:        string (texto chico arriba del título; opcional).
 *  - title:          ReactNode (el caller pasa su propio markup para resaltar
 *                    palabras con `text-primary` / `text-accent`).
 *  - description:    ReactNode.
 *  - primaryCta:     { href, label, gradient?: boolean } — si gradient=true (default)
 *                    usa `.btn-gradient-animated`. La utilidad CSS vive en
 *                    `@alessandrovaru/ui/styles.css`.
 *  - secondaryCta:   { href, label } (opcional).
 *  - bullets:        Array<{ label, tone?: "primary" | "accent" }>.
 *  - image:          { src, alt, width?, height? } — next/image source.
 *  - video:          { src, poster? } — opcional, fondo full-bleed. Respeta
 *                    `prefers-reduced-motion` y `prefers-reduced-data`.
 *  - className:      classes extra para la `<section>`.
 */
const Hero = ({
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
  bullets = [],
  image,
  video,
  className = "",
}) => {
  const videoRef = useRef(null);
  const [loadVideo, setLoadVideo] = useState(false);

  useEffect(() => {
    if (!video?.src) return;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const prefersReducedData = window.matchMedia(
      "(prefers-reduced-data: reduce)"
    ).matches;
    if (!prefersReducedMotion && !prefersReducedData) {
      setLoadVideo(true);
    }
  }, [video?.src]);

  useEffect(() => {
    if (!loadVideo || !videoRef.current) return;
    const el = videoRef.current;
    const play = () => {
      el.play().catch(() => {});
    };
    el.addEventListener("loadedmetadata", play);
    if (el.readyState >= 3) play();
    return () => el.removeEventListener("loadedmetadata", play);
  }, [loadVideo]);

  const gradientCta = primaryCta?.gradient !== false;
  const primaryClasses = gradientCta
    ? "text-sm py-3 px-6 rounded-lg inline-flex items-center text-white shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 btn-gradient-animated"
    : "btn btn-primary";

  return (
    <div className="relative">
      {video?.src ? (
        loadVideo ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="z-10 absolute inset-0 w-full h-full object-cover opacity-40 -z-10"
              poster={video.poster}
            >
              <source src={video.src} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-br from-base-100/30 via-base-100/20 to-base-100/30 -z-5" />
          </>
        ) : (
          <div className="absolute inset-0 bg-base-100 -z-10" />
        )
      ) : null}

      <section
        className={`relative overflow-hidden max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 px-8 pt-24 lg:pt-24 sm:pb-0 lg:pb-24 z-20 ${className}`}
      >
        <div className="flex-1 space-y-6 lg:pr-8 z-10">
          {eyebrow ? (
            <p className="text-primary font-semibold uppercase tracking-wider text-sm">
              {eyebrow}
            </p>
          ) : null}

          {title ? (
            <h1 className="font-extrabold text-3xl md:text-5xl lg:text-6xl leading-tight tracking-tight">
              {title}
            </h1>
          ) : null}

          {description ? (
            <p className="text-lg md:text-xl text-base-content/80 max-w-2xl leading-relaxed">
              {description}
            </p>
          ) : null}

          {(primaryCta || secondaryCta) && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4">
              {primaryCta ? (
                <Link href={primaryCta.href} className={primaryClasses}>
                  {primaryCta.label}
                </Link>
              ) : null}
              {secondaryCta ? (
                <Link
                  href={secondaryCta.href}
                  className="btn-ghost py-2 px-4 rounded-lg inline-flex items-center"
                >
                  {secondaryCta.label}
                </Link>
              ) : null}
            </div>
          )}

          {bullets.length > 0 && (
            <ul className="flex flex-wrap items-center gap-3 pt-6 text-sm text-base-content/70 py-8 md:py-0">
              {bullets.map((b, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckIcon
                    className={`w-5 h-5 ${
                      b.tone === "accent" ? "text-accent" : "text-primary"
                    }`}
                  />
                  {b.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        {image ? (
          <div className="relative md:relative flex-1 w-full flex items-center justify-center lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 self-end">
            <div className="absolute -bottom-16 -right-16 w-[40rem] h-[40rem] bg-gradient-to-br from-primary/20 via-accent/30 to-secondary/20 rounded-full blur-3xl opacity-60" />
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width ?? 800}
              height={image.height ?? 800}
              priority
              className="relative z-20 max-w-xl h-auto object-contain drop-shadow-2xl w-[500px]"
            />
          </div>
        ) : null}
      </section>
    </div>
  );
};

export default Hero;

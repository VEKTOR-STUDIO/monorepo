"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Vista en grande de una foto: fondo oscuro + imagen contenida + texto y
 * autor debajo. Entra y sale con una animación GSAP (fade del fondo y
 * zoom del panel). Se cierra con clic en el fondo, la ✕ o Escape.
 */
export default function Lightbox({ post, onClose }) {
  const backdropRef = useRef(null);
  const panelRef = useRef(null);
  const timelineRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const tl = gsap.timeline();
    tl.fromTo(
      backdropRef.current,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.25, ease: "power1.out" }
    ).fromTo(
      panelRef.current,
      { autoAlpha: 0, scale: 0.88, y: 28 },
      { autoAlpha: 1, scale: 1, y: 0, duration: 0.45, ease: "power3.out" },
      "<0.05"
    );
    timelineRef.current = tl;

    return () => {
      document.body.style.overflow = "";
      tl.kill();
    };
  }, [post.id]);

  const handleClose = useCallback(() => {
    const tl = timelineRef.current;
    if (!tl) return onClose();

    // Reproducir la animación de entrada en reversa antes de desmontar.
    tl.timeScale(1.75);
    tl.eventCallback("onReverseComplete", onClose);
    tl.reverse();
  }, [onClose]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleClose]);

  return (
    <div
      ref={backdropRef}
      role="dialog"
      aria-modal="true"
      aria-label={post.description}
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm md:p-8"
    >
      <button
        type="button"
        aria-label="Cerrar"
        onClick={handleClose}
        className="btn btn-circle btn-ghost absolute right-3 top-3 z-10 text-white"
      >
        ✕
      </button>

      <figure
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
        className="flex w-full max-w-4xl flex-col gap-5"
      >
        <div className="relative h-[60vh] w-full md:h-[68vh]">
          <Image
            src={post.image_url}
            alt={post.description}
            fill
            sizes="100vw"
            priority
            className="object-contain"
          />
        </div>

        <figcaption className="text-center text-white">
          <p className="mx-auto max-w-2xl text-base leading-relaxed md:text-lg">
            {post.description}
          </p>
          <p className="mt-2 text-sm uppercase tracking-widest text-white/50">
            {post.author_name || "Anónimo"} ·{" "}
            {new Date(post.created_at).toLocaleDateString("es", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </figcaption>
      </figure>
    </div>
  );
}

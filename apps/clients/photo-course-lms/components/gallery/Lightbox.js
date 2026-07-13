"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import DOMPurify from "isomorphic-dompurify";
import {
  ALLOWED_DESCRIPTION_ATTR,
  ALLOWED_DESCRIPTION_TAGS,
  stripHtml,
} from "@/libs/gallery";

/**
 * Vista en grande de una foto: fondo oscuro + panel con la imagen de un
 * lado y el texto (rich text) del otro. En pantallas chicas se apila en
 * una sola columna. Entra y sale con una animación GSAP (fade del fondo y
 * zoom del panel). Se cierra con clic en el fondo, la ✕ o Escape.
 */
export default function Lightbox({ post, onClose }) {
  const backdropRef = useRef(null);
  const panelRef = useRef(null);
  const timelineRef = useRef(null);

  const plainText = stripHtml(post.description);

  // El HTML ya se sanitiza al guardarlo (ver app/actions.js), pero se
  // vuelve a sanitizar aquí antes de inyectarlo con dangerouslySetInnerHTML
  // como segunda capa de defensa contra XSS.
  const safeHtml = useMemo(
    () =>
      DOMPurify.sanitize(post.description, {
        ALLOWED_TAGS: ALLOWED_DESCRIPTION_TAGS,
        ALLOWED_ATTR: ALLOWED_DESCRIPTION_ATTR,
      }),
    [post.description]
  );

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
      aria-label={plainText}
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
        className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-neutral-900 shadow-2xl md:h-[85vh] md:flex-row"
      >
        {/* Imagen: mitad izquierda en desktop, arriba en mobile */}
        <div className="relative h-[45vh] w-full shrink-0 bg-black md:h-full md:w-3/5">
          <Image
            src={post.image_url}
            alt={plainText}
            fill
            sizes="(max-width: 768px) 100vw, 60vw"
            priority
            className="object-contain"
          />
        </div>

        {/* Texto: mitad derecha en desktop, abajo (con scroll) en mobile */}
        <figcaption className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-6 text-white md:w-2/5 md:p-8">
          <div
            className="gallery-rich-text flex-1 text-base leading-relaxed md:text-lg"
            dangerouslySetInnerHTML={{ __html: safeHtml }}
          />
          <p className="border-t border-white/10 pt-4 text-sm uppercase tracking-widest text-white/50">
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

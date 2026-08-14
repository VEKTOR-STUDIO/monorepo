"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { updateAcademy } from "@/app/dashboard/actions";
import { ACADEMY_FALLBACK_COLOR, NO_ACADEMY_LABEL } from "@/libs/academies";

const SWIPE_THRESHOLD = 48;

function Arrow({ dir }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      className={`h-5 w-5 ${dir === "prev" ? "rotate-180" : ""}`}
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function CrestArt({ academy, priority = false }) {
  const crest = academy.crest;
  const letter = (academy.name || "?").trim().charAt(0).toUpperCase();

  if (!crest) {
    return (
      <span className="display text-7xl text-white/90 md:text-8xl">{letter}</span>
    );
  }

  const circle = crest.shape === "circle";

  return (
    <Image
      src={crest.src}
      alt=""
      fill
      sizes="(max-width: 768px) 14rem, 18rem"
      priority={priority}
      draggable={false}
      className={
        circle
          ? "pointer-events-none object-cover"
          : `pointer-events-none object-contain p-4 md:p-6 ${
              crest.knockout ? "roster-knockout" : ""
            }`
      }
    />
  );
}

/**
 * Roster estilo FIFA: el escudo del centro manda, los de los lados se
 * asoman, y se pasa de academia con el dedo, las flechas o el teclado.
 */
export default function TeamSelect({ academies, currentAcademyId }) {
  const start = Math.max(
    0,
    academies.findIndex((academy) => academy.id === currentAcademyId)
  );
  const [index, setIndex] = useState(start);
  const [isPending, startTransition] = useTransition();
  const pointer = useRef({ x: 0, dragging: false, moved: false });

  const count = academies.length;
  const selected = academies[index] ?? null;
  const isMine = Boolean(selected && selected.id === currentAcademyId);
  const teamColor = selected?.color || ACADEMY_FALLBACK_COLOR;

  const go = useCallback(
    (dir) => {
      setIndex((current) => Math.min(count - 1, Math.max(0, current + dir)));
    },
    [count]
  );

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const onPointerDown = (event) => {
    pointer.current = { x: event.clientX, dragging: true, moved: false };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const onPointerMove = (event) => {
    if (!pointer.current.dragging) return;
    if (Math.abs(event.clientX - pointer.current.x) > 8) {
      pointer.current.moved = true;
    }
  };

  const onPointerUp = (event) => {
    if (!pointer.current.dragging) return;
    const delta = event.clientX - pointer.current.x;
    pointer.current.dragging = false;
    if (Math.abs(delta) >= SWIPE_THRESHOLD) {
      go(delta < 0 ? 1 : -1);
    }
  };

  const choose = (academyId) => {
    startTransition(async () => {
      const result = await updateAcademy(academyId ?? "");
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success(
        academyId ? "Academia actualizada 🥋" : "Quedaste sin academia"
      );
    });
  };

  if (!selected) return null;

  return (
    <div
      className="roster"
      style={{ "--team-color": teamColor }}
    >
      <div className="roster-glow" aria-hidden="true" />

      <div
        className="roster-stage"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        role="listbox"
        aria-label="Academias del circuito"
        aria-activedescendant={`roster-${selected.id}`}
      >
        {academies.map((academy, academyIndex) => {
          const offset = academyIndex - index;
          const abs = Math.abs(offset);
          const isCenter = offset === 0;
          const crest = academy.crest;
          const circle = crest?.shape === "circle";

          return (
            <button
              key={academy.id}
              id={`roster-${academy.id}`}
              type="button"
              role="option"
              aria-selected={isCenter}
              tabIndex={isCenter ? 0 : -1}
              onClick={() => {
                if (pointer.current.moved) return;
                if (isCenter) return;
                setIndex(academyIndex);
              }}
              className={`roster-card ${isCenter ? "is-center" : ""} ${
                circle ? "is-circle" : "is-wide"
              }`}
              style={{
                "--i": offset,
                "--s": isCenter ? 1 : abs === 1 ? 0.62 : 0.42,
                "--o": abs > 1 ? 0 : isCenter ? 1 : 0.4,
                "--z": 20 - abs,
              }}
            >
              <span className="roster-plate">
                <CrestArt academy={academy} priority={isCenter} />
              </span>
            </button>
          );
        })}
      </div>

      <div className="relative z-10 space-y-4 text-center">
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={index === 0}
            className="roster-arrow"
            aria-label="Academia anterior"
          >
            <Arrow dir="prev" />
          </button>

          <div className="min-w-0 flex-1">
            <p className="text-[0.65rem] font-black uppercase tracking-[0.35em] opacity-50">
              Academia
            </p>
            <h2 className="display mt-1 text-4xl md:text-5xl">{selected.name}</h2>
          </div>

          <button
            type="button"
            onClick={() => go(1)}
            disabled={index >= count - 1}
            className="roster-arrow"
            aria-label="Academia siguiente"
          >
            <Arrow dir="next" />
          </button>
        </div>

        <div className="flex justify-center gap-2">
          {academies.map((academy, academyIndex) => (
            <button
              key={academy.id}
              type="button"
              aria-label={academy.name}
              onClick={() => setIndex(academyIndex)}
              className={`h-1.5 rounded-full transition-all ${
                academyIndex === index
                  ? "w-8 bg-primary"
                  : "w-1.5 bg-base-content/30 hover:bg-base-content/60"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          className="btn btn-primary mx-auto flex h-14 w-full max-w-sm text-base"
          disabled={isPending || isMine}
          onClick={() => choose(selected.id)}
        >
          {isPending ? (
            <span className="loading loading-spinner loading-sm" />
          ) : isMine ? (
            "Esta es tu academia"
          ) : (
            `Elegir academia`
          )}
        </button>

        {currentAcademyId && (
          <button
            type="button"
            className="text-[0.65rem] font-bold uppercase tracking-widest opacity-40 transition hover:opacity-80"
            disabled={isPending}
            onClick={() => choose("")}
          >
            {NO_ACADEMY_LABEL}
          </button>
        )}
      </div>
    </div>
  );
}

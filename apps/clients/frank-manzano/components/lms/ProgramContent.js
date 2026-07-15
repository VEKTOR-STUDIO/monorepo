"use client";

import { useMemo, useState } from "react";
import VideoPlayer from "@/components/lms/VideoPlayer";

const ProgramContent = ({ workouts = [] }) => {
  // Primer ejercicio con video, para arrancar el reproductor.
  const firstPlayable = useMemo(() => {
    for (const w of workouts) {
      const ex = (w.exercises || []).find((e) => e.video_url);
      if (ex) return { url: ex.video_url, title: ex.name };
    }
    return null;
  }, [workouts]);

  const [active, setActive] = useState(firstPlayable);
  const [openWorkout, setOpenWorkout] = useState(workouts[0]?.id ?? null);

  if (!workouts.length) {
    return (
      <div className="rounded-md border border-base-300 bg-base-200/60 p-8 text-center text-base-content/60">
        Este programa todavía no tiene sesiones publicadas.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
      {/* Reproductor */}
      <div className="lg:col-span-3">
        <div className="lg:sticky lg:top-24">
          {active ? (
            <>
              <VideoPlayer url={active.url} title={active.title} />
              <p className="mt-3 text-sm font-medium text-base-content">
                {active.title}
              </p>
            </>
          ) : (
            <div className="flex aspect-video w-full items-center justify-center rounded-md border border-base-300 bg-base-200 text-sm text-base-content/40">
              Selecciona un ejercicio para ver su video
            </div>
          )}
        </div>
      </div>

      {/* Sesiones + ejercicios */}
      <div className="space-y-3 lg:col-span-2">
        {workouts.map((w) => {
          const isOpen = openWorkout === w.id;
          return (
            <div
              key={w.id}
              className="overflow-hidden rounded-md border border-base-300 bg-base-100"
            >
              <button
                type="button"
                onClick={() => setOpenWorkout(isOpen ? null : w.id)}
                className="flex w-full items-center justify-between gap-3 p-4 text-left transition-colors hover:bg-base-200/60"
              >
                <span>
                  <span className="block text-sm font-semibold text-base-content">
                    {w.title}
                  </span>
                  {(w.focus || w.duration_minutes) && (
                    <span className="mt-0.5 block text-xs text-base-content/50">
                      {[w.focus, w.duration_minutes ? `${w.duration_minutes} min` : null]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  )}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 shrink-0 text-base-content/50 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isOpen && (
                <div className="border-t border-base-300">
                  {w.description && (
                    <p className="px-4 pt-3 text-xs text-base-content/60">{w.description}</p>
                  )}
                  {(w.exercises || []).length === 0 ? (
                    <p className="p-4 text-xs text-base-content/40">
                      Sin ejercicios cargados todavía.
                    </p>
                  ) : (
                    <ul className="divide-y divide-base-200">
                      {w.exercises.map((ex) => {
                        const isActive =
                          active?.url === ex.video_url && active?.title === ex.name;
                        return (
                          <li key={ex.id}>
                            <button
                              type="button"
                              disabled={!ex.video_url}
                              onClick={() =>
                                ex.video_url &&
                                setActive({ url: ex.video_url, title: ex.name })
                              }
                              className={`flex w-full items-start gap-3 p-4 text-left transition-colors ${
                                ex.video_url
                                  ? "hover:bg-base-200/60"
                                  : "cursor-default"
                              } ${isActive ? "bg-primary/5" : ""}`}
                            >
                              <span
                                className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border text-xs ${
                                  ex.video_url
                                    ? "border-primary/40 text-primary"
                                    : "border-base-300 text-base-content/30"
                                }`}
                              >
                                {ex.video_url ? (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                  >
                                    <path d="M8 5v14l11-7z" />
                                  </svg>
                                ) : (
                                  "—"
                                )}
                              </span>
                              <span className="flex-1">
                                <span className="block text-sm font-medium text-base-content">
                                  {ex.name}
                                </span>
                                <span className="mt-0.5 block text-xs text-base-content/50">
                                  {[
                                    ex.sets ? `${ex.sets} series` : null,
                                    ex.reps ? `${ex.reps} reps` : null,
                                    ex.rest_seconds ? `${ex.rest_seconds}s descanso` : null,
                                  ]
                                    .filter(Boolean)
                                    .join(" · ")}
                                </span>
                                {ex.description && (
                                  <span className="mt-1 block text-xs text-base-content/40">
                                    {ex.description}
                                  </span>
                                )}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgramContent;

"use client";

// Reescrito como EditionsTimeline — exportado con el nombre original para
// no romper el árbol de imports legacy del template.

import { useState } from "react";
import { editions } from "@/data/fights";

const EditionsTimeline = () => {
  const [active, setActive] = useState(editions.length - 1);

  return (
    <section id="ediciones" className="relative bg-base-100 py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="mb-14 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="w-10 h-px bg-primary" />
            <p className="text-primary font-bold text-xs uppercase tracking-[0.4em]">
              Historia
            </p>
            <span className="w-10 h-px bg-primary" />
          </div>
          <h2 className="font-display leading-none" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}>
            Cada <span className="text-primary">edición</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 lg:gap-12">
          {/* Editions list */}
          <ol className="border-l-2 border-primary/30">
            {editions.map((e, i) => {
              const isActive = i === active;
              return (
                <li key={e.number}>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    className={`relative w-full text-left pl-6 pr-4 py-4 flex items-center gap-4 transition-colors duration-200 ${
                      isActive
                        ? "bg-base-200 border-l-4 -ml-[2px] border-primary"
                        : "border-l-4 -ml-[2px] border-transparent hover:bg-base-200/50"
                    }`}
                  >
                    <span
                      className={`font-display text-3xl leading-none w-12 ${
                        isActive ? "text-primary" : "text-base-content/40"
                      }`}
                    >
                      {e.number}
                    </span>
                    <span className="flex-1">
                      <span className="block text-[0.65rem] tracking-[0.25em] uppercase font-bold text-base-content/50">
                        {e.date}
                      </span>
                      <span className="block text-sm text-base-content/80 mt-1">
                        {e.venue}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          {/* Active edition detail */}
          <div className="bg-base-200 border border-base-content/10 p-8 lg:p-12 flex flex-col justify-center min-h-[280px]">
            <p className="text-[0.65rem] tracking-[0.4em] uppercase font-bold text-primary mb-3">
              Edición {editions[active].number}
            </p>
            <h3 className="font-display text-5xl text-base-content leading-none mb-4">
              {editions[active].date}
            </h3>
            <p className="text-sm tracking-[0.2em] uppercase text-base-content/60 mb-6">
              {editions[active].venue}
            </p>
            <p className="text-base-content/75 leading-relaxed text-lg">
              {editions[active].note}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditionsTimeline;

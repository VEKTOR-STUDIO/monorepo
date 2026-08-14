"use client";

import { CAOS_OATH } from "@/libs/caos";

// El papel del CAOS: plegado por defecto, se abre para leerlo en voz alta.
// En la ceremonia llega cerrado (el show no se come el veredicto). En el
// manual puede arrancar abierto. details nativo: un toque y se despliega.
export default function CaosOath({ defaultOpen = false, className = "" }) {
  return (
    <details
      defaultOpen={defaultOpen}
      className={`group clip-cut border-2 border-base-300 bg-base-200 open:border-primary ${className}`}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
        <span className="min-w-0">
          <span className="text-[0.6rem] font-black uppercase tracking-[0.3em] text-primary">
            {CAOS_OATH.label}
          </span>
          <span className="mt-0.5 block truncate text-xs font-semibold opacity-60">
            {CAOS_OATH.cue}
          </span>
        </span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="h-4 w-4 shrink-0 opacity-50 transition-transform group-open:rotate-180"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </summary>

      <OathBody />
    </details>
  );
}

function OathBody() {
  return (
    <div className="space-y-5 border-t-2 border-base-300 px-4 py-5">
      <div className="space-y-1">
        {CAOS_OATH.lead.map((line) => (
          <p key={line} className="text-sm font-medium opacity-85 md:text-base">
            {line}
          </p>
        ))}
      </div>

      <div className="space-y-1">
        {CAOS_OATH.nos.map((line) => (
          <p key={line} className="display text-2xl leading-none md:text-3xl">
            {line}
          </p>
        ))}
      </div>

      <div className="space-y-1">
        {CAOS_OATH.pay.map((line) => (
          <p key={line} className="text-sm font-semibold md:text-base">
            {line}
          </p>
        ))}
      </div>

      <p className="text-sm font-medium opacity-80 md:text-base">
        {CAOS_OATH.ref}
      </p>

      <div>
        <p className="display text-xl md:text-2xl">{CAOS_OATH.clean}</p>
        <p className="mt-1 text-sm font-semibold opacity-80">
          {CAOS_OATH.winner}
        </p>
        <p className="display mt-2 text-xl text-primary md:text-2xl">
          {CAOS_OATH.mercy}
        </p>
      </div>
    </div>
  );
}

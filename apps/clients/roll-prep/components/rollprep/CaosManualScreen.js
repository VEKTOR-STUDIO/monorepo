import Link from "next/link";
import CaosMark from "./CaosMark";
import CaosManual from "./CaosManual";

/**
 * La pantalla del manual del Torneo CAOS. Vive en dos direcciones porque tiene
 * dos públicos: /caos/manual la abre cualquiera (el que vio el flyer y quiere
 * saber qué le van a rolear antes de anotarse) y /dashboard/torneos/manual la
 * abre el alumno con la barra de navegación abajo. El contenido es el mismo
 * códice — no toca base de datos, todo el mazo vive en libs/caos.js — así que
 * lo único que cambia es hacia dónde vuelve el enlace de arriba.
 */
export default function CaosManualScreen({ backHref, backLabel, footer }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-base-100 p-4 text-base-content md:p-8">
      <CaosMark
        watermark
        className="pointer-events-none fixed -right-16 top-20 w-[20rem] select-none opacity-[0.16] md:w-[30rem]"
      />

      <section className="relative z-10 mx-auto max-w-3xl space-y-6">
        <div className="rise rise-1 flex items-center justify-between">
          <Link
            href={backHref}
            className="tile-cta text-[0.65rem] font-black uppercase tracking-[0.2em] opacity-60 hover:text-primary hover:opacity-100"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="h-3 w-3 rotate-180"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
            {backLabel}
          </Link>
          <span className="tag-skew bg-accent px-3 py-1 text-xs text-accent-content">
            <span>Manual</span>
          </span>
        </div>

        <div className="rise rise-1 flex items-end gap-4">
          <CaosMark className="h-16 w-auto shrink-0 md:h-20" />
          <div>
            <h1 className="display text-5xl">
              Torneo CAOS<span className="text-primary">.</span>
            </h1>
            <p className="mt-1 text-sm font-medium opacity-70">
              El bracket de siempre, pero cada pelea se rolea. Terreno aleatorio,
              cartas de duelo y XP extra para el que remonta.
            </p>
          </div>
        </div>

        <CaosManual />

        {footer}
      </section>
    </main>
  );
}

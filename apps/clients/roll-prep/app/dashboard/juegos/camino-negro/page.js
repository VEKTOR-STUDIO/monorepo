import Link from "next/link";
import CaminoNegro from "@/components/rollprep/CaminoNegro";
import { JUEGO } from "@/libs/camino-negro";

// Camino Negro: el juego corre entero en el navegador (localStorage) y no
// escribe nada en la base. Ver libs/camino-negro.js para las reglas.
export default function CaminoNegroPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-base-100 p-4 text-base-content md:p-8">
      <span
        aria-hidden="true"
        className="display text-stroke pointer-events-none fixed -right-8 top-24 select-none text-[11rem] leading-none md:text-[15rem]"
      >
        ROLL
      </span>

      <section className="relative z-10 mx-auto max-w-xl space-y-5">
        <div className="rise rise-1 flex items-center justify-between">
          <Link
            href="/dashboard/juegos"
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
            Juegos
          </Link>
          <span className="tag-skew bg-primary px-3 py-1 text-[0.6rem] text-primary-content">
            <span>Roguelike</span>
          </span>
        </div>

        <div className="rise rise-1">
          <h1 className="display text-5xl">
            Camino<span className="text-primary"> Negro</span>
          </h1>
          <p className="mt-2 text-sm font-medium opacity-70">
            {JUEGO.tagline} Cada corrida es distinta y se pierde de verdad. Se
            guarda solo en este teléfono.
          </p>
        </div>

        <div className="rise rise-2">
          <CaminoNegro />
        </div>
      </section>
    </main>
  );
}

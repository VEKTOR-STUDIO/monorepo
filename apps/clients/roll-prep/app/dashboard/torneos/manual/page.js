import Link from "next/link";
import CaosManual from "@/components/rollprep/CaosManual";

export const metadata = {
  title: "Manual del Torneo CAOS",
};

// Manual del modo CAOS: el códice del juego. Todas las cartas, los terrenos
// y cuánto paga cada cosa. No toca la base de datos: el mazo entero vive en
// libs/caos.js, así que se puede leer aunque no haya ningún torneo abierto.
export default function ManualCaos() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-base-100 p-4 text-base-content md:p-8">
      <span
        aria-hidden="true"
        className="display text-stroke pointer-events-none fixed -right-8 top-28 select-none text-[10rem] leading-none md:text-[14rem]"
      >
        CAOS
      </span>

      <section className="relative z-10 mx-auto max-w-3xl space-y-6">
        <div className="rise rise-1 flex items-center justify-between">
          <Link
            href="/dashboard/torneos"
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
            Torneos
          </Link>
          <span className="tag-skew bg-accent px-3 py-1 text-xs text-accent-content">
            <span>Manual</span>
          </span>
        </div>

        <div className="rise rise-1">
          <h1 className="display text-5xl">
            Torneo CAOS<span className="text-primary">.</span>
          </h1>
          <p className="mt-1 text-sm font-medium opacity-70">
            El bracket de siempre, pero cada pelea se rolea. Terreno aleatorio,
            cartas de duelo y XP extra para el que remonta.
          </p>
        </div>

        <CaosManual />
      </section>
    </main>
  );
}

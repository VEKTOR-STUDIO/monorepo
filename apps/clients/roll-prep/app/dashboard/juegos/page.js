import Link from "next/link";
import MenuTile from "@/components/rollprep/MenuTile";
import { JUEGO } from "@/libs/camino-negro";

// Sección Juegos: el arcade de RollPrep. Lo que se juega aquí no toca el XP
// ni el ranking del gym — es la sala de máquinas, aparte del tatami.
export default function Juegos() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-base-100 p-4 text-base-content md:p-8">
      <span
        aria-hidden="true"
        className="display text-stroke pointer-events-none fixed -right-6 top-28 select-none text-[10rem] leading-none md:text-[14rem]"
      >
        PLAY
      </span>

      <section className="relative z-10 mx-auto max-w-xl space-y-6">
        <div className="rise rise-1 flex items-center justify-between">
          <Link
            href="/dashboard"
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
            Menú
          </Link>
          <span className="tag-skew bg-secondary px-3 py-1 text-[0.6rem] text-secondary-content">
            <span>Arcade</span>
          </span>
        </div>

        <div className="rise rise-1">
          <h1 className="display text-5xl">
            Juegos<span className="text-primary">.</span>
          </h1>
          <p className="mt-2 text-sm font-medium opacity-70">
            Jiu-jitsu para los días que no hay tatami. No dan XP ni suben el
            cinturón: se juegan por jugar.
          </p>
        </div>

        <div className="rise rise-2">
          <MenuTile
            hero
            href={`/dashboard/juegos/${JUEGO.key}`}
            index={1}
            kicker="Roguelike de decisiones"
            title={JUEGO.name}
            description={JUEGO.tagline}
            chip="Jugar"
            chipTone="primary"
          />
        </div>

        <div className="rise rise-3 clip-cut stripes relative min-h-36 border-2 border-base-300 bg-base-200 p-5">
          <span
            aria-hidden="true"
            className="display text-stroke pointer-events-none absolute -bottom-4 right-1 select-none text-7xl"
          >
            02
          </span>
          <span className="tag-skew bg-base-300 px-2 py-0.5 text-[0.6rem] text-base-content">
            <span>Próximamente</span>
          </span>
          <p className="display mt-6 text-3xl opacity-50">Otra máquina</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-widest opacity-40">
            La sala apenas abre
          </p>
        </div>
      </section>
    </main>
  );
}

import Link from "next/link";
import CaosMark from "@/components/rollprep/CaosMark";
import CaosScript from "@/components/rollprep/CaosScript";
import { CAOS_SCRIPT } from "@/libs/caos-script";

export const metadata = {
  title: "Guion del Torneo CAOS",
  robots: { index: false, follow: false },
};

// Guion de rodaje de un CAOS de cuatro. Solo el profesor: lo garantiza el
// layout de /dashboard/admin. No toca la base — el texto vive en
// libs/caos-script.js y el papel se lee de CAOS_OATH.
export default function AdminGuionCaos() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-base-100 p-4 text-base-content md:p-8">
      <CaosMark
        watermark
        className="pointer-events-none fixed -right-16 top-20 w-[20rem] select-none opacity-[0.16] md:w-[30rem]"
      />

      <section className="relative z-10 mx-auto max-w-3xl space-y-8">
        <div className="rise rise-1 flex items-center justify-between">
          <Link
            href="/dashboard/admin"
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
            Panel
          </Link>
          <span className="tag-skew bg-primary px-3 py-1 text-xs text-primary-content">
            <span>{CAOS_SCRIPT.kicker}</span>
          </span>
        </div>

        <div className="rise rise-1 flex items-end gap-4">
          <CaosMark className="h-16 w-auto shrink-0 md:h-20" />
          <div>
            <p className="text-[0.65rem] font-black uppercase tracking-[0.3em] opacity-60">
              {CAOS_SCRIPT.title}
            </p>
            <h1 className="display text-5xl md:text-6xl">
              {CAOS_SCRIPT.display}
              <span className="text-primary">.</span>
            </h1>
            <p className="mt-1 text-sm font-medium opacity-70">
              {CAOS_SCRIPT.tagline}
            </p>
          </div>
        </div>

        <CaosScript />
      </section>
    </main>
  );
}

import Link from "next/link";
import TeamSelect from "@/components/rollprep/TeamSelect";
import { createClient } from "@/libs/supabase/server";
import { ACADEMIES_MIGRATION, getAcademies, getProfileWithAcademy } from "@/libs/academies";

export const dynamic = "force-dynamic";

// Roster del circuito: pantalla tipo FIFA para fichar academia.
export default async function Equipo() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [profile, academies] = await Promise.all([
    getProfileWithAcademy(supabase, user.id),
    getAcademies(supabase),
  ]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-base-100 p-4 text-base-content md:p-8">
      <span
        aria-hidden="true"
        className="display text-stroke pointer-events-none fixed -right-4 top-28 select-none text-[9rem] leading-none md:text-[14rem]"
      >
        TEAM
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
            <span>Roster</span>
          </span>
        </div>

        <div className="rise rise-1">
          <h1 className="display text-5xl">
            Equipo<span className="text-primary">.</span>
          </h1>
          <p className="mt-2 text-sm font-medium opacity-70">
            Pasa las academias y elige la tuya. Sale en el ranking y en tu
            ficha. Más adelante el roster abre otras puertas.
          </p>
        </div>

        {academies.length === 0 ? (
          <div className="rise rise-2 clip-cut border-2 border-error bg-error/10 p-5">
            <p className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-error">
              Falta una migración
            </p>
            <p className="mt-2 text-sm font-semibold">
              Corre <code className="bg-base-300 px-1">{ACADEMIES_MIGRATION}</code>{" "}
              para montar el roster de academias.
            </p>
          </div>
        ) : (
          <div className="rise rise-2">
            <TeamSelect
              academies={academies}
              currentAcademyId={profile?.academy_id ?? null}
            />
          </div>
        )}
      </section>
    </main>
  );
}

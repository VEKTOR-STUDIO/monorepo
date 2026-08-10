import Link from "next/link";
import ButtonAccount from "@/components/ButtonAccount";
import PlayerHud from "@/components/rollprep/PlayerHud";
import ProfileForm from "@/components/rollprep/ProfileForm";
import { createClient } from "@/libs/supabase/server";
import { getAcademies, getProfileWithAcademy } from "@/libs/academies";
import {
  getStudentPoints,
  getRank,
  formatXp,
  POINT_EVENT_LABELS,
  BELTS,
} from "@/libs/gamification";

export const dynamic = "force-dynamic";

// Ficha del jugador: nombre, rango de cinturón, XP y el historial de puntos.
export default async function Perfil() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [profile, academies, { totalPoints, events }] = await Promise.all([
    getProfileWithAcademy(supabase, user.id),
    getAcademies(supabase),
    getStudentPoints(supabase, user.id),
  ]);

  const { belt } = getRank(totalPoints);

  return (
    <main className="min-h-screen bg-base-100 p-4 text-base-content md:p-8">
      <section className="mx-auto max-w-xl space-y-6">
        <div className="rise rise-1 relative z-50 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="tile-cta text-[0.65rem] font-black uppercase tracking-[0.2em] opacity-60 hover:text-primary hover:opacity-100"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="h-3 w-3  rotate-180"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
            Menú
          </Link>
          <ButtonAccount />
        </div>

        <h1 className="display rise rise-1 text-5xl">
          Mi perfil<span className="text-primary">.</span>
        </h1>

        <div className="rise rise-2">
          <PlayerHud
            fullName={profile?.full_name}
            totalPoints={totalPoints}
            academy={profile?.academy}
          />
        </div>

        <div className="rise rise-3">
          <ProfileForm
            currentName={profile?.full_name}
            currentAcademyId={profile?.academy_id}
            academies={academies}
          />
        </div>

        {/* Camino de cinturones: cada color se recorre por grados */}
        <div className="rise rise-3 clip-cut border-2 border-base-300 bg-base-200 p-4">
          <div className="mb-3 flex items-baseline justify-between gap-2">
            <p className="text-xs font-black uppercase tracking-[0.2em] opacity-60">
              Camino del cinturón
            </p>
            <p className="text-[0.55rem] font-bold uppercase tracking-widest opacity-40">
              Grado {belt.degree} de {belt.maxDegree}
            </p>
          </div>

          <div className="space-y-3">
            {BELTS.map((b) => {
              const isCurrentBelt = b.key === belt.beltKey;

              return (
                <div key={b.key}>
                  <div className="flex items-baseline justify-between gap-2">
                    <p
                      className={`text-[0.6rem] font-black uppercase tracking-widest ${
                        totalPoints >= b.degrees[0] ? "" : "opacity-35"
                      }`}
                    >
                      {b.short}
                    </p>
                    <p className="text-[0.5rem] font-bold uppercase tracking-widest opacity-40">
                      desde {formatXp(b.degrees[0])} XP
                    </p>
                  </div>

                  <div className="mt-1 flex gap-1">
                    {b.degrees.map((threshold, degree) => {
                      const reached = totalPoints >= threshold;
                      const isCurrent = isCurrentBelt && degree === belt.degree;

                      return (
                        <div
                          key={degree}
                          title={`${
                            degree ? `${b.short} · grado ${degree}` : b.short
                          } — ${formatXp(threshold)} XP`}
                          className={`h-2 flex-1 ${isCurrent ? "blink-soft" : ""}`}
                          style={{
                            backgroundColor: reached ? b.color : "transparent",
                            border: reached
                              ? "none"
                              : "1px solid var(--color-base-300)",
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Historial de XP */}
        <div className="rise rise-4 space-y-3">
          <div className="flex items-baseline justify-between">
            <h2 className="display text-2xl">
              Historial de XP<span className="text-primary">.</span>
            </h2>
            <span className="text-[0.65rem] font-bold uppercase tracking-widest opacity-50">
              {events.length} eventos
            </span>
          </div>

          {!events.length && (
            <div className="stripes border border-base-300 p-6 text-center">
              <p className="text-xs font-semibold uppercase tracking-widest opacity-60">
                Aún no tienes puntos. Estudia la clase de hoy para empezar.
              </p>
            </div>
          )}

          <div className="divide-y divide-base-300 border border-base-300 bg-base-200">
            {events.map((event) => (
              <div key={event.id} className="flex items-center gap-3 p-3">
                <span className="display w-14 shrink-0 text-right text-xl text-primary">
                  +{event.points}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold uppercase tracking-wide">
                    {POINT_EVENT_LABELS[event.kind] ?? event.kind}
                  </p>
                  <p className="text-[0.6rem] font-semibold uppercase tracking-widest opacity-40">
                    {new Date(event.created_at).toLocaleDateString("es-VE", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

import Link from "next/link";
import AcademyBadge from "@/components/rollprep/AcademyBadge";
import AcademyFilter from "@/components/rollprep/AcademyFilter";
import BeltBadge from "@/components/rollprep/BeltBadge";
import RankingTabs from "@/components/rollprep/RankingTabs";
import { createClient } from "@/libs/supabase/server";
import { academyFromRow, isMissingAcademies } from "@/libs/academies";
import { formatXp, getRank } from "@/libs/gamification";

export const dynamic = "force-dynamic";

const COLUMNS = "student_id, full_name, total_points, classes_completed";
const COLUMNS_WITH_ACADEMY = `${COLUMNS}, academy_id, academy_name, academy_slug, academy_color`;

// Ranking del gym: alumnos ordenados por XP total (vista `leaderboard`),
// con su academia y un filtro para ver el ranking de cada una.
export default async function Ranking({ searchParams }) {
  const { academia } = (await searchParams) ?? {};
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const leaderboard = (columns) =>
    supabase
      .from("leaderboard")
      .select(columns)
      .order("total_points", { ascending: false })
      .order("full_name", { ascending: true });

  let { data: rows, error } = await leaderboard(COLUMNS_WITH_ACADEMY);

  // Falta la migración de academias: el ranking de siempre sigue en pie.
  if (isMissingAcademies(error)) {
    ({ data: rows } = await leaderboard(COLUMNS));
  }

  const ranking = (rows ?? []).map((row) => ({
    ...row,
    academy: academyFromRow(row),
  }));

  // Las academias que hoy tienen gente en el ranking (para los filtros).
  const academies = [
    ...new Map(
      ranking
        .filter((row) => row.academy)
        .map((row) => [row.academy.slug, row.academy])
    ).values(),
  ].sort((a, b) => a.name.localeCompare(b.name, "es"));

  const activeSlug = academies.some((a) => a.slug === academia) ? academia : null;
  const visible = activeSlug
    ? ranking.filter((row) => row.academy?.slug === activeSlug)
    : ranking;
  const myIndex = visible.findIndex((r) => r.student_id === user.id);

  return (
    <main className="relative min-h-screen overflow-hidden bg-base-100 p-4 text-base-content md:p-8">
      <span
        aria-hidden="true"
        className="display text-stroke pointer-events-none fixed -right-6 top-32 select-none text-[10rem] leading-none md:text-[14rem]"
      >
        TOP
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
          <span className="tag-skew bg-accent px-3 py-1 text-xs text-accent-content">
            <span>Ranking del gym</span>
          </span>
        </div>

        <div className="rise rise-1">
          <h1 className="display text-5xl">
            Ranking<span className="text-primary">.</span>
          </h1>
          <p className="mt-1 text-sm font-medium opacity-70">
            XP por estudiar clases, votar, comentar y mantener el perfil al día.
            Es el que sube el cinturón.
          </p>
          {myIndex >= 0 && (
            <p className="mt-2 text-xs font-black uppercase tracking-[0.2em] text-primary">
              Tu posición: #{myIndex + 1} de {visible.length}
            </p>
          )}
        </div>

        <div className="rise rise-2">
          <RankingTabs active="gym" />
        </div>

        <div className="rise rise-2">
          <AcademyFilter
            academies={academies}
            activeSlug={activeSlug}
            basePath="/dashboard/ranking"
          />
        </div>

        {!visible.length && (
          <div className="rise rise-2 stripes border border-base-300 p-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest opacity-60">
              {activeSlug
                ? "Esta academia todavía no tiene alumnos con puntos."
                : "Todavía no hay puntos en el gym. Sé el primero en marcar."}
            </p>
          </div>
        )}

        <div className="rise rise-2 space-y-2">
          {visible.map((row, index) => {
            const isMe = row.student_id === user.id;
            const { belt } = getRank(row.total_points);
            const isPodium = index < 3;

            return (
              <div
                key={row.student_id}
                className={`clip-cut relative flex items-center gap-4 border-2 p-4 ${
                  isMe
                    ? "border-primary bg-primary/10 shadow-[0_0_30px_-12px] shadow-primary/60"
                    : isPodium
                      ? "border-base-content/30 bg-base-200"
                      : "border-base-300 bg-base-200"
                }`}
              >
                <span
                  className={`display w-12 shrink-0 text-center text-3xl ${
                    index === 0
                      ? "text-primary"
                      : isPodium
                        ? "text-base-content"
                        : "text-stroke"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="display truncate text-xl">
                    {row.full_name || "Alumno"}
                    {isMe && <span className="ml-2 text-sm text-primary">(tú)</span>}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <BeltBadge rank={belt} size="xs" />
                    <AcademyBadge academy={row.academy} size="xs" />
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest opacity-50">
                      {row.classes_completed} clases estudiadas
                    </span>
                  </div>
                </div>

                <span className="display shrink-0 text-2xl text-primary">
                  {formatXp(row.total_points)}
                  <span className="ml-1 text-xs opacity-70">XP</span>
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}

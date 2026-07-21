import Link from "next/link";
import { createClient } from "@/libs/supabase/server";
import { getRank } from "@/libs/gamification";

export const dynamic = "force-dynamic";

// Ranking del gym: alumnos ordenados por XP total (vista `leaderboard`).
export default async function Ranking() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: rows } = await supabase
    .from("leaderboard")
    .select("student_id, full_name, total_points, classes_completed")
    .order("total_points", { ascending: false })
    .order("full_name", { ascending: true });

  const ranking = rows ?? [];
  const myIndex = ranking.findIndex((r) => r.student_id === user.id);

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
            <span>Temporada actual</span>
          </span>
        </div>

        <div className="rise rise-1">
          <h1 className="display text-5xl">
            Ranking<span className="text-primary">.</span>
          </h1>
          <p className="mt-1 text-sm font-medium opacity-70">
            XP por estudiar clases, votar, comentar y mantener el perfil al día.
          </p>
          {myIndex >= 0 && (
            <p className="mt-2 text-xs font-black uppercase tracking-[0.2em] text-primary">
              Tu posición: #{myIndex + 1} de {ranking.length}
            </p>
          )}
        </div>

        {!ranking.length && (
          <div className="rise rise-2 stripes border border-base-300 p-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest opacity-60">
              Todavía no hay puntos en el gym. Sé el primero en marcar.
            </p>
          </div>
        )}

        <div className="rise rise-2 space-y-2">
          {ranking.map((row, index) => {
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
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className="tag-skew px-1.5 py-0.5 text-[0.55rem] text-base-100"
                      style={{ backgroundColor: belt.color }}
                    >
                      <span className={belt.short === "Negra" ? "text-white" : ""}>
                        {belt.short}
                      </span>
                    </span>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest opacity-50">
                      {row.classes_completed} clases estudiadas
                    </span>
                  </div>
                </div>

                <span className="display shrink-0 text-2xl text-primary">
                  {row.total_points}
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

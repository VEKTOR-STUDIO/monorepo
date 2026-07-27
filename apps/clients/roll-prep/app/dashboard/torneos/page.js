import Link from "next/link";
import { createClient } from "@/libs/supabase/server";
import { TOURNAMENT_POINTS, TOURNAMENT_STATUS_LABELS } from "@/libs/tournaments";

export const dynamic = "force-dynamic";

// Torneos internos (topes de clase): lista de brackets del gym.
// Todos los alumnos los ven; solo el profesor crea nuevos.
export default async function Torneos() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: profile }, { data: tournaments }] = await Promise.all([
    supabase.from("profiles").select("role").eq("id", user.id).single(),
    supabase
      .from("tournaments")
      .select("id, title, status, created_at, tournament_participants (count)")
      .order("created_at", { ascending: false }),
  ]);

  const isAdmin = profile?.role === "admin";
  const list = tournaments ?? [];

  return (
    <main className="relative min-h-screen overflow-hidden bg-base-100 p-4 text-base-content md:p-8">
      <span
        aria-hidden="true"
        className="display text-stroke pointer-events-none fixed -right-8 top-28 select-none text-[10rem] leading-none md:text-[14rem]"
      >
        VS
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
          <span className="tag-skew bg-secondary px-3 py-1 text-xs text-secondary-content">
            <span>Topes internos</span>
          </span>
        </div>

        <div className="rise rise-1">
          <h1 className="display text-5xl">
            Torneos<span className="text-primary">.</span>
          </h1>
          <p className="mt-1 text-sm font-medium opacity-70">
            Brackets de los topes de clase. Los resultados quedan guardados.
          </p>
          <p className="mt-2 text-[0.65rem] font-black uppercase tracking-[0.2em] text-primary">
            Pelear +{TOURNAMENT_POINTS.participation} XP · Finalista +
            {TOURNAMENT_POINTS.finalist} XP · Campeón +
            {TOURNAMENT_POINTS.champion} XP
          </p>
        </div>

        {isAdmin && (
          <Link
            href="/dashboard/torneos/nuevo"
            className="rise rise-2 btn btn-primary btn-block"
          >
            + Nuevo tope
          </Link>
        )}

        {!list.length && (
          <div className="rise rise-2 stripes border border-base-300 p-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest opacity-60">
              Todavía no hay torneos.
              {isAdmin
                ? " Crea el primer tope de la clase."
                : " El profesor armará el primer tope pronto."}
            </p>
          </div>
        )}

        <div className="rise rise-3 space-y-2">
          {list.map((tournament) => {
            const count = tournament.tournament_participants?.[0]?.count ?? 0;
            const isActive = tournament.status === "active";

            return (
              <Link
                key={tournament.id}
                href={`/dashboard/torneos/${tournament.id}`}
                className="clip-cut group relative flex items-center gap-4 border-2 border-base-300 bg-base-200 p-4 transition-colors hover:border-primary"
              >
                <div className="min-w-0 flex-1">
                  <p className="display truncate text-xl group-hover:text-primary">
                    {tournament.title}
                  </p>
                  <p className="mt-1 text-[0.6rem] font-bold uppercase tracking-widest opacity-50">
                    {new Date(tournament.created_at).toLocaleDateString("es-VE", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                    {" · "}
                    {count} peleador{count === 1 ? "" : "es"}
                  </p>
                </div>

                <span
                  className={`tag-skew px-2 py-0.5 text-[0.6rem] ${
                    isActive
                      ? "blink-soft bg-primary text-primary-content"
                      : "bg-base-300 text-base-content"
                  }`}
                >
                  <span>{TOURNAMENT_STATUS_LABELS[tournament.status]}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}

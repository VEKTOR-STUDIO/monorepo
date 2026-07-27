import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/libs/supabase/server";
import TournamentBracket from "@/components/rollprep/TournamentBracket";
import { TOURNAMENT_POINTS, TOURNAMENT_STATUS_LABELS } from "@/libs/tournaments";

export const dynamic = "force-dynamic";

// Detalle de un tope: el bracket completo. Los alumnos lo ven; el profesor
// carga resultados, re-sortea o lo borra.
export default async function TorneoDetalle({ params }) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: profile }, { data: tournament }] = await Promise.all([
    supabase.from("profiles").select("role").eq("id", user.id).single(),
    supabase
      .from("tournaments")
      .select("id, title, status, created_at, completed_at")
      .eq("id", id)
      .maybeSingle(),
  ]);

  if (!tournament) notFound();

  const [{ data: participants }, { data: matches }] = await Promise.all([
    supabase
      .from("tournament_participants")
      .select("student_id, seed, profiles:student_id (full_name)")
      .eq("tournament_id", tournament.id)
      .order("seed", { ascending: true }),
    supabase
      .from("tournament_matches")
      .select("id, round, slot, student1_id, student2_id, winner_id, method")
      .eq("tournament_id", tournament.id)
      .order("round", { ascending: true })
      .order("slot", { ascending: true }),
  ]);

  const names = Object.fromEntries(
    (participants ?? []).map((p) => [
      p.student_id,
      p.profiles?.full_name || "Alumno",
    ])
  );

  const isAdmin = profile?.role === "admin";
  const isActive = tournament.status === "active";

  return (
    <main className="relative min-h-screen overflow-hidden bg-base-100 p-4 text-base-content md:p-8">
      <span
        aria-hidden="true"
        className="display text-stroke pointer-events-none fixed -right-8 top-28 select-none text-[10rem] leading-none md:text-[14rem]"
      >
        VS
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
          <span
            className={`tag-skew px-3 py-1 text-xs ${
              isActive
                ? "blink-soft bg-primary text-primary-content"
                : "bg-base-300 text-base-content"
            }`}
          >
            <span>{TOURNAMENT_STATUS_LABELS[tournament.status]}</span>
          </span>
        </div>

        <div className="rise rise-1">
          <h1 className="display text-4xl md:text-5xl">
            {tournament.title}
            <span className="text-primary">.</span>
          </h1>
          <p className="mt-1 text-[0.65rem] font-bold uppercase tracking-widest opacity-50">
            {new Date(tournament.created_at).toLocaleDateString("es-VE", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            {" · "}
            {(participants ?? []).length} peleadores
          </p>
          <p className="mt-2 text-[0.65rem] font-black uppercase tracking-[0.2em] text-primary">
            Pelear +{TOURNAMENT_POINTS.participation} XP · Finalista +
            {TOURNAMENT_POINTS.finalist} XP · Campeón +
            {TOURNAMENT_POINTS.champion} XP
          </p>
        </div>

        <TournamentBracket
          tournament={tournament}
          matches={matches ?? []}
          names={names}
          isAdmin={isAdmin}
        />
      </section>
    </main>
  );
}

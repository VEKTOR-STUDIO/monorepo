import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/libs/supabase/server";
import CaosMark from "@/components/rollprep/CaosMark";
import TournamentBracket from "@/components/rollprep/TournamentBracket";
import { TOURNAMENT_POINTS, TOURNAMENT_STATUS_LABELS } from "@/libs/tournaments";
import {
  CAOS_POINTS,
  OUTFITS,
  EVENT_TYPES,
  CAOS_RANKING_MIGRATION,
} from "@/libs/caos";

export const dynamic = "force-dynamic";

// La base todavía no tiene alguna columna nueva (modo CAOS, invitados...).
function MissingMigration({
  file = "supabase/migrations/20260806120000_caos.sql",
  message,
}) {
  return (
    <main className="min-h-screen bg-base-100 p-4 text-base-content md:p-8">
      <section className="mx-auto max-w-xl space-y-4">
        <Link
          href="/dashboard/torneos"
          className="tile-cta text-[0.65rem] font-black uppercase tracking-[0.2em] opacity-60 hover:text-primary hover:opacity-100"
        >
          Torneos
        </Link>
        <div className="clip-cut border-2 border-error bg-error/10 p-5">
          <p className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-error">
            Falta una migración
          </p>
          <p className="mt-2 text-sm font-semibold">
            El torneo sigue guardado en la base: lo que falta es correr{" "}
            <code className="bg-base-300 px-1">{file}</code> en el SQL Editor
            de Supabase. Se puede correr varias veces sin problema.
          </p>
          <p className="mt-2 text-xs font-medium opacity-60">{message}</p>
        </div>
      </section>
    </main>
  );
}

// Detalle de un tope: el bracket completo. Los alumnos lo ven; el profesor
// carga resultados, re-sortea o lo borra.
export default async function TorneoDetalle({ params }) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: profile }, { data: tournament, error }] = await Promise.all([
    supabase.from("profiles").select("role").eq("id", user.id).single(),
    supabase
      .from("tournaments")
      .select(
        "id, title, status, mode, outfit, event_type, ranked, created_at, completed_at"
      )
      .eq("id", id)
      .maybeSingle(),
  ]);

  // Falta una columna de la migración del CAOS: el torneo existe, pero el
  // query no corre. Mejor decirlo que devolver un 404 que no es verdad.
  if (error?.code === "42703") {
    return (
      <MissingMigration
        file={
          /event_type|ranked/.test(error.message ?? "")
            ? CAOS_RANKING_MIGRATION
            : undefined
        }
        message={error.message}
      />
    );
  }
  if (!tournament) notFound();

  const isCaos = tournament.mode === "caos";

  const [
    { data: participants, error: participantsError },
    { data: matches },
    { data: rollRows },
  ] = await Promise.all([
    supabase
      .from("tournament_participants")
      .select("student_id, seed, is_guest, guest_name")
      .eq("tournament_id", tournament.id)
      .order("seed", { ascending: true }),
    supabase
      .from("tournament_matches")
      .select("id, round, slot, student1_id, student2_id, winner_id, method")
      .eq("tournament_id", tournament.id)
      .order("round", { ascending: true })
      .order("slot", { ascending: true }),
    isCaos
      ? supabase
          .from("tournament_match_rolls")
          .select(
            "match_id, tier, terrain_key, duel_key, student1_weight, student2_weight"
          )
          .eq("tournament_id", tournament.id)
      : Promise.resolve({ data: [] }),
  ]);

  if (participantsError?.code === "42703") {
    return (
      <MissingMigration
        file="supabase/migrations/20260806140000_tournament_guests.sql"
        message={participantsError.message}
      />
    );
  }

  // El nombre de un alumno vive en su perfil; el de un invitado, en su
  // propia fila de participante (no tiene cuenta que consultar).
  const studentIds = (participants ?? [])
    .filter((p) => !p.is_guest)
    .map((p) => p.student_id);

  const { data: profiles } = studentIds.length
    ? await supabase.from("profiles").select("id, full_name").in("id", studentIds)
    : { data: [] };

  const fullNames = Object.fromEntries(
    (profiles ?? []).map((p) => [p.id, p.full_name])
  );

  const names = Object.fromEntries(
    (participants ?? []).map((p) => [
      p.student_id,
      p.is_guest
        ? p.guest_name || "Invitado"
        : fullNames[p.student_id] || "Alumno",
    ])
  );

  const guestIds = (participants ?? [])
    .filter((p) => p.is_guest)
    .map((p) => p.student_id);

  const rolls = Object.fromEntries(
    (rollRows ?? []).map((roll) => [roll.match_id, roll])
  );

  const isAdmin = profile?.role === "admin";
  const isActive = tournament.status === "active";

  return (
    <main className="relative min-h-screen overflow-hidden bg-base-100 p-4 text-base-content md:p-8">
      {isCaos ? (
        <CaosMark
          watermark
          className="pointer-events-none fixed -right-16 top-20 w-[20rem] select-none opacity-[0.16] md:w-[30rem]"
        />
      ) : (
        <span
          aria-hidden="true"
          className="display text-stroke pointer-events-none fixed -right-8 top-28 select-none text-[10rem] leading-none md:text-[14rem]"
        >
          VS
        </span>
      )}

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
          {isCaos && (
            <div className="mb-2 flex items-center gap-2">
              <CaosMark className="h-8 w-auto shrink-0" />
              <span className="tag-skew inline-block bg-accent px-2 py-0.5 text-[0.6rem] text-accent-content">
                <span>
                  Modalidad CAOS · {OUTFITS[tournament.outfit]?.label ?? "No-Gi"}
                </span>
              </span>
              {tournament.event_type === "circuit" && (
                <span className="tag-skew inline-block border border-base-content/40 px-2 py-0.5 text-[0.6rem]">
                  <span>{EVENT_TYPES.circuit.label}</span>
                </span>
              )}
              <Link
                href="/dashboard/torneos/manual"
                className="text-[0.6rem] font-black uppercase tracking-[0.2em] opacity-60 hover:text-primary hover:opacity-100"
              >
                Manual
              </Link>
            </div>
          )}
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
            {guestIds.length > 0 &&
              ` · ${guestIds.length} invitado${guestIds.length === 1 ? "" : "s"}`}
          </p>
          <p className="mt-2 text-[0.65rem] font-black uppercase tracking-[0.2em] text-primary">
            Pelear +{TOURNAMENT_POINTS.participation} XP · Finalista +
            {TOURNAMENT_POINTS.finalist} XP · Campeón +
            {TOURNAMENT_POINTS.champion} XP
          </p>
          {isCaos && (
            <p className="mt-1 text-[0.65rem] font-black uppercase tracking-[0.2em] text-accent">
              Remontar desde la carga +20 / +40 / +60 XP · Finalizar por
              sumisión +{CAOS_POINTS.finish} XP
            </p>
          )}
          {isCaos && (
            <p className="mt-2 text-[0.65rem] font-semibold opacity-60">
              {tournament.ranked === false ? (
                "Este bracket no puntúa: se pelea, pero no suma al ranking CAOS."
              ) : (
                <>
                  Cada pelea suma al{" "}
                  <Link
                    href="/dashboard/ranking/caos"
                    className="font-black text-accent hover:underline"
                  >
                    ranking CAOS
                  </Link>
                  .
                </>
              )}
            </p>
          )}
        </div>

        <TournamentBracket
          tournament={tournament}
          matches={matches ?? []}
          names={names}
          guestIds={guestIds}
          isAdmin={isAdmin}
          rolls={rolls}
        />
      </section>
    </main>
  );
}

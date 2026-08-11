import Link from "next/link";
import AcademyBadge from "@/components/rollprep/AcademyBadge";
import AcademyFilter from "@/components/rollprep/AcademyFilter";
import RankingTabs from "@/components/rollprep/RankingTabs";
import { createClient } from "@/libs/supabase/server";
import { academyFromRow } from "@/libs/academies";
import { formatXp } from "@/libs/gamification";
import {
  CAOS_BOARDS,
  CAOS_RANKING_MIGRATION,
  CAOS_RANK_POINTS,
  DEFAULT_CAOS_BOARD,
  isMissingCaosRanking,
  rankCaosBoard,
} from "@/libs/caos";

export const dynamic = "force-dynamic";

// La vista trae cada estadística tres veces (total, clase y circuito): se
// piden las tres y el tablero elegido decide cuál se lee.
const STAT_KEYS = ["pc", "fights", "wins", "submissions", "upsets", "titles"];

const COLUMNS = [
  "student_id",
  "full_name",
  "academy_id",
  "academy_name",
  "academy_slug",
  "academy_color",
  "last_fight_at",
  ...STAT_KEYS.flatMap((key) => [key, `${key}_class`, `${key}_circuit`]),
].join(", ");

// Ranking CAOS: el récord competitivo del modo, en Puntos de CAOS (PC).
// Nada que ver con el XP del gym — ver components/rollprep/RankingTabs.js.
export default async function RankingCaos({ searchParams }) {
  const { academia, tipo } = (await searchParams) ?? {};
  const board = CAOS_BOARDS[tipo] ? tipo : DEFAULT_CAOS_BOARD;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: rows, error } = await supabase
    .from("caos_leaderboard")
    .select(COLUMNS);

  // Sin la migración la consulta falla entera y el tablero llegaría vacío:
  // un ranking en cero se lee como "nadie ha peleado", que no es verdad.
  if (isMissingCaosRanking(error)) {
    return <MissingMigration message={error.message} />;
  }

  const ranking = rankCaosBoard(rows, board).map((row) => ({
    ...row,
    academy: academyFromRow(row),
  }));

  // Las academias que hoy tienen gente en ESTE tablero.
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
        className="display text-stroke pointer-events-none fixed -right-8 top-32 select-none text-[10rem] leading-none md:text-[14rem]"
      >
        CAOS
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
            <span>Récord del CAOS</span>
          </span>
        </div>

        <div className="rise rise-1">
          <h1 className="display text-5xl">
            Ranking CAOS<span className="text-accent">.</span>
          </h1>
          <p className="mt-1 text-sm font-medium opacity-70">
            Puntos de CAOS: se ganan peleando el modo, no estudiando. El
            cinturón va por otro lado.
          </p>
          {myIndex >= 0 && (
            <p className="mt-2 text-xs font-black uppercase tracking-[0.2em] text-accent">
              Tu posición: #{myIndex + 1} de {visible.length}
            </p>
          )}
        </div>

        <div className="rise rise-2">
          <RankingTabs active="caos" />
        </div>

        <div className="rise rise-2 space-y-2">
          <div className="flex flex-wrap gap-2">
            {Object.entries(CAOS_BOARDS).map(([key, meta]) => {
              const isActive = key === board;
              const params = new URLSearchParams();
              if (key !== DEFAULT_CAOS_BOARD) params.set("tipo", key);
              if (activeSlug) params.set("academia", activeSlug);
              const query = params.toString();

              return (
                <Link
                  key={key}
                  href={`/dashboard/ranking/caos${query ? `?${query}` : ""}`}
                  aria-current={isActive ? "page" : undefined}
                  className={`tag-skew border-2 px-3 py-1 text-[0.6rem] ${
                    isActive
                      ? "border-accent bg-accent text-accent-content"
                      : "border-base-300 opacity-60 hover:opacity-100"
                  }`}
                >
                  <span>{meta.label}</span>
                </Link>
              );
            })}
          </div>
          <p className="text-[0.65rem] font-semibold opacity-50">
            {CAOS_BOARDS[board].tagline}
          </p>
        </div>

        <div className="rise rise-2">
          <AcademyFilter
            academies={academies}
            activeSlug={activeSlug}
            basePath="/dashboard/ranking/caos"
            params={{ tipo: board === DEFAULT_CAOS_BOARD ? null : board }}
          />
        </div>

        {!visible.length && (
          <div className="rise rise-2 stripes border border-base-300 p-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest opacity-60">
              {activeSlug
                ? "Esta academia todavía no ha peleado en este tablero."
                : "Todavía no hay peleas CAOS aquí. Arma un torneo y rolea."}
            </p>
          </div>
        )}

        <div className="rise rise-2 space-y-2">
          {visible.map((row, index) => {
            const isMe = row.student_id === user.id;
            const isPodium = index < 3;

            return (
              <div
                key={row.student_id}
                className={`clip-cut relative flex items-center gap-4 border-2 p-4 ${
                  isMe
                    ? "border-accent bg-accent/10 shadow-[0_0_30px_-12px] shadow-accent/60"
                    : isPodium
                      ? "border-base-content/30 bg-base-200"
                      : "border-base-300 bg-base-200"
                }`}
              >
                <span
                  className={`display w-12 shrink-0 text-center text-3xl ${
                    index === 0
                      ? "text-accent"
                      : isPodium
                        ? "text-base-content"
                        : "text-stroke"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="display truncate text-xl">
                    {row.full_name || "Peleador"}
                    {isMe && <span className="ml-2 text-sm text-accent">(tú)</span>}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <AcademyBadge academy={row.academy} size="xs" />
                    <span className="text-[0.6rem] font-black uppercase tracking-widest">
                      {row.wins}
                      <span className="opacity-40">-</span>
                      {row.losses}
                    </span>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest opacity-50">
                      {row.submissions} sub · {row.upsets} remontadas
                      {row.titles > 0 &&
                        ` · ${row.titles} título${row.titles === 1 ? "" : "s"}`}
                    </span>
                  </div>
                </div>

                <span className="display shrink-0 text-2xl text-accent">
                  {formatXp(row.pc)}
                  <span className="ml-1 text-xs opacity-70">PC</span>
                </span>
              </div>
            );
          })}
        </div>

        <div className="rise rise-3 clip-cut border-2 border-base-300 bg-base-200 p-5">
          <p className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-accent">
            Cómo se cobran los PC
          </p>
          <ul className="mt-2 space-y-1 text-xs font-medium opacity-80">
            <li>· Pelear: +{CAOS_RANK_POINTS.fight} — ganes o pierdas.</li>
            <li>· Ganar: +{CAOS_RANK_POINTS.win}.</li>
            <li>
              · Ganar por sumisión: +{CAOS_RANK_POINTS.submission} extra.
            </li>
            <li>
              · Ganar cargando el OMEGA: +{CAOS_RANK_POINTS.upsetPerTier} por
              nivel de la carta ({CAOS_RANK_POINTS.upsetPerTier} /{" "}
              {CAOS_RANK_POINTS.upsetPerTier * 2} /{" "}
              {CAOS_RANK_POINTS.upsetPerTier * 3}).
            </li>
            <li>
              · Campeón: +{CAOS_RANK_POINTS.champion} · Finalista: +
              {CAOS_RANK_POINTS.finalist}.
            </li>
          </ul>
          <p className="mt-3 border-t border-base-300 pt-3 text-[0.65rem] font-semibold opacity-60">
            Solo rankea quien tiene cuenta. Los invitados pelean el bracket y
            pueden llevárselo, pero no tienen dónde acumular: el que quiera
            estar aquí, que se registre antes de que se sortee.
          </p>
        </div>
      </section>
    </main>
  );
}

// La base todavía no tiene las vistas del ranking CAOS.
function MissingMigration({ message }) {
  return (
    <main className="min-h-screen bg-base-100 p-4 text-base-content md:p-8">
      <section className="mx-auto max-w-xl space-y-4">
        <Link
          href="/dashboard/ranking"
          className="tile-cta text-[0.65rem] font-black uppercase tracking-[0.2em] opacity-60 hover:text-primary hover:opacity-100"
        >
          Ranking
        </Link>
        <div className="clip-cut border-2 border-error bg-error/10 p-5">
          <p className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-error">
            Falta una migración
          </p>
          <p className="mt-2 text-sm font-semibold">
            El ranking CAOS se calcula a partir de las peleas que ya están
            guardadas: no se perdió nada. Lo que falta es correr{" "}
            <code className="bg-base-300 px-1">{CAOS_RANKING_MIGRATION}</code>{" "}
            en el SQL Editor de Supabase. Se puede correr varias veces sin
            problema.
          </p>
          <p className="mt-2 text-xs font-medium opacity-60">{message}</p>
        </div>
      </section>
    </main>
  );
}

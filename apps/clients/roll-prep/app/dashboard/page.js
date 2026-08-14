import ButtonAccount from "@/components/ButtonAccount";
import PlayerHud from "@/components/rollprep/PlayerHud";
import DayStrip from "@/components/rollprep/DayStrip";
import MenuTile from "@/components/rollprep/MenuTile";
import { createClient } from "@/libs/supabase/server";
import { getProfileWithAcademy } from "@/libs/academies";
import {
  addDays,
  dateInTimezone,
  getVideoThumbnail,
  todayInTimezone,
} from "@/libs/rollprep";
import { getStudentPoints, getRank } from "@/libs/gamification";
import config from "@/config";

export const dynamic = "force-dynamic";

// Ventana de la tira de días: una semana atrás (lo que acaba de pasar) y dos
// hacia adelante (lo que viene). Tiene que coincidir con los props de DayStrip.
const STRIP_BACK = 4;
const STRIP_FORWARD = 10;

// Menú principal del alumno, estilo pantalla de selección de un videojuego
// de pelea: HUD del jugador arriba y tiles de modo abajo.
export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const todayKey = todayInTimezone();
  const stripFrom = addDays(todayKey, -STRIP_BACK);
  const stripTo = addDays(todayKey, STRIP_FORWARD);

  const [
    profile,
    { data: assignment },
    { data: poll },
    { count: libraryCount },
    { data: stripClasses },
    eventsResult,
  ] = await Promise.all([
    getProfileWithAcademy(supabase, user.id),
    supabase
      .from("assignments")
      .select("id, title, video_url, scheduled_for, created_at")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("polls")
      .select("id, question")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase.from("assignments").select("id", { count: "exact", head: true }),
    supabase
      .from("assignments")
      .select("id, title, video_url, scheduled_for, is_active")
      .gte("scheduled_for", stripFrom)
      .lte("scheduled_for", stripTo)
      .order("scheduled_for", { ascending: true }),
    supabase
      .from("tournaments")
      .select("id, title, mode, status, created_at, scheduled_for")
      .gte("scheduled_for", stripFrom)
      .lte("scheduled_for", stripTo)
      .order("scheduled_for", { ascending: true }),
  ]);

  let stripEvents = eventsResult.data;
  if (
    eventsResult.error?.code === "42703" &&
    /scheduled_for/.test(eventsResult.error.message ?? "")
  ) {
    const fallback = await supabase
      .from("tournaments")
      .select("id, title, mode, status, created_at")
      .gte("created_at", `${addDays(stripFrom, -1)}T00:00:00Z`)
      .lte("created_at", `${addDays(stripTo, 1)}T00:00:00Z`)
      .order("created_at", { ascending: true });
    stripEvents = fallback.data;
  }

  const [{ totalPoints }, completionRes, voteRes] = await Promise.all([
    getStudentPoints(supabase, user.id),
    assignment
      ? supabase
          .from("assignment_completions")
          .select("completed_at")
          .eq("assignment_id", assignment.id)
          .eq("student_id", user.id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    poll
      ? supabase
          .from("poll_votes")
          .select("option_id")
          .eq("poll_id", poll.id)
          .eq("student_id", user.id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const isCompleted = Boolean(completionRes?.data);
  const hasVoted = Boolean(voteRes?.data);
  const splashUrl = assignment ? getVideoThumbnail(assignment.video_url) : null;
  const { belt } = getRank(totalPoints);

  // Clases y topes en un solo formato para la tira de días. Cada carta lleva
  // su splash art: la miniatura del video en las clases, rayas en los topes.
  const stripItems = [
    ...(stripClasses ?? []).map((a) => ({
      id: `class-${a.id}`,
      date: a.scheduled_for,
      kind: "class",
      title: a.title,
      href: `/dashboard/clase/${a.id}`,
      live: a.is_active,
      splashUrl: getVideoThumbnail(a.video_url),
    })),
    ...(stripEvents ?? []).map((t) => {
      const date = t.scheduled_for ?? dateInTimezone(t.created_at);
      return {
        id: `event-${t.id}`,
        date,
        kind: "event",
        title: t.title,
        href: `/dashboard/torneos/${t.id}`,
        live:
          t.status === "active" ||
          (t.status === "scheduled" && date === todayKey),
        splashUrl: null,
      };
    }),
  ].filter((item) => item.date && item.date >= stripFrom && item.date <= stripTo);

  const today = new Intl.DateTimeFormat("es-VE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: config.timezone,
  }).format(new Date());

  return (
    <main className="relative min-h-screen overflow-hidden bg-base-100 p-4 text-base-content md:p-8">
      {/* Palabra gigante de fondo, puro fighting game */}
      <span
        aria-hidden="true"
        className="display text-stroke pointer-events-none fixed -right-8 top-24 select-none text-[11rem] leading-none md:text-[16rem]"
      >
        OSS
      </span>

      <section className="relative z-10 mx-auto max-w-xl space-y-5">
        <div className="rise rise-1 relative z-50 flex items-center justify-between">
          <div>
            <h1 className="display text-3xl">
              Roll<span className="text-primary">Prep</span>
            </h1>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.25em] opacity-50">
              {today}
            </p>
          </div>
          <ButtonAccount />
        </div>

        <div className="rise rise-2">
          <PlayerHud
            fullName={profile?.full_name}
            totalPoints={totalPoints}
            academy={profile?.academy}
          />
        </div>

        <div className="rise rise-3">
          <DayStrip
            todayKey={todayKey}
            items={stripItems}
            back={STRIP_BACK}
            forward={STRIP_FORWARD}
          />
        </div>

        <div className="rise rise-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          {/* 01 — Clase de hoy (hero, ocupa las 2 columnas) */}
          <div className="md:col-span-2">
            {assignment ? (
              <MenuTile
                hero
                href="/dashboard/clase"
                index={1}
                kicker="La clase de hoy"
                title={assignment.title}
                description="Video, notas del profesor y comentarios"
                splashUrl={splashUrl}
                chip={isCompleted ? "Completada" : "+50 XP"}
                chipTone={isCompleted ? "done" : "primary"}
              />
            ) : (
              <div className="clip-cut stripes relative min-h-52 border-2 border-base-300 bg-base-200 p-5 md:min-h-64">
                <span
                  aria-hidden="true"
                  className="display text-stroke pointer-events-none absolute -bottom-4 right-1 select-none text-9xl"
                >
                  01
                </span>
                <span className="tag-skew bg-secondary px-2 py-0.5 text-[0.6rem] text-secondary-content">
                  <span>La clase de hoy</span>
                </span>
                <p className="display mt-8 text-4xl opacity-60">Día de descanso</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-widest opacity-50">
                  El profesor aún no publica la próxima clase
                </p>
              </div>
            )}
          </div>

          {/* 02 — Ranking */}
          <MenuTile
            href="/dashboard/ranking"
            index={2}
            kicker="Competencia"
            title="Ranking"
            description="Dos tableros: el XP del gym y el récord del CAOS"
          />

          {/* 03 — Torneos */}
          <MenuTile
            href="/dashboard/torneos"
            index={3}
            kicker="Tatami"
            title="Torneos"
            description="Topes de clase y circuitos CAOS"
          />

          {/* 04 — Calendario */}
          <MenuTile
            href="/dashboard/calendario"
            index={4}
            kicker="Agenda"
            title="Calendario"
            description="Clases y topes del mes, día por día"
          />

          {/* 05 — Votación */}
          <MenuTile
            href="/dashboard/votar"
            index={5}
            kicker="Votación"
            title="Votar"
            description={
              poll
                ? poll.question
                : "No hay votación abierta por ahora"
            }
            chip={poll ? (hasVoted ? "Votaste" : "+10 XP") : null}
            chipTone={hasVoted ? "done" : "accent"}
          />

          {/* 06 — Videoteca */}
          <MenuTile
            href="/dashboard/videoteca"
            index={6}
            kicker="Archivo"
            title="Videoteca"
            description={`${libraryCount ?? 0} clases en el archivo técnico`}
          />

          {/* 07 — Perfil */}
          <MenuTile
            href="/dashboard/perfil"
            index={7}
            kicker="Jugador"
            title="Mi perfil"
            description={`${belt.short} · historial de XP y datos`}
          />
        </div>
      </section>
    </main>
  );
}

import ButtonAccount from "@/components/ButtonAccount";
import VideoEmbed from "@/components/rollprep/VideoEmbed";
import CompleteAssignmentButton from "@/components/rollprep/CompleteAssignmentButton";
import PollVoteCards from "@/components/rollprep/PollVoteCards";
import { createClient } from "@/libs/supabase/server";
import { resolveDashboardMode } from "@/libs/rollprep";

export const dynamic = "force-dynamic";

// Dashboard del Alumno (mobile-first).
// La vista alterna según el día de la semana y el estado activo en la DB:
// - Martes a jueves → Modo Tarea: video asignado + botón "Visto y Estudiado".
// - Jueves a martes → Modo Votación: 3 tarjetas para elegir el próximo tema.
export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: assignment }, { data: poll }] = await Promise.all([
    supabase
      .from("assignments")
      .select("id, title, video_url, notes, created_at")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("polls")
      .select("id, question, created_at, poll_options (id, title, description)")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const mode = resolveDashboardMode({ assignment, poll });

  let completion = null;
  let currentVote = null;

  if (mode === "task") {
    ({ data: completion } = await supabase
      .from("assignment_completions")
      .select("completed_at")
      .eq("assignment_id", assignment.id)
      .eq("student_id", user.id)
      .maybeSingle());
  } else if (mode === "poll") {
    ({ data: currentVote } = await supabase
      .from("poll_votes")
      .select("option_id")
      .eq("poll_id", poll.id)
      .eq("student_id", user.id)
      .maybeSingle());
  }

  return (
    <main className="relative min-h-screen bg-base-100 p-4 text-base-content md:p-8">
      <section className="relative z-10 mx-auto max-w-xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="display text-3xl">
            Roll<span className="text-primary">Prep</span>
          </h1>
          <ButtonAccount />
        </div>

        {mode === "task" && (
          <div className="space-y-5">
            <span className="tag-skew rise rise-1 bg-primary px-3 py-1 text-xs text-primary-content">
              <span>Tarea de la semana</span>
            </span>

            <h2 className="display rise rise-2 text-4xl md:text-5xl">
              {assignment.title}
            </h2>

            <div className="rise rise-3">
              <VideoEmbed
                videoUrl={assignment.video_url}
                title={assignment.title}
              />
            </div>

            {assignment.notes && (
              <div className="rise rise-4 border-l-4 border-primary bg-base-200 p-4">
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-primary">
                  Notas del profesor
                </p>
                <p className="whitespace-pre-line text-sm leading-relaxed opacity-80">
                  {assignment.notes}
                </p>
              </div>
            )}

            <div className="rise rise-5">
              <CompleteAssignmentButton
                assignmentId={assignment.id}
                isCompleted={Boolean(completion)}
              />
            </div>
          </div>
        )}

        {mode === "poll" && (
          <div className="space-y-5">
            <span className="tag-skew rise rise-1 bg-secondary px-3 py-1 text-xs text-secondary-content">
              <span>Votación abierta</span>
            </span>

            <h2 className="display rise rise-2 text-4xl md:text-5xl">
              {poll.question}
            </h2>

            <p className="rise rise-3 text-sm font-medium opacity-70">
              Elige el tema que quieres estudiar en la próxima clase.
            </p>

            <div className="rise rise-4">
              <PollVoteCards
                poll={poll}
                options={poll.poll_options}
                currentVoteOptionId={currentVote?.option_id ?? null}
              />
            </div>
          </div>
        )}

        {mode === "empty" && (
          <div className="rise rise-2 relative overflow-hidden border border-base-300 bg-base-200 p-10 text-center">
            <span
              aria-hidden="true"
              className="display text-stroke pointer-events-none absolute -bottom-6 -right-2 select-none text-8xl"
            >
              REST
            </span>
            <h2 className="display text-3xl">Día de descanso</h2>
            <p className="mt-3 text-sm font-medium opacity-70">
              El profesor todavía no ha publicado la tarea ni la votación.
              Mientras tanto, repasa la videoteca.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

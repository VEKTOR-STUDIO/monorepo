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
    <main className="min-h-screen p-4 md:p-8">
      <section className="mx-auto max-w-xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold">RollPrep 🥋</h1>
          <ButtonAccount />
        </div>

        {mode === "task" && (
          <div className="space-y-5">
            <div className="badge badge-primary badge-outline">
              📋 Tarea de la semana
            </div>
            <h2 className="text-3xl font-extrabold leading-tight">
              {assignment.title}
            </h2>

            <VideoEmbed videoUrl={assignment.video_url} title={assignment.title} />

            {assignment.notes && (
              <div className="rounded-2xl bg-base-200 p-4">
                <p className="text-sm font-semibold mb-1">Notas del profesor</p>
                <p className="text-sm opacity-80 whitespace-pre-line">
                  {assignment.notes}
                </p>
              </div>
            )}

            <CompleteAssignmentButton
              assignmentId={assignment.id}
              isCompleted={Boolean(completion)}
            />
          </div>
        )}

        {mode === "poll" && (
          <div className="space-y-5">
            <div className="badge badge-secondary badge-outline">
              🗳️ Votación abierta
            </div>
            <h2 className="text-3xl font-extrabold leading-tight">
              {poll.question}
            </h2>
            <p className="opacity-70">
              Elige el tema que quieres estudiar en la próxima clase.
            </p>

            <PollVoteCards
              poll={poll}
              options={poll.poll_options}
              currentVoteOptionId={currentVote?.option_id ?? null}
            />
          </div>
        )}

        {mode === "empty" && (
          <div className="rounded-2xl bg-base-200 p-10 text-center space-y-3">
            <p className="text-5xl">🧘</p>
            <h2 className="text-xl font-bold">Nada pendiente por ahora</h2>
            <p className="opacity-70">
              El profesor todavía no ha publicado la tarea ni la votación.
              Mientras tanto, repasa la videoteca.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

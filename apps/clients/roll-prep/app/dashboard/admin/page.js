import AdminAssignmentForm from "@/components/rollprep/AdminAssignmentForm";
import AdminPollForm from "@/components/rollprep/AdminPollForm";
import AdminLiveRefresh from "@/components/rollprep/AdminLiveRefresh";
import { createClient } from "@/libs/supabase/server";

export const dynamic = "force-dynamic";

// Dashboard del Profesor (panel de control):
// - Asignar la tarea en curso (video, título, notas).
// - Crear la votación del fin de semana (3 opciones).
// - Métricas: quién completó la tarea activa y conteo de votos en vivo.
export default async function AdminPanel() {
  const supabase = await createClient();

  const [{ data: assignment }, { data: poll }, { count: studentCount }] =
    await Promise.all([
      supabase
        .from("assignments")
        .select("id, title, created_at")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("polls")
        .select("id, question, created_at, poll_options (id, title)")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("role", "student"),
    ]);

  const [{ data: completions }, { data: votes }] = await Promise.all([
    assignment
      ? supabase
          .from("assignment_completions")
          .select("completed_at, profiles:student_id (full_name)")
          .eq("assignment_id", assignment.id)
          .order("completed_at", { ascending: true })
      : Promise.resolve({ data: [] }),
    poll
      ? supabase
          .from("poll_votes")
          .select("option_id")
          .eq("poll_id", poll.id)
      : Promise.resolve({ data: [] }),
  ]);

  const voteCounts = (votes ?? []).reduce((acc, vote) => {
    acc[vote.option_id] = (acc[vote.option_id] ?? 0) + 1;
    return acc;
  }, {});
  const totalVotes = votes?.length ?? 0;

  return (
    <main className="min-h-screen bg-base-100 p-4 text-base-content md:p-8">
      <AdminLiveRefresh />

      <section className="mx-auto max-w-3xl space-y-10">
        <div className="rise rise-1">
          <span className="tag-skew bg-primary px-3 py-1 text-xs text-primary-content">
            <span>Coach mode</span>
          </span>
          <h1 className="display mt-4 text-5xl">
            Panel del <span className="text-primary">Profesor</span>
          </h1>
          <p className="mt-2 text-sm font-semibold uppercase tracking-widest opacity-60">
            {studentCount ?? 0} alumno{studentCount === 1 ? "" : "s"} en el
            equipo
          </p>
        </div>

        {/* ------------------------------ MÉTRICAS ------------------------ */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rise rise-2 border border-base-300 bg-base-200">
            <div className="border-b border-base-300 px-6 py-4">
              <h2 className="display text-xl">Tarea activa</h2>
            </div>
            <div className="space-y-4 p-6">
              {assignment ? (
                <>
                  <p className="font-semibold">{assignment.title}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="display text-6xl text-primary">
                      {completions?.length ?? 0}
                    </span>
                    <span className="display text-stroke text-3xl">
                      / {studentCount ?? 0}
                    </span>
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest opacity-60">
                    Marcaron &ldquo;Visto y Estudiado&rdquo;
                  </p>
                  <ul className="space-y-2 text-sm">
                    {completions?.map((completion, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 border-l-2 border-primary bg-base-100 px-3 py-2"
                      >
                        <span className="font-semibold">
                          {completion.profiles?.full_name ?? "Alumno"}
                        </span>
                        <span className="ml-auto text-xs font-semibold uppercase tracking-wider opacity-50">
                          {new Date(completion.completed_at).toLocaleDateString(
                            "es-VE",
                            { day: "numeric", month: "short" }
                          )}
                        </span>
                      </li>
                    ))}
                    {!completions?.length && (
                      <li className="text-sm opacity-60">
                        Nadie la ha completado aún.
                      </li>
                    )}
                  </ul>
                </>
              ) : (
                <p className="text-sm opacity-60">No hay tarea activa.</p>
              )}
            </div>
          </div>

          <div className="rise rise-3 border border-base-300 bg-base-200">
            <div className="flex items-center justify-between border-b border-base-300 px-6 py-4">
              <h2 className="display text-xl">Votación activa</h2>
              {poll && (
                <span className="tag-skew bg-primary px-2 py-0.5 text-[0.65rem] text-primary-content">
                  <span>En vivo</span>
                </span>
              )}
            </div>
            <div className="space-y-4 p-6">
              {poll ? (
                <>
                  <p className="font-semibold">{poll.question}</p>
                  <div className="space-y-4">
                    {poll.poll_options.map((option) => {
                      const count = voteCounts[option.id] ?? 0;
                      const pct = totalVotes
                        ? Math.round((count / totalVotes) * 100)
                        : 0;

                      return (
                        <div key={option.id}>
                          <div className="mb-1 flex justify-between text-sm">
                            <span className="font-semibold">
                              {option.title}
                            </span>
                            <span className="display text-primary">
                              {count} ({pct}%)
                            </span>
                          </div>
                          <div className="h-2 w-full bg-base-300">
                            <div
                              className="h-full bg-primary transition-all duration-500"
                              style={{
                                width: `${
                                  totalVotes ? (count / totalVotes) * 100 : 0
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest opacity-50">
                    {totalVotes} voto{totalVotes === 1 ? "" : "s"} en total
                  </p>
                </>
              ) : (
                <p className="text-sm opacity-60">No hay votación activa.</p>
              )}
            </div>
          </div>
        </div>

        {/* ------------------------------ FORMULARIOS --------------------- */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rise rise-4 border border-base-300 bg-base-200">
            <div className="border-b border-base-300 px-6 py-4">
              <h2 className="display text-xl">Nueva tarea</h2>
              <p className="mt-1 text-xs font-medium opacity-60">
                Reemplaza la tarea activa. Los alumnos la verán de martes a
                jueves.
              </p>
            </div>
            <div className="p-6">
              <AdminAssignmentForm />
            </div>
          </div>

          <div className="rise rise-5 border border-base-300 bg-base-200">
            <div className="border-b border-base-300 px-6 py-4">
              <h2 className="display text-xl">Nueva votación</h2>
              <p className="mt-1 text-xs font-medium opacity-60">
                Reemplaza la votación activa. Los alumnos votan de jueves a
                martes.
              </p>
            </div>
            <div className="p-6">
              <AdminPollForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

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
    <main className="min-h-screen p-4 md:p-8">
      <AdminLiveRefresh />

      <section className="mx-auto max-w-3xl space-y-10">
        <div>
          <h1 className="text-2xl font-extrabold">Panel del Profesor 📊</h1>
          <p className="opacity-70">
            {studentCount ?? 0} alumno{studentCount === 1 ? "" : "s"} registrado
            {studentCount === 1 ? "" : "s"}
          </p>
        </div>

        {/* ------------------------------ MÉTRICAS ------------------------ */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="card bg-base-100 border border-base-300">
            <div className="card-body">
              <h2 className="card-title text-lg">📋 Tarea activa</h2>
              {assignment ? (
                <>
                  <p className="font-medium">{assignment.title}</p>
                  <div className="stat p-0">
                    <div className="stat-value text-primary text-3xl">
                      {completions?.length ?? 0}
                      <span className="text-base font-normal opacity-60">
                        {" "}
                        / {studentCount ?? 0}
                      </span>
                    </div>
                    <div className="stat-desc">marcaron “Visto y Estudiado”</div>
                  </div>
                  <ul className="mt-2 space-y-1 text-sm">
                    {completions?.map((completion, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-success">✓</span>
                        <span>{completion.profiles?.full_name ?? "Alumno"}</span>
                        <span className="ml-auto opacity-50 text-xs">
                          {new Date(completion.completed_at).toLocaleDateString(
                            "es-VE",
                            { day: "numeric", month: "short" }
                          )}
                        </span>
                      </li>
                    ))}
                    {!completions?.length && (
                      <li className="opacity-60">Nadie la ha completado aún.</li>
                    )}
                  </ul>
                </>
              ) : (
                <p className="opacity-60">No hay tarea activa.</p>
              )}
            </div>
          </div>

          <div className="card bg-base-100 border border-base-300">
            <div className="card-body">
              <h2 className="card-title text-lg">
                🗳️ Votación activa
                <span className="badge badge-success badge-sm">en vivo</span>
              </h2>
              {poll ? (
                <>
                  <p className="font-medium">{poll.question}</p>
                  <div className="mt-2 space-y-3">
                    {poll.poll_options.map((option) => {
                      const count = voteCounts[option.id] ?? 0;
                      const pct = totalVotes
                        ? Math.round((count / totalVotes) * 100)
                        : 0;

                      return (
                        <div key={option.id}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{option.title}</span>
                            <span className="font-bold">
                              {count} ({pct}%)
                            </span>
                          </div>
                          <progress
                            className="progress progress-secondary w-full"
                            value={count}
                            max={Math.max(totalVotes, 1)}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-xs opacity-60 mt-1">
                    {totalVotes} voto{totalVotes === 1 ? "" : "s"} en total
                  </p>
                </>
              ) : (
                <p className="opacity-60">No hay votación activa.</p>
              )}
            </div>
          </div>
        </div>

        {/* ------------------------------ FORMULARIOS --------------------- */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="card bg-base-100 border border-base-300">
            <div className="card-body">
              <h2 className="card-title text-lg">Nueva tarea</h2>
              <p className="text-sm opacity-60">
                Reemplaza la tarea activa. Los alumnos la verán de martes a
                jueves.
              </p>
              <AdminAssignmentForm />
            </div>
          </div>

          <div className="card bg-base-100 border border-base-300">
            <div className="card-body">
              <h2 className="card-title text-lg">Nueva votación</h2>
              <p className="text-sm opacity-60">
                Reemplaza la votación activa. Los alumnos votan de jueves a
                martes.
              </p>
              <AdminPollForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

import Link from "next/link";
import AdminAssignmentForm from "@/components/rollprep/AdminAssignmentForm";
import AdminAssignmentsList from "@/components/rollprep/AdminAssignmentsList";
import AdminPollForm from "@/components/rollprep/AdminPollForm";
import AdminLiveRefresh from "@/components/rollprep/AdminLiveRefresh";
import { createClient } from "@/libs/supabase/server";

export const dynamic = "force-dynamic";

// Dashboard del Profesor (panel de control):
// - Publicar / editar clases (video, título, notas, fecha).
// - Crear la votación del fin de semana (3 opciones).
// - Métricas: quién completó la tarea activa y conteo de votos en vivo.
export default async function AdminPanel() {
  const supabase = await createClient();

  const [
    { data: assignment },
    { data: allAssignments },
    { data: poll },
    { count: studentCount },
  ] = await Promise.all([
    supabase
      .from("assignments")
      .select("id, title, scheduled_for, created_at")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("assignments")
      .select("id, title, video_url, notes, scheduled_for, is_active, created_at")
      .order("scheduled_for", { ascending: false })
      .order("created_at", { ascending: false }),
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

        {/* ------------------------------ USUARIOS ------------------------ */}
        <Link
          href="/dashboard/admin/usuarios"
          className="rise rise-2 flex items-center justify-between gap-4 border border-base-300 bg-base-200 p-6 transition-colors hover:border-primary"
        >
          <div>
            <h2 className="display text-xl">
              Usuarios<span className="text-primary">.</span>
            </h2>
            <p className="mt-1 text-xs font-medium opacity-60">
              Nombre, academia y rol de cada quien. También das de baja cuentas.
            </p>
          </div>
          <span className="display shrink-0 text-4xl text-primary">
            {studentCount ?? 0}
          </span>
        </Link>

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
                  {assignment.scheduled_for && (
                    <p className="text-xs font-bold uppercase tracking-widest text-primary">
                      {new Date(
                        `${assignment.scheduled_for}T12:00:00`
                      ).toLocaleDateString("es-VE", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </p>
                  )}
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
              <h2 className="display text-xl">Nueva clase</h2>
              <p className="mt-1 text-xs font-medium opacity-60">
                Define título, video, notas y la fecha en el calendario. Si la
                marcas activa, reemplaza la clase de hoy.
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

        {/* ------------------------------ HISTORIAL DE CLASES ------------- */}
        <div className="rise rise-5 border border-base-300 bg-base-200">
          <div className="border-b border-base-300 px-6 py-4">
            <h2 className="display text-xl">Todas las clases</h2>
            <p className="mt-1 text-xs font-medium opacity-60">
              Edita fechas, contenido o cuál es la clase activa. Sirve para
              corregir clases pasadas y alinear el calendario.
            </p>
          </div>
          <AdminAssignmentsList assignments={allAssignments ?? []} />
        </div>
      </section>
    </main>
  );
}

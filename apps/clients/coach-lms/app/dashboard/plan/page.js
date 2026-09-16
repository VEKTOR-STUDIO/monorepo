import Link from "next/link";
import { redirect } from "next/navigation";
import {
  getCompletedWorkoutIds,
  getCurrentUser,
  getMyAssignments,
  LEVELS,
} from "@/libs/training";
import config from "@/config";

export const dynamic = "force-dynamic";

export const metadata = { title: `Mi plan | ${config.appName}` };

const STATUS_LABEL = {
  activo: "En curso",
  pausado: "En pausa",
  terminado: "Terminado",
};

export default async function MyPlanPage() {
  const { user } = await getCurrentUser();
  if (!user) redirect(config.auth.loginUrl);

  const [assignments, completed] = await Promise.all([
    getMyAssignments(user.id),
    getCompletedWorkoutIds(user.id),
  ]);

  if (assignments.length === 0) {
    return (
      <div className="border border-dashed border-base-300 p-10 text-center">
        <h1 className="display text-3xl text-base-content">Aún no tienes plan</h1>
        <p className="mx-auto mt-3 max-w-md text-base-content/60">
          Cuando el coach te asigne un plan de entrenamiento aparecerá aquí, con todas sus
          sesiones y ejercicios.
        </p>
        <Link href="/dashboard/biblioteca" className="btn btn-primary mt-6">
          Mientras tanto, mira los ejercicios
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <header>
        <h1 className="display text-4xl text-base-content sm:text-5xl">Mi plan</h1>
        <p className="mt-2 text-base-content/60">
          Marca cada sesión al terminarla: así sumas XP y el coach ve tu progreso.
        </p>
      </header>

      {assignments.map((assignment) => {
        const program = assignment.programs;
        const workouts = program.workouts || [];
        const done = workouts.filter((workout) => completed.has(workout.id)).length;
        const percent = workouts.length
          ? Math.round((done / workouts.length) * 100)
          : 0;

        return (
          <section key={assignment.id} className="border border-base-300 bg-base-200/40">
            <div className="border-b border-base-300 p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-base-content/45">
                <span
                  className={`px-2 py-0.5 ${
                    assignment.status === "activo"
                      ? "bg-primary/15 text-primary"
                      : "bg-base-300 text-base-content/60"
                  }`}
                >
                  {STATUS_LABEL[assignment.status]}
                </span>
                {program.category && <span>{program.category}</span>}
                {LEVELS.includes(program.level) && <span>· {program.level}</span>}
                {program.duration_weeks && <span>· {program.duration_weeks} semanas</span>}
              </div>

              <h2 className="display mt-2 text-3xl text-base-content">{program.title}</h2>
              {program.subtitle && (
                <p className="mt-1 text-base-content/70">{program.subtitle}</p>
              )}

              {assignment.notes && (
                <p className="mt-3 border-l-2 border-accent pl-3 text-sm text-base-content/70">
                  <span className="font-bold uppercase tracking-wide text-accent">
                    Nota del coach:{" "}
                  </span>
                  {assignment.notes}
                </p>
              )}

              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-base-content/50">
                  <span>
                    {done} de {workouts.length} sesiones hechas
                  </span>
                  <span>{percent}%</span>
                </div>
                <div className="mt-1 h-2 w-full bg-base-300">
                  <div className="h-full bg-primary" style={{ width: `${percent}%` }} />
                </div>
              </div>
            </div>

            <ul className="divide-y divide-base-300">
              {workouts.map((workout) => {
                const lastDone = completed.get(workout.id);
                return (
                  <li
                    key={workout.id}
                    className="flex flex-wrap items-center gap-3 p-4 sm:p-5"
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center border text-lg ${
                        lastDone
                          ? "border-primary bg-primary/15 text-primary"
                          : "border-base-300 text-base-content/30"
                      }`}
                      aria-hidden="true"
                    >
                      {lastDone ? "✓" : "•"}
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-base-content">{workout.title}</p>
                      <p className="text-xs text-base-content/50">
                        {workout.focus ? `${workout.focus}` : ""}
                        {workout.duration_minutes
                          ? `${workout.focus ? " · " : ""}${workout.duration_minutes} min`
                          : ""}
                        {lastDone
                          ? ` · última vez ${new Date(
                              `${lastDone}T12:00:00`
                            ).toLocaleDateString("es", { day: "numeric", month: "short" })}`
                          : ""}
                      </p>
                    </div>

                    <Link
                      href={`/dashboard/sesion/${workout.id}?plan=${assignment.id}`}
                      className={`btn btn-sm shrink-0 ${
                        lastDone ? "btn-ghost border border-base-300" : "btn-primary"
                      }`}
                    >
                      {lastDone ? "Repetir" : "Empezar"}
                    </Link>
                  </li>
                );
              })}

              {workouts.length === 0 && (
                <li className="p-6 text-center text-sm text-base-content/50">
                  Este plan todavía no tiene sesiones cargadas.
                </li>
              )}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

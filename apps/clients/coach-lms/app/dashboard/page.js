import Link from "next/link";
import { redirect } from "next/navigation";
import ActiveAppointment from "@/components/ActiveAppointment";
import GameStats from "@/components/training/GameStats";
import {
  displayNameOf,
  getActiveAppointment,
  getAthleteStats,
  getCompletedWorkoutIds,
  getCurrentUser,
  getMyAssignments,
  getRecentLogs,
} from "@/libs/training";
import config from "@/config";

export const dynamic = "force-dynamic";

const EFFORT_LABEL = (value) => {
  if (!value) return null;
  if (value <= 3) return "suave";
  if (value <= 6) return "llevadera";
  if (value <= 8) return "dura";
  return "al límite";
};

export default async function AthleteHome() {
  const { user, profile, isAdmin } = await getCurrentUser();
  if (!user) redirect(config.auth.loginUrl);

  const [stats, assignments, completed, logs, appointment] = await Promise.all([
    getAthleteStats(user.id),
    getMyAssignments(user.id),
    getCompletedWorkoutIds(user.id),
    getRecentLogs(user.id, 6),
    getActiveAppointment(user.id),
  ]);

  // La "próxima sesión" es la primera del plan activo que aún no ha registrado.
  const activePlan = assignments.find((assignment) => assignment.status === "activo");
  const nextWorkout = activePlan?.programs?.workouts?.find(
    (workout) => !completed.has(workout.id)
  );

  const name = displayNameOf(user, profile);
  const today = new Date().toISOString().slice(0, 10);
  const trainedToday = stats.last_workout_on === today;

  return (
    <div className="space-y-8">
      {isAdmin && (
        <div className="flex flex-wrap items-center justify-between gap-3 border border-accent/40 bg-accent/10 px-4 py-3">
          <p className="text-sm text-base-content/80">
            Estás viendo la pantalla del alumno. Tu panel de entrenador está aparte.
          </p>
          <Link href="/admin" className="btn btn-sm btn-primary">
            Ir al panel del entrenador
          </Link>
        </div>
      )}

      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-primary">
          {trainedToday ? "Hoy ya entrenaste" : "Tu área de entrenamiento"}
        </p>
        <h1 className="display mt-1 text-4xl text-base-content sm:text-5xl">
          Hola, {name.split(" ")[0]}
        </h1>
      </header>

      <GameStats stats={stats} />

      {/* Cita presencial reservada, si la hay. */}
      {appointment && <ActiveAppointment appointment={appointment} />}

      {/* ------------------------------------------------ próxima sesión --- */}
      <section>
        <h2 className="display mb-3 text-2xl text-base-content">Tu próxima sesión</h2>

        {nextWorkout ? (
          <div className="border border-primary/40 bg-primary/5 p-5 sm:p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-base-content/50">
              {activePlan.programs.title}
            </p>
            <h3 className="display mt-1 text-3xl text-base-content">{nextWorkout.title}</h3>
            {nextWorkout.description && (
              <p className="mt-2 max-w-2xl text-sm text-base-content/70">
                {nextWorkout.description}
              </p>
            )}
            <p className="mt-3 text-sm text-base-content/50">
              {nextWorkout.focus ? `Foco: ${nextWorkout.focus}` : ""}
              {nextWorkout.duration_minutes
                ? `${nextWorkout.focus ? " · " : ""}${nextWorkout.duration_minutes} minutos`
                : ""}
            </p>
            <Link
              href={`/dashboard/sesion/${nextWorkout.id}?plan=${activePlan.id}`}
              className="btn btn-primary mt-5"
            >
              Empezar esta sesión
            </Link>
          </div>
        ) : activePlan ? (
          <div className="border border-base-300 bg-base-200/40 p-6">
            <p className="display text-2xl text-base-content">
              Terminaste todas las sesiones de tu plan
            </p>
            <p className="mt-2 text-sm text-base-content/60">
              Habla con Frank para el siguiente bloque, o repite una sesión desde tu plan.
            </p>
            <Link href="/dashboard/plan" className="btn btn-ghost mt-4 border border-base-300">
              Ver mi plan
            </Link>
          </div>
        ) : (
          <div className="border border-dashed border-base-300 p-8 text-center">
            <p className="display text-2xl text-base-content">
              Todavía no tienes un plan asignado
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm text-base-content/60">
              Frank te asignará tu plan de entrenamiento. Mientras tanto, puedes mirar el
              libro de ejercicios y ver cómo se hace cada movimiento.
            </p>
            <Link href="/dashboard/biblioteca" className="btn btn-primary mt-5">
              Ver el libro de ejercicios
            </Link>
          </div>
        )}
      </section>

      {/* ------------------------------------------------------ historial --- */}
      <section>
        <div className="mb-3 flex items-end justify-between gap-4">
          <h2 className="display text-2xl text-base-content">Últimas sesiones</h2>
          <Link
            href="/dashboard/ranking"
            className="text-sm font-semibold text-primary hover:underline"
          >
            Ver ranking →
          </Link>
        </div>

        {logs.length === 0 ? (
          <p className="border border-dashed border-base-300 p-8 text-center text-base-content/60">
            Aquí irán apareciendo tus sesiones a medida que las registres.
          </p>
        ) : (
          <ul className="divide-y divide-base-300 border border-base-300">
            {logs.map((log) => (
              <li key={log.id} className="flex flex-wrap items-center gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-base-content">
                    {log.workouts?.title || "Sesión libre"}
                  </p>
                  <p className="text-xs text-base-content/50">
                    {new Date(`${log.performed_on}T12:00:00`).toLocaleDateString("es", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                    {log.duration_minutes ? ` · ${log.duration_minutes} min` : ""}
                    {log.perceived_effort ? ` · ${EFFORT_LABEL(log.perceived_effort)}` : ""}
                    {log.status === "parcial" ? " · parcial" : ""}
                  </p>
                  {log.notes && (
                    <p className="mt-1 text-sm italic text-base-content/60">
                      &ldquo;{log.notes}&rdquo;
                    </p>
                  )}
                </div>
                <span className="display shrink-0 text-xl text-primary">
                  +{log.xp_awarded}
                  <span className="ml-1 text-xs text-base-content/40">XP</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

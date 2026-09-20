import Link from "next/link";
import { getCoachOverview } from "@/libs/training";

export const dynamic = "force-dynamic";

const Tile = ({ label, value, hint, href }) => {
  const content = (
    <div className="h-full border border-base-300 bg-base-200/60 p-5 transition-colors hover:border-primary/50">
      <p className="text-[11px] uppercase tracking-[0.14em] text-base-content/45">{label}</p>
      <p className="display mt-1 text-4xl text-base-content">{value}</p>
      {hint && <p className="mt-1 text-xs text-base-content/50">{hint}</p>}
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : content;
};

export default async function AdminHome() {
  const overview = await getCoachOverview();

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-primary">Panel del entrenador</p>
        <h1 className="display mt-1 text-4xl text-base-content sm:text-5xl">
          Cómo va la semana
        </h1>
      </header>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Tile
          label="Alumnos"
          value={overview.athleteCount}
          hint="registrados en la web"
          href="/admin/alumnos"
        />
        <Tile
          label="Planes activos"
          value={overview.activeAssignments}
          hint={`sobre ${overview.programCount} planes creados`}
          href="/admin/programas"
        />
        <Tile
          label="Sesiones"
          value={overview.weekSessions}
          hint="en los últimos 7 días"
        />
        <Tile
          label="Minutos"
          value={overview.weekMinutes.toLocaleString("es")}
          hint="entrenados por todos"
        />
      </div>

      {/* -------------------------------------------------- accesos rápidos --- */}
      <section className="grid gap-3 sm:grid-cols-3">
        <Link
          href="/admin/programas"
          className="border border-primary/40 bg-primary/5 p-5 transition-colors hover:bg-primary/10"
        >
          <p className="display text-2xl text-base-content">Crear un plan</p>
          <p className="mt-1 text-sm text-base-content/60">
            Arma las sesiones y elige los ejercicios del libro.
          </p>
        </Link>
        <Link
          href="/admin/alumnos"
          className="border border-base-300 bg-base-200/60 p-5 transition-colors hover:border-primary/50"
        >
          <p className="display text-2xl text-base-content">Asignar a un alumno</p>
          <p className="mt-1 text-sm text-base-content/60">
            Entra en su ficha y elige qué plan le toca.
          </p>
        </Link>
        <Link
          href="/admin/citas"
          className="border border-base-300 bg-base-200/60 p-5 transition-colors hover:border-primary/50"
        >
          <p className="display text-2xl text-base-content">
            Solicitudes
            {overview.pendingLeads > 0 && (
              <span className="ml-2 bg-primary px-2 text-base text-primary-content">
                {overview.pendingLeads}
              </span>
            )}
          </p>
          <p className="mt-1 text-sm text-base-content/60">
            Gente que pidió información o una cita.
          </p>
        </Link>
      </section>

      {/* ------------------------------------------------------- actividad --- */}
      <section>
        <h2 className="display mb-3 text-2xl text-base-content">Últimos entrenamientos</h2>

        {overview.recent.length === 0 ? (
          <p className="border border-dashed border-base-300 p-8 text-center text-base-content/60">
            Todavía nadie ha registrado una sesión. En cuanto lo hagan, aparecerá aquí.
          </p>
        ) : (
          <ul className="divide-y divide-base-300 border border-base-300">
            {overview.recent.map((log) => (
              <li key={log.id} className="flex flex-wrap items-center gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-base-content">
                    <Link
                      href={`/admin/alumnos/${log.athlete_id}`}
                      className="hover:text-primary"
                    >
                      {log.profiles?.full_name || log.profiles?.email || "Alumno"}
                    </Link>
                    <span className="ml-2 font-normal text-base-content/60">
                      {log.workouts?.title || "Sesión libre"}
                    </span>
                  </p>
                  <p className="text-xs text-base-content/50">
                    {new Date(`${log.performed_on}T12:00:00`).toLocaleDateString("es", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })}
                    {log.duration_minutes ? ` · ${log.duration_minutes} min` : ""}
                    {log.perceived_effort ? ` · esfuerzo ${log.perceived_effort}/10` : ""}
                  </p>
                  {log.notes && (
                    <p className="mt-1 text-sm italic text-accent">
                      &ldquo;{log.notes}&rdquo;
                    </p>
                  )}
                </div>
                <span className="display shrink-0 text-xl text-primary">
                  +{log.xp_awarded}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

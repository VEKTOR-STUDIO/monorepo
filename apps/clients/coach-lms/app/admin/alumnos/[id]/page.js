import Link from "next/link";
import { notFound } from "next/navigation";
import AthleteForm from "@/components/admin/AthleteForm";
import AssignmentPanel from "@/components/admin/AssignmentPanel";
import { getAdminPrograms, getAthleteDetail, levelProgress } from "@/libs/training";

export const dynamic = "force-dynamic";

export default async function AthleteDetailPage({ params }) {
  const { id } = await params;

  const [detail, programs] = await Promise.all([getAthleteDetail(id), getAdminPrograms()]);
  if (!detail) notFound();

  const { profile, stats, assignments, logs } = detail;
  const progress = levelProgress(stats?.xp || 0, stats?.level || 1);

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin/alumnos"
          className="text-sm font-medium text-base-content/50 hover:text-primary"
        >
          ← Todos los alumnos
        </Link>
        <h1 className="display mt-3 text-4xl text-base-content sm:text-5xl">
          {profile.full_name || profile.email}
        </h1>
        <p className="mt-1 text-sm text-base-content/50">
          {profile.email}
          {profile.phone ? ` · ${profile.phone}` : ""}
          {" · alta el "}
          {new Date(profile.created_at).toLocaleDateString("es")}
        </p>
        {(profile.discipline || profile.fight_record || profile.weight_kg || profile.weight_class) && (
          <p className="mt-1 text-sm font-semibold text-base-content/70">
            {[
              profile.discipline,
              profile.fight_record,
              profile.weight_kg ? `${profile.weight_kg} kg` : null,
              profile.weight_class ? `pelea en ${profile.weight_class}` : null,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
        )}
      </div>

      {/* ---------------------------------------------------------- cifras --- */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Nivel", value: stats?.level || 1, hint: `${progress.percent}% al siguiente` },
          { label: "XP", value: (stats?.xp || 0).toLocaleString("es") },
          {
            label: "Racha",
            value: stats?.current_streak || 0,
            hint: `récord ${stats?.longest_streak || 0}`,
          },
          {
            label: "Sesiones",
            value: stats?.total_workouts || 0,
            hint: `${stats?.total_minutes || 0} min`,
          },
        ].map((tile) => (
          <div key={tile.label} className="border border-base-300 bg-base-200/60 p-4">
            <p className="text-[11px] uppercase tracking-[0.14em] text-base-content/45">
              {tile.label}
            </p>
            <p className="display mt-1 text-3xl text-base-content">{tile.value}</p>
            {tile.hint && <p className="mt-0.5 text-xs text-base-content/50">{tile.hint}</p>}
          </div>
        ))}
      </div>

      {/* ----------------------------------------------------------- plan --- */}
      <section>
        <h2 className="display mb-3 text-2xl text-base-content">Su plan</h2>
        <AssignmentPanel
          athleteId={profile.id}
          assignments={assignments}
          programs={programs}
        />
      </section>

      {/* ---------------------------------------------------------- ficha --- */}
      <section>
        <h2 className="display mb-3 text-2xl text-base-content">Su ficha</h2>
        <div className="border border-base-300 p-4 sm:p-5">
          <AthleteForm athlete={profile} />
        </div>
      </section>

      {/* ------------------------------------------------------ historial --- */}
      <section>
        <h2 className="display mb-3 text-2xl text-base-content">Historial de sesiones</h2>

        {logs.length === 0 ? (
          <p className="border border-dashed border-base-300 p-8 text-center text-base-content/60">
            Este alumno todavía no ha registrado ninguna sesión.
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
                    {log.perceived_effort ? ` · esfuerzo ${log.perceived_effort}/10` : ""}
                    {log.status === "parcial" ? " · parcial" : ""}
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

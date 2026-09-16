import Link from "next/link";
import NewProgramForm from "@/components/admin/NewProgramForm";
import { getAdminPrograms } from "@/libs/training";

export const dynamic = "force-dynamic";

export default async function ProgramsPage() {
  const programs = await getAdminPrograms();

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-4xl text-base-content sm:text-5xl">Planes</h1>
          <p className="mt-2 max-w-2xl text-base-content/60">
            Un plan es un conjunto de sesiones. Lo creas una vez y se lo asignas a los
            alumnos que quieras.
          </p>
        </div>
        <NewProgramForm />
      </header>

      {programs.length === 0 ? (
        <p className="border border-dashed border-base-300 p-10 text-center text-base-content/60">
          Todavía no has creado ningún plan.
        </p>
      ) : (
        <ul className="divide-y divide-base-300 border border-base-300">
          {programs.map((program) => (
            <li key={program.id}>
              <Link
                href={`/admin/programas/${program.id}`}
                className="flex flex-wrap items-center gap-3 p-4 transition-colors hover:bg-base-200/60"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-base-content">
                    {program.title}
                    {!program.is_published && (
                      <span className="ml-2 border border-base-300 px-1.5 text-[10px] uppercase tracking-widest text-base-content/50">
                        inactivo
                      </span>
                    )}
                    {program.is_public && (
                      <span className="ml-2 border border-accent/50 px-1.5 text-[10px] uppercase tracking-widest text-accent">
                        público
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-base-content/50">
                    {program.subtitle || program.category || "Sin descripción"}
                    {program.duration_weeks ? ` · ${program.duration_weeks} semanas` : ""}
                  </p>
                </div>

                <span className="shrink-0 text-right">
                  <span className="display block text-xl text-base-content">
                    {program.workouts_count}
                  </span>
                  <span className="block text-[10px] uppercase tracking-widest text-base-content/40">
                    sesiones
                  </span>
                </span>

                <span className="shrink-0 text-right">
                  <span className="display block text-xl text-primary">
                    {program.athletes_count}
                  </span>
                  <span className="block text-[10px] uppercase tracking-widest text-base-content/40">
                    alumnos
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

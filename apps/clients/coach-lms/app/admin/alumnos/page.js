import Link from "next/link";
import Image from "next/image";
import { getAthletes } from "@/libs/training";

export const dynamic = "force-dynamic";

export default async function AthletesPage() {
  const athletes = await getAthletes();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="display text-4xl text-base-content sm:text-5xl">Alumnos</h1>
        <p className="mt-2 max-w-2xl text-base-content/60">
          Cada persona que crea su cuenta en la web aparece aquí. Entra en su ficha para
          asignarle un plan y ver cómo va.
        </p>
      </header>

      {athletes.length === 0 ? (
        <div className="border border-dashed border-base-300 p-10 text-center">
          <p className="display text-2xl text-base-content">Todavía no hay alumnos</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-base-content/60">
            Pásales el enlace de la web y que pulsen &laquo;Área atletas&raquo; para crear
            su cuenta. En cuanto lo hagan, los verás en esta lista.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-base-300 border border-base-300">
          {athletes.map((athlete) => (
            <li key={athlete.id}>
              <Link
                href={`/admin/alumnos/${athlete.id}`}
                className="flex flex-wrap items-center gap-3 p-4 transition-colors hover:bg-base-200/60 sm:gap-4"
              >
                <span className="h-12 w-12 shrink-0 overflow-hidden border border-base-300">
                  <Image
                    src={
                      athlete.image ||
                      `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(
                        athlete.full_name || athlete.email || "A"
                      )}`
                    }
                    alt=""
                    width={48}
                    height={48}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate font-bold text-base-content">
                    {athlete.full_name || athlete.email}
                    {!athlete.is_active && (
                      <span className="ml-2 border border-base-300 px-1.5 text-[10px] uppercase tracking-widest text-base-content/50">
                        inactivo
                      </span>
                    )}
                  </span>
                  <span className="block truncate text-xs text-base-content/50">
                    {athlete.plans.length > 0
                      ? athlete.plans.join(" · ")
                      : "Sin plan asignado"}
                  </span>
                </span>

                <span className="shrink-0 text-right">
                  <span className="display block text-xl text-primary">
                    {athlete.stats?.total_workouts || 0}
                  </span>
                  <span className="block text-[10px] uppercase tracking-widest text-base-content/40">
                    sesiones
                  </span>
                </span>

                <span className="hidden shrink-0 text-right sm:block">
                  <span className="display block text-xl text-base-content">
                    N{athlete.stats?.level || 1}
                  </span>
                  <span className="block text-[10px] uppercase tracking-widest text-base-content/40">
                    nivel
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

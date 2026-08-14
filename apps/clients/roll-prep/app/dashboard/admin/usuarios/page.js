import Link from "next/link";
import AdminUsersList from "@/components/rollprep/AdminUsersList";
import { createClient } from "@/libs/supabase/server";
import {
  ACADEMIES_MIGRATION,
  academyFromRow,
  getAcademies,
  isMissingAcademies,
} from "@/libs/academies";

export const dynamic = "force-dynamic";

// Gestión de usuarios: todo el gym en una lista (alumnos y profesores), con
// su correo, academia y XP. Desde aquí el profesor edita nombre, rol y
// academia, o elimina la cuenta. Solo admin (lo garantiza el layout).
export default async function AdminUsuarios() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: rows, error }, academies] = await Promise.all([
    supabase
      .from("admin_users")
      .select(
        "id, email, full_name, role, last_sign_in_at, academy_id, academy_name, academy_slug, academy_color, total_points, classes_completed"
      )
      .order("full_name", { ascending: true }),
    getAcademies(supabase),
  ]);

  // Sin la migración no existe la vista admin_users: se cae a la lista de
  // perfiles (sin correo ni XP) para no dejar el panel inservible.
  const needsMigration = isMissingAcademies(error);

  const { data: fallbackRows } = needsMigration
    ? await supabase
        .from("profiles")
        .select("id, full_name, role")
        .order("full_name", { ascending: true })
    : { data: null };

  const users = (rows ?? fallbackRows ?? []).map((row) => ({
    email: null,
    last_sign_in_at: null,
    academy_id: null,
    total_points: 0,
    classes_completed: 0,
    ...row,
    academy: academyFromRow(row),
  }));

  const admins = users.filter((u) => u.role === "admin").length;
  const withoutAcademy = users.filter((u) => !u.academy_id).length;

  return (
    <main className="min-h-screen bg-base-100 p-4 text-base-content md:p-8">
      <section className="mx-auto max-w-3xl space-y-6">
        <div className="rise rise-1 flex items-center justify-between">
          <Link
            href="/dashboard/admin"
            className="tile-cta text-[0.65rem] font-black uppercase tracking-[0.2em] opacity-60 hover:text-primary hover:opacity-100"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="h-3 w-3 rotate-180"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
            Panel
          </Link>
          <span className="tag-skew bg-primary px-3 py-1 text-xs text-primary-content">
            <span>Coach mode</span>
          </span>
        </div>

        <div className="rise rise-1">
          <h1 className="display text-5xl">
            Usuarios<span className="text-primary">.</span>
          </h1>
          <p className="mt-1 text-sm font-medium opacity-70">
            Todo el gym en una lista: cambia el nombre, la academia o el rol de
            cualquiera, y elimina las cuentas que ya no entrenan.
          </p>
        </div>

        {needsMigration && (
          <div className="rise rise-2 clip-cut border-2 border-error bg-error/10 p-5">
            <p className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-error">
              Falta una migración
            </p>
            <p className="mt-2 text-sm font-semibold">
              Corre <code className="bg-base-300 px-1">{ACADEMIES_MIGRATION}</code>{" "}
              en el SQL Editor de Supabase para ver correos, XP y academias
              (y para poder eliminar cuentas). Se puede correr varias veces sin
              problema.
            </p>
          </div>
        )}

        <div className="rise rise-2 grid grid-cols-3 gap-3">
          {[
            { label: "Usuarios", value: users.length },
            { label: "Profesores", value: admins },
            { label: "Sin academia", value: withoutAcademy },
          ].map((stat) => (
            <div
              key={stat.label}
              className="border border-base-300 bg-base-200 p-4 text-center"
            >
              <p className="display text-4xl text-primary">{stat.value}</p>
              <p className="mt-1 text-[0.6rem] font-bold uppercase tracking-widest opacity-60">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="rise rise-3 border border-base-300 bg-base-200">
          <div className="border-b border-base-300 px-6 py-4">
            <h2 className="display text-xl">Todos los usuarios</h2>
            <p className="mt-1 text-xs font-medium opacity-60">
              Las academias se asignan aquí o las elige cada alumno desde el
              roster. Aparecen en el ranking y en su ficha.
            </p>
          </div>
          <AdminUsersList
            users={users}
            academies={academies}
            currentUserId={user.id}
          />
        </div>
      </section>
    </main>
  );
}

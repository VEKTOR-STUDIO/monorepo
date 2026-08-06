import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/libs/supabase/server";
import TournamentCreateForm from "@/components/rollprep/TournamentCreateForm";

export const dynamic = "force-dynamic";

// Crear un tope: el profesor marca quiénes están en clase hoy y sortea
// el bracket. Solo admin.
export default async function NuevoTorneo() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/dashboard/torneos");
  }

  const { data: students } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("role", "student")
    .order("full_name", { ascending: true });

  return (
    <main className="min-h-screen bg-base-100 p-4 text-base-content md:p-8">
      <section className="mx-auto max-w-xl space-y-6">
        <div className="rise rise-1 flex items-center justify-between">
          <Link
            href="/dashboard/torneos"
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
            Torneos
          </Link>
          <span className="tag-skew bg-primary px-3 py-1 text-xs text-primary-content">
            <span>Coach mode</span>
          </span>
        </div>

        <div className="rise rise-1">
          <h1 className="display text-5xl">
            Nuevo tope<span className="text-primary">.</span>
          </h1>
          <p className="mt-1 text-sm font-medium opacity-70">
            Quita a los que faltaron hoy, suma los invitados que cayeron y
            sortea el bracket. Después puedes re-sortear o borrarlo si era de
            prueba.
          </p>
        </div>

        <div className="rise rise-2">
          <TournamentCreateForm students={students ?? []} />
        </div>
      </section>
    </main>
  );
}

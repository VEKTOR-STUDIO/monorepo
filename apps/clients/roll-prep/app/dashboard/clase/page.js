import Link from "next/link";
import { createClient } from "@/libs/supabase/server";
import ClassView from "./ClassView";

export const dynamic = "force-dynamic";

// La clase de hoy: muestra la tarea activa. Si no hay, día de descanso.
export default async function ClaseDeHoy() {
  const supabase = await createClient();

  const { data: assignment } = await supabase
    .from("assignments")
    .select("id, title, video_url, notes, scheduled_for, created_at, is_active")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!assignment) {
    return (
      <main className="min-h-screen bg-base-100 p-4 text-base-content md:p-8">
        <section className="mx-auto max-w-xl space-y-6">
          <Link
            href="/dashboard"
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
            Menú
          </Link>

          <div className="rise rise-2 stripes relative overflow-hidden border-2 border-base-300 bg-base-200 p-10 text-center">
            <span
              aria-hidden="true"
              className="display text-stroke pointer-events-none absolute -bottom-6 -right-2 select-none text-8xl"
            >
              REST
            </span>
            <h1 className="display text-3xl">Día de descanso</h1>
            <p className="mt-3 text-sm font-medium opacity-70">
              El profesor todavía no publica la próxima clase. Mientras tanto,
              repasa la videoteca o el calendario.
            </p>
            <Link href="/dashboard/videoteca" className="btn btn-primary mt-6">
              Ir a la videoteca
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return <ClassView assignment={assignment} />;
}

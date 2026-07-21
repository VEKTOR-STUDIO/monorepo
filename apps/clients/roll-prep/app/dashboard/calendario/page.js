import Link from "next/link";
import CalendarView from "@/components/rollprep/CalendarView";
import { createClient } from "@/libs/supabase/server";

export const dynamic = "force-dynamic";

// Calendario de clases: vista mensual navegable con las clases de cada día.
export default async function Calendario() {
  const supabase = await createClient();

  const { data: assignments } = await supabase
    .from("assignments")
    .select("id, title, scheduled_for, created_at, is_active")
    .order("created_at", { ascending: true });

  return (
    <main className="min-h-screen bg-base-100 p-4 text-base-content md:p-8">
      <section className="mx-auto max-w-xl space-y-6">
        <div className="rise rise-1 flex items-center justify-between">
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
          <span className="tag-skew bg-secondary px-3 py-1 text-xs text-secondary-content">
            <span>Agenda del gym</span>
          </span>
        </div>

        <div className="rise rise-2">
          <CalendarView assignments={assignments ?? []} />
        </div>
      </section>
    </main>
  );
}

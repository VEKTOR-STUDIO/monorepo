import Link from "next/link";
import CalendarView from "@/components/rollprep/CalendarView";
import { createClient } from "@/libs/supabase/server";
import { dateInTimezone } from "@/libs/rollprep";

export const dynamic = "force-dynamic";

// Calendario del gym: clases y topes, día por día.
export default async function Calendario() {
  const supabase = await createClient();

  const [{ data: assignments }, eventsResult] = await Promise.all([
    supabase
      .from("assignments")
      .select("id, title, scheduled_for, created_at, is_active")
      .order("created_at", { ascending: true }),
    supabase
      .from("tournaments")
      .select("id, title, status, scheduled_for, created_at")
      .order("created_at", { ascending: true }),
  ]);

  let tournaments = eventsResult.data;
  if (
    eventsResult.error?.code === "42703" &&
    /scheduled_for/.test(eventsResult.error.message ?? "")
  ) {
    const fallback = await supabase
      .from("tournaments")
      .select("id, title, status, created_at")
      .order("created_at", { ascending: true });
    tournaments = fallback.data;
  }

  const items = [
    ...(assignments ?? []).map((a) => ({
      id: `class-${a.id}`,
      title: a.title,
      date: a.scheduled_for ?? a.created_at?.slice(0, 10),
      href: `/dashboard/clase/${a.id}`,
      kind: "class",
      live: a.is_active,
    })),
    ...(tournaments ?? []).map((t) => ({
      id: `event-${t.id}`,
      title: t.title,
      date: t.scheduled_for ?? dateInTimezone(t.created_at),
      href: `/dashboard/torneos/${t.id}`,
      kind: "event",
      live: t.status === "active" || t.status === "scheduled",
    })),
  ].filter((item) => item.date);

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
          <CalendarView items={items} />
        </div>
      </section>
    </main>
  );
}

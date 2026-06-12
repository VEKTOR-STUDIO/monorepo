import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/libs/supabase/server";
import config from "@/config";
import EventBuilder from "@/components/admin/EventBuilder";

export const dynamic = "force-dynamic";

// Constructor de una cartelera específica — exclusivo del admin.
export default async function EventBuilderPage({ params }) {
  const { eventId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .maybeSingle();

  if (!event) {
    notFound();
  }

  const { data: bouts } = await supabase
    .from("bouts")
    .select(
      `*,
      red:fighters!bouts_red_fighter_id_fkey(id, full_name, nickname, wins, losses, draws, weight_class, photo_url, nationality),
      blue:fighters!bouts_blue_fighter_id_fkey(id, full_name, nickname, wins, losses, draws, weight_class, photo_url, nationality)`
    )
    .eq("event_id", eventId)
    .order("bout_order", { ascending: false });

  // Roster completo para armar combates (el simulador permite incluir pendientes)
  const { data: fighters } = await supabase
    .from("fighters")
    .select(
      "id, full_name, nickname, gender, discipline, experience_level, weight_class, weight_kg, height_cm, reach_cm, stance, team, years_training, birth_date, wins, losses, draws, wins_ko, wins_sub, wins_dec, status, photo_url, nationality, city, state"
    )
    .order("full_name");

  return (
    <main
      className="min-h-screen bg-base-100 relative overflow-hidden"
      data-theme={config.colors.theme}
    >
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, var(--color-primary) 0 2px, transparent 2px 24px)",
        }}
        aria-hidden
      />

      <div className="relative min-h-screen p-4 md:p-6 py-8 md:py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard/events"
              className="btn btn-ghost btn-sm border border-primary/30 text-base-content/70 hover:border-primary/60"
            >
              ← Todas las carteleras
            </Link>
            <Link
              href="/dashboard"
              className="btn btn-ghost btn-sm text-base-content/50"
            >
              Roster
            </Link>
          </div>

          <EventBuilder
            event={event}
            bouts={bouts || []}
            fighters={fighters || []}
          />
        </div>
      </div>
    </main>
  );
}

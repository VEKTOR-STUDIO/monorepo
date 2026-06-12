import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/libs/supabase/server";
import config from "@/config";
import EventsManager from "@/components/admin/EventsManager";

export const dynamic = "force-dynamic";

// Generador de carteleras — exclusivo del admin.
export default async function EventsPage() {
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

  const { data: events } = await supabase
    .from("events")
    .select("*, bouts(count)")
    .order("event_date", { ascending: false, nullsFirst: false });

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
          <div className="border border-primary/30 bg-base-200/80 p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-[0.65rem] text-base-content/50 uppercase tracking-[0.3em] font-bold mb-1">
                  Panel de administración
                </p>
                <h1 className="font-display text-3xl md:text-5xl text-primary leading-none">
                  Generador de carteleras
                </h1>
                <p className="text-sm text-base-content/50 mt-2">
                  Crea eventos, arma combates desde el roster y simula
                  enfrentamientos antes de publicar.
                </p>
              </div>
              <Link
                href="/dashboard"
                className="btn btn-ghost btn-sm border border-primary/30 text-base-content/70 hover:border-primary/60"
              >
                ← Volver al roster
              </Link>
            </div>
          </div>

          <EventsManager events={events || []} />
        </div>
      </div>
    </main>
  );
}

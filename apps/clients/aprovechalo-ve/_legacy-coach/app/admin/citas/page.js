import AdminDashboard from "@/components/AdminDashboard";
import { createClient } from "@/libs/supabase/server";

export const dynamic = "force-dynamic";

// Lo que ya existía antes del sistema de entrenamiento: citas, solicitudes del
// formulario "elite" y las notas del manifiesto. Vive aquí para no perderlo.
export default async function AppointmentsPage() {
  const supabase = await createClient();

  const [{ data: appointments }, { data: posts }, { data: leads }] = await Promise.all([
    supabase
      .from("appointments")
      .select("*, services(name)")
      .order("appointment_date", { ascending: true }),
    supabase
      .from("manifesto_posts")
      .select("id, title, content, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("elite_leads")
      .select("id, name, phone, current_fitness_level, goals, created_at")
      .order("created_at", { ascending: false }),
  ]);

  const all = appointments || [];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="display text-4xl text-base-content sm:text-5xl">
          Citas y solicitudes
        </h1>
        <p className="mt-2 max-w-2xl text-base-content/60">
          Reservas de sesiones presenciales, gente que pidió información y tus notas
          publicadas en la web.
        </p>
      </header>

      <AdminDashboard
        pendingAppointments={all.filter((item) => item.status === "pending")}
        confirmedAppointments={all.filter((item) => item.status === "confirmed")}
        completedAppointments={all.filter((item) => item.status === "completed")}
        manifestoPosts={posts || []}
        eliteLeads={leads || []}
      />
    </div>
  );
}

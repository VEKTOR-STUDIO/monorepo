import Image from "next/image";
import { redirect } from "next/navigation";
import { createClient } from "@/libs/supabase/server";
import SignOutButton from "@/components/SignOutButton";
// BookingWizard desactivado por ahora; se puede reactivar en el futuro.
// import BookingWizard from "@/components/BookingWizard";
import ActiveAppointment from "@/components/ActiveAppointment";
import AdminDashboard from "@/components/AdminDashboard";
import Link from "next/link";
import Footer from "@/components/Footer";

export default async function Dashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, image, role")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === "admin";

  let appointments, pendingAppointments, confirmedAppointments, completedAppointments;

  let manifestoPosts = [];
  let eliteLeads = [];

  if (isAdmin) {
    const { data: allAppointments } = await supabase
      .from("appointments")
      .select("*, services(name)")
      .order("appointment_date", { ascending: true });
    appointments = allAppointments || [];
    pendingAppointments = appointments.filter((apt) => apt.status === "pending");
    confirmedAppointments = appointments.filter((apt) => apt.status === "confirmed");
    completedAppointments = appointments.filter((apt) => apt.status === "completed");

    const { data: posts, error: errPosts } = await supabase
      .from("manifesto_posts")
      .select("id, title, content, created_at")
      .order("created_at", { ascending: false });
    manifestoPosts = errPosts ? [] : (posts || []);

    const { data: leads, error: errLeads } = await supabase
      .from("elite_leads")
      .select("id, name, phone, current_fitness_level, goals, created_at")
      .order("created_at", { ascending: false });
    eliteLeads = errLeads ? [] : (leads || []);
  } else {
    const { data: userAppointments } = await supabase
      .from("appointments")
      .select("*, services(id, name, duration_minutes)")
      .eq("user_id", user.id)
      .order("appointment_date", { ascending: true });
    appointments = userAppointments || [];
  }

  // Verificar si tiene cita activa (pendiente o confirmada) - solo para usuarios regulares
  const activeAppointment = !isAdmin && appointments?.find(
    (apt) => apt.status === "pending" || apt.status === "confirmed"
  );

  const displayName =
    profile?.name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    (user?.email ? user.email.split("@")[0] : "");

  const avatarUrl = profile?.image || user?.user_metadata?.avatar_url || "";

  const getStatusBadge = (status) => {
    const badges = {
      pending: "badge-warning",
      confirmed: "badge-success",
      cancelled: "badge-error",
      completed: "badge-info",
    };
    const labels = {
      pending: "Pendiente",
      confirmed: "Confirmada",
      cancelled: "Cancelada",
      completed: "Completada",
    };
    return { class: badges[status] || "badge-ghost", label: labels[status] || status };
  };

  if (isAdmin) {
    return (
      <main className="min-h-screen relative overflow-hidden bg-base-100">
        <div className="relative min-h-screen p-4 md:p-6 py-8 md:py-12">
          <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
            <div className="relative rounded-md p-6 md:p-8 overflow-hidden border border-base-300 bg-base-200 shadow-sm">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="avatar">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-md border border-primary/40 overflow-hidden">
                      {avatarUrl ? (
                        <Image src={avatarUrl} alt={displayName} width={80} height={80} />
                      ) : (
                        <Image
                          src={`https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(
                            displayName || "U"
                          )}`}
                          alt={displayName}
                          width={80}
                          height={80}
                        />
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-xs text-base-content/50 uppercase tracking-wider">Panel de administración</p>
                      <span className="badge badge-sm rounded-md border border-primary text-primary text-[10px] tracking-widest font-bold">
                        ADMIN
                      </span>
                    </div>
                    <h1 className="text-2xl md:text-4xl font-bold text-primary">{displayName}</h1>
                    <p className="text-xs text-base-content/50 mt-0.5">{user.email}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href="/"
                    className="btn btn-ghost btn-sm md:btn-md rounded-md border border-base-300 text-base-content/70 hover:bg-primary/10"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    Inicio
                  </Link>
                  <SignOutButton className="btn btn-ghost btn-sm md:btn-md hover:bg-error/10 text-base-content/70" />
                </div>
              </div>
            </div>

            {/* Admin Dashboard Component */}
            <AdminDashboard
              pendingAppointments={pendingAppointments}
              confirmedAppointments={confirmedAppointments}
              completedAppointments={completedAppointments}
              manifestoPosts={manifestoPosts}
              eliteLeads={eliteLeads}
            />
          </div>
        </div>
      </main>
    );
  }

  // Vista usuario: panel genérico
  return (
    <>
      <main className="min-h-screen bg-base-100 relative overflow-hidden">
        <div className="relative min-h-screen p-4 md:p-6 py-8 md:py-12">
          <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
            <div className="relative rounded-md p-6 md:p-8 overflow-hidden border border-base-300 shadow-sm bg-base-200">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="avatar">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-md border border-primary/30 overflow-hidden">
                      {avatarUrl ? (
                        <Image src={avatarUrl} alt={displayName} width={80} height={80} />
                      ) : (
                        <Image
                          src={`https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(
                            displayName || "U"
                          )}`}
                          alt={displayName}
                          width={80}
                          height={80}
                        />
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-xl md:text-2xl text-primary">Hola, {displayName || "atleta"}.</p>
                    <h1 className="text-2xl md:text-4xl font-semibold text-base-content">Tu panel de rendimiento</h1>
                    <p className="text-sm text-base-content/60 mt-1">{user.email}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href="/" className="btn btn-ghost btn-sm rounded-md border border-base-300 text-base-content/80 hover:bg-base-300/30">
                    Inicio
                  </Link>
                  <SignOutButton className="btn btn-ghost btn-sm hover:bg-error/10 text-base-content/70" />
                </div>
              </div>
            </div>

            {activeAppointment ? (
              <ActiveAppointment appointment={activeAppointment} />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {["Sesiones / semana", "Carga (demo)", "Próximo bloque"].map((label) => (
                    <div
                      key={label}
                      className="rounded-md border border-base-300 bg-base-100 p-4 shadow-sm text-center"
                    >
                      <p className="text-xs text-base-content/50 uppercase tracking-wide">{label}</p>
                      <p className="text-2xl font-semibold text-base-content mt-1">000</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-md border border-base-300 p-8 md:p-10 text-center bg-base-200/80 shadow-sm">
                  <p className="text-xl md:text-2xl font-bold text-primary mb-2">Seguimiento</p>
                <p className="text-base-content/70 max-w-lg mx-auto mb-4">
                    Conecta aquí tus métricas reales (volumen, RPE, tests) o integra tu herramienta de análisis.
                  </p>
                  <Link href="/" className="btn btn-primary btn-sm rounded-md border border-primary/80 shadow-sm">
                    Volver al inicio
                  </Link>
                </div>
              </>
            )}

          {appointments && appointments.filter((apt) => apt.status === "cancelled" || apt.status === "completed").length > 0 && (
            <div className="relative rounded-md p-6 md:p-8 overflow-hidden border border-base-300 bg-base-200 shadow-sm">
              <div className="relative z-10">
                <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-primary">Historial</h2>
                <div className="space-y-4">
                  {appointments
                    .filter((apt) => apt.status === "cancelled" || apt.status === "completed")
                    .map((apt) => {
                      const statusBadge = getStatusBadge(apt.status);
                      return (
                      <div
                        key={apt.id}
                        className="group rounded-md p-4 md:p-5 border border-base-300 transition-colors hover:border-primary/40 bg-base-100"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <h3 className="font-bold text-base md:text-lg">{apt.full_name}</h3>
                              <span className={`badge ${statusBadge.class} px-3 md:px-4 rounded-full text-xs md:text-sm`}>
                                {statusBadge.label}
                              </span>
                            </div>
                          <div className="space-y-1 text-sm text-base-content/70">
                            <p className="flex items-center gap-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              {new Date(apt.appointment_date).toLocaleDateString("es-MX", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                            <p className="flex items-center gap-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              {apt.appointment_time}
                            </p>
                            {apt.company && (
                              <p className="flex items-center gap-2">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                  />
                                </svg>
                                {apt.company}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-xs text-base-content/50">
                          Creada: {new Date(apt.created_at).toLocaleDateString("es-MX")}
                        </div>
                      </div>
                      {apt.message && (
                        <div className="mt-3 pt-3 border-t border-base-content/10">
                          <p className="text-sm text-base-content/70 italic">
                            &quot;{apt.message}&quot;
                          </p>
                        </div>
                      )}
                    </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
    <Footer />
    </>
  );
}

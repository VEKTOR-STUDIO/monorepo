import Image from "next/image";
import { redirect } from "next/navigation";
import { createClient } from "@/libs/supabase/server";
import SignOutButton from "@/components/SignOutButton";
import BookingWizard from "@/components/BookingWizard";
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

  // Catálogo de servicios (para BookingWizard y admin)
  const { data: services } = await supabase
    .from("services")
    .select("id, name, description, price, duration_minutes, image_url")
    .order("name");

  let appointments, pendingAppointments, confirmedAppointments, completedAppointments;

  if (isAdmin) {
    const { data: allAppointments } = await supabase
      .from("appointments")
      .select("*, services(name)")
      .order("appointment_date", { ascending: true });
    appointments = allAppointments || [];
    pendingAppointments = appointments.filter((apt) => apt.status === "pending");
    confirmedAppointments = appointments.filter((apt) => apt.status === "confirmed");
    completedAppointments = appointments.filter((apt) => apt.status === "completed");
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

  // Si es admin, mostrar dashboard de administrador
  if (isAdmin) {
    return (
      <main className="min-h-screen relative overflow-hidden bg-[#1A1A1A]">
        {/* Orbs de fondo sutiles */}
        <div className="absolute top-0 -right-40 w-[30rem] h-[30rem] bg-[#C69C6D]/4 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -left-40 w-[30rem] h-[30rem] bg-[#C69C6D]/4 rounded-full blur-3xl pointer-events-none" />

        <div className="relative min-h-screen p-4 md:p-6 py-8 md:py-12">
          <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
            {/* Admin Header */}
            <div
              className="relative rounded-2xl p-6 md:p-8 overflow-hidden border border-[#C69C6D]/30 shadow-xl"
              style={{ backgroundColor: "#222222" }}
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="avatar">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full ring-2 ring-[#C69C6D]/40 overflow-hidden">
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
                      <span
                        className="badge badge-sm border text-[10px] tracking-widest"
                        style={{ borderColor: "rgba(198, 156, 109, 0.4)", color: "#C69C6D", backgroundColor: "rgba(198, 156, 109, 0.1)" }}
                      >
                        ADMIN
                      </span>
                    </div>
                    <h1
                      className="text-2xl md:text-4xl font-semibold"
                      style={{ fontFamily: "var(--font-display)", color: "#C69C6D" }}
                    >
                      {displayName}
                    </h1>
                    <p className="text-xs text-base-content/50 mt-0.5">{user.email}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href="/"
                    className="btn btn-ghost btn-sm md:btn-md border border-[#C69C6D]/25 text-base-content/70 hover:bg-[#C69C6D]/8 hover:border-[#C69C6D]/45"
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
            />
          </div>
        </div>
      </main>
    );
  }

  // Vista normal para usuarios regulares — Portal PMU Luxury Dark
  return (
    <>
      <main className="min-h-screen bg-[#1A1A1A] relative overflow-hidden">
        <div className="absolute inset-0 bg-[#1A1A1A]" />
        <div className="absolute top-0 -right-40 w-[30rem] h-[30rem] bg-[#C69C6D]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-40 w-[30rem] h-[30rem] bg-[#C69C6D]/5 rounded-full blur-3xl" />

        <div className="relative min-h-screen p-4 md:p-6 py-8 md:py-12">
          <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
            {/* Header personalizado — Luxury Dark */}
            <div
              className="relative rounded-2xl p-6 md:p-8 overflow-hidden border border-[#C69C6D]/30 shadow-xl"
              style={{ backgroundColor: "#222222" }}
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="avatar">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full ring-2 ring-[#C69C6D]/50 overflow-hidden">
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
                    <p
                      className="text-xl md:text-2xl font-serif text-[#C69C6D]"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      Bienvenida, {displayName || "bella"}.
                    </p>
                    <h1
                      className="text-2xl md:text-4xl font-semibold text-base-content"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      Tu transformación comienza aquí.
                    </h1>
                    <p className="text-sm text-base-content/60 mt-1">{user.email}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href="/"
                    className="btn btn-ghost btn-sm border border-[#C69C6D]/30 text-base-content/80 hover:bg-[#C69C6D]/10 hover:border-[#C69C6D]/50"
                  >
                    Inicio
                  </Link>
                  <SignOutButton className="btn btn-ghost btn-sm hover:bg-error/10 text-base-content/70" />
                </div>
              </div>
            </div>

            {/* Estado actual: cita activa o invitación a reservar */}
            {activeAppointment ? (
              <ActiveAppointment appointment={activeAppointment} />
            ) : (
              <>
                <div
                  className="rounded-2xl border border-[#C69C6D]/40 p-8 md:p-10 text-center"
                  style={{ backgroundColor: "#222222" }}
                >
                  <p
                    className="text-2xl md:text-3xl font-semibold text-[#C69C6D] mb-2"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Reservar tu Sesión
                  </p>
                  <p className="text-base-content/70 max-w-lg mx-auto mb-6">
                    Elige tu tratamiento, fecha y completa tu ficha clínica. Nos pondremos en contacto para confirmar.
                  </p>
                </div>
                <BookingWizard services={services} user={user} userProfile={profile} />
              </>
            )}

          {/* Historial Estético */}
          {appointments && appointments.filter((apt) => apt.status === "cancelled" || apt.status === "completed").length > 0 && (
            <div
              className="relative rounded-2xl p-6 md:p-8 overflow-hidden border border-[#C69C6D]/30"
              style={{ backgroundColor: "#222222" }}
            >
              <div className="relative z-10">
                <h2
                  className="text-2xl md:text-3xl font-semibold mb-6 text-[#C69C6D]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Historial estético
                </h2>
                <div className="space-y-4">
                  {appointments
                    .filter((apt) => apt.status === "cancelled" || apt.status === "completed")
                    .map((apt) => {
                      const statusBadge = getStatusBadge(apt.status);
                      return (
                      <div
                        key={apt.id}
                        className="group rounded-xl p-4 md:p-5 border border-base-content/10 transition-all duration-300 hover:border-[#C69C6D]/40 bg-[#1A1A1A]/80"
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

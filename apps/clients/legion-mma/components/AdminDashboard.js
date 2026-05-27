"use client";

import { useState } from "react";
import { createClient } from "@/libs/supabase/client";
import { useRouter } from "next/navigation";

const AdminDashboard = ({ pendingAppointments, confirmedAppointments, completedAppointments }) => {
  const [loadingId, setLoadingId] = useState(null);
  const router = useRouter();

  const handleStatusChange = async (appointmentId, newStatus) => {
    setLoadingId(appointmentId);
    const supabase = createClient();

    try {
      const { error } = await supabase
        .from("appointments")
        .update({ status: newStatus })
        .eq("id", appointmentId);

      if (error) throw error;
      router.refresh();
    } catch (err) {
      console.error("Error al actualizar cita:", err);
      alert("Error al actualizar la cita. Intenta de nuevo.");
    } finally {
      setLoadingId(null);
    }
  };

  const SectionHeader = ({ title, count }) => (
    <div className="flex items-center gap-4 mb-5">
      <div className="h-px flex-1" style={{ backgroundColor: "rgba(198, 156, 109, 0.2)" }} />
      <div className="flex items-center gap-2.5">
        <h2
          className="text-sm md:text-base font-semibold uppercase tracking-[0.15em]"
          style={{ fontFamily: "var(--font-display)", color: "#C69C6D" }}
        >
          {title}
        </h2>
        {count > 0 && (
          <span
            className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold"
            style={{ backgroundColor: "rgba(198, 156, 109, 0.2)", color: "#C69C6D" }}
          >
            {count}
          </span>
        )}
      </div>
      <div className="h-px flex-1" style={{ backgroundColor: "rgba(198, 156, 109, 0.2)" }} />
    </div>
  );

  const EmptyState = ({ message }) => (
    <div
      className="rounded-2xl p-10 text-center border border-base-content/8"
      style={{ backgroundColor: "#222222" }}
    >
      <div className="w-10 h-10 rounded-full bg-base-content/5 flex items-center justify-center mx-auto mb-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-base-content/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <p className="text-sm text-base-content/30">{message}</p>
    </div>
  );

  const AppointmentCard = ({ appointment, isPending }) => {
    const appointmentDate = new Date(appointment.appointment_date);
    const isLoading = loadingId === appointment.id;
    const serviceName = appointment.services?.name ?? null;

    return (
      <div
        className="group relative rounded-2xl p-5 md:p-6 border border-[#C69C6D]/15 hover:border-[#C69C6D]/45 transition-all duration-300 overflow-hidden"
        style={{ backgroundColor: "#222222" }}
      >
        {/* Corner glow on hover */}
        <div
          className="absolute top-0 right-0 w-28 h-28 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ backgroundColor: "rgba(198, 156, 109, 0.05)" }}
        />

        <div className="relative z-10">
          {/* Header: name + email */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ring-1"
                style={{
                  backgroundColor: "rgba(198, 156, 109, 0.12)",
                  ringColor: "rgba(198, 156, 109, 0.25)",
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "#C69C6D" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="min-w-0">
                <h3
                  className="text-base md:text-lg font-semibold truncate group-hover:text-[#C69C6D] transition-colors text-base-content"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {appointment.full_name}
                </h3>
                <p className="text-xs text-base-content/45 truncate">{appointment.email}</p>
              </div>
            </div>
            <span className="ml-2 flex-shrink-0 text-[10px] font-mono text-base-content/25 mt-1">
              #{appointment.id.slice(0, 6)}
            </span>
          </div>

          {/* Servicio */}
          {serviceName && (
            <div
              className="mb-4 px-3 py-2 rounded-lg border"
              style={{
                backgroundColor: "rgba(198, 156, 109, 0.08)",
                borderColor: "rgba(198, 156, 109, 0.2)",
              }}
            >
              <p className="text-[10px] uppercase tracking-wider text-base-content/40 mb-0.5">Servicio</p>
              <p className="text-sm font-medium" style={{ color: "#C69C6D" }}>{serviceName}</p>
            </div>
          )}

          {/* Fecha y hora */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div
              className="rounded-xl p-3 border border-base-content/8"
              style={{ backgroundColor: "#1A1A1A" }}
            >
              <p className="text-[10px] text-base-content/40 mb-1 uppercase tracking-wider">Fecha</p>
              <p className="text-sm font-semibold text-base-content/80">
                {appointmentDate.toLocaleDateString("es-MX", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
            <div
              className="rounded-xl p-3 border border-base-content/8"
              style={{ backgroundColor: "#1A1A1A" }}
            >
              <p className="text-[10px] text-base-content/40 mb-1 uppercase tracking-wider">Hora</p>
              <p className="text-sm font-semibold text-base-content/80">{appointment.appointment_time}</p>
            </div>
          </div>

          {/* Contacto */}
          {(appointment.phone || appointment.company) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {appointment.phone && (
                <div
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border border-base-content/8"
                  style={{ backgroundColor: "#1A1A1A" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "rgba(198, 156, 109, 0.55)" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-base-content/60">{appointment.phone}</span>
                </div>
              )}
              {appointment.company && (
                <div
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border border-base-content/8"
                  style={{ backgroundColor: "#1A1A1A" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "rgba(198, 156, 109, 0.55)" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="text-base-content/60">{appointment.company}</span>
                </div>
              )}
            </div>
          )}

          {/* Mensaje */}
          {appointment.message && (
            <div
              className="rounded-xl p-3 mb-4 border border-base-content/8"
              style={{ backgroundColor: "#1A1A1A" }}
            >
              <p className="text-[10px] text-base-content/40 mb-1 uppercase tracking-wider">Mensaje</p>
              <p className="text-sm text-base-content/60 italic line-clamp-2">&quot;{appointment.message}&quot;</p>
            </div>
          )}

          {/* Ficha clínica (resumen) */}
          {appointment.health_notes && (
            <div
              className="rounded-xl p-3 mb-4 border"
              style={{
                backgroundColor: "rgba(198, 156, 109, 0.05)",
                borderColor: "rgba(198, 156, 109, 0.15)",
              }}
            >
              <p className="text-[10px] text-base-content/40 mb-1 uppercase tracking-wider">Ficha clínica</p>
              <p className="text-xs text-base-content/55 line-clamp-2">{appointment.health_notes}</p>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex flex-col md:flex-row gap-2 pt-4 border-t border-base-content/8">
            {isPending ? (
              <>
                <button
                  onClick={() => handleStatusChange(appointment.id, "confirmed")}
                  disabled={isLoading}
                  className="flex-1 btn btn-sm border-none font-semibold tracking-widest uppercase text-[#1A1A1A] hover:opacity-90 disabled:opacity-40"
                  style={{ backgroundColor: "#C69C6D" }}
                >
                  {isLoading ? (
                    <span className="loading loading-spinner loading-xs" />
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Confirmar
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleStatusChange(appointment.id, "cancelled")}
                  disabled={isLoading}
                  className="btn btn-sm btn-ghost border border-error/30 text-error hover:bg-error/8 disabled:opacity-40"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancelar
                </button>
              </>
            ) : (
              <button
                onClick={() => handleStatusChange(appointment.id, "completed")}
                disabled={isLoading}
                className="flex-1 btn btn-sm btn-ghost border font-semibold tracking-wider uppercase disabled:opacity-40"
                style={{ borderColor: "rgba(198, 156, 109, 0.35)", color: "#C69C6D" }}
              >
                {isLoading ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Marcar completada
                  </>
                )}
              </button>
            )}
          </div>

          {/* Timestamp */}
          <div className="mt-3 text-[11px] text-base-content/25 flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Creada: {new Date(appointment.created_at).toLocaleString("es-MX")}
          </div>
        </div>
      </div>
    );
  };

  const CompletedAppointmentCard = ({ appointment }) => {
    const appointmentDate = new Date(appointment.appointment_date);
    const serviceName = appointment.services?.name ?? null;

    return (
      <div
        className="group relative rounded-2xl p-4 md:p-5 border border-base-content/8 hover:border-[#C69C6D]/15 transition-all duration-300 opacity-60 hover:opacity-80"
        style={{ backgroundColor: "#222222" }}
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-base-content/5 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3
                className="text-sm font-semibold text-base-content/60 truncate"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {appointment.full_name}
              </h3>
              <span className="flex-shrink-0 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider border border-base-content/12 text-base-content/30">
                Completada
              </span>
            </div>
            {serviceName && (
              <p className="text-xs text-base-content/35 mb-1">{serviceName}</p>
            )}
            <p className="text-xs text-base-content/35">
              {appointmentDate.toLocaleDateString("es-MX", {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric",
              })}{" "}
              · {appointment.appointment_time}
            </p>
            <p className="text-[11px] text-base-content/25 mt-1">
              Completada: {new Date(appointment.updated_at).toLocaleString("es-MX")}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-10">
      {/* Estadísticas */}
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        <div
          className="rounded-2xl p-4 md:p-6 text-center border"
          style={{ backgroundColor: "#222222", borderColor: "rgba(198, 156, 109, 0.3)" }}
        >
          <p
            className="text-3xl md:text-5xl font-bold"
            style={{ fontFamily: "var(--font-display)", color: "#C69C6D" }}
          >
            {pendingAppointments.length}
          </p>
          <p className="text-[10px] md:text-xs text-base-content/40 mt-1.5 uppercase tracking-wider">
            Pendientes
          </p>
        </div>
        <div
          className="rounded-2xl p-4 md:p-6 text-center border"
          style={{ backgroundColor: "#222222", borderColor: "rgba(198, 156, 109, 0.15)" }}
        >
          <p
            className="text-3xl md:text-5xl font-bold text-base-content/70"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {confirmedAppointments.length}
          </p>
          <p className="text-[10px] md:text-xs text-base-content/40 mt-1.5 uppercase tracking-wider">
            Confirmadas
          </p>
        </div>
        <div
          className="rounded-2xl p-4 md:p-6 text-center border border-base-content/8"
          style={{ backgroundColor: "#222222" }}
        >
          <p
            className="text-3xl md:text-5xl font-bold text-base-content/35"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {completedAppointments?.length || 0}
          </p>
          <p className="text-[10px] md:text-xs text-base-content/30 mt-1.5 uppercase tracking-wider">
            Completadas
          </p>
        </div>
      </div>

      {/* Pendientes */}
      <div>
        <SectionHeader title="Pendientes de confirmación" count={pendingAppointments.length} />
        {pendingAppointments.length === 0 ? (
          <EmptyState message="No hay citas pendientes" />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {pendingAppointments.map((apt) => (
              <AppointmentCard key={apt.id} appointment={apt} isPending={true} />
            ))}
          </div>
        )}
      </div>

      {/* Confirmadas */}
      <div>
        <SectionHeader title="Confirmadas" count={confirmedAppointments.length} />
        {confirmedAppointments.length === 0 ? (
          <EmptyState message="No hay citas confirmadas" />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {confirmedAppointments.map((apt) => (
              <AppointmentCard key={apt.id} appointment={apt} isPending={false} />
            ))}
          </div>
        )}
      </div>

      {/* Completadas */}
      <div>
        <SectionHeader title="Completadas" count={completedAppointments?.length || 0} />
        {!completedAppointments || completedAppointments.length === 0 ? (
          <EmptyState message="No hay citas completadas aún" />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {completedAppointments.map((apt) => (
              <CompletedAppointmentCard key={apt.id} appointment={apt} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

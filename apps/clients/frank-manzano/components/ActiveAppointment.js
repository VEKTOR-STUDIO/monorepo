"use client";

import { useState } from "react";
import { createClient } from "@/libs/supabase/client";
import { useRouter } from "next/navigation";

const ActiveAppointment = ({ appointment }) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const getStatusBadge = (status) => {
    const badges = {
      pending: { class: "badge-warning", label: "Pendiente de Confirmación" },
      confirmed: { class: "badge-success", label: "Confirmada" },
    };
    return badges[status] || { class: "badge-ghost", label: status };
  };

  const handleCancelAppointment = async () => {
    setLoading(true);
    const supabase = createClient();

    try {
      const { error } = await supabase.from("appointments").delete().eq("id", appointment.id);

      if (error) throw error;

      router.refresh();
    } catch (err) {
      console.error("Error al cancelar cita:", err);
      alert("Error al cancelar la cita. Intenta de nuevo.");
    } finally {
      setLoading(false);
      setShowConfirmDialog(false);
    }
  };

  const statusBadge = getStatusBadge(appointment.status);
  const appointmentDate = new Date(appointment.appointment_date);
  const now = new Date();
  const daysUntil = Math.ceil((appointmentDate - now) / (1000 * 60 * 60 * 24));
  const serviceName = appointment.services?.name ?? "Servicio";
  const durationMin = appointment.services?.duration_minutes ?? 60;

  return (
    <>
      <div className="w-full mx-auto">
        <div className="relative rounded-md p-6 md:p-8 overflow-hidden border border-base-300 bg-base-200 shadow-sm">
          <div className="relative z-10 flex items-start justify-between mb-6 flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-md bg-primary/10 flex items-center justify-center border border-primary/30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 md:h-7 md:w-7 text-primary"
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
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-primary">Cita activa</h2>
                <p className="text-sm text-base-content/70">
                  {serviceName} · Lorem ipsum
                </p>
              </div>
            </div>
            <span className={`badge ${statusBadge.class} badge-md px-3 md:px-4 rounded-md text-xs md:text-sm`}>
              {statusBadge.label}
            </span>
          </div>

          <div className="relative z-10 rounded-md border border-base-300 p-6 mb-6 bg-base-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-base-content/50 mb-2 uppercase tracking-wider">Fecha</p>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-md bg-base-200 flex flex-col items-center justify-center text-primary border border-base-300">
                    <span className="text-xl md:text-2xl font-bold">{appointmentDate.getDate()}</span>
                    <span className="text-[10px] md:text-xs uppercase font-semibold">
                      {appointmentDate.toLocaleDateString("es-MX", { month: "short" })}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-base-content">
                      {appointmentDate.toLocaleDateString("es-MX", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    {daysUntil >= 0 && (
                      <p className="text-sm text-primary font-medium">
                        {daysUntil === 0 ? "Hoy" : daysUntil === 1 ? "Mañana" : `En ${daysUntil} días`}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs text-base-content/50 mb-2 uppercase tracking-wider">Hora</p>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 md:h-16 md:h-16 rounded-md bg-base-200 flex items-center justify-center border border-base-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-7 w-7 md:h-8 md:w-8 text-primary"
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
                  </div>
                  <p className="font-bold text-xl md:text-2xl text-base-content">{appointment.appointment_time}</p>
                </div>
              </div>
            </div>
            {appointment.message && (
              <div className="mt-4 pt-4 border-t border-base-300">
                <p className="text-sm text-base-content/60 mb-1">Notas</p>
                <p className="text-base-content/80 italic">&quot;{appointment.message}&quot;</p>
              </div>
            )}
          </div>

          <div className="rounded-md p-4 mb-6 border border-base-300 bg-base-100">
            <div className="flex gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-primary flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="text-sm">
                <p className="font-semibold text-base-content mb-1">Notas genéricas</p>
                <ul className="space-y-1 text-base-content/70">
                  <li>• Lorem ipsum dolor sit amet.</li>
                  <li>• Consectetur adipiscing elit sed do eiusmod.</li>
                  <li>• Duración aproximada: {durationMin} minutos</li>
                  <li>• Texto de demostración</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setShowConfirmDialog(true)}
              className="btn btn-ghost btn-sm text-error hover:bg-error/10 rounded-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancelar cita
            </button>
          </div>
        </div>
      </div>

      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-base-100 rounded-md p-6 md:p-8 max-w-md w-full shadow-sm border border-base-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-md bg-error/10 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-error"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl md:text-2xl font-bold">¿Cancelar la cita?</h3>
            </div>
            <p className="text-sm md:text-base text-base-content/70 mb-6">
              Esta acción no se puede deshacer. Podrás agendar una nueva cita después de cancelar esta.
            </p>
            <div className="flex flex-col-reverse md:flex-row gap-3 justify-end">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="btn btn-ghost hover:bg-base-200 rounded-md"
                disabled={loading}
              >
                No, mantener
              </button>
              <button onClick={handleCancelAppointment} className="btn btn-error rounded-md" disabled={loading}>
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm" />
                    <span className="ml-2">Cancelando…</span>
                  </>
                ) : (
                  "Sí, cancelar"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ActiveAppointment;

"use client";

import { useState } from "react";
import Image from "next/image";
import { createClient } from "@/libs/supabase/client";
import { useRouter } from "next/navigation";
import config from "@/config";

const STEP_LABELS = ["El Arte", "Fecha y Hora", "Ficha Clínica", "Confirmar"];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function BookingWizard({ services, user, userProfile }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [hasPreviousWork, setHasPreviousWork] = useState(false);
  const [pregnantOrNursing, setPregnantOrNursing] = useState(false);
  const [anticoagulants, setAnticoagulants] = useState(false);
  const [healthNotesExtra, setHealthNotesExtra] = useState("");

  const fullName =
    userProfile?.name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    "";
  const email = user?.email || "";

  const buildHealthNotes = () => {
    const parts = [];
    if (hasPreviousWork) parts.push("Micropigmentación anterior: Sí");
    else parts.push("Micropigmentación anterior: No");
    if (pregnantOrNursing) parts.push("Embarazo/lactancia: Sí");
    else parts.push("Embarazo/lactancia: No");
    if (anticoagulants) parts.push("Anticoagulantes: Sí");
    else parts.push("Anticoagulantes: No");
    if (healthNotesExtra.trim()) parts.push(`Notas: ${healthNotesExtra.trim()}`);
    return parts.join(". ");
  };

  const canProceedStep0 = !!selectedService;
  const canProceedStep1 =
    appointmentDate &&
    appointmentTime &&
    new Date(`${appointmentDate}T${appointmentTime}`) > new Date();

  const handleConfirm = async () => {
    setLoading(true);
    setError("");
    const supabase = createClient();
    try {
      const { error: insertError } = await supabase
        .from("appointments")
        .insert({
          user_id: user.id,
          service_id: selectedService?.id ?? null,
          full_name: fullName || email?.split("@")[0] || "Cliente",
          email,
          appointment_date: appointmentDate,
          appointment_time: appointmentTime,
          message: null,
          status: "pending",
          health_notes: buildHealthNotes(),
          has_previous_work: hasPreviousWork,
          deposit_status: "pending",
        })
        .select()
        .single();

      if (insertError) throw insertError;
      setTimeout(() => router.refresh(), 800);
    } catch (err) {
      console.error("Error al reservar:", err);
      setError(err.message || "Error al confirmar la reserva. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const whatsappUrl = config?.business?.whatsapp || "https://wa.me/584120000000";

  return (
    <div className="w-full mx-auto">
      <div
        className="relative rounded-2xl overflow-hidden border border-[#C69C6D]/40 bg-[#222222] shadow-xl"
        style={{ borderColor: "rgba(198, 156, 109, 0.4)" }}
      >
        {/* Stepper elegante */}
        <div className="border-b border-[#C69C6D]/30 bg-[#1A1A1A]/80 px-4 py-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {STEP_LABELS.map((label, i) => (
              <button
                key={label}
                type="button"
                onClick={() => setStep(i)}
                className={classNames(
                  "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  step === i
                    ? "bg-[#C69C6D] text-[#1A1A1A]"
                    : "text-base-content/70 hover:text-[#C69C6D] hover:bg-[#C69C6D]/10"
                )}
              >
                {i + 1}. {label}
              </button>
            ))}
          </div>
          {error && (
            <div className="mt-3 p-3 rounded-lg bg-error/10 border border-error/30 text-error text-sm text-center">
              {error}
            </div>
          )}
        </div>

        {/* Render current step content via hidden panels and manual step index */}
        <div className="p-6 md:p-8">
          {step === 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-[#C69C6D]" style={{ fontFamily: "var(--font-display)" }}>
                Elige tu experiencia
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(services || []).map((svc) => (
                  <button
                    key={svc.id}
                    type="button"
                    onClick={() => setSelectedService(svc)}
                    className={classNames(
                      "text-left rounded-xl border-2 p-4 transition-all duration-200",
                      selectedService?.id === svc.id
                        ? "border-[#C69C6D] bg-[#C69C6D]/10 shadow-lg shadow-[#C69C6D]/20"
                        : "border-base-content/10 bg-[#1A1A1A] hover:border-[#C69C6D]/50"
                    )}
                  >
                    {svc.image_url ? (
                      <div className="aspect-video rounded-lg overflow-hidden mb-3 bg-base-300 relative">
                        <Image src={svc.image_url} alt={svc.name} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="aspect-video rounded-lg bg-[#2a2a2a] mb-3 flex items-center justify-center text-[#C69C6D]/50">
                        <span className="text-4xl">✦</span>
                      </div>
                    )}
                    <p className="font-semibold text-base-content">{svc.name}</p>
                    {svc.description && (
                      <p className="text-sm text-base-content/60 mt-1 line-clamp-2">{svc.description}</p>
                    )}
                    <div className="mt-2 flex items-center gap-3 text-sm">
                      <span className="text-[#C69C6D] font-medium">${Number(svc.price).toFixed(0)}</span>
                      <span className="text-base-content/50">{svc.duration_minutes} min</span>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={!canProceedStep0}
                  className="btn bg-[#C69C6D] text-[#1A1A1A] border-none hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-[#C69C6D]" style={{ fontFamily: "var(--font-display)" }}>
                Fecha y hora
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label text-base-content/80">Fecha</label>
                  <input
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="input w-full bg-[#1A1A1A] border-b border-[#C69C6D]/50 rounded-none"
                  />
                </div>
                <div>
                  <label className="label text-base-content/80">Hora</label>
                  <input
                    type="time"
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    className="input w-full bg-[#1A1A1A] border-b border-[#C69C6D]/50 rounded-none"
                  />
                </div>
              </div>
              <div className="flex justify-between pt-4">
                <button type="button" onClick={() => setStep(0)} className="btn btn-ghost text-base-content/70">
                  Atrás
                </button>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!canProceedStep1}
                  className="btn bg-[#C69C6D] text-[#1A1A1A] border-none hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-[#C69C6D]" style={{ fontFamily: "var(--font-display)" }}>
                Ficha clínica
              </h3>
              <p className="text-sm text-base-content/60">
                Responde con sinceridad para tu seguridad y el mejor resultado.
              </p>
              <div className="space-y-4">
                <label className="flex items-center justify-between gap-4 p-4 rounded-xl bg-[#1A1A1A] border border-base-content/10 cursor-pointer">
                  <span className="text-base-content">¿Tienes micropigmentación o trabajo previo en la zona?</span>
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={hasPreviousWork}
                    onChange={(e) => setHasPreviousWork(e.target.checked)}
                  />
                </label>
                {hasPreviousWork && (
                  <div className="p-4 rounded-xl bg-warning/10 border border-warning/30 text-warning">
                    <p className="text-sm font-medium">
                      Por favor envía una foto del trabajo actual por WhatsApp para evaluación previa.
                    </p>
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm underline">
                      Abrir WhatsApp →
                    </a>
                  </div>
                )}
                <label className="flex items-center justify-between gap-4 p-4 rounded-xl bg-[#1A1A1A] border border-base-content/10 cursor-pointer">
                  <span className="text-base-content">¿Estás embarazada o en período de lactancia?</span>
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={pregnantOrNursing}
                    onChange={(e) => setPregnantOrNursing(e.target.checked)}
                  />
                </label>
                <label className="flex items-center justify-between gap-4 p-4 rounded-xl bg-[#1A1A1A] border border-base-content/10 cursor-pointer">
                  <span className="text-base-content">¿Tomas anticoagulantes o medicación que afecte la coagulación?</span>
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={anticoagulants}
                    onChange={(e) => setAnticoagulants(e.target.checked)}
                  />
                </label>
                <div>
                  <label className="label text-base-content/80">Alergias u otras notas (opcional)</label>
                  <textarea
                    value={healthNotesExtra}
                    onChange={(e) => setHealthNotesExtra(e.target.value)}
                    placeholder="Ej. alergia a anestésicos, condiciones de piel..."
                    className="textarea w-full bg-[#1A1A1A] border-b border-[#C69C6D]/50 rounded-none min-h-[80px]"
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-between pt-4">
                <button type="button" onClick={() => setStep(1)} className="btn btn-ghost text-base-content/70">
                  Atrás
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="btn bg-[#C69C6D] text-[#1A1A1A] border-none hover:opacity-90"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-[#C69C6D]" style={{ fontFamily: "var(--font-display)" }}>
                Resumen de tu reserva
              </h3>
              <div className="rounded-xl border border-[#C69C6D]/30 bg-[#1A1A1A] p-6 space-y-4">
                {selectedService && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-base-content/50">Servicio</p>
                    <p className="font-semibold text-[#C69C6D]">{selectedService.name}</p>
                    <p className="text-sm text-base-content/60">
                      ${Number(selectedService.price).toFixed(0)} · {selectedService.duration_minutes} min
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-xs uppercase tracking-wider text-base-content/50">Fecha y hora</p>
                  <p className="font-semibold">
                    {appointmentDate
                      ? new Date(appointmentDate).toLocaleDateString("es-MX", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "—"}
                  </p>
                  <p className="text-[#C69C6D]">{appointmentTime || "—"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-base-content/50">Datos</p>
                  <p>{fullName || email}</p>
                  <p className="text-sm text-base-content/60">{email}</p>
                </div>
              </div>
              {error && (
                <div className="p-3 rounded-lg bg-error/10 border border-error/30 text-error text-sm">{error}</div>
              )}
              <div className="flex justify-between pt-2">
                <button type="button" onClick={() => setStep(2)} className="btn btn-ghost text-base-content/70">
                  Atrás
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={loading}
                  className="btn bg-[#C69C6D] text-[#1A1A1A] border-none hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner loading-sm" />
                      <span className="ml-2">Confirmando...</span>
                    </>
                  ) : (
                    "Confirmar reserva"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

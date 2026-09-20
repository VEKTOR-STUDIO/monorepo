"use client";

import { useState } from "react";
import { createClient } from "@/libs/supabase/client";
import { useRouter } from "next/navigation";

const AppointmentForm = ({ user, userProfile }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const [formData, setFormData] = useState({
    full_name: userProfile?.name || user?.user_metadata?.full_name || user?.user_metadata?.name || "",
    email: user?.email || "",
    phone: "",
    company: "",
    appointment_date: "",
    appointment_time: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const supabase = createClient();

    // Validaciones
    if (!formData.appointment_date || !formData.appointment_time) {
      setError("Por favor selecciona una fecha y hora para la cita");
      setLoading(false);
      return;
    }

    try {
      const { error: insertError } = await supabase
        .from("appointments")
        .insert({
          user_id: user.id,
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          appointment_date: formData.appointment_date,
          appointment_time: formData.appointment_time,
          message: formData.message,
          status: "pending",
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setSuccess(true);
      
      // Esperar 1 segundo para mostrar el mensaje de éxito y luego refrescar
      setTimeout(() => {
        router.refresh(); // Refresca la página para mostrar ActiveAppointment
      }, 1000);
    } catch (err) {
      console.error("Error al agendar cita:", err);
      setError(err.message || "Error al agendar la cita. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto">
      <div className="relative bg-base-100/80 backdrop-blur-md border border-base-content/10 rounded-2xl p-6 md:p-8 shadow-xl overflow-hidden">
        {/* Orbs decorativos */}
        <div className="absolute -top-24 -right-24 w-[20rem] h-[20rem] bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 rounded-full blur-3xl opacity-40 pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-[20rem] h-[20rem] bg-gradient-to-br from-accent/20 via-secondary/20 to-primary/20 rounded-full blur-3xl opacity-40 pointer-events-none" />
        
        <div className="relative z-10 mb-6">
          <h2 className="text-2xl md:text-3xl font-black mb-2">
            Agenda tu cita con{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Daniel Tamayo
            </span>
          </h2>
          <p className="text-sm md:text-base text-base-content/70">
            Completa el formulario y nos pondremos en contacto contigo para
            confirmar tu sesión de fisioterapia.
          </p>
        </div>

        {success && (
          <div className="alert alert-success mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>¡Cita agendada! Te confirmaremos disponibilidad a la brevedad.</span>
          </div>
        )}

        {error && (
          <div className="alert alert-error mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
          {/* Información Personal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-sm md:text-base">Nombre Completo *</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="input input-bordered w-full pl-12 h-12 focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:border-accent transition-all duration-300 hover:border-primary/50"
                  required
                  placeholder="Tu nombre completo"
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-sm md:text-base">Email *</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input input-bordered w-full pl-12 h-12 focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:border-accent transition-all duration-300 hover:border-primary/50"
                  required
                  placeholder="tu@email.com"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-sm md:text-base">Teléfono</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+52 123 456 7890"
                  className="input input-bordered w-full pl-12 h-12 focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:border-accent transition-all duration-300 hover:border-primary/50"
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-sm md:text-base">Deporte / Academia</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Ej. BJJ, gimnasio, Total Elite"
                  className="input input-bordered w-full pl-12 h-12 focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:border-accent transition-all duration-300 hover:border-primary/50"
                />
              </div>
            </div>
          </div>

          {/* Fecha y Hora */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-sm md:text-base">Fecha Preferida *</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="date"
                  name="appointment_date"
                  value={formData.appointment_date}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="input input-bordered w-full pl-12 h-12 focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:border-accent transition-all duration-300 hover:border-primary/50"
                  required
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-sm md:text-base">Hora Preferida *</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <input
                  type="time"
                  name="appointment_time"
                  value={formData.appointment_time}
                  onChange={handleChange}
                  className="input input-bordered w-full pl-12 h-12 focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:border-accent transition-all duration-300 hover:border-primary/50"
                  required
                />
              </div>
            </div>
          </div>

          {/* Mensaje */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-sm md:text-base">
                Motivo de la consulta / Lesión
              </span>
            </label>
            <div className="relative">
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="textarea textarea-bordered min-h-[120px] w-full focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:border-accent transition-all duration-300 hover:border-primary/50 text-base"
                placeholder="Ej. recuperación de lesión, dolor de hombro, preparación para competencia..."
              />
            </div>
          </div>

          {/* Botón de Submit */}
          <div className="flex justify-center md:justify-end gap-3 pt-2">
            <button
              type="submit"
              className="w-full cursor-pointer md:w-auto relative text-base py-3 px-8 rounded-lg inline-flex items-center justify-center text-white shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 bg-gradient-to-r from-primary via-accent to-secondary"
              disabled={loading}
              style={{
                background: loading 
                  ? 'text-base-100' 
                  : 'linear-gradient(90deg, text-base-100 0%, text-base-300 50%, text-base-200 100%)',
                backgroundSize: '200% 100%',
                animation: loading ? 'none' : 'gradientSlide 4s ease-in-out infinite'
              }}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-md"></span>
                  <span className="ml-2">Agendando...</span>
                </>
              ) : (
                <span className="text-base-100 inline-flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="black"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Confirmar cita
                </span>
              )}
            </button>
          </div>
        </form>

        {/* Keyframe para la animación del botón degradado */}
        <style jsx>{`
          @keyframes gradientSlide {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
        `}</style>

        {/* Additional note */}
        <div className="mt-6 p-4 bg-base-200 rounded-lg">
          <p className="text-sm text-base-content/70">
            <strong>Nota:</strong> Te confirmaremos disponibilidad por email o contacto en menos de 24 horas.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AppointmentForm;


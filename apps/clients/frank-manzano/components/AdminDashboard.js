"use client";

import { useState } from "react";
import { createClient } from "@/libs/supabase/client";
import { useRouter } from "next/navigation";

const AdminDashboard = ({
  pendingAppointments = [],
  confirmedAppointments = [],
  completedAppointments = [],
  manifestoPosts = [],
  eliteLeads = [],
}) => {
  const [loadingId, setLoadingId] = useState(null);
  const [manifestoList, setManifestoList] = useState(manifestoPosts);
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
      <div className="h-px flex-1 bg-base-content/20" />
      <div className="flex items-center gap-2.5">
        <h2
          className="text-sm md:text-base font-bold uppercase tracking-[0.15em] text-primary"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </h2>
        {count > 0 && (
          <span className="w-5 h-5 rounded-none flex items-center justify-center text-[10px] font-bold border-2 border-primary text-primary">
            {count}
          </span>
        )}
      </div>
      <div className="h-px flex-1 bg-base-content/20" />
    </div>
  );

  const EmptyState = ({ message }) => (
    <div className="rounded-none p-10 text-center border-2 border-base-content/20 bg-base-200">
      <div className="w-10 h-10 rounded-none bg-base-content/10 flex items-center justify-center mx-auto mb-3 border-2 border-base-content/20">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <p className="text-sm text-base-content/50">{message}</p>
    </div>
  );

  const AppointmentCard = ({ appointment, isPending }) => {
    const appointmentDate = new Date(appointment.appointment_date);
    const isLoading = loadingId === appointment.id;
    const serviceName = appointment.services?.name ?? null;

    return (
      <div
        className="group relative rounded-none p-5 md:p-6 border-2 border-base-content/20 hover:border-primary/40 transition-all duration-200 overflow-hidden bg-base-200"
      >
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-none flex items-center justify-center flex-shrink-0 border-2 border-primary/30 bg-primary/10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="min-w-0">
                <h3
                  className="text-base md:text-lg font-bold truncate group-hover:text-primary transition-colors text-base-content"
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
            <div className="mb-4 px-3 py-2 rounded-none border-2 border-primary/20 bg-primary/5">
              <p className="text-[10px] uppercase tracking-wider text-base-content/50 mb-0.5">Servicio</p>
              <p className="text-sm font-bold text-primary">{serviceName}</p>
            </div>
          )}

          {/* Fecha y hora */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="rounded-none p-3 border-2 border-base-content/20 bg-base-100">
              <p className="text-[10px] text-base-content/50 mb-1 uppercase tracking-wider">Fecha</p>
              <p className="text-sm font-semibold text-base-content/80">
                {appointmentDate.toLocaleDateString("es-MX", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="rounded-none p-3 border-2 border-base-content/20 bg-base-100">
              <p className="text-[10px] text-base-content/50 mb-1 uppercase tracking-wider">Hora</p>
              <p className="text-sm font-semibold text-base-content/80">{appointment.appointment_time}</p>
            </div>
          </div>

          {/* Contacto */}
          {(appointment.phone || appointment.company) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {appointment.phone && (
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-none text-xs border-2 border-base-content/20 bg-base-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-base-content/60">{appointment.phone}</span>
                </div>
              )}
              {appointment.company && (
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-none text-xs border-2 border-base-content/20 bg-base-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="text-base-content/60">{appointment.company}</span>
                </div>
              )}
            </div>
          )}

          {/* Mensaje */}
          {appointment.message && (
            <div className="rounded-none p-3 mb-4 border-2 border-base-content/20 bg-base-100">
              <p className="text-[10px] text-base-content/50 mb-1 uppercase tracking-wider">Mensaje</p>
              <p className="text-sm text-base-content/60 italic line-clamp-2">&quot;{appointment.message}&quot;</p>
            </div>
          )}

          {/* Ficha clínica (resumen) */}
          {appointment.health_notes && (
            <div className="rounded-none p-3 mb-4 border-2 border-primary/20 bg-primary/5">
              <p className="text-[10px] text-base-content/50 mb-1 uppercase tracking-wider">Ficha clínica</p>
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
                  className="flex-1 btn btn-sm btn-primary rounded-none border-2 border-primary font-bold tracking-widest uppercase text-primary-content hover:opacity-90 disabled:opacity-40"
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
                  className="flex-1 btn btn-sm btn-ghost rounded-none border-2 border-primary/50 text-primary font-bold tracking-wider uppercase disabled:opacity-40"
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
        className="group relative rounded-none p-4 md:p-5 border-2 border-base-content/20 hover:border-primary/30 transition-all duration-200 opacity-70 hover:opacity-100 bg-base-200"
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-none border-2 border-base-content/20 bg-base-content/5 flex items-center justify-center flex-shrink-0 mt-0.5">
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
              <span className="flex-shrink-0 px-2 py-0.5 rounded-none text-[10px] uppercase tracking-wider border-2 border-base-content/20 text-base-content/50">
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
        <div className="rounded-none p-4 md:p-6 text-center border-2 border-primary/40 bg-base-200">
          <p className="text-3xl md:text-5xl font-bold text-primary" style={{ fontFamily: "var(--font-display)" }}>
            {pendingAppointments.length}
          </p>
          <p className="text-[10px] md:text-xs text-base-content/50 mt-1.5 uppercase tracking-wider">Pendientes</p>
        </div>
        <div className="rounded-none p-4 md:p-6 text-center border-2 border-base-content/20 bg-base-200">
          <p className="text-3xl md:text-5xl font-bold text-base-content/80" style={{ fontFamily: "var(--font-display)" }}>
            {confirmedAppointments.length}
          </p>
          <p className="text-[10px] md:text-xs text-base-content/50 mt-1.5 uppercase tracking-wider">Confirmadas</p>
        </div>
        <div className="rounded-none p-4 md:p-6 text-center border-2 border-base-content/20 bg-base-200">
          <p className="text-3xl md:text-5xl font-bold text-base-content/50" style={{ fontFamily: "var(--font-display)" }}>
            {completedAppointments?.length || 0}
          </p>
          <p className="text-[10px] md:text-xs text-base-content/40 mt-1.5 uppercase tracking-wider">Completadas</p>
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

      {/* Posts (manifesto_posts) */}
      <div>
        <SectionHeader title="Posts" count={manifestoList.length} />
        <ManifestoEditor list={manifestoList} setList={setManifestoList} />
        {manifestoList.length === 0 ? (
          <EmptyState message="Sin entradas. Añade una arriba." />
        ) : (
          <div className="space-y-3 mt-4">
            {manifestoList.map((post) => (
              <ManifestoCard key={post.id} post={post} onUpdate={setManifestoList} list={manifestoList} />
            ))}
          </div>
        )}
      </div>

      {/* Leads (elite_leads) */}
      <div>
        <SectionHeader title="Leads" count={eliteLeads.length} />
        {eliteLeads.length === 0 ? (
          <EmptyState message="Sin leads" />
        ) : (
          <div className="rounded-none overflow-hidden border-2 border-base-content/20">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-base-content/20 bg-base-200">
                  <th className="p-3 text-xs uppercase tracking-wider font-bold text-base-content/80" style={{ fontFamily: "var(--font-display)" }}>Nombre</th>
                  <th className="p-3 text-xs uppercase tracking-wider font-bold text-base-content/80" style={{ fontFamily: "var(--font-display)" }}>Teléfono</th>
                  <th className="p-3 text-xs uppercase tracking-wider font-bold text-base-content/80" style={{ fontFamily: "var(--font-display)" }}>Nivel</th>
                  <th className="p-3 text-xs uppercase tracking-wider font-bold text-base-content/80" style={{ fontFamily: "var(--font-display)" }}>Objetivos</th>
                  <th className="p-3 text-xs uppercase tracking-wider font-bold text-base-content/80" style={{ fontFamily: "var(--font-display)" }}>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {eliteLeads.map((lead) => (
                  <tr key={lead.id} className="border-b border-base-content/10 last:border-b-0 bg-base-100 hover:bg-base-200">
                    <td className="p-3 font-semibold text-base-content">{lead.name}</td>
                    <td className="p-3 text-base-content/80">{lead.phone}</td>
                    <td className="p-3 text-base-content/70 text-sm">{lead.current_fitness_level || "—"}</td>
                    <td className="p-3 text-base-content/70 text-sm max-w-xs truncate" title={lead.goals || ""}>{lead.goals || "—"}</td>
                    <td className="p-3 text-base-content/50 text-sm">{new Date(lead.created_at).toLocaleDateString("es-VE")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

function ManifestoEditor({ list, setList }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/manifesto", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: title.trim(), content: content.trim() }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error");
      setList([data, ...list]);
      setTitle("");
      setContent("");
    } catch (err) {
      alert(err.message || "Error al crear");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-none border-2 border-primary/30 bg-base-200 p-4 md:p-5 space-y-3">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título"
        className="input input-bordered w-full rounded-none border-2 border-base-content/20 bg-base-100"
        required
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Contenido"
        rows={3}
        className="textarea textarea-bordered w-full rounded-none border-2 border-base-content/20 bg-base-100"
        required
      />
      <button type="submit" disabled={loading} className="btn btn-primary btn-sm rounded-none border-2 border-primary font-bold uppercase tracking-wider">
        {loading ? "Guardando…" : "Añadir entrada"}
      </button>
    </form>
  );
}

function ManifestoCard({ post, onUpdate, list }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/manifesto/${post.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, content }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error");
      onUpdate(list.map((p) => (p.id === post.id ? data : p)));
      setEditing(false);
    } catch (err) {
      alert(err.message || "Error al actualizar");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿Eliminar esta entrada?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/manifesto/${post.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar");
      onUpdate(list.filter((p) => p.id !== post.id));
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (editing) {
    return (
      <form onSubmit={handleUpdate} className="rounded-none border-2 border-primary/40 bg-base-200 p-4 space-y-3">
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="input input-bordered w-full rounded-none border-2 border-base-content/20 bg-base-100" required />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={3} className="textarea textarea-bordered w-full rounded-none border-2 border-base-content/20 bg-base-100" required />
        <div className="flex gap-2">
          <button type="submit" disabled={loading} className="btn btn-primary btn-sm rounded-none border-2 border-primary">Guardar</button>
          <button type="button" onClick={() => setEditing(false)} className="btn btn-ghost btn-sm rounded-none border-2 border-base-content/20">Cancelar</button>
        </div>
      </form>
    );
  }

  return (
    <div className="rounded-none border-2 border-base-content/20 bg-base-200 p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
      <div>
        <h3 className="font-bold text-primary" style={{ fontFamily: "var(--font-display)" }}>{post.title}</h3>
        <p className="text-sm text-base-content/70 line-clamp-2 mt-1">{post.content}</p>
        <p className="text-xs text-base-content/40 mt-2">{new Date(post.created_at).toLocaleDateString("es-VE")}</p>
      </div>
      <div className="flex gap-2 shrink-0">
        <button type="button" onClick={() => setEditing(true)} className="btn btn-ghost btn-sm rounded-none border-2 border-base-content/20">Editar</button>
        <button type="button" onClick={handleDelete} disabled={loading} className="btn btn-ghost btn-sm rounded-none border-2 border-error/30 text-error">Eliminar</button>
      </div>
    </div>
  );
}

export default AdminDashboard;

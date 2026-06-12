"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { createClient } from "@/libs/supabase/client";
import { EVENT_STATUS_LABELS } from "@/data/fighterOptions";

const EMPTY_EVENT = {
  name: "Legión",
  edition: "",
  event_date: "",
  venue: "",
  city: "Caracas",
  status: "borrador",
};

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("es-VE", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Fecha por definir";

/**
 * EventsManager — lista de carteleras + creación de nuevos eventos.
 */
export default function EventsManager({ events = [] }) {
  const supabase = createClient();
  const router = useRouter();

  const [showForm, setShowForm] = useState(events.length === 0);
  const [form, setForm] = useState(EMPTY_EVENT);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("events")
        .insert({
          name: form.name.trim(),
          edition: form.edition.trim() || null,
          event_date: form.event_date
            ? new Date(form.event_date).toISOString()
            : null,
          venue: form.venue.trim() || null,
          city: form.city.trim() || null,
          status: form.status,
        })
        .select("id")
        .single();
      if (error) throw error;

      toast.success("Evento creado");
      router.push(`/dashboard/events/${data.id}`);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "No se pudo crear el evento");
      setIsLoading(false);
    }
  };

  const handleDelete = async (event) => {
    const ok = window.confirm(
      `¿Eliminar "${event.name} ${event.edition || ""}" y todos sus combates? Esta acción no se puede deshacer.`
    );
    if (!ok) return;

    setDeletingId(event.id);
    try {
      const { error } = await supabase.from("events").delete().eq("id", event.id);
      if (error) throw error;
      toast.success("Evento eliminado");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "No se pudo eliminar el evento");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Crear evento */}
      <div className="border border-primary/30 bg-base-200/60">
        <button
          className="w-full flex items-center justify-between p-5 text-left"
          onClick={() => setShowForm((v) => !v)}
        >
          <h2 className="font-display text-xl md:text-2xl leading-none">
            Nueva <span className="text-primary">cartelera</span>
          </h2>
          <span className="font-display text-primary text-2xl">
            {showForm ? "−" : "+"}
          </span>
        </button>

        {showForm && (
          <form onSubmit={handleCreate} className="p-5 pt-0 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text text-[0.65rem] tracking-[0.2em] uppercase text-base-content/60 font-bold">
                    Nombre <span className="text-primary">*</span>
                  </span>
                </div>
                <input
                  required
                  type="text"
                  className="input w-full"
                  value={form.name}
                  onChange={set("name")}
                />
              </label>

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text text-[0.65rem] tracking-[0.2em] uppercase text-base-content/60 font-bold">
                    Edición
                  </span>
                </div>
                <input
                  type="text"
                  className="input w-full"
                  placeholder="XI"
                  value={form.edition}
                  onChange={set("edition")}
                />
              </label>

              <label className="form-control w-full col-span-2">
                <div className="label">
                  <span className="label-text text-[0.65rem] tracking-[0.2em] uppercase text-base-content/60 font-bold">
                    Fecha y hora
                  </span>
                </div>
                <input
                  type="datetime-local"
                  className="input w-full"
                  value={form.event_date}
                  onChange={set("event_date")}
                />
              </label>

              <label className="form-control w-full col-span-2">
                <div className="label">
                  <span className="label-text text-[0.65rem] tracking-[0.2em] uppercase text-base-content/60 font-bold">
                    Sede
                  </span>
                </div>
                <input
                  type="text"
                  className="input w-full"
                  placeholder="Hotel Tamanaco"
                  value={form.venue}
                  onChange={set("venue")}
                />
              </label>

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text text-[0.65rem] tracking-[0.2em] uppercase text-base-content/60 font-bold">
                    Ciudad
                  </span>
                </div>
                <input
                  type="text"
                  className="input w-full"
                  value={form.city}
                  onChange={set("city")}
                />
              </label>

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text text-[0.65rem] tracking-[0.2em] uppercase text-base-content/60 font-bold">
                    Estado
                  </span>
                </div>
                <select
                  className="select w-full"
                  value={form.status}
                  onChange={set("status")}
                >
                  <option value="borrador">Borrador / Simulación</option>
                  <option value="publicado">Publicado</option>
                </select>
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading && <span className="loading loading-spinner loading-xs" />}
              Crear y armar cartelera
            </button>
          </form>
        )}
      </div>

      {/* Lista de eventos */}
      {events.length === 0 ? (
        <div className="border border-base-content/10 bg-base-200 p-10 text-center text-base-content/50 text-sm tracking-[0.2em] uppercase">
          Aún no hay carteleras creadas
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {events.map((event) => {
            const status =
              EVENT_STATUS_LABELS[event.status] || EVENT_STATUS_LABELS.borrador;
            const boutCount = event.bouts?.[0]?.count ?? 0;
            return (
              <div
                key={event.id}
                className="border border-base-content/10 bg-base-200 hover:border-primary/40 transition-colors"
              >
                <Link
                  href={`/dashboard/events/${event.id}`}
                  className="block p-5"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-display text-2xl md:text-3xl leading-none">
                      {event.name}{" "}
                      {event.edition && (
                        <span className="text-primary">{event.edition}</span>
                      )}
                    </h3>
                    <span
                      className={`badge ${status.badge} badge-sm uppercase text-[0.6rem] font-bold tracking-wider shrink-0`}
                    >
                      {event.status}
                    </span>
                  </div>
                  <p className="text-sm text-base-content/60 capitalize">
                    {formatDate(event.event_date)}
                  </p>
                  <p className="text-[0.65rem] tracking-[0.2em] uppercase text-base-content/40 font-bold mt-1">
                    {[event.venue, event.city].filter(Boolean).join(" · ") ||
                      "Sede por definir"}
                  </p>
                  <p className="text-[0.65rem] tracking-[0.2em] uppercase text-primary font-bold mt-3">
                    {boutCount} {boutCount === 1 ? "combate" : "combates"}
                  </p>
                </Link>
                <div className="border-t border-base-content/10 px-5 py-2 flex justify-between items-center">
                  <Link
                    href={`/dashboard/events/${event.id}`}
                    className="btn btn-ghost btn-xs text-primary"
                  >
                    Armar cartelera →
                  </Link>
                  <button
                    className="btn btn-ghost btn-xs text-error"
                    disabled={deletingId === event.id}
                    onClick={() => handleDelete(event)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

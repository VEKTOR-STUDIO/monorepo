"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createClient } from "@/libs/supabase/client";
import FighterPicker from "./FighterPicker";
import TaleOfTheTape from "./TaleOfTheTape";
import {
  WEIGHT_CLASSES,
  EVENT_STATUS_LABELS,
  VICTORY_METHODS,
  BOUT_WINNERS,
} from "@/data/fighterOptions";

// Sugerencias de división para el datalist (UFC masculino + femenino + grappling)
const DIVISION_SUGGESTIONS = [
  ...WEIGHT_CLASSES.masculino.map((w) => w.value),
  ...WEIGHT_CLASSES.femenino.map((w) => `${w.value} Femenino`),
  "Grappling",
  "Grappling Femenino",
  "Peso Pactado",
];

const toLocalInput = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const cornerName = (bout, corner) => {
  const f = bout[corner];
  return f ? f.full_name : "Por definir";
};

/**
 * EventBuilder — arma la cartelera de un evento: agrega combates desde el
 * roster, simula enfrentamientos (tale of the tape), reordena, registra
 * resultados y controla el estado del evento.
 */
export default function EventBuilder({ event, bouts = [], fighters = [] }) {
  const supabase = createClient();
  const router = useRouter();

  // ── Estado del evento ──────────────────────────────────────────────
  const [editingEvent, setEditingEvent] = useState(false);
  const [eventForm, setEventForm] = useState({
    name: event.name || "",
    edition: event.edition || "",
    event_date: toLocalInput(event.event_date),
    venue: event.venue || "",
    city: event.city || "",
    notes: event.notes || "",
  });
  const [savingEvent, setSavingEvent] = useState(false);

  // ── Nuevo combate / simulador ─────────────────────────────────────
  const [red, setRed] = useState(null);
  const [blue, setBlue] = useState(null);
  const [discipline, setDiscipline] = useState("mma");
  const [weightClass, setWeightClass] = useState("");
  const [isTitleFight, setIsTitleFight] = useState(false);
  const [isMainEvent, setIsMainEvent] = useState(false);
  const [onlyApproved, setOnlyApproved] = useState(true);
  const [addingBout, setAddingBout] = useState(false);

  // ── Resultados ────────────────────────────────────────────────────
  const [resultBoutId, setResultBoutId] = useState(null);
  const [resultForm, setResultForm] = useState({
    winner: "rojo",
    method: "Decisión unánime",
    round: "",
    ended_at_time: "",
  });
  const [busyBoutId, setBusyBoutId] = useState(null);

  const selectableFighters = useMemo(
    () =>
      onlyApproved ? fighters.filter((f) => f.status === "aprobado") : fighters,
    [fighters, onlyApproved]
  );

  const status = EVENT_STATUS_LABELS[event.status] || EVENT_STATUS_LABELS.borrador;

  const refresh = () => router.refresh();

  // ── Acciones del evento ───────────────────────────────────────────
  const saveEvent = async (e) => {
    e.preventDefault();
    setSavingEvent(true);
    try {
      const { error } = await supabase
        .from("events")
        .update({
          name: eventForm.name.trim(),
          edition: eventForm.edition.trim() || null,
          event_date: eventForm.event_date
            ? new Date(eventForm.event_date).toISOString()
            : null,
          venue: eventForm.venue.trim() || null,
          city: eventForm.city.trim() || null,
          notes: eventForm.notes.trim() || null,
        })
        .eq("id", event.id);
      if (error) throw error;
      toast.success("Evento actualizado");
      setEditingEvent(false);
      refresh();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "No se pudo actualizar el evento");
    } finally {
      setSavingEvent(false);
    }
  };

  const setEventStatus = async (newStatus) => {
    try {
      const { error } = await supabase
        .from("events")
        .update({ status: newStatus })
        .eq("id", event.id);
      if (error) throw error;
      toast.success(`Evento: ${EVENT_STATUS_LABELS[newStatus].label}`);
      refresh();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "No se pudo cambiar el estado");
    }
  };

  // ── Acciones de combates ──────────────────────────────────────────
  const addBout = async () => {
    if (!red && !blue) {
      toast.error("Selecciona al menos un peleador");
      return;
    }
    setAddingBout(true);
    try {
      const maxOrder = bouts.reduce((m, b) => Math.max(m, b.bout_order), 0);
      const { error } = await supabase.from("bouts").insert({
        event_id: event.id,
        bout_order: maxOrder + 1,
        discipline,
        weight_class: weightClass.trim() || null,
        red_fighter_id: red?.id || null,
        blue_fighter_id: blue?.id || null,
        is_title_fight: isTitleFight,
        is_main_event: isMainEvent,
      });
      if (error) throw error;

      toast.success("Combate agregado a la cartelera");
      setRed(null);
      setBlue(null);
      setWeightClass("");
      setIsTitleFight(false);
      setIsMainEvent(false);
      refresh();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "No se pudo agregar el combate");
    } finally {
      setAddingBout(false);
    }
  };

  const deleteBout = async (bout) => {
    const ok = window.confirm(
      `¿Eliminar el combate ${cornerName(bout, "red")} vs ${cornerName(bout, "blue")}?`
    );
    if (!ok) return;
    setBusyBoutId(bout.id);
    try {
      const { error } = await supabase.from("bouts").delete().eq("id", bout.id);
      if (error) throw error;
      toast.success("Combate eliminado");
      refresh();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "No se pudo eliminar el combate");
    } finally {
      setBusyBoutId(null);
    }
  };

  // Mueve el combate hacia arriba/abajo intercambiando bout_order con el vecino
  const moveBout = async (index, direction) => {
    const neighbor = bouts[index + direction];
    const bout = bouts[index];
    if (!neighbor) return;
    setBusyBoutId(bout.id);
    try {
      const updates = [
        supabase.from("bouts").update({ bout_order: neighbor.bout_order }).eq("id", bout.id),
        supabase.from("bouts").update({ bout_order: bout.bout_order }).eq("id", neighbor.id),
      ];
      const results = await Promise.all(updates);
      const failed = results.find((r) => r.error);
      if (failed) throw failed.error;
      refresh();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "No se pudo reordenar");
    } finally {
      setBusyBoutId(null);
    }
  };

  const saveResult = async (bout) => {
    setBusyBoutId(bout.id);
    try {
      const { error } = await supabase
        .from("bouts")
        .update({
          status: "finalizado",
          winner: resultForm.winner,
          method: resultForm.method || null,
          round: resultForm.round ? parseInt(resultForm.round, 10) : null,
          ended_at_time: resultForm.ended_at_time.trim() || null,
        })
        .eq("id", bout.id);
      if (error) throw error;
      toast.success("Resultado guardado");
      setResultBoutId(null);
      refresh();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "No se pudo guardar el resultado");
    } finally {
      setBusyBoutId(null);
    }
  };

  const reopenBout = async (bout) => {
    setBusyBoutId(bout.id);
    try {
      const { error } = await supabase
        .from("bouts")
        .update({
          status: "programado",
          winner: null,
          method: null,
          round: null,
          ended_at_time: null,
        })
        .eq("id", bout.id);
      if (error) throw error;
      toast.success("Combate reabierto");
      refresh();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "No se pudo reabrir el combate");
    } finally {
      setBusyBoutId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* ── Cabecera del evento ─────────────────────────────────────── */}
      <div className="border border-primary/30 bg-base-200/80 p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`badge ${status.badge} badge-sm uppercase text-[0.6rem] font-bold tracking-wider`}>
                {event.status}
              </span>
              <span className="text-[0.65rem] tracking-[0.2em] uppercase text-base-content/40 font-bold">
                {bouts.length} {bouts.length === 1 ? "combate" : "combates"}
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-5xl leading-none">
              {event.name}{" "}
              {event.edition && <span className="text-primary">{event.edition}</span>}
            </h1>
            <p className="text-sm text-base-content/60 mt-2 capitalize">
              {event.event_date
                ? new Date(event.event_date).toLocaleDateString("es-VE", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Fecha por definir"}
              {(event.venue || event.city) &&
                ` · ${[event.venue, event.city].filter(Boolean).join(", ")}`}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              className="select select-sm w-44"
              value={event.status}
              onChange={(e) => setEventStatus(e.target.value)}
            >
              <option value="borrador">Borrador / Simulación</option>
              <option value="publicado">Publicado</option>
              <option value="finalizado">Finalizado</option>
              <option value="cancelado">Cancelado</option>
            </select>
            <button
              className="btn btn-ghost btn-sm border border-primary/30"
              onClick={() => setEditingEvent((v) => !v)}
            >
              {editingEvent ? "Cancelar" : "Editar evento"}
            </button>
          </div>
        </div>

        {editingEvent && (
          <form onSubmit={saveEvent} className="mt-6 pt-6 border-t border-primary/20 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <input
                required
                type="text"
                className="input w-full"
                placeholder="Nombre"
                value={eventForm.name}
                onChange={(e) => setEventForm((f) => ({ ...f, name: e.target.value }))}
              />
              <input
                type="text"
                className="input w-full"
                placeholder="Edición (XI)"
                value={eventForm.edition}
                onChange={(e) => setEventForm((f) => ({ ...f, edition: e.target.value }))}
              />
              <input
                type="datetime-local"
                className="input w-full col-span-2"
                value={eventForm.event_date}
                onChange={(e) => setEventForm((f) => ({ ...f, event_date: e.target.value }))}
              />
              <input
                type="text"
                className="input w-full col-span-2"
                placeholder="Sede"
                value={eventForm.venue}
                onChange={(e) => setEventForm((f) => ({ ...f, venue: e.target.value }))}
              />
              <input
                type="text"
                className="input w-full"
                placeholder="Ciudad"
                value={eventForm.city}
                onChange={(e) => setEventForm((f) => ({ ...f, city: e.target.value }))}
              />
              <input
                type="text"
                className="input w-full"
                placeholder="Notas internas"
                value={eventForm.notes}
                onChange={(e) => setEventForm((f) => ({ ...f, notes: e.target.value }))}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-sm" disabled={savingEvent}>
              {savingEvent && <span className="loading loading-spinner loading-xs" />}
              Guardar cambios
            </button>
          </form>
        )}
      </div>

      {/* ── Simulador / nuevo combate ───────────────────────────────── */}
      <div className="border border-primary/30 bg-base-200/60 p-5 md:p-6 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="font-display text-xl md:text-2xl leading-none">
            Simular <span className="text-primary">enfrentamiento</span>
          </h2>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="toggle toggle-primary toggle-sm"
              checked={onlyApproved}
              onChange={(e) => setOnlyApproved(e.target.checked)}
            />
            <span className="text-[0.65rem] tracking-[0.2em] uppercase text-base-content/60 font-bold">
              Solo aprobados
            </span>
          </label>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <FighterPicker
            fighters={selectableFighters}
            value={red}
            onChange={setRed}
            excludeId={blue?.id}
            corner="rojo"
          />
          <FighterPicker
            fighters={selectableFighters}
            value={blue}
            onChange={setBlue}
            excludeId={red?.id}
            corner="azul"
          />
        </div>

        {red && blue && <TaleOfTheTape red={red} blue={blue} />}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text text-[0.65rem] tracking-[0.2em] uppercase text-base-content/60 font-bold">
                Disciplina
              </span>
            </div>
            <select
              className="select w-full"
              value={discipline}
              onChange={(e) => setDiscipline(e.target.value)}
            >
              <option value="mma">MMA</option>
              <option value="bjj">BJJ / Grappling</option>
            </select>
          </label>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text text-[0.65rem] tracking-[0.2em] uppercase text-base-content/60 font-bold">
                División
              </span>
            </div>
            <input
              type="text"
              className="input w-full"
              list="division-suggestions"
              placeholder="Peso Ligero"
              value={weightClass}
              onChange={(e) => setWeightClass(e.target.value)}
            />
            <datalist id="division-suggestions">
              {DIVISION_SUGGESTIONS.map((d) => (
                <option key={d} value={d} />
              ))}
            </datalist>
          </label>

          <div className="flex flex-col gap-2 pb-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="checkbox checkbox-primary checkbox-sm"
                checked={isMainEvent}
                onChange={(e) => setIsMainEvent(e.target.checked)}
              />
              <span className="text-[0.65rem] tracking-[0.2em] uppercase text-base-content/60 font-bold">
                Estelar
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="checkbox checkbox-primary checkbox-sm"
                checked={isTitleFight}
                onChange={(e) => setIsTitleFight(e.target.checked)}
              />
              <span className="text-[0.65rem] tracking-[0.2em] uppercase text-base-content/60 font-bold">
                Por el título
              </span>
            </label>
          </div>

          <button
            className="btn btn-primary w-full"
            disabled={addingBout || (!red && !blue)}
            onClick={addBout}
          >
            {addingBout && <span className="loading loading-spinner loading-xs" />}
            Agregar a la cartelera
          </button>
        </div>
      </div>

      {/* ── Cartelera ───────────────────────────────────────────────── */}
      <div className="space-y-3">
        <h2 className="font-display text-xl md:text-2xl leading-none">
          Cartelera <span className="text-primary">oficial</span>
        </h2>

        {bouts.length === 0 ? (
          <div className="border border-base-content/10 bg-base-200 p-10 text-center text-base-content/50 text-sm tracking-[0.2em] uppercase">
            Aún no hay combates — usa el simulador para armar el primero
          </div>
        ) : (
          bouts.map((bout, index) => {
            const finished = bout.status === "finalizado";
            const showingResult = resultBoutId === bout.id;
            const winnerLabel = BOUT_WINNERS.find((w) => w.value === bout.winner)?.label;
            return (
              <div
                key={bout.id}
                className={`border bg-base-200 ${
                  bout.is_main_event ? "border-primary/60" : "border-base-content/10"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-3 p-4">
                  {/* Reordenar */}
                  <div className="flex md:flex-col gap-1 shrink-0">
                    <button
                      className="btn btn-ghost btn-xs"
                      disabled={index === 0 || busyBoutId === bout.id}
                      onClick={() => moveBout(index, -1)}
                      aria-label="Subir combate"
                    >
                      ▲
                    </button>
                    <button
                      className="btn btn-ghost btn-xs"
                      disabled={index === bouts.length - 1 || busyBoutId === bout.id}
                      onClick={() => moveBout(index, 1)}
                      aria-label="Bajar combate"
                    >
                      ▼
                    </button>
                  </div>

                  {/* Enfrentamiento */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      {bout.is_main_event && (
                        <span className="badge badge-sm border border-primary/50 text-primary bg-primary/10 uppercase text-[0.6rem] font-bold tracking-widest">
                          Estelar
                        </span>
                      )}
                      {bout.is_title_fight && (
                        <span className="badge badge-sm badge-warning uppercase text-[0.6rem] font-bold tracking-widest">
                          Título
                        </span>
                      )}
                      <span className="text-[0.6rem] tracking-[0.2em] uppercase text-base-content/40 font-bold">
                        {bout.discipline === "bjj" ? "BJJ" : "MMA"}
                        {bout.weight_class && ` · ${bout.weight_class}`}
                      </span>
                    </div>
                    <p className="font-display text-lg md:text-2xl leading-tight">
                      <span className={bout.winner === "rojo" ? "text-primary" : ""}>
                        {cornerName(bout, "red")}
                      </span>
                      <span className="text-primary mx-2 text-base md:text-lg">vs</span>
                      <span className={bout.winner === "azul" ? "text-primary" : ""}>
                        {cornerName(bout, "blue")}
                      </span>
                    </p>
                    {finished && (
                      <p className="text-[0.65rem] tracking-[0.15em] uppercase text-success font-bold mt-1">
                        {winnerLabel}
                        {bout.method && ` · ${bout.method}`}
                        {bout.round && ` · R${bout.round}`}
                        {bout.ended_at_time && ` · ${bout.ended_at_time}`}
                      </p>
                    )}
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center gap-2 flex-wrap shrink-0">
                    {finished ? (
                      <button
                        className="btn btn-ghost btn-xs border border-base-content/20"
                        disabled={busyBoutId === bout.id}
                        onClick={() => reopenBout(bout)}
                      >
                        Reabrir
                      </button>
                    ) : (
                      <button
                        className="btn btn-outline btn-xs border-primary/50 text-primary"
                        onClick={() => {
                          setResultBoutId(showingResult ? null : bout.id);
                          setResultForm({
                            winner: "rojo",
                            method: "Decisión unánime",
                            round: "",
                            ended_at_time: "",
                          });
                        }}
                      >
                        {showingResult ? "Cancelar" : "Resultado"}
                      </button>
                    )}
                    <button
                      className="btn btn-ghost btn-xs text-error"
                      disabled={busyBoutId === bout.id}
                      onClick={() => deleteBout(bout)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>

                {/* Formulario de resultado */}
                {showingResult && !finished && (
                  <div className="border-t border-base-content/10 p-4 grid grid-cols-2 md:grid-cols-5 gap-3 items-end">
                    <label className="form-control w-full">
                      <div className="label">
                        <span className="label-text text-[0.6rem] tracking-[0.2em] uppercase text-base-content/60 font-bold">
                          Ganador
                        </span>
                      </div>
                      <select
                        className="select select-sm w-full"
                        value={resultForm.winner}
                        onChange={(e) =>
                          setResultForm((f) => ({ ...f, winner: e.target.value }))
                        }
                      >
                        {BOUT_WINNERS.map((w) => (
                          <option key={w.value} value={w.value}>{w.label}</option>
                        ))}
                      </select>
                    </label>

                    <label className="form-control w-full">
                      <div className="label">
                        <span className="label-text text-[0.6rem] tracking-[0.2em] uppercase text-base-content/60 font-bold">
                          Método
                        </span>
                      </div>
                      <select
                        className="select select-sm w-full"
                        value={resultForm.method}
                        onChange={(e) =>
                          setResultForm((f) => ({ ...f, method: e.target.value }))
                        }
                      >
                        {VICTORY_METHODS.map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </label>

                    <label className="form-control w-full">
                      <div className="label">
                        <span className="label-text text-[0.6rem] tracking-[0.2em] uppercase text-base-content/60 font-bold">
                          Round
                        </span>
                      </div>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        className="input input-sm w-full"
                        value={resultForm.round}
                        onChange={(e) =>
                          setResultForm((f) => ({ ...f, round: e.target.value }))
                        }
                      />
                    </label>

                    <label className="form-control w-full">
                      <div className="label">
                        <span className="label-text text-[0.6rem] tracking-[0.2em] uppercase text-base-content/60 font-bold">
                          Tiempo
                        </span>
                      </div>
                      <input
                        type="text"
                        className="input input-sm w-full"
                        placeholder="3:42"
                        value={resultForm.ended_at_time}
                        onChange={(e) =>
                          setResultForm((f) => ({ ...f, ended_at_time: e.target.value }))
                        }
                      />
                    </label>

                    <button
                      className="btn btn-primary btn-sm"
                      disabled={busyBoutId === bout.id}
                      onClick={() => saveResult(bout)}
                    >
                      Guardar
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import {
  deleteConcept,
  setConceptOrder,
  setConceptSchedule,
  toggleConceptRevealed,
} from "@/app/admin/actions";
import { isConceptRevealed } from "@/libs/gallery";

function toDatetimeLocalValue(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

/**
 * Fila de administración de un concepto: revelar/ocultar, programar fecha
 * de revelado automático, cambiar el orden y borrar. `postCount` es solo
 * informativo (cuántas fotos ya tiene ese concepto).
 */
export default function ConceptRow({ concept, postCount }) {
  const [isRevealed, setIsRevealed] = useState(concept.is_revealed);
  const [revealAt, setRevealAt] = useState(concept.reveal_at);
  const [sortOrder, setSortOrder] = useState(concept.sort_order);
  const [isBusy, setIsBusy] = useState(false);

  const effectivelyRevealed = isConceptRevealed({
    is_revealed: isRevealed,
    reveal_at: revealAt,
  });

  const handleToggle = async (e) => {
    const next = e.target.checked;
    setIsRevealed(next);
    setIsBusy(true);
    try {
      const result = await toggleConceptRevealed(concept.id, next);
      if (result?.error) {
        toast.error(result.error);
        setIsRevealed(!next);
        return;
      }
      toast.success(next ? "Concepto revelado." : "Concepto ocultado.");
    } finally {
      setIsBusy(false);
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    const value = e.currentTarget.reveal_at.value;
    setIsBusy(true);
    try {
      const result = await setConceptSchedule(concept.id, value || null);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      setRevealAt(value ? new Date(value).toISOString() : null);
      toast.success("Fecha de revelado guardada.");
    } finally {
      setIsBusy(false);
    }
  };

  const handleOrderBlur = async (e) => {
    const value = e.target.value;
    if (value === String(concept.sort_order)) return;
    setIsBusy(true);
    try {
      const result = await setConceptOrder(concept.id, value);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      setSortOrder(Number(value));
    } finally {
      setIsBusy(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        `¿Borrar el concepto "${concept.name}"? Las fotos que tenga quedarán como "General".`
      )
    ) {
      return;
    }

    setIsBusy(true);
    try {
      const result = await deleteConcept(concept.id);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Concepto borrado.");
      }
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <li className="flex flex-col gap-3 rounded-xl border border-base-content/15 bg-base-100 p-4 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-medium">{concept.name}</p>
          <span
            className={`badge badge-sm ${
              effectivelyRevealed ? "badge-success" : "badge-ghost"
            }`}
          >
            {effectivelyRevealed
              ? "Revelado"
              : revealAt
                ? "Programado"
                : "Oculto"}
          </span>
        </div>
        <p className="mt-1 text-xs opacity-60">
          {postCount} {postCount === 1 ? "foto" : "fotos"}
          {revealAt && !isRevealed && (
            <>
              {" "}
              · se revela automáticamente el{" "}
              {new Date(revealAt).toLocaleString("es", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </>
          )}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="label cursor-pointer gap-2 p-0">
          <span className="label-text text-xs">Revelado</span>
          <input
            type="checkbox"
            className="toggle toggle-sm"
            checked={isRevealed}
            disabled={isBusy}
            onChange={handleToggle}
          />
        </label>

        <form
          onSubmit={handleScheduleSubmit}
          className="flex items-center gap-1"
        >
          <input
            type="datetime-local"
            name="reveal_at"
            defaultValue={toDatetimeLocalValue(concept.reveal_at)}
            disabled={isBusy}
            className="input input-bordered input-xs w-40"
          />
          <button
            type="submit"
            disabled={isBusy}
            className="btn btn-ghost btn-xs"
            title="Guardar fecha de revelado"
          >
            Guardar
          </button>
        </form>

        <input
          type="number"
          defaultValue={sortOrder}
          disabled={isBusy}
          onBlur={handleOrderBlur}
          title="Orden (menor = primero)"
          className="input input-bordered input-xs w-16"
        />

        <button
          type="button"
          onClick={handleDelete}
          disabled={isBusy}
          className="btn btn-outline btn-error btn-xs"
        >
          Borrar
        </button>
      </div>
    </li>
  );
}

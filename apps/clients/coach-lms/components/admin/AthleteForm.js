"use client";

import { useActionState } from "react";
import { updateAthlete } from "@/app/admin/actions";
import { LEVELS } from "@/libs/training-constants";

// Ficha del alumno. Las notas son privadas: el alumno nunca las ve.
const AthleteForm = ({ athlete }) => {
  const [state, formAction, pending] = useActionState(updateAthlete, null);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="id" value={athlete.id} />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-semibold">Nombre</span>
          <input
            type="text"
            name="full_name"
            defaultValue={athlete.full_name || ""}
            className="input input-bordered w-full"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold">Teléfono</span>
          <input
            type="tel"
            name="phone"
            defaultValue={athlete.phone || ""}
            className="input input-bordered w-full"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold">Nivel</span>
          <select
            name="level"
            defaultValue={athlete.level || ""}
            className="select select-bordered w-full"
          >
            <option value="">Sin definir</option>
            {LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-3 self-end border border-base-300 p-3">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={athlete.is_active}
            className="checkbox checkbox-primary"
          />
          <span className="text-sm font-semibold">Alumno activo</span>
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block text-sm font-semibold">Su objetivo</span>
        <textarea
          name="goal"
          rows={2}
          defaultValue={athlete.goal || ""}
          className="textarea textarea-bordered w-full"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-semibold">
          Tus notas <span className="font-normal text-base-content/50">(privadas)</span>
        </span>
        <textarea
          name="coach_notes"
          rows={4}
          defaultValue={athlete.coach_notes || ""}
          placeholder="Lesiones, limitaciones, qué trabajar el próximo bloque…"
          className="textarea textarea-bordered w-full"
        />
      </label>

      {state?.ok && (
        <p className="border border-success/40 bg-success/10 px-3 py-2 text-sm text-success">
          Guardado.
        </p>
      )}
      {state?.error && (
        <p className="border border-error/40 bg-error/10 px-3 py-2 text-sm text-error">
          {state.error}
        </p>
      )}

      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? <span className="loading loading-spinner loading-sm" /> : "Guardar ficha"}
      </button>
    </form>
  );
};

export default AthleteForm;

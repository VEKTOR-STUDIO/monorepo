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

      <fieldset className="space-y-4 border border-base-300 p-4">
        <legend className="px-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
          Ficha de peleador
        </legend>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <label className="block">
            <span className="mb-1 block text-sm font-semibold">Estilo</span>
            <input
              type="text"
              name="discipline"
              defaultValue={athlete.discipline || ""}
              placeholder="Striker, grappler, MMA…"
              className="input input-bordered w-full"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold">Récord</span>
            <input
              type="text"
              name="fight_record"
              defaultValue={athlete.fight_record || ""}
              placeholder="5-0 Pro"
              className="input input-bordered w-full"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold">Altura (cm)</span>
            <input
              type="number"
              name="height_cm"
              min="120"
              max="230"
              defaultValue={athlete.height_cm ?? ""}
              className="input input-bordered w-full"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold">Peso actual (kg)</span>
            <input
              type="number"
              name="weight_kg"
              min="30"
              max="200"
              step="0.1"
              defaultValue={athlete.weight_kg ?? ""}
              className="input input-bordered w-full"
            />
          </label>

          <label className="block lg:col-span-2">
            <span className="mb-1 block text-sm font-semibold">Categoría</span>
            <input
              type="text"
              name="weight_class"
              defaultValue={athlete.weight_class || ""}
              placeholder="155 lb (70,3 kg)"
              className="input input-bordered w-full"
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold">
            Estrategia de pelea{" "}
            <span className="font-normal text-base-content/50">(la ve el alumno, solo tú la editas)</span>
          </span>
          <textarea
            name="fight_strategy"
            rows={2}
            defaultValue={athlete.fight_strategy || ""}
            placeholder="Control del centro del octágono: presión, velocidad de entrada, potencia corta y capacidad de repetir esfuerzos."
            className="textarea textarea-bordered w-full"
          />
        </label>
      </fieldset>

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

"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createProgram } from "@/app/admin/actions";

// Crear un plan: solo el nombre es obligatorio. Lo demás se rellena después.
const NewProgramForm = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(createProgram, null);

  // Al crearlo, entramos directo a su editor: es lo que toca hacer después.
  useEffect(() => {
    if (state?.ok && state.id) router.push(`/admin/programas/${state.id}`);
  }, [state, router]);

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="btn btn-primary">
        + Crear un plan
      </button>
    );
  }

  return (
    <form action={formAction} className="space-y-3 border border-primary/40 bg-primary/5 p-4">
      <label className="block">
        <span className="mb-1 block text-sm font-semibold">Nombre del plan</span>
        <input
          type="text"
          name="title"
          required
          autoFocus
          placeholder="Fuerza para principiantes · 8 semanas"
          className="input input-bordered w-full"
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block">
          <span className="mb-1 block text-sm font-semibold">Nivel</span>
          <select name="level" defaultValue="todos" className="select select-bordered w-full">
            <option value="todos">Todos los niveles</option>
            <option value="principiante">Principiante</option>
            <option value="intermedio">Intermedio</option>
            <option value="avanzado">Avanzado</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold">Tipo</span>
          <input
            type="text"
            name="category"
            placeholder="fuerza, hiit…"
            className="input input-bordered w-full"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold">Semanas</span>
          <input type="number" name="duration_weeks" min="1" className="input input-bordered w-full" />
        </label>
      </div>

      <label className="flex items-start gap-3 border border-base-300 bg-base-100 p-3">
        <input type="checkbox" name="is_public" className="checkbox checkbox-primary mt-0.5" />
        <span>
          <span className="block text-sm font-semibold">Mostrarlo en la web pública</span>
          <span className="block text-xs text-base-content/50">
            Déjalo sin marcar si es un plan a medida para un alumno.
          </span>
        </span>
      </label>

      {state?.error && (
        <p className="border border-error/40 bg-error/10 px-3 py-2 text-sm text-error">
          {state.error}
        </p>
      )}

      <div className="flex gap-2">
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? <span className="loading loading-spinner loading-sm" /> : "Crear y editar"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="btn btn-ghost border border-base-300"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default NewProgramForm;

"use client";

import { useRef, useTransition } from "react";
import toast from "react-hot-toast";
import { createAssignment } from "@/app/dashboard/actions";

function todayLocalISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Formulario del profesor para publicar una clase nueva.
export default function AdminAssignmentForm() {
  const formRef = useRef(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData) => {
    startTransition(async () => {
      const result = await createAssignment(formData);

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Clase publicada 📋");
      formRef.current?.reset();
    });
  };

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-4">
      <label className="block w-full">
        <span className="mb-1 block text-xs font-bold uppercase tracking-widest opacity-70">
          Título
        </span>
        <input
          name="title"
          required
          placeholder="Ej. Berimbolo desde De La Riva"
          className="input input-bordered w-full"
        />
      </label>

      <label className="block w-full">
        <span className="mb-1 block text-xs font-bold uppercase tracking-widest opacity-70">
          URL del video (YouTube o Instagram)
        </span>
        <input
          name="video_url"
          type="url"
          required
          placeholder="https://www.youtube.com/watch?v=..."
          className="input input-bordered w-full"
        />
      </label>

      <label className="block w-full">
        <span className="mb-1 block text-xs font-bold uppercase tracking-widest opacity-70">
          Fecha de la clase
        </span>
        <input
          name="scheduled_for"
          type="date"
          required
          defaultValue={todayLocalISO()}
          className="input input-bordered w-full"
        />
      </label>

      <label className="block w-full">
        <span className="mb-1 block text-xs font-bold uppercase tracking-widest opacity-70">
          Notas (opcional)
        </span>
        <textarea
          name="notes"
          rows={3}
          placeholder="Detalles clave a observar, grips, timing..."
          className="textarea textarea-bordered w-full"
        />
      </label>

      <label className="flex cursor-pointer items-center gap-3 border border-base-300 bg-base-100 px-3 py-3">
        <input
          type="checkbox"
          name="is_active"
          defaultChecked
          className="checkbox checkbox-primary checkbox-sm"
        />
        <span>
          <span className="block text-xs font-bold uppercase tracking-widest">
            Marcar como clase activa
          </span>
          <span className="text-[0.65rem] opacity-60">
            Es la que aparece en &ldquo;Clase de hoy&rdquo; del menú
          </span>
        </span>
      </label>

      <button className="btn btn-primary btn-block" disabled={isPending}>
        {isPending && <span className="loading loading-spinner loading-xs" />}
        Publicar clase
      </button>
    </form>
  );
}

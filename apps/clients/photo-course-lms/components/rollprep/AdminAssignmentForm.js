"use client";

import { useRef, useTransition } from "react";
import toast from "react-hot-toast";
import { createAssignment } from "@/app/dashboard/actions";

// Formulario del profesor para asignar la tarea en curso.
// Al crearla, desactiva la tarea anterior automáticamente.
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

      toast.success("Tarea publicada 📋");
      formRef.current?.reset();
    });
  };

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-4">
      <label className="form-control w-full">
        <span className="label-text font-medium mb-1">Título</span>
        <input
          name="title"
          required
          placeholder="Ej. Berimbolo desde De La Riva"
          className="input input-bordered w-full"
        />
      </label>

      <label className="form-control w-full">
        <span className="label-text font-medium mb-1">
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

      <label className="form-control w-full">
        <span className="label-text font-medium mb-1">Notas (opcional)</span>
        <textarea
          name="notes"
          rows={3}
          placeholder="Detalles clave a observar, grips, timing..."
          className="textarea textarea-bordered w-full"
        />
      </label>

      <button className="btn btn-primary btn-block" disabled={isPending}>
        {isPending && <span className="loading loading-spinner loading-xs" />}
        Publicar tarea
      </button>
    </form>
  );
}

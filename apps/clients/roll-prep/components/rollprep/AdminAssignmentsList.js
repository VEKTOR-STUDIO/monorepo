"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import {
  setActiveAssignment,
  updateAssignment,
} from "@/app/dashboard/actions";

function formatDate(value) {
  if (!value) return "Sin fecha";
  return new Date(`${value}T12:00:00`).toLocaleDateString("es-VE", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function EditForm({ assignment, onDone }) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData) => {
    startTransition(async () => {
      const result = await updateAssignment(formData);

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Clase actualizada");
      onDone?.();
    });
  };

  return (
    <form action={handleSubmit} className="space-y-3 border-t border-base-300 p-4">
      <input type="hidden" name="id" value={assignment.id} />

      <label className="block w-full">
        <span className="mb-1 block text-xs font-bold uppercase tracking-widest opacity-70">
          Título
        </span>
        <input
          name="title"
          required
          defaultValue={assignment.title}
          className="input input-bordered w-full"
        />
      </label>

      <label className="block w-full">
        <span className="mb-1 block text-xs font-bold uppercase tracking-widest opacity-70">
          URL del video
        </span>
        <input
          name="video_url"
          type="url"
          required
          defaultValue={assignment.video_url}
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
          defaultValue={assignment.scheduled_for ?? ""}
          className="input input-bordered w-full"
        />
      </label>

      <label className="block w-full">
        <span className="mb-1 block text-xs font-bold uppercase tracking-widest opacity-70">
          Notas
        </span>
        <textarea
          name="notes"
          rows={3}
          defaultValue={assignment.notes ?? ""}
          className="textarea textarea-bordered w-full"
        />
      </label>

      <label className="flex cursor-pointer items-center gap-3 border border-base-300 bg-base-100 px-3 py-3">
        <input
          type="checkbox"
          name="is_active"
          defaultChecked={assignment.is_active}
          className="checkbox checkbox-primary checkbox-sm"
        />
        <span className="text-xs font-bold uppercase tracking-widest">
          Clase activa (aparece en &ldquo;Clase de hoy&rdquo;)
        </span>
      </label>

      <div className="flex gap-2">
        <button type="button" className="btn btn-ghost btn-sm" onClick={onDone}>
          Cancelar
        </button>
        <button className="btn btn-primary btn-sm flex-1" disabled={isPending}>
          {isPending && <span className="loading loading-spinner loading-xs" />}
          Guardar cambios
        </button>
      </div>
    </form>
  );
}

// Lista de todas las clases: editar fecha/contenido y marcar la activa.
export default function AdminAssignmentsList({ assignments }) {
  const [editingId, setEditingId] = useState(null);
  const [isPending, startTransition] = useTransition();

  const handleActivate = (id) => {
    startTransition(async () => {
      const result = await setActiveAssignment(id);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Esta es ahora la clase activa");
    });
  };

  if (!assignments?.length) {
    return (
      <p className="p-6 text-sm opacity-60">
        Aún no hay clases. Publica la primera arriba.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-base-300">
      {assignments.map((assignment) => {
        const isEditing = editingId === assignment.id;

        return (
          <li key={assignment.id}>
            <div className="flex items-start gap-3 p-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">{assignment.title}</p>
                  {assignment.is_active && (
                    <span className="tag-skew bg-primary px-2 py-0.5 text-[0.6rem] text-primary-content">
                      <span>Activa</span>
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs font-bold uppercase tracking-widest text-primary">
                  {formatDate(assignment.scheduled_for)}
                </p>
              </div>

              <div className="flex shrink-0 flex-col gap-1 sm:flex-row">
                <Link
                  href={`/dashboard/admin/clase/${assignment.id}`}
                  className="btn btn-ghost btn-xs"
                >
                  Analíticas
                </Link>
                {!assignment.is_active && (
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleActivate(assignment.id)}
                    className="btn btn-outline btn-xs"
                  >
                    Activar
                  </button>
                )}
                <button
                  type="button"
                  onClick={() =>
                    setEditingId(isEditing ? null : assignment.id)
                  }
                  className="btn btn-ghost btn-xs"
                >
                  {isEditing ? "Cerrar" : "Editar"}
                </button>
              </div>
            </div>

            {isEditing && (
              <EditForm
                assignment={assignment}
                onDone={() => setEditingId(null)}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}

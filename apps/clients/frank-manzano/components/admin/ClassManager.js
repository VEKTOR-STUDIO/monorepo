"use client";

import { useActionState, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClass, deleteClass, setClassPublished } from "@/app/admin/actions";

// Clases con día, hora y cupo. Los alumnos solo ven las publicadas.
const ClassManager = ({ classes }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [state, formAction, creating] = useActionState(
    async (previousState, formData) => {
      const result = await createClass(previousState, formData);
      if (result?.ok) {
        setOpen(false);
        router.refresh();
      }
      return result;
    },
    null
  );

  const run = (work) =>
    startTransition(async () => {
      await work();
      router.refresh();
    });

  const upcoming = classes.filter((item) => new Date(item.starts_at) >= new Date());
  const past = classes.filter((item) => new Date(item.starts_at) < new Date());

  const renderClass = (item) => (
    <li key={item.id} className="flex flex-wrap items-center gap-3 p-4">
      <div className="min-w-0 flex-1">
        <p className="font-bold text-base-content">
          {item.title}
          {!item.is_published && (
            <span className="ml-2 border border-base-300 px-1.5 text-[10px] uppercase tracking-widest text-base-content/50">
              borrador
            </span>
          )}
        </p>
        <p className="text-xs text-base-content/50">
          {new Date(item.starts_at).toLocaleString("es", {
            weekday: "long",
            day: "numeric",
            month: "long",
            hour: "2-digit",
            minute: "2-digit",
          })}
          {item.location ? ` · ${item.location}` : ""}
          {` · ${item.booked}/${item.capacity} plazas`}
        </p>
      </div>

      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={() => run(() => setClassPublished(item.id, !item.is_published))}
          className="btn btn-ghost btn-sm border border-base-300"
        >
          {item.is_published ? "Ocultar" : "Publicar"}
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            if (confirm(`¿Borrar la clase "${item.title}"?`)) {
              run(() => deleteClass(item.id));
            }
          }}
          className="btn btn-ghost btn-sm text-error hover:bg-error/10"
        >
          Borrar
        </button>
      </div>
    </li>
  );

  return (
    <div className="space-y-6">
      {open ? (
        <form action={formAction} className="space-y-3 border border-primary/40 bg-primary/5 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="mb-1 block text-sm font-semibold">Nombre de la clase</span>
              <input
                type="text"
                name="title"
                required
                autoFocus
                placeholder="Funcional grupal · martes"
                className="input input-bordered w-full"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-semibold">Día</span>
              <input type="date" name="date" required className="input input-bordered w-full" />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-semibold">Hora</span>
              <input type="time" name="time" required className="input input-bordered w-full" />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-semibold">Duración (min)</span>
              <input type="number" name="duration_minutes" min="15" defaultValue={60} className="input input-bordered w-full" />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-semibold">Plazas</span>
              <input type="number" name="capacity" min="1" defaultValue={10} className="input input-bordered w-full" />
            </label>

            <label className="block sm:col-span-2">
              <span className="mb-1 block text-sm font-semibold">Dónde</span>
              <input
                type="text"
                name="location"
                placeholder="Gimnasio, parque, online…"
                className="input input-bordered w-full"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold">Descripción</span>
            <textarea name="description" rows={2} className="textarea textarea-bordered w-full" />
          </label>

          <label className="flex items-center gap-3 border border-base-300 bg-base-100 p-3">
            <input type="checkbox" name="is_published" defaultChecked className="checkbox checkbox-primary" />
            <span className="text-sm font-semibold">Publicarla ya para los alumnos</span>
          </label>

          {state?.error && (
            <p className="border border-error/40 bg-error/10 px-3 py-2 text-sm text-error">
              {state.error}
            </p>
          )}

          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary" disabled={creating}>
              {creating ? <span className="loading loading-spinner loading-sm" /> : "Crear clase"}
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
      ) : (
        <button type="button" onClick={() => setOpen(true)} className="btn btn-primary">
          + Crear una clase
        </button>
      )}

      <section>
        <h2 className="display mb-3 text-2xl text-base-content">Próximas</h2>
        {upcoming.length === 0 ? (
          <p className="border border-dashed border-base-300 p-8 text-center text-base-content/60">
            No hay clases programadas.
          </p>
        ) : (
          <ul className="divide-y divide-base-300 border border-base-300">
            {upcoming.map(renderClass)}
          </ul>
        )}
      </section>

      {past.length > 0 && (
        <section>
          <h2 className="display mb-3 text-2xl text-base-content">Pasadas</h2>
          <ul className="divide-y divide-base-300 border border-base-300 opacity-60">
            {past.slice(0, 10).map(renderClass)}
          </ul>
        </section>
      )}
    </div>
  );
};

export default ClassManager;

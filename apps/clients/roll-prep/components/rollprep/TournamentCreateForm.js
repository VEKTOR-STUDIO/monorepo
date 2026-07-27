"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createTournament } from "@/app/dashboard/torneos/actions";

// Formulario del profesor para armar un tope: todos los alumnos aparecen
// marcados y solo hay que quitar a los que faltaron. Al enviar se sortea
// el bracket y se navega directo al torneo.
export default function TournamentCreateForm({ students }) {
  const router = useRouter();
  const [selected, setSelected] = useState(() => new Set(students.map((s) => s.id)));
  const [isPending, startTransition] = useTransition();

  const toggle = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allSelected = selected.size === students.length;

  const handleSubmit = (formData) => {
    startTransition(async () => {
      const result = await createTournament(formData);

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      toast.success("¡Bracket sorteado! 🥋");
      router.push(`/dashboard/torneos/${result.id}`);
    });
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      <label className="block w-full">
        <span className="mb-1 block text-xs font-bold uppercase tracking-widest opacity-70">
          Nombre del tope
        </span>
        <input
          name="title"
          maxLength={80}
          placeholder="Tope interno"
          className="input input-bordered w-full"
        />
      </label>

      <div className="border border-base-300 bg-base-200">
        <div className="flex items-center justify-between border-b border-base-300 px-4 py-3">
          <p className="text-xs font-black uppercase tracking-[0.2em]">
            En el tatami:{" "}
            <span className="text-primary">{selected.size}</span> / {students.length}
          </p>
          <button
            type="button"
            className="btn btn-ghost btn-xs uppercase"
            onClick={() =>
              setSelected(
                allSelected ? new Set() : new Set(students.map((s) => s.id))
              )
            }
          >
            {allSelected ? "Quitar todos" : "Marcar todos"}
          </button>
        </div>

        {!students.length && (
          <p className="p-4 text-sm opacity-60">
            Aún no hay alumnos registrados en el gym.
          </p>
        )}

        <div className="max-h-80 divide-y divide-base-300 overflow-y-auto">
          {students.map((student) => {
            const isIn = selected.has(student.id);
            return (
              <label
                key={student.id}
                className={`flex cursor-pointer items-center gap-3 px-4 py-3 transition-opacity ${
                  isIn ? "" : "opacity-40"
                }`}
              >
                <input
                  type="checkbox"
                  name="student_ids"
                  value={student.id}
                  checked={isIn}
                  onChange={() => toggle(student.id)}
                  className="checkbox-primary checkbox checkbox-sm"
                />
                <span className="truncate text-sm font-semibold">
                  {student.full_name || "Alumno"}
                </span>
                {!isIn && (
                  <span className="ml-auto text-[0.6rem] font-bold uppercase tracking-widest opacity-60">
                    Faltó
                  </span>
                )}
              </label>
            );
          })}
        </div>
      </div>

      <button
        className="btn btn-primary btn-block"
        disabled={isPending || selected.size < 2}
      >
        {isPending && <span className="loading loading-spinner loading-xs" />}
        Sortear bracket ({selected.size} peleador{selected.size === 1 ? "" : "es"})
      </button>

      {selected.size < 2 && (
        <p className="text-center text-xs font-semibold uppercase tracking-widest opacity-50">
          Se necesitan al menos 2 peleadores
        </p>
      )}
    </form>
  );
}

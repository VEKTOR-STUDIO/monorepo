"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  assignProgram,
  removeAssignment,
  setAssignmentStatus,
} from "@/app/admin/actions";

// Qué plan tiene el alumno y desde cuándo. Un desplegable y un botón: nada más.
const STATUS_LABEL = {
  activo: "En curso",
  pausado: "En pausa",
  terminado: "Terminado",
};

const AssignmentPanel = ({ athleteId, assignments, programs }) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [programId, setProgramId] = useState("");
  const [startsOn, setStartsOn] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const alreadyAssigned = new Set(assignments.map((item) => item.programs?.id));
  const available = programs.filter((program) => !alreadyAssigned.has(program.id));

  const run = (work) =>
    startTransition(async () => {
      setError("");
      const result = await work();
      if (result?.error) setError(result.error);
      else router.refresh();
    });

  const handleAssign = (event) => {
    event.preventDefault();
    if (!programId) {
      setError("Elige un plan.");
      return;
    }
    run(async () => {
      const result = await assignProgram({ athleteId, programId, startsOn, notes });
      if (result?.ok) {
        setProgramId("");
        setNotes("");
      }
      return result;
    });
  };

  return (
    <div className="space-y-5">
      {assignments.length > 0 && (
        <ul className="divide-y divide-base-300 border border-base-300">
          {assignments.map((assignment) => (
            <li key={assignment.id} className="flex flex-wrap items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <p className="font-bold text-base-content">
                  <Link
                    href={`/admin/programas/${assignment.programs?.id}`}
                    className="hover:text-primary"
                  >
                    {assignment.programs?.title || "Plan borrado"}
                  </Link>
                </p>
                <p className="text-xs text-base-content/50">
                  {STATUS_LABEL[assignment.status]} · desde{" "}
                  {new Date(`${assignment.starts_on}T12:00:00`).toLocaleDateString("es")}
                </p>
                {assignment.notes && (
                  <p className="mt-1 text-sm italic text-base-content/60">
                    &ldquo;{assignment.notes}&rdquo;
                  </p>
                )}
              </div>

              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  disabled={pending}
                  onClick={() =>
                    run(() =>
                      setAssignmentStatus(
                        assignment.id,
                        athleteId,
                        assignment.status === "activo" ? "pausado" : "activo"
                      )
                    )
                  }
                  className="btn btn-ghost btn-sm border border-base-300"
                >
                  {assignment.status === "activo" ? "Pausar" : "Reactivar"}
                </button>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => run(() => removeAssignment(assignment.id, athleteId))}
                  className="btn btn-ghost btn-sm text-error hover:bg-error/10"
                >
                  Quitar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleAssign} className="space-y-3 border border-base-300 p-4">
        <p className="text-sm font-bold uppercase tracking-wide text-base-content">
          Asignar un plan
        </p>

        {available.length === 0 ? (
          <p className="text-sm text-base-content/60">
            Este alumno ya tiene todos los planes que has creado.{" "}
            <Link href="/admin/programas" className="link link-primary">
              Crea uno nuevo
            </Link>
            .
          </p>
        ) : (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-sm font-semibold">Plan</span>
                <select
                  value={programId}
                  onChange={(event) => setProgramId(event.target.value)}
                  className="select select-bordered w-full"
                >
                  <option value="">Elige un plan…</option>
                  {available.map((program) => (
                    <option key={program.id} value={program.id}>
                      {program.title}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-semibold">Empieza el</span>
                <input
                  type="date"
                  value={startsOn}
                  onChange={(event) => setStartsOn(event.target.value)}
                  className="input input-bordered w-full"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-1 block text-sm font-semibold">
                Nota para el alumno (opcional)
              </span>
              <input
                type="text"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Empieza suave la primera semana"
                className="input input-bordered w-full"
              />
            </label>

            <button type="submit" className="btn btn-primary" disabled={pending}>
              {pending ? <span className="loading loading-spinner loading-sm" /> : "Asignar"}
            </button>
          </>
        )}

        {error && (
          <p className="border border-error/40 bg-error/10 px-3 py-2 text-sm text-error">
            {error}
          </p>
        )}
      </form>
    </div>
  );
};

export default AssignmentPanel;

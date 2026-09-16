"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { bookClass, cancelClassBooking } from "@/app/dashboard/actions";

// Clases a las que el alumno se puede apuntar. Un botón por clase, sin más.
const ClassList = ({ classes }) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const run = (work) =>
    startTransition(async () => {
      setError("");
      const result = await work();
      if (result?.error) setError(result.error);
      else router.refresh();
    });

  if (classes.length === 0) {
    return (
      <p className="border border-dashed border-base-300 p-10 text-center text-base-content/60">
        No hay clases programadas por ahora. Cuando Frank publique alguna, aparecerá aquí.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <p className="border border-error/40 bg-error/10 px-3 py-2 text-sm text-error">
          {error}
        </p>
      )}

      <ul className="divide-y divide-base-300 border border-base-300">
        {classes.map((item) => {
          const reserved = item.myStatus === "reservada";
          const full = item.free === 0 && !reserved;

          return (
            <li key={item.id} className="flex flex-wrap items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <p className="font-bold text-base-content">{item.title}</p>
                <p className="text-xs text-base-content/50">
                  {new Date(item.starts_at).toLocaleString("es", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {item.location ? ` · ${item.location}` : ""}
                  {` · ${item.duration_minutes} min`}
                </p>
                {item.description && (
                  <p className="mt-1 text-sm text-base-content/60">{item.description}</p>
                )}
                <p className="mt-1 text-xs uppercase tracking-widest text-base-content/40">
                  {reserved
                    ? "Estás apuntado"
                    : full
                      ? "Sin plazas"
                      : `${item.free} ${item.free === 1 ? "plaza libre" : "plazas libres"}`}
                </p>
              </div>

              <button
                type="button"
                disabled={pending || full}
                onClick={() =>
                  run(() => (reserved ? cancelClassBooking(item.id) : bookClass(item.id)))
                }
                className={`btn btn-sm shrink-0 ${
                  reserved ? "btn-ghost border border-base-300" : "btn-primary"
                }`}
              >
                {reserved ? "Anular" : full ? "Completa" : "Apuntarme"}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ClassList;

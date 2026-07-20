"use client";

import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { markAssignmentCompleted } from "@/app/dashboard/actions";

// Botón gigante de llamado a la acción: "Visto y Estudiado".
export default function CompleteAssignmentButton({ assignmentId, isCompleted }) {
  const [isPending, startTransition] = useTransition();
  const [completed, setCompleted] = useState(isCompleted);

  if (completed) {
    return (
      <div className="relative overflow-hidden border border-primary bg-primary/10 p-6 text-center">
        <span
          aria-hidden="true"
          className="display text-stroke pointer-events-none absolute -bottom-5 -right-1 select-none text-7xl"
        >
          DONE
        </span>
        <p className="display text-3xl text-primary">Tarea completada</p>
        <p className="mt-2 text-sm font-semibold uppercase tracking-widest opacity-70">
          Nos vemos en el tatami
        </p>
      </div>
    );
  }

  const handleClick = () => {
    startTransition(async () => {
      const result = await markAssignmentCompleted(assignmentId);

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      setCompleted(true);
      toast.success("¡Oss! Tarea registrada 🥋");
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="btn btn-primary btn-block h-auto min-h-20 text-2xl shadow-[0_0_40px_-8px] shadow-primary/50 transition-transform active:scale-[0.98]"
    >
      {isPending ? (
        <span className="loading loading-spinner loading-md" />
      ) : (
        <span className="display">Visto y estudiado</span>
      )}
    </button>
  );
}

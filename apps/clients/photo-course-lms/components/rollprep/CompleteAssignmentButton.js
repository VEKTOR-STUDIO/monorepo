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
      <div className="rounded-2xl bg-success/10 border border-success/30 p-6 text-center">
        <p className="text-4xl mb-2">✅</p>
        <p className="text-lg font-bold text-success">¡Tarea completada!</p>
        <p className="text-sm opacity-70">Nos vemos en el tatami 🥋</p>
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
      className="btn btn-primary btn-block h-auto min-h-20 text-xl font-extrabold rounded-2xl shadow-lg"
    >
      {isPending ? (
        <span className="loading loading-spinner loading-md" />
      ) : (
        <>👁️ Visto y Estudiado</>
      )}
    </button>
  );
}

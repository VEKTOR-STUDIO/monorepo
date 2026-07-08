"use client";

import { useRef, useTransition } from "react";
import toast from "react-hot-toast";
import { createPoll } from "@/app/dashboard/actions";

// Formulario del profesor para crear la votación del fin de semana
// con sus 3 opciones de contenido.
export default function AdminPollForm() {
  const formRef = useRef(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData) => {
    startTransition(async () => {
      const result = await createPoll(formData);

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Votación publicada 🗳️");
      formRef.current?.reset();
    });
  };

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-4">
      <label className="form-control w-full">
        <span className="label-text font-medium mb-1">Pregunta</span>
        <input
          name="question"
          placeholder="¿Qué estudiamos en la próxima clase?"
          className="input input-bordered w-full"
        />
      </label>

      {[1, 2, 3].map((i) => (
        <fieldset key={i} className="rounded-xl border border-base-300 p-4 space-y-2">
          <legend className="px-2 text-sm font-semibold">Opción {i}</legend>
          <input
            name={`option_${i}_title`}
            required
            placeholder={
              ["Retención de Guardia", "Derribos", "Pases de guardia"][i - 1]
            }
            className="input input-bordered w-full"
          />
          <input
            name={`option_${i}_description`}
            placeholder="Descripción corta (opcional)"
            className="input input-bordered w-full"
          />
        </fieldset>
      ))}

      <button className="btn btn-secondary btn-block" disabled={isPending}>
        {isPending && <span className="loading loading-spinner loading-xs" />}
        Publicar votación
      </button>
    </form>
  );
}

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
      <label className="block w-full">
        <span className="mb-1 block text-xs font-bold uppercase tracking-widest opacity-70">
          Pregunta
        </span>
        <input
          name="question"
          placeholder="¿Qué estudiamos en la próxima clase?"
          className="input input-bordered w-full"
        />
      </label>

      {[1, 2, 3].map((i) => (
        <fieldset
          key={i}
          className="space-y-2 border border-base-300 bg-base-100 p-4"
        >
          <legend className="tag-skew bg-secondary px-2 py-0.5 text-[0.65rem] text-secondary-content">
            <span>Opción {i}</span>
          </legend>
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

"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import ExerciseFigure from "@/components/training/ExerciseFigure";
import { createLibraryExercise } from "@/app/admin/actions";

// Añadir un ejercicio propio al libro.
//
// Truco útil: puede reutilizar la animación de un ejercicio parecido. Por
// ejemplo "Sentadilla con pausa de 3 segundos" reutiliza el monigote de la
// sentadilla — es el mismo movimiento con otra indicación.
const NewLibraryExercise = ({ animations }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [animationSlug, setAnimationSlug] = useState("");
  const [state, formAction, pending] = useActionState(
    async (previousState, formData) => {
      const result = await createLibraryExercise(previousState, formData);
      if (result?.ok) {
        setOpen(false);
        setAnimationSlug("");
        router.refresh();
      }
      return result;
    },
    null
  );

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="btn btn-primary">
        + Añadir un ejercicio mío
      </button>
    );
  }

  return (
    <form
      action={formAction}
      className="space-y-3 border border-primary/40 bg-primary/5 p-4"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-sm font-semibold">Nombre del ejercicio</span>
          <input
            type="text"
            name="name"
            required
            autoFocus
            placeholder="Sentadilla con pausa de 3 segundos"
            className="input input-bordered w-full"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold">Músculo principal</span>
          <input
            type="text"
            name="primary_muscle"
            placeholder="Cuádriceps"
            className="input input-bordered w-full"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold">Material</span>
          <input
            type="text"
            name="equipment"
            placeholder="Barra, Peso corporal…"
            className="input input-bordered w-full"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold">Tipo</span>
          <select name="category" defaultValue="fuerza" className="select select-bordered w-full">
            <option value="fuerza">Fuerza</option>
            <option value="cardio">Cardio</option>
            <option value="core">Core</option>
            <option value="movilidad">Movilidad</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold">Cómo se mide</span>
          <select
            name="exercise_type"
            defaultValue="weight_reps"
            className="select select-bordered w-full"
          >
            <option value="weight_reps">Peso × repeticiones</option>
            <option value="bodyweight_reps">Repeticiones</option>
            <option value="duration">Tiempo</option>
            <option value="distance_duration">Distancia / tiempo</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold">Series por defecto</span>
          <input type="number" name="default_sets" min="1" defaultValue={3} className="input input-bordered w-full" />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold">Reps por defecto</span>
          <input type="text" name="default_reps" placeholder="10-12" className="input input-bordered w-full" />
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block text-sm font-semibold">Claves técnicas</span>
        <textarea
          name="cues"
          rows={2}
          placeholder="Pecho arriba, rodillas siguiendo la punta del pie…"
          className="textarea textarea-bordered w-full"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-semibold">
          Video propio (opcional)
        </span>
        <input
          type="url"
          name="video_url"
          placeholder="https://www.youtube.com/watch?v=…"
          className="input input-bordered w-full"
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <label className="block">
          <span className="mb-1 block text-sm font-semibold">
            Reutilizar una animación (opcional)
          </span>
          <select
            name="animation_slug"
            value={animationSlug}
            onChange={(event) => setAnimationSlug(event.target.value)}
            className="select select-bordered w-full"
          >
            <option value="">Sin animación</option>
            {animations.map((animation) => (
              <option key={animation.slug} value={animation.animation_slug || animation.slug}>
                {animation.name}
              </option>
            ))}
          </select>
          <span className="mt-1 block text-xs text-base-content/50">
            Elige el movimiento más parecido: el alumno verá ese monigote.
          </span>
        </label>

        <div className="w-24">
          <ExerciseFigure slug={animationSlug} name="Vista previa" className="border border-base-300" />
        </div>
      </div>

      {state?.error && (
        <p className="border border-error/40 bg-error/10 px-3 py-2 text-sm text-error">
          {state.error}
        </p>
      )}

      <div className="flex gap-2">
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? <span className="loading loading-spinner loading-sm" /> : "Añadir al libro"}
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
  );
};

export default NewLibraryExercise;

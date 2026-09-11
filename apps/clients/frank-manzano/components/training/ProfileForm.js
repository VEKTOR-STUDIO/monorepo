"use client";

import { useActionState } from "react";
import { updateMyProfileAction } from "@/app/dashboard/actions";

// Datos que el alumno puede cambiar. Su nivel y las notas del entrenador son
// solo de Frank: la base de datos los protege aunque alguien toque el formulario.
const ProfileForm = ({ profile, email }) => {
  const [state, formAction, pending] = useActionState(updateMyProfileAction, null);

  return (
    <form action={formAction} className="max-w-lg space-y-4">
      <label className="block">
        <span className="mb-1 block text-sm font-semibold">Nombre</span>
        <input
          type="text"
          name="full_name"
          defaultValue={profile?.full_name || ""}
          placeholder="Nombre y apellido"
          className="input input-bordered w-full"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-semibold">Correo</span>
        <input
          type="email"
          value={email}
          disabled
          className="input input-bordered w-full opacity-60"
        />
        <span className="mt-1 block text-xs text-base-content/45">
          El correo con el que entras no se puede cambiar desde aquí.
        </span>
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-semibold">Teléfono</span>
        <input
          type="tel"
          name="phone"
          defaultValue={profile?.phone || ""}
          placeholder="Para que Frank te escriba"
          className="input input-bordered w-full"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-semibold">¿Qué quieres conseguir?</span>
        <textarea
          name="goal"
          rows={3}
          defaultValue={profile?.goal || ""}
          placeholder="Bajar de peso, ganar fuerza, volver a correr…"
          className="textarea textarea-bordered w-full"
        />
      </label>

      <label className="flex items-start gap-3 border border-base-300 p-4">
        <input
          type="checkbox"
          name="show_in_ranking"
          defaultChecked={profile?.show_in_ranking ?? true}
          className="checkbox checkbox-primary mt-0.5"
        />
        <span>
          <span className="block font-semibold">Aparecer en el ranking</span>
          <span className="block text-sm text-base-content/55">
            Si lo desmarcas, los demás alumnos no verán tu nombre ni tu XP.
          </span>
        </span>
      </label>

      {state?.ok && (
        <p className="border border-success/40 bg-success/10 px-3 py-2 text-sm text-success">
          Guardado.
        </p>
      )}
      {state?.error && (
        <p className="border border-error/40 bg-error/10 px-3 py-2 text-sm text-error">
          {state.error}
        </p>
      )}

      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? <span className="loading loading-spinner loading-sm" /> : "Guardar cambios"}
      </button>
    </form>
  );
};

export default ProfileForm;

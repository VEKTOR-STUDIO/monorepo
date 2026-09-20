"use client";

import { useActionState } from "react";
import { updateMyProfileAction } from "@/app/dashboard/actions";

// Datos que el alumno puede cambiar. Su nivel y las notas del entrenador son
// solo del coach: la base de datos los protege aunque alguien toque el formulario.
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
          placeholder="Para que el coach te escriba"
          className="input input-bordered w-full"
        />
      </label>

      <fieldset className="space-y-4 border border-base-300 p-4">
        <legend className="px-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
          Ficha de peleador
        </legend>
        <p className="text-sm text-base-content/55">
          Con estos datos el coach arma tu plan: sin peso y categoría no hay bloque.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-semibold">Estilo</span>
            <input
              type="text"
              name="discipline"
              defaultValue={profile?.discipline || ""}
              placeholder="Striker, grappler, MMA…"
              className="input input-bordered w-full"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold">Récord</span>
            <input
              type="text"
              name="fight_record"
              defaultValue={profile?.fight_record || ""}
              placeholder="5-0 Pro"
              className="input input-bordered w-full"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold">Peso actual (kg)</span>
            <input
              type="number"
              name="weight_kg"
              min="30"
              max="200"
              step="0.1"
              inputMode="decimal"
              defaultValue={profile?.weight_kg ?? ""}
              placeholder="80"
              className="input input-bordered w-full"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold">Categoría en la que peleas</span>
            <input
              type="text"
              name="weight_class"
              defaultValue={profile?.weight_class || ""}
              placeholder="155 lb (70,3 kg)"
              className="input input-bordered w-full"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold">Altura (cm)</span>
            <input
              type="number"
              name="height_cm"
              min="120"
              max="230"
              inputMode="numeric"
              defaultValue={profile?.height_cm ?? ""}
              placeholder="180"
              className="input input-bordered w-full"
            />
          </label>
        </div>

        {profile?.fight_strategy && (
          <p className="border-l-2 border-accent pl-3 text-sm text-base-content/70">
            <span className="font-bold uppercase tracking-wide text-accent">Estrategia del coach: </span>
            {profile.fight_strategy}
          </p>
        )}
      </fieldset>

      <label className="block">
        <span className="mb-1 block text-sm font-semibold">¿Qué quieres conseguir?</span>
        <textarea
          name="goal"
          rows={3}
          defaultValue={profile?.goal || ""}
          placeholder="Controlar el centro, llegar mejor al peso, aguantar el tercer round…"
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

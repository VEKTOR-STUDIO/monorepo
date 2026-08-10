"use client";

import { useTransition } from "react";
import toast from "react-hot-toast";
import { updateProfile } from "@/app/dashboard/actions";

// Editor de la ficha del alumno: nombre de peleador y academia.
// Completar el nombre por primera vez otorga XP.
export default function ProfileForm({
  currentName,
  currentAcademyId,
  academies = [],
}) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData) => {
    startTransition(async () => {
      const result = await updateProfile(formData);

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Perfil actualizado 🥋");
    });
  };

  return (
    <form action={handleSubmit} className="space-y-3">
      <label className="block w-full">
        <span className="mb-1 block text-xs font-bold uppercase tracking-widest opacity-70">
          Nombre de peleador
        </span>
        <input
          name="full_name"
          required
          maxLength={80}
          defaultValue={currentName ?? ""}
          placeholder="Tu nombre en el tatami"
          className="input input-bordered w-full"
        />
      </label>

      {academies.length > 0 && (
        <label className="block w-full">
          <span className="mb-1 block text-xs font-bold uppercase tracking-widest opacity-70">
            Academia
          </span>
          <select
            name="academy_id"
            defaultValue={currentAcademyId ?? ""}
            className="select select-bordered w-full"
          >
            <option value="">Sin academia</option>
            {academies.map((academy) => (
              <option key={academy.id} value={academy.id}>
                {academy.name}
              </option>
            ))}
          </select>
          <span className="mt-1 block text-[0.65rem] font-semibold uppercase tracking-widest opacity-50">
            Sale en el ranking junto a tu nombre
          </span>
        </label>
      )}

      <button className="btn btn-primary w-full" disabled={isPending}>
        {isPending ? (
          <span className="loading loading-spinner loading-xs" />
        ) : (
          "Guardar"
        )}
      </button>

      {!currentName && (
        <p className="text-[0.65rem] font-bold uppercase tracking-widest text-primary">
          Completa tu perfil: +25 XP
        </p>
      )}
    </form>
  );
}

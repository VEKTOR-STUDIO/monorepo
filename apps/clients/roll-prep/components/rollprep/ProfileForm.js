"use client";

import { useTransition } from "react";
import toast from "react-hot-toast";
import { updateProfileName } from "@/app/dashboard/actions";

// Editor del nombre de peleador. Completarlo por primera vez otorga XP.
export default function ProfileNameForm({ currentName }) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData) => {
    startTransition(async () => {
      const result = await updateProfileName(formData);

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Nombre actualizado 🥋");
    });
  };

  return (
    <form action={handleSubmit} className="space-y-2">
      <label className="block w-full">
        <span className="mb-1 block text-xs font-bold uppercase tracking-widest opacity-70">
          Nombre de peleador
        </span>
        <div className="flex gap-2">
          <input
            name="full_name"
            required
            maxLength={80}
            defaultValue={currentName ?? ""}
            placeholder="Tu nombre en el tatami"
            className="input input-bordered w-full"
          />
          <button className="btn btn-primary" disabled={isPending}>
            {isPending ? (
              <span className="loading loading-spinner loading-xs" />
            ) : (
              "Guardar"
            )}
          </button>
        </div>
      </label>
      {!currentName && (
        <p className="text-[0.65rem] font-bold uppercase tracking-widest text-primary">
          Completa tu perfil: +25 XP
        </p>
      )}
    </form>
  );
}

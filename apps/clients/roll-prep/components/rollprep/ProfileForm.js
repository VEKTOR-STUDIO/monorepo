"use client";

import Link from "next/link";
import { useTransition } from "react";
import toast from "react-hot-toast";
import { updateProfile } from "@/app/dashboard/actions";
import AcademyBadge from "@/components/rollprep/AcademyBadge";

// Editor de la ficha del alumno: nombre de peleador. La academia se elige
// en el roster (/dashboard/equipo), no desde un select.
export default function ProfileForm({ currentName, currentAcademy }) {
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
    <div className="space-y-3">
      <Link
        href="/dashboard/equipo"
        className="clip-cut flex items-center justify-between gap-3 border-2 border-base-300 bg-base-200 p-4 transition hover:border-primary"
      >
        <div className="min-w-0">
          <p className="text-[0.65rem] font-black uppercase tracking-[0.25em] opacity-50">
            Academia
          </p>
          <div className="mt-2">
            <AcademyBadge academy={currentAcademy} size="md" showEmpty />
          </div>
        </div>
        <span className="tile-cta shrink-0 text-[0.65rem] font-black uppercase tracking-[0.2em] text-primary">
          {currentAcademy ? "Cambiar" : "Elegir"}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="h-3 w-3"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </Link>

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
    </div>
  );
}

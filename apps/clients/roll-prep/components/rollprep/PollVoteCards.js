"use client";

import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { submitVote } from "@/app/dashboard/actions";

// 3 tarjetas de contenido: el alumno toca una para elegir el tema de la
// próxima clase. Puede cambiar su voto mientras la encuesta esté activa.
export default function PollVoteCards({ poll, options, currentVoteOptionId }) {
  const [isPending, startTransition] = useTransition();
  const [selected, setSelected] = useState(currentVoteOptionId);

  const handleVote = (optionId) => {
    if (optionId === selected) return;

    startTransition(async () => {
      const result = await submitVote(poll.id, optionId);

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      setSelected(optionId);
      toast.success("¡Voto registrado! 🗳️");
    });
  };

  return (
    <div className="space-y-3">
      {options.map((option, index) => {
        const isSelected = selected === option.id;

        return (
          <button
            key={option.id}
            onClick={() => handleVote(option.id)}
            disabled={isPending}
            className={`group relative w-full overflow-hidden border text-left transition-all duration-200 ${
              isSelected
                ? "border-primary bg-primary/10 shadow-[0_0_30px_-10px] shadow-primary/60"
                : "border-base-300 bg-base-100 hover:border-primary/60 hover:bg-base-200"
            }`}
          >
            {/* Barra lateral que se enciende al seleccionar */}
            <span
              className={`absolute inset-y-0 left-0 w-1 transition-colors ${
                isSelected ? "bg-primary" : "bg-transparent group-hover:bg-primary/40"
              }`}
            />

            <div className="flex items-center gap-4 p-5">
              <span
                className={`display text-4xl transition-colors ${
                  isSelected ? "text-primary" : "text-stroke"
                }`}
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="flex-1">
                <h3 className="display text-xl">{option.title}</h3>
                {option.description && (
                  <p className="mt-1 text-sm font-medium opacity-70">
                    {option.description}
                  </p>
                )}
              </div>

              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center border-2 transition-colors ${
                  isSelected
                    ? "border-primary bg-primary text-primary-content"
                    : "border-base-300"
                }`}
              >
                {isSelected && (
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </div>
          </button>
        );
      })}

      {selected && (
        <p className="text-center text-xs font-semibold uppercase tracking-widest opacity-50">
          Puedes cambiar tu voto hasta que cierre la encuesta
        </p>
      )}
    </div>
  );
}

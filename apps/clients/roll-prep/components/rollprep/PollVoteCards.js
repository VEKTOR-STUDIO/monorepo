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
    <div className="space-y-4">
      {options.map((option) => {
        const isSelected = selected === option.id;

        return (
          <button
            key={option.id}
            onClick={() => handleVote(option.id)}
            disabled={isPending}
            className={`card w-full text-left transition-all border-2 ${
              isSelected
                ? "border-primary bg-primary/10 shadow-lg"
                : "border-base-300 bg-base-100 hover:border-primary/50"
            }`}
          >
            <div className="card-body flex-row items-center gap-4 p-5">
              <div className="flex-1">
                <h3 className="card-title text-lg">{option.title}</h3>
                {option.description && (
                  <p className="text-sm opacity-70">{option.description}</p>
                )}
              </div>
              <div
                className={`h-6 w-6 shrink-0 rounded-full border-2 flex items-center justify-center ${
                  isSelected ? "border-primary bg-primary text-primary-content" : "border-base-300"
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
        <p className="text-center text-sm opacity-60">
          Puedes cambiar tu voto hasta que cierre la encuesta.
        </p>
      )}
    </div>
  );
}

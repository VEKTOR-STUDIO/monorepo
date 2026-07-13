"use client";

import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { createConcept } from "@/app/admin/actions";

const MAX_CONCEPT_NAME_LENGTH = 60;

/**
 * Formulario para crear un nuevo concepto del taller (p. ej. "masa
 * confusa"). Puede revelarse de inmediato, programarse para una fecha
 * futura, o quedar oculto hasta que Rafael lo revele a mano más adelante.
 */
export default function ConceptForm() {
  const formRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const result = await createConcept(new FormData(e.currentTarget));

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Concepto creado.");
      formRef.current?.reset();
    } catch {
      toast.error("Algo salió mal. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="card border border-base-content/15 bg-base-100 shadow-sm"
    >
      <div className="card-body gap-4">
        <h2 className="card-title text-base">Nuevo concepto</h2>

        <div className="form-control gap-2">
          <label className="label p-0" htmlFor="concept-name">
            <span className="label-text">
              Nombre (p. ej. &ldquo;Masa confusa&rdquo;)
            </span>
          </label>
          <input
            id="concept-name"
            name="name"
            type="text"
            required
            maxLength={MAX_CONCEPT_NAME_LENGTH}
            disabled={isSubmitting}
            placeholder="Nombre del concepto"
            className="input input-bordered w-full"
          />
        </div>

        <div className="form-control gap-2">
          <label className="label p-0" htmlFor="concept-reveal-at">
            <span className="label-text">
              Revelado programado (opcional)
            </span>
          </label>
          <input
            id="concept-reveal-at"
            name="reveal_at"
            type="datetime-local"
            disabled={isSubmitting}
            className="input input-bordered w-full"
          />
          <span className="text-xs opacity-60">
            Se revelará solo automáticamente en esa fecha; también podrás
            revelarlo antes a mano.
          </span>
        </div>

        <label className="label cursor-pointer justify-start gap-3 p-0">
          <input
            type="checkbox"
            name="reveal_now"
            disabled={isSubmitting}
            className="checkbox"
          />
          <span className="label-text">Revelar de inmediato</span>
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-neutral"
        >
          {isSubmitting ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            "Crear concepto"
          )}
        </button>
      </div>
    </form>
  );
}

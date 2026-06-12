"use client";

import { useState } from "react";
import FighterForm from "./FighterForm";
import FighterProfileView from "./FighterProfileView";

/**
 * FighterDashboard — controla el flujo del peleador en /dashboard:
 * sin ficha → formulario de registro; con ficha → perfil estilo UFC + edición.
 */
export default function FighterDashboard({ user, fighter }) {
  const [editing, setEditing] = useState(false);

  // Registro inicial: aún no existe ficha
  if (!fighter) {
    return (
      <div className="border border-primary/30 bg-base-200/60 p-6 md:p-10">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="w-10 h-px bg-primary" />
            <p className="text-primary font-bold text-xs uppercase tracking-[0.4em]">
              Registro de peleador
            </p>
            <span className="w-10 h-px bg-primary" />
          </div>
          <h2 className="font-display leading-none" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
            Únete al <span className="text-primary">roster</span>
          </h2>
          <p className="text-base-content/60 mt-4 text-sm tracking-[0.15em] uppercase max-w-xl mx-auto">
            Completa tu ficha de peleador para formar parte de la base de datos
            oficial de Legión.
          </p>
        </div>
        <FighterForm user={user} />
      </div>
    );
  }

  // Edición de ficha existente
  if (editing) {
    return (
      <div className="border border-primary/30 bg-base-200/60 p-6 md:p-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl md:text-3xl leading-none">
            Editar <span className="text-primary">ficha</span>
          </h2>
          <button
            className="btn btn-ghost btn-sm border border-base-content/20"
            onClick={() => setEditing(false)}
          >
            Cancelar
          </button>
        </div>
        <FighterForm
          user={user}
          fighter={fighter}
          onSaved={() => setEditing(false)}
        />
      </div>
    );
  }

  // Perfil estilo UFC
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl md:text-3xl leading-none">
          Tu <span className="text-primary">ficha de peleador</span>
        </h2>
        <button
          className="btn btn-outline btn-sm border-primary/50 text-primary hover:bg-primary hover:text-primary-content"
          onClick={() => setEditing(true)}
        >
          Editar ficha
        </button>
      </div>
      <FighterProfileView fighter={fighter} />
    </div>
  );
}

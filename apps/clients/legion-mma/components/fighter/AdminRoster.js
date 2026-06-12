"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { createClient } from "@/libs/supabase/client";
import { STATUS_LABELS } from "@/data/fighterOptions";

const FILTERS = [
  { value: "todos", label: "Todos" },
  { value: "pendiente", label: "Pendientes" },
  { value: "aprobado", label: "Aprobados" },
  { value: "rechazado", label: "Rechazados" },
  { value: "inactivo", label: "Inactivos" },
];

const DISCIPLINE_LABELS = { mma: "MMA", bjj: "BJJ", ambas: "MMA + BJJ" };

/**
 * AdminRoster — panel de administración de la base de datos de peleadores.
 * Permite filtrar por estado y aprobar / rechazar / desactivar fichas.
 */
export default function AdminRoster({ fighters = [] }) {
  const supabase = createClient();
  const router = useRouter();
  const [filter, setFilter] = useState("todos");
  const [updatingId, setUpdatingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const filtered =
    filter === "todos" ? fighters : fighters.filter((f) => f.status === filter);

  const counts = fighters.reduce((acc, f) => {
    acc[f.status] = (acc[f.status] || 0) + 1;
    return acc;
  }, {});

  const setStatus = async (fighter, status) => {
    setUpdatingId(fighter.id);
    try {
      const { error } = await supabase
        .from("fighters")
        .update({ status })
        .eq("id", fighter.id);
      if (error) throw error;
      toast.success(`${fighter.full_name}: ${STATUS_LABELS[status].label}`);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "No se pudo actualizar el estado");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Resumen */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          ["Total", fighters.length],
          ["Pendientes", counts.pendiente || 0],
          ["Aprobados", counts.aprobado || 0],
          ["Rechazados", counts.rechazado || 0],
        ].map(([label, value]) => (
          <div key={label} className="border border-primary/20 bg-base-200 p-4 text-center">
            <p className="font-display text-3xl text-primary tabular-nums">{value}</p>
            <p className="text-[0.6rem] tracking-[0.25em] uppercase text-base-content/50 font-bold mt-1">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`btn btn-sm ${
              filter === f.value
                ? "btn-primary"
                : "btn-ghost border border-base-content/20"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Lista */}
      {filtered.length === 0 ? (
        <div className="border border-base-content/10 bg-base-200 p-10 text-center text-base-content/50 text-sm tracking-[0.2em] uppercase">
          No hay peleadores en esta categoría
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((f) => {
            const status = STATUS_LABELS[f.status] || STATUS_LABELS.pendiente;
            const expanded = expandedId === f.id;
            return (
              <div key={f.id} className="border border-base-content/10 bg-base-200">
                {/* Fila principal */}
                <div className="flex flex-col md:flex-row md:items-center gap-4 p-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="relative w-12 h-16 bg-base-300 border-l-2 border-primary overflow-hidden shrink-0">
                      {f.photo_url ? (
                        <Image
                          src={f.photo_url}
                          alt={f.full_name}
                          fill
                          className="object-cover object-top"
                          sizes="48px"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center font-display text-primary/40 text-lg">
                          {f.full_name?.[0] || "?"}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-display text-lg text-base-content truncate">
                        {f.full_name}
                        {f.nickname && (
                          <span className="text-primary text-sm ml-2">&ldquo;{f.nickname}&rdquo;</span>
                        )}
                      </p>
                      <p className="text-[0.65rem] tracking-[0.15em] uppercase text-base-content/50 font-bold">
                        {DISCIPLINE_LABELS[f.discipline] || f.discipline}
                        {f.weight_class && ` · ${f.weight_class}`}
                        {` · ${f.wins}-${f.losses}-${f.draws}`}
                        {` · ${f.experience_level}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`badge ${status.badge} badge-sm uppercase text-[0.6rem] font-bold tracking-wider`}>
                      {f.status}
                    </span>
                    {f.status !== "aprobado" && (
                      <button
                        className="btn btn-success btn-xs"
                        disabled={updatingId === f.id}
                        onClick={() => setStatus(f, "aprobado")}
                      >
                        Aprobar
                      </button>
                    )}
                    {f.status !== "rechazado" && (
                      <button
                        className="btn btn-error btn-xs btn-outline"
                        disabled={updatingId === f.id}
                        onClick={() => setStatus(f, "rechazado")}
                      >
                        Rechazar
                      </button>
                    )}
                    {f.status === "aprobado" && (
                      <button
                        className="btn btn-ghost btn-xs border border-base-content/20"
                        disabled={updatingId === f.id}
                        onClick={() => setStatus(f, "inactivo")}
                      >
                        Desactivar
                      </button>
                    )}
                    <button
                      className="btn btn-ghost btn-xs"
                      onClick={() => setExpandedId(expanded ? null : f.id)}
                    >
                      {expanded ? "Cerrar" : "Detalles"}
                    </button>
                  </div>
                </div>

                {/* Detalle expandible */}
                {expanded && (
                  <div className="border-t border-base-content/10 p-4 grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-sm text-base-content/70">
                    {[
                      ["Teléfono", f.phone],
                      ["Instagram", f.instagram ? `@${f.instagram}` : null],
                      ["Nacimiento", f.birth_date],
                      ["Ubicación", [f.city, f.state].filter(Boolean).join(", ")],
                      ["Peso", f.weight_kg ? `${Number(f.weight_kg)} kg` : null],
                      ["Estatura", f.height_cm ? `${Number(f.height_cm)} cm` : null],
                      ["Alcance", f.reach_cm ? `${Number(f.reach_cm)} cm` : null],
                      ["Guardia", f.stance],
                      ["Cinturón BJJ", f.bjj_belt],
                      ["Equipo", f.team],
                      ["Coach", f.coach_name],
                      ["Años entrenando", f.years_training],
                      ["KO/Sum/Dec", `${f.wins_ko || 0}/${f.wins_sub || 0}/${f.wins_dec || 0}`],
                      ["Emergencia", `${f.emergency_contact_name} — ${f.emergency_contact_phone}`],
                      ["Tipo de sangre", f.blood_type],
                      ["Condiciones médicas", f.medical_conditions],
                    ]
                      .filter(([, v]) => v != null && v !== "")
                      .map(([label, value]) => (
                        <p key={label}>
                          <span className="text-base-content/40 uppercase text-[0.6rem] tracking-[0.2em] font-bold mr-2">
                            {label}
                          </span>
                          {value}
                        </p>
                      ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

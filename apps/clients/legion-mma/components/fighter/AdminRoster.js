"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { createClient } from "@/libs/supabase/client";
import {
  STATUS_LABELS,
  FIGHTING_STYLES,
  VE_BANKS,
  BANK_ACCOUNT_TYPES,
} from "@/data/fighterOptions";
import { getFighterCompletion } from "@/libs/fighterCompletion";

const styleLabelOf = (value) =>
  FIGHTING_STYLES.find((s) => s.value === value)?.label || value;

const bankLabelOf = (code) =>
  VE_BANKS.find((b) => b.value === code)?.label || code;
const accountTypeLabelOf = (value) =>
  BANK_ACCOUNT_TYPES.find((t) => t.value === value)?.label || value;

// El embedded select (fighter_payments) llega como objeto o arreglo.
const paymentOf = (f) =>
  Array.isArray(f?.fighter_payments)
    ? f.fighter_payments[0] || null
    : f?.fighter_payments || null;

const STATUS_FILTERS = [
  { value: "todos", label: "Todos" },
  { value: "pendiente", label: "Pendientes" },
  { value: "aprobado", label: "Aprobados" },
  { value: "rechazado", label: "Rechazados" },
  { value: "inactivo", label: "Inactivos" },
];

const DISCIPLINE_LABELS = { mma: "MMA", bjj: "BJJ", ambas: "MMA + BJJ" };

const SORT_OPTIONS = [
  { value: "recientes", label: "Más recientes" },
  { value: "nombre", label: "Nombre A-Z" },
  { value: "victorias", label: "Más victorias" },
  { value: "peso", label: "Peso (menor a mayor)" },
];

// Búsqueda insensible a acentos ("Perez" encuentra "Pérez")
const normalize = (s = "") =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

/**
 * AdminRoster — panel de administración de la base de datos de peleadores.
 * Búsqueda por texto, filtros combinables y acciones de aprobación.
 */
export default function AdminRoster({ fighters = [] }) {
  const supabase = createClient();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [disciplineFilter, setDisciplineFilter] = useState("todas");
  const [weightClassFilter, setWeightClassFilter] = useState("todas");
  const [levelFilter, setLevelFilter] = useState("todos");
  const [sortBy, setSortBy] = useState("recientes");
  const [updatingId, setUpdatingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  // Divisiones presentes en la base de datos (para el filtro)
  const weightClasses = useMemo(
    () =>
      [...new Set(fighters.map((f) => f.weight_class).filter(Boolean))].sort(),
    [fighters]
  );

  const filtered = useMemo(() => {
    const q = normalize(search.trim());
    let list = fighters.filter((f) => {
      if (statusFilter !== "todos" && f.status !== statusFilter) return false;
      if (disciplineFilter !== "todas" && f.discipline !== disciplineFilter)
        return false;
      if (weightClassFilter !== "todas" && f.weight_class !== weightClassFilter)
        return false;
      if (levelFilter !== "todos" && f.experience_level !== levelFilter)
        return false;
      if (q) {
        const haystack = normalize(
          [f.full_name, f.nickname, f.team, f.coach_name, f.city, f.state]
            .filter(Boolean)
            .join(" ")
        );
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    const sorters = {
      recientes: (a, b) => new Date(b.created_at) - new Date(a.created_at),
      nombre: (a, b) => a.full_name.localeCompare(b.full_name, "es"),
      victorias: (a, b) => (b.wins || 0) - (a.wins || 0),
      peso: (a, b) => (a.weight_kg || 0) - (b.weight_kg || 0),
    };
    return [...list].sort(sorters[sortBy] || sorters.recientes);
  }, [fighters, search, statusFilter, disciplineFilter, weightClassFilter, levelFilter, sortBy]);

  const counts = fighters.reduce((acc, f) => {
    acc[f.status] = (acc[f.status] || 0) + 1;
    return acc;
  }, {});

  const hasActiveFilters =
    search.trim() !== "" ||
    statusFilter !== "todos" ||
    disciplineFilter !== "todas" ||
    weightClassFilter !== "todas" ||
    levelFilter !== "todos";

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("todos");
    setDisciplineFilter("todas");
    setWeightClassFilter("todas");
    setLevelFilter("todos");
  };

  const viewIdDocument = async (path) => {
    try {
      const { data, error } = await supabase.storage
        .from("fighter-documents")
        .createSignedUrl(path, 60);
      if (error) throw error;
      window.open(data.signedUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error(error);
      toast.error("No se pudo abrir el documento");
    }
  };

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

      {/* Búsqueda y filtros */}
      <div className="border border-primary/20 bg-base-200/60 p-4 md:p-5 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Buscador */}
          <label className="input flex items-center gap-3 flex-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 text-primary/70 shrink-0"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type="text"
              className="grow bg-transparent outline-none"
              placeholder="Buscar por nombre, apodo, equipo, coach o ciudad..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                className="text-base-content/40 hover:text-base-content"
                onClick={() => setSearch("")}
                aria-label="Limpiar búsqueda"
              >
                ✕
              </button>
            )}
          </label>

          {/* Orden */}
          <select
            className="select w-full md:w-56"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <select
            className="select w-full"
            value={disciplineFilter}
            onChange={(e) => setDisciplineFilter(e.target.value)}
          >
            <option value="todas">Disciplina: todas</option>
            <option value="mma">MMA</option>
            <option value="bjj">BJJ / Grappling</option>
            <option value="ambas">Ambas</option>
          </select>

          <select
            className="select w-full"
            value={weightClassFilter}
            onChange={(e) => setWeightClassFilter(e.target.value)}
          >
            <option value="todas">División: todas</option>
            {weightClasses.map((wc) => (
              <option key={wc} value={wc}>{wc}</option>
            ))}
          </select>

          <select
            className="select w-full col-span-2 md:col-span-1"
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
          >
            <option value="todos">Nivel: todos</option>
            <option value="amateur">Amateur</option>
            <option value="profesional">Profesional</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`btn btn-sm ${
                statusFilter === f.value
                  ? "btn-primary"
                  : "btn-ghost border border-base-content/20"
              }`}
            >
              {f.label}
            </button>
          ))}
          {hasActiveFilters && (
            <button className="btn btn-sm btn-ghost text-error" onClick={clearFilters}>
              Limpiar filtros
            </button>
          )}
          <span className="ml-auto text-[0.65rem] tracking-[0.2em] uppercase text-base-content/40 font-bold">
            {filtered.length} de {fighters.length} peleadores
          </span>
        </div>
      </div>

      {/* Lista */}
      {filtered.length === 0 ? (
        <div className="border border-base-content/10 bg-base-200 p-10 text-center text-base-content/50 text-sm tracking-[0.2em] uppercase">
          {hasActiveFilters
            ? "Ningún peleador coincide con la búsqueda"
            : "Aún no hay peleadores registrados"}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((f) => {
            const status = STATUS_LABELS[f.status] || STATUS_LABELS.pendiente;
            const expanded = expandedId === f.id;
            const completion = getFighterCompletion(f);
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
                        {f.team && ` · ${f.team}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`badge badge-sm uppercase text-[0.6rem] font-bold tracking-wider ${
                        completion.percent === 100
                          ? "badge-success"
                          : "border border-base-content/20 text-base-content/60"
                      }`}
                      title={`${completion.completed} de ${completion.total} datos`}
                    >
                      {completion.percent}% perfil
                    </span>
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
                  <div className="border-t border-base-content/10 p-4 space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-sm text-base-content/70">
                      {[
                        ["Teléfono", f.phone],
                        ["Instagram", f.instagram ? `@${f.instagram}` : null],
                        ["Cédula / Pasaporte", f.id_document_number],
                        ["Nacimiento", f.birth_date],
                        ["Ubicación", [f.city, f.state].filter(Boolean).join(", ")],
                        ["Estilo de combate", f.fighting_style ? styleLabelOf(f.fighting_style) : null],
                        ["Peso", f.weight_kg ? `${Number(f.weight_kg)} kg` : null],
                        ["Estatura", f.height_cm ? `${Number(f.height_cm)} cm` : null],
                        ["Alcance", f.reach_cm ? `${Number(f.reach_cm)} cm` : null],
                        ["Guardia", f.stance],
                        ["Cinturón BJJ", f.bjj_belt],
                        ["Academia / Equipo", f.team],
                        ["Coach", f.coach_name],
                        ["Años entrenando", f.years_training],
                        ["Récord amateur", `${f.amateur_wins || 0}-${f.amateur_losses || 0}-${f.amateur_draws || 0}`],
                        ["KO/Sum/Dec", `${f.wins_ko || 0}/${f.wins_sub || 0}/${f.wins_dec || 0}`],
                        [
                          "En Legión (V-D-E)",
                          (f.legion_wins || 0) + (f.legion_losses || 0) + (f.legion_draws || 0) > 0
                            ? `${f.legion_wins || 0}-${f.legion_losses || 0}-${f.legion_draws || 0}`
                            : null,
                        ],
                        [
                          "Otras orgs (V-D-E)",
                          (f.other_org_wins || 0) + (f.other_org_losses || 0) + (f.other_org_draws || 0) > 0
                            ? `${f.other_org_wins || 0}-${f.other_org_losses || 0}-${f.other_org_draws || 0}`
                            : null,
                        ],
                        ["Talla short", f.short_size],
                        ["Talla franela", f.shirt_size],
                        ["Talla guante", f.glove_size],
                        ["Franela coach", f.coach_shirt_size],
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
                    {f.id_document_url && (
                      <button
                        onClick={() => viewIdDocument(f.id_document_url)}
                        className="btn btn-ghost btn-xs border border-primary/30 text-primary"
                      >
                        Ver foto de la cédula
                      </button>
                    )}

                    {/* Datos de pago (para liquidar bolsas) */}
                    {(() => {
                      const p = paymentOf(f);
                      const has =
                        p &&
                        (p.bank_code ||
                          p.bank_account_number ||
                          p.pago_movil_phone ||
                          p.bank_account_holder);
                      return (
                        <div className="border border-primary/20 bg-base-100/40 p-3">
                          <p className="text-[0.6rem] tracking-[0.25em] uppercase text-primary font-bold mb-2">
                            Datos de pago
                          </p>
                          {has ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-sm text-base-content/70">
                              {[
                                ["Banco", p.bank_code ? bankLabelOf(p.bank_code) : null],
                                ["Tipo de cuenta", p.bank_account_type ? accountTypeLabelOf(p.bank_account_type) : null],
                                ["N° de cuenta", p.bank_account_number],
                                ["Titular", p.bank_account_holder],
                                ["Cédula / RIF", p.bank_account_holder_id],
                                ["Pago Móvil", p.pago_movil_phone],
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
                          ) : (
                            <p className="text-sm text-base-content/40">
                              Sin datos de pago cargados.
                            </p>
                          )}
                        </div>
                      );
                    })()}
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

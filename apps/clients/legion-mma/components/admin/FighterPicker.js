"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

// Búsqueda insensible a acentos
const normalize = (s = "") =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

/**
 * FighterPicker — combobox con búsqueda para asignar un peleador a una esquina.
 * Props:
 *  - fighters: lista completa del roster
 *  - value: peleador seleccionado o null
 *  - onChange(fighter|null)
 *  - excludeId: id ya usado en la otra esquina
 *  - corner: "rojo" | "azul" (solo estética)
 */
export default function FighterPicker({
  fighters = [],
  value,
  onChange,
  excludeId,
  corner = "rojo",
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const isRed = corner === "rojo";

  const results = useMemo(() => {
    const q = normalize(query.trim());
    return fighters
      .filter((f) => f.id !== excludeId)
      .filter((f) => {
        if (!q) return true;
        return normalize(
          [f.full_name, f.nickname, f.team, f.weight_class]
            .filter(Boolean)
            .join(" ")
        ).includes(q);
      })
      .slice(0, 8);
  }, [fighters, query, excludeId]);

  // Esquina ya asignada: chip con opción de quitar
  if (value) {
    return (
      <div
        className={`flex items-center gap-3 border p-3 ${
          isRed ? "border-primary/60 bg-primary/5" : "border-base-content/30 bg-base-content/5"
        }`}
      >
        <div className="relative w-10 h-13 bg-base-300 overflow-hidden shrink-0" style={{ height: "3.25rem" }}>
          {value.photo_url ? (
            <Image
              src={value.photo_url}
              alt={value.full_name}
              fill
              className="object-cover object-top"
              sizes="40px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center font-display text-primary/40">
              {value.full_name?.[0] || "?"}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display text-base truncate">{value.full_name}</p>
          <p className="text-[0.6rem] tracking-[0.15em] uppercase text-base-content/50 font-bold">
            {value.wins}-{value.losses}-{value.draws}
            {value.weight_class && ` · ${value.weight_class}`}
            {value.status !== "aprobado" && (
              <span className="text-warning"> · {value.status}</span>
            )}
          </p>
        </div>
        <button
          type="button"
          className="btn btn-ghost btn-xs text-error"
          onClick={() => onChange(null)}
        >
          Quitar
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <input
        type="text"
        className="input w-full"
        placeholder={`Buscar peleador (esquina ${corner})...`}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
      />

      {open && results.length > 0 && (
        <ul className="absolute z-30 top-full left-0 right-0 mt-1 border border-primary/40 bg-base-200 shadow-2xl max-h-72 overflow-y-auto">
          {results.map((f) => (
            <li key={f.id}>
              <button
                type="button"
                className="w-full flex items-center gap-3 p-2.5 text-left hover:bg-primary/10 transition-colors"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onChange(f);
                  setQuery("");
                  setOpen(false);
                }}
              >
                <div className="relative w-8 h-10 bg-base-300 overflow-hidden shrink-0">
                  {f.photo_url ? (
                    <Image
                      src={f.photo_url}
                      alt={f.full_name}
                      fill
                      className="object-cover object-top"
                      sizes="32px"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center font-display text-primary/40 text-sm">
                      {f.full_name?.[0] || "?"}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold truncate">
                    {f.full_name}
                    {f.nickname && (
                      <span className="text-primary font-normal"> &ldquo;{f.nickname}&rdquo;</span>
                    )}
                  </p>
                  <p className="text-[0.6rem] tracking-[0.15em] uppercase text-base-content/50 font-bold">
                    {f.wins}-{f.losses}-{f.draws}
                    {f.weight_class && ` · ${f.weight_class}`}
                    {f.team && ` · ${f.team}`}
                    {f.status !== "aprobado" && (
                      <span className="text-warning"> · {f.status}</span>
                    )}
                  </p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

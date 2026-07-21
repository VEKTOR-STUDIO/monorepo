"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const WEEKDAYS = ["L", "M", "M", "J", "V", "S", "D"];

function toKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

// Calendario mensual navegable: los días con clase se marcan en volt y al
// tocarlos se despliegan las clases de ese día con link al detalle.
export default function CalendarView({ assignments }) {
  const now = new Date();
  const [view, setView] = useState({ year: now.getFullYear(), month: now.getMonth() });
  const [selectedKey, setSelectedKey] = useState(null);

  // Mapa "YYYY-MM-DD" → clases de ese día.
  const byDate = useMemo(() => {
    const map = {};
    for (const a of assignments) {
      const key = a.scheduled_for ?? a.created_at?.slice(0, 10);
      if (!key) continue;
      (map[key] ??= []).push(a);
    }
    return map;
  }, [assignments]);

  const { year, month } = view;
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7; // lunes = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayKey = toKey(now.getFullYear(), now.getMonth(), now.getDate());

  const cells = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const navigate = (delta) => {
    setSelectedKey(null);
    setView(({ year, month }) => {
      const d = new Date(year, month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };

  const goToday = () => {
    setSelectedKey(todayKey);
    setView({ year: now.getFullYear(), month: now.getMonth() });
  };

  const selectedClasses = selectedKey ? byDate[selectedKey] ?? [] : [];
  const monthCount = Object.keys(byDate).filter((key) =>
    key.startsWith(`${year}-${String(month + 1).padStart(2, "0")}`)
  ).length;

  return (
    <div className="space-y-4">
      {/* Cabecera del mes con navegación */}
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="display text-5xl">
            {MONTHS[month]}
            <span className="text-primary">.</span>
          </h2>
          <p className="text-xs font-bold uppercase tracking-[0.25em] opacity-50">
            {year} · {monthCount} {monthCount === 1 ? "día con clase" : "días con clase"}
          </p>
        </div>

        <div className="flex gap-1">
          <button
            onClick={() => navigate(-1)}
            aria-label="Mes anterior"
            className="btn btn-square btn-outline btn-sm"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-4 w-4">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>
          <button onClick={goToday} className="btn btn-outline btn-sm">
            Hoy
          </button>
          <button
            onClick={() => navigate(1)}
            aria-label="Mes siguiente"
            className="btn btn-square btn-outline btn-sm"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-4 w-4">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Grid del mes */}
      <div className="clip-cut border-2 border-base-300 bg-base-200 p-3">
        <div className="grid grid-cols-7 gap-1">
          {WEEKDAYS.map((d, i) => (
            <span
              key={`${d}-${i}`}
              className="pb-1 text-center text-[0.6rem] font-black uppercase tracking-widest opacity-40"
            >
              {d}
            </span>
          ))}

          {cells.map((day, i) => {
            if (!day) return <span key={`empty-${i}`} />;

            const key = toKey(year, month, day);
            const classes = byDate[key];
            const isToday = key === todayKey;
            const isSelected = key === selectedKey;

            return (
              <button
                key={key}
                onClick={() => setSelectedKey(isSelected ? null : key)}
                disabled={!classes}
                className={`relative flex aspect-square flex-col items-center justify-center border text-sm font-bold transition-all ${
                  isSelected
                    ? "border-primary bg-primary text-primary-content"
                    : classes
                      ? "border-primary/60 bg-primary/10 text-primary hover:bg-primary/25"
                      : "border-transparent opacity-45"
                } ${isToday && !isSelected ? "border-secondary" : ""}`}
              >
                <span className={isToday ? "underline underline-offset-2" : ""}>
                  {day}
                </span>
                {classes && (
                  <span
                    className={`absolute bottom-1 h-1 w-1 ${
                      isSelected ? "bg-primary-content" : "bg-primary"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Clases del día seleccionado */}
      {selectedKey && (
        <div className="space-y-2">
          <p className="text-xs font-black uppercase tracking-[0.2em] opacity-60">
            {new Date(`${selectedKey}T12:00:00`).toLocaleDateString("es-VE", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>

          {!selectedClasses.length && (
            <p className="border border-base-300 p-4 text-xs font-semibold uppercase tracking-widest opacity-50">
              Sin clase registrada este día
            </p>
          )}

          {selectedClasses.map((a) => (
            <Link
              key={a.id}
              href={`/dashboard/clase/${a.id}`}
              className="menu-tile clip-cut block p-4"
            >
              <span className="relative z-10 flex items-center justify-between gap-3">
                <span>
                  <span className="display block text-xl">{a.title}</span>
                  <span className="text-[0.6rem] font-bold uppercase tracking-widest text-primary">
                    Ver clase y comentarios
                  </span>
                </span>
                {a.is_active && (
                  <span className="tag-skew blink-soft shrink-0 bg-primary px-2 py-0.5 text-[0.6rem] text-primary-content">
                    <span>Activa</span>
                  </span>
                )}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

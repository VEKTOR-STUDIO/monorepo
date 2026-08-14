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

// Calendario mensual navegable: clases en volt, topes/circuitos en accent.
// Al tocar un día se despliegan los eventos con link al detalle.
export default function CalendarView({ items = [] }) {
  const now = new Date();
  const [view, setView] = useState({ year: now.getFullYear(), month: now.getMonth() });
  const [selectedKey, setSelectedKey] = useState(null);

  // Mapa "YYYY-MM-DD" → lo que pasa ese día (clases primero, luego topes).
  const byDate = useMemo(() => {
    const map = {};
    for (const item of items) {
      if (!item?.date) continue;
      (map[item.date] ??= []).push(item);
    }
    for (const list of Object.values(map)) {
      list.sort((a, b) => (a.kind === b.kind ? 0 : a.kind === "class" ? -1 : 1));
    }
    return map;
  }, [items]);

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

  const selectedItems = selectedKey ? byDate[selectedKey] ?? [] : [];
  const monthCount = Object.keys(byDate).filter((key) =>
    key.startsWith(`${year}-${String(month + 1).padStart(2, "0")}`)
  ).length;

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="display text-5xl">
            {MONTHS[month]}
            <span className="text-primary">.</span>
          </h2>
          <p className="text-xs font-bold uppercase tracking-[0.25em] opacity-50">
            {year} · {monthCount}{" "}
            {monthCount === 1 ? "día con agenda" : "días con agenda"}
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
            const dayItems = byDate[key];
            const isToday = key === todayKey;
            const isSelected = key === selectedKey;
            const hasClass = dayItems?.some((item) => item.kind === "class");
            const hasEvent = dayItems?.some((item) => item.kind === "event");
            const tone = hasClass ? "primary" : hasEvent ? "accent" : null;

            return (
              <button
                key={key}
                onClick={() => setSelectedKey(isSelected ? null : key)}
                disabled={!dayItems}
                className={`relative flex aspect-square flex-col items-center justify-center border text-sm font-bold transition-all ${
                  isSelected
                    ? tone === "accent"
                      ? "border-accent bg-accent text-accent-content"
                      : "border-primary bg-primary text-primary-content"
                    : hasClass
                      ? "border-primary/60 bg-primary/10 text-primary hover:bg-primary/25"
                      : hasEvent
                        ? "border-accent/60 bg-accent/10 text-accent hover:bg-accent/25"
                        : "border-transparent opacity-45"
                } ${isToday && !isSelected ? "border-secondary" : ""}`}
              >
                <span className={isToday ? "underline underline-offset-2" : ""}>
                  {day}
                </span>
                {dayItems && (
                  <span className="absolute bottom-1 flex gap-0.5">
                    {hasClass && (
                      <span
                        className={`h-1 w-1 ${
                          isSelected ? "bg-primary-content" : "bg-primary"
                        }`}
                      />
                    )}
                    {hasEvent && (
                      <span
                        className={`h-1 w-1 ${
                          isSelected ? "bg-current" : "bg-accent"
                        }`}
                      />
                    )}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {selectedKey && (
        <div className="space-y-2">
          <p className="text-xs font-black uppercase tracking-[0.2em] opacity-60">
            {new Date(`${selectedKey}T12:00:00`).toLocaleDateString("es-VE", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>

          {!selectedItems.length && (
            <p className="border border-base-300 p-4 text-xs font-semibold uppercase tracking-widest opacity-50">
              Nada agendado este día
            </p>
          )}

          {selectedItems.map((item) => {
            const isEvent = item.kind === "event";
            return (
              <Link
                key={item.id}
                href={item.href}
                className="menu-tile clip-cut block p-4"
              >
                <span className="relative z-10 flex items-center justify-between gap-3">
                  <span>
                    <span className="display block text-xl">{item.title}</span>
                    <span
                      className={`text-[0.6rem] font-bold uppercase tracking-widest ${
                        isEvent ? "text-accent" : "text-primary"
                      }`}
                    >
                      {isEvent ? "Ver el tope" : "Ver clase y comentarios"}
                    </span>
                  </span>
                  {item.live && (
                    <span
                      className={`tag-skew blink-soft shrink-0 px-2 py-0.5 text-[0.6rem] ${
                        isEvent
                          ? "bg-accent text-accent-content"
                          : "bg-primary text-primary-content"
                      }`}
                    >
                      <span>{isEvent ? "Evento" : "Activa"}</span>
                    </span>
                  )}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

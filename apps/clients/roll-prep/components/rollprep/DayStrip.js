"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

const WEEKDAY_INITIALS = ["D", "L", "M", "M", "J", "V", "S"];
const WEEKDAYS = [
  "Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado",
];
const MONTHS = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

// Los nombres de días y meses van a mano y las fechas se leen con los getters
// UTC (cada día se ancla a mediodía UTC): así el servidor y el navegador
// pintan exactamente lo mismo, sin importar el huso ni el locale del celular.
function shiftKey(key, days) {
  return new Date(Date.parse(`${key}T12:00:00Z`) + days * 86_400_000)
    .toISOString()
    .slice(0, 10);
}

/**
 * Tira de días arrastrable: el calendario del gym en horizontal, con las
 * clases y los topes de cada día. Al tocar un día se abre abajo el detalle
 * con links directos. Arranca centrada en hoy.
 *
 * `items` viene ya normalizado desde el servidor:
 * { id, date: "YYYY-MM-DD", kind: "class" | "event", title, label, href, live }
 */
export default function DayStrip({ todayKey, items = [], back = 7, forward = 14 }) {
  const [selectedKey, setSelectedKey] = useState(todayKey);
  const scrollerRef = useRef(null);
  const todayRef = useRef(null);

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

  const days = useMemo(
    () =>
      Array.from({ length: back + forward + 1 }, (_, i) => {
        const key = shiftKey(todayKey, i - back);
        const date = new Date(`${key}T12:00:00Z`);
        return {
          key,
          number: date.getUTCDate(),
          weekday: WEEKDAY_INITIALS[date.getUTCDay()],
          items: byDate[key] ?? [],
        };
      }),
    [todayKey, byDate, back, forward]
  );

  // Hoy al centro apenas monta. Se mueve solo el scroll del contenedor (no
  // scrollIntoView) para no arrastrar la página entera hacia abajo.
  useEffect(() => {
    const scroller = scrollerRef.current;
    const tile = todayRef.current;
    if (!scroller || !tile) return;

    scroller.scrollLeft =
      tile.offsetLeft - scroller.clientWidth / 2 + tile.clientWidth / 2;
  }, []);

  const selected = new Date(`${selectedKey}T12:00:00Z`);
  const selectedItems = byDate[selectedKey] ?? [];
  const upcoming = items.filter((item) => item.date >= todayKey).length;

  return (
    <div className="clip-cut relative border-2 border-base-300 bg-base-200 p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[0.6rem] font-black uppercase tracking-[0.25em] opacity-50">
          Agenda · {upcoming} por delante
        </span>
        <Link
          href="/dashboard/calendario"
          className="tile-cta text-[0.6rem] font-black uppercase tracking-[0.2em] text-primary"
        >
          Ver mes
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="h-2.5 w-2.5"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </div>

      <div
        ref={scrollerRef}
        className="day-strip relative mt-2 flex gap-1.5 overflow-x-auto pb-1"
      >
        {days.map((day) => {
          const isToday = day.key === todayKey;
          const isSelected = day.key === selectedKey;
          const hasItems = day.items.length > 0;

          return (
            <button
              key={day.key}
              ref={isToday ? todayRef : null}
              onClick={() => setSelectedKey(day.key)}
              aria-pressed={isSelected}
              className={`flex w-12 shrink-0 flex-col items-center gap-0.5 border py-1.5 transition-colors ${
                isSelected
                  ? "border-primary bg-primary text-primary-content"
                  : hasItems
                    ? "border-primary/50 bg-primary/10 text-primary hover:bg-primary/25"
                    : "border-base-300 opacity-45 hover:opacity-80"
              } ${isToday && !isSelected ? "border-secondary opacity-100" : ""}`}
            >
              <span className="text-[0.5rem] font-black uppercase tracking-widest opacity-70">
                {isToday ? "Hoy" : day.weekday}
              </span>
              <span className="display text-xl leading-none">{day.number}</span>

              {/* Un punto por cosa agendada: volt = clase, rojo = tope. */}
              <span className="flex h-1.5 items-center gap-0.5">
                {day.items.slice(0, 3).map((item) => (
                  <span
                    key={item.id}
                    className={`h-1 w-1 ${
                      item.kind === "class"
                        ? isSelected
                          ? "bg-primary-content"
                          : "bg-primary"
                        : "bg-accent"
                    }`}
                  />
                ))}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-2 border-t border-base-300 pt-2">
        <p className="text-[0.6rem] font-black uppercase tracking-[0.2em] opacity-60">
          {WEEKDAYS[selected.getUTCDay()]} {selected.getUTCDate()} de{" "}
          {MONTHS[selected.getUTCMonth()]}
        </p>

        {!selectedItems.length && (
          <p className="mt-1 text-[0.65rem] font-semibold uppercase tracking-widest opacity-40">
            Nada agendado este día
          </p>
        )}

        {selectedItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="group mt-1.5 flex items-center gap-2"
          >
            <span
              className={`h-3 w-1 shrink-0 ${
                item.kind === "class" ? "bg-primary" : "bg-accent"
              }`}
            />
            <span className="min-w-0 flex-1 truncate text-sm font-bold group-hover:text-primary">
              {item.title}
            </span>
            {item.live && (
              <span className="tag-skew blink-soft shrink-0 bg-primary px-1.5 py-0.5 text-[0.5rem] text-primary-content">
                <span>Activo</span>
              </span>
            )}
            <span className="shrink-0 text-[0.55rem] font-black uppercase tracking-widest opacity-50">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

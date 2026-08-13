"use client";

import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";

const WEEKDAY_INITIALS = ["D", "L", "M", "M", "J", "V", "S"];
const MONTHS = [
  "ene", "feb", "mar", "abr", "may", "jun",
  "jul", "ago", "sep", "oct", "nov", "dic",
];

// Un título corto se lee entero y quedarse quieto; uno largo no cabe en un
// cuadro de 6rem, así que ese sí se arrastra solo al pasar el cursor.
const TICKER_FROM = 13;

// Los nombres de días y meses van a mano y las fechas se leen con los getters
// UTC (cada día se ancla a mediodía UTC): así el servidor y el navegador
// pintan exactamente lo mismo, sin importar el huso ni el locale del celular.
function shiftKey(key, days) {
  return new Date(Date.parse(`${key}T12:00:00Z`) + days * 86_400_000)
    .toISOString()
    .slice(0, 10);
}

/**
 * Tira de días arrastrable: el calendario del gym en horizontal, como la fila
 * de personajes de una pantalla de selección. Cada día con algo agendado es
 * una carta cuadrada con su splash art y entra directo al contenido; los días
 * vacíos se encogen a una lápida fina. Arranca centrada en hoy.
 *
 * `items` viene ya normalizado desde el servidor:
 * { id, date: "YYYY-MM-DD", kind: "class" | "event", title, href, live, splashUrl }
 */
export default function DayStrip({ todayKey, items = [], back = 4, forward = 10 }) {
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
        const number = date.getUTCDate();

        return {
          key,
          number,
          // El día 1 anuncia el mes; el resto, la inicial del día.
          label:
            number === 1
              ? MONTHS[date.getUTCMonth()]
              : WEEKDAY_INITIALS[date.getUTCDay()],
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

  // py-2: al hover las cartas se despegan 3px y tiran sombra 6px; sin ese
  // aire, el scroll horizontal se las recorta.
  return (
    <div
      ref={scrollerRef}
      className="day-strip relative flex gap-1.5 overflow-x-auto px-0.5 py-2"
    >
      {days.map((day) => {
        const isToday = day.key === todayKey;
        const [item, ...rest] = day.items;
        const topLabel = isToday ? "Hoy" : day.label;

        // Día muerto: lápida fina, solo el número. Comprimir lo vacío deja que
        // en pantalla entren más días con contenido.
        if (!item) {
          return (
            <div
              key={day.key}
              ref={isToday ? todayRef : null}
              className={`flex h-24 w-11 shrink-0 flex-col justify-between border p-1.5 ${
                isToday
                  ? "border-secondary opacity-70"
                  : "border-base-300 opacity-30"
              }`}
            >
              <span className="text-[0.5rem] font-black uppercase tracking-widest">
                {topLabel}
              </span>
              <span className="display text-2xl leading-none">{day.number}</span>
            </div>
          );
        }

        return (
          <Link
            key={day.key}
            ref={isToday ? todayRef : null}
            href={item.href}
            className={`menu-tile clip-cut group h-24 w-24 shrink-0 ${
              isToday ? "border-secondary" : ""
            }`}
          >
            {item.splashUrl ? (
              <span
                className="tile-splash"
                style={{ backgroundImage: `url(${item.splashUrl})` }}
                aria-hidden="true"
              />
            ) : (
              <span className="stripes absolute inset-0 opacity-40" aria-hidden="true" />
            )}

            {/* Franja de tipo: volt = clase, rojo = tope. */}
            <span
              aria-hidden="true"
              className={`absolute inset-x-0 top-0 h-1 ${
                item.kind === "class" ? "bg-primary" : "bg-accent"
              }`}
            />

            <span className="relative z-10 flex h-full flex-col justify-between p-1.5 pt-2">
              <span className="flex items-start justify-between gap-1">
                <span className="text-[0.5rem] font-black uppercase tracking-widest opacity-60">
                  {topLabel}
                </span>
                <span className="flex shrink-0 items-center gap-1">
                  {rest.length > 0 && (
                    <span className="text-[0.5rem] font-black opacity-60">
                      +{rest.length}
                    </span>
                  )}
                  {item.live && (
                    <span className="blink-soft mt-0.5 h-1.5 w-1.5 bg-primary" />
                  )}
                </span>
              </span>

              <span className="block">
                <span className="display block text-3xl leading-none group-hover:text-primary">
                  {day.number}
                </span>
                <span className="day-tick mt-0.5 text-[0.5rem] font-black uppercase tracking-widest opacity-70">
                  <span
                    className={`day-tick-track ${
                      item.title.length > TICKER_FROM ? "day-tick-run" : ""
                    }`}
                  >
                    <span>{item.title}</span>
                    {item.title.length > TICKER_FROM && (
                      <span aria-hidden="true">{item.title}</span>
                    )}
                  </span>
                </span>
              </span>
            </span>
          </Link>
        );
      })}

      {/* Última carta: el mes completo, para el que quiere ver más lejos. */}
      <Link
        href="/dashboard/calendario"
        className="menu-tile clip-cut group h-24 w-11 shrink-0"
      >
        <span className="stripes absolute inset-0 opacity-40" aria-hidden="true" />
        <span className="display absolute bottom-1.5 left-1.5 z-10 text-lg leading-none group-hover:text-primary">
          Mes
        </span>
      </Link>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import {
  GAS_CRITICO,
  MOVIMIENTOS,
  POSICIONES,
  RIVALES,
  TIPOS,
  modificadores,
  opcionesDeAsalto,
  probabilidadRival,
} from "@/libs/camino-negro";

// La escalera de posiciones, de la peor a la mejor. Se dibuja siempre igual
// para que el jugador aprenda a leerla de un vistazo.
const ESCALERA = Object.entries(POSICIONES).sort(
  (a, b) => a[1].valor - b[1].valor
);

const TONO_CHIP = {
  presion: "bg-warning text-warning-content",
  movimiento: "bg-info text-info-content",
  ataque: "bg-accent text-accent-content",
  defensa: "bg-base-300 text-base-content",
};

const TONO_LINEA = {
  bien: "text-primary",
  mal: "text-accent",
  aviso: "text-warning",
  neutro: "opacity-60",
};

// Pantalla de tope: el rival canta, tú respondes. Todo lo que decide la
// pelea está a la vista — probabilidad, gas y lectura del triángulo — para
// que perder sea culpa de la decisión, no de información escondida.
export default function CaminoNegroPelea({ corrida, pelea, onAsalto, onSeguir }) {
  const [sacudida, setSacudida] = useState(false);

  useEffect(() => {
    if (pelea.registro.length === 0) return;
    setSacudida(true);
    const t = setTimeout(() => setSacudida(false), 240);
    return () => clearTimeout(t);
  }, [pelea.registro.length]);

  const rival = RIVALES[pelea.rivalKey];
  const opciones = useMemo(
    () => (pelea.final ? [] : opcionesDeAsalto(pelea, corrida)),
    [pelea, corrida]
  );
  const intencion = MOVIMIENTOS[pelea.intencion];
  const mods = modificadores(corrida);
  const chanceRival = mods.revelaRival ? probabilidadRival(pelea, corrida) : null;

  const pos = POSICIONES[pelea.pos];
  const gasYo = Math.max(0, Math.round((pelea.gasYo / pelea.gasMaxYo) * 100));
  const gasRival = Math.max(
    0,
    Math.round((pelea.gasRival / pelea.gasMaxRival) * 100)
  );
  const ultimas = [...pelea.registro].slice(-6).reverse();

  return (
    <div className={`space-y-3 ${sacudida ? "cn-golpe" : ""}`}>
      {/* ------------------------- El rival ------------------------- */}
      <div className="clip-cut relative overflow-hidden border-2 border-accent bg-base-200 p-4">
        <span
          aria-hidden="true"
          className="display text-stroke pointer-events-none absolute -bottom-5 right-1 select-none text-7xl"
        >
          {String(pelea.asalto).padStart(2, "0")}
        </span>
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-2">
            <span
              className={`tag-skew px-2 py-0.5 text-[0.6rem] ${
                pelea.jefe
                  ? "bg-accent text-accent-content blink-soft"
                  : "bg-secondary text-secondary-content"
              }`}
            >
              <span>{pelea.jefe ? "Jefe de bloque" : "Tope"}</span>
            </span>
            <span className="text-[0.6rem] font-black uppercase tracking-[0.2em] opacity-60">
              Asalto {Math.min(pelea.asalto, pelea.asaltos)}/{pelea.asaltos}
            </span>
          </div>
          <h2 className="display mt-2 text-3xl">{rival.name}</h2>
          <p className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-accent">
            {rival.kicker}
          </p>
          <p className="mt-1 max-w-[85%] text-xs opacity-60">{rival.tagline}</p>
        </div>
      </div>

      {/* ------------------------- Marcador ------------------------- */}
      <div className="grid grid-cols-2 gap-2">
        <Tanque
          etiqueta="Tú"
          gas={pelea.gasYo}
          porcentaje={gasYo}
          puntos={pelea.puntosYo}
          bajo={pelea.gasYo < GAS_CRITICO}
        />
        <Tanque
          etiqueta={rival.name}
          gas={pelea.gasRival}
          porcentaje={gasRival}
          puntos={pelea.puntosRival}
          bajo={pelea.gasRival < GAS_CRITICO}
          rival
        />
      </div>

      {/* ------------------------- Posición ------------------------- */}
      <div className="border-2 border-base-300 bg-base-200 p-3">
        <div className="cn-escalera mb-2">
          {ESCALERA.map(([key, dato]) => (
            <span
              key={key}
              title={dato.name}
              className={`cn-escalon ${
                dato.valor > 0
                  ? "cn-escalon-arriba"
                  : dato.valor < 0
                    ? "cn-escalon-abajo"
                    : ""
              } ${key === pelea.pos ? "cn-escalon-aqui" : ""}`}
            />
          ))}
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <p className="display text-2xl">{pos.name}</p>
          {pelea.ventajaYo > 0 && (
            <span className="tag-skew bg-primary px-2 py-0.5 text-[0.55rem] text-primary-content">
              <span>Agarre puesto</span>
            </span>
          )}
          {pelea.ventajaRival > 0 && (
            <span className="tag-skew bg-accent px-2 py-0.5 text-[0.55rem] text-accent-content">
              <span>Él tiene el agarre</span>
            </span>
          )}
        </div>
        <p className="text-xs opacity-60">{pos.detalle}</p>
      </div>

      {pelea.final ? (
        /* ------------------------- Veredicto ------------------------- */
        <div
          className={`caos-verdict clip-cut border-2 p-5 ${
            pelea.final.resultado === "victoria"
              ? "border-primary bg-primary/10"
              : "border-accent bg-accent/10"
          }`}
        >
          <span
            className={`tag-skew px-2 py-0.5 text-[0.6rem] ${
              pelea.final.resultado === "victoria"
                ? "bg-primary text-primary-content"
                : "bg-accent text-accent-content"
            }`}
          >
            <span>{pelea.final.resultado === "victoria" ? "Victoria" : "Derrota"}</span>
          </span>
          <h3 className="display mt-3 text-4xl">{pelea.final.titulo}</h3>
          <p className="mt-1 text-sm opacity-70">{pelea.final.texto}</p>
          <p className="mt-3 text-[0.65rem] font-black uppercase tracking-[0.2em] opacity-50">
            Marcador {pelea.puntosYo}–{pelea.puntosRival} · Gas {pelea.gasYo}/
            {pelea.gasMaxYo}
          </p>
          <button type="button" onClick={onSeguir} className="btn btn-primary mt-4 w-full">
            Seguir
          </button>
        </div>
      ) : (
        <>
          {/* ------------------------- La intención ------------------------- */}
          <div
            key={pelea.asalto}
            className="cn-canta border-2 border-accent bg-base-200 p-3"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[0.6rem] font-black uppercase tracking-[0.25em] text-accent">
                Él va a...
              </span>
              <span
                className={`tag-skew px-2 py-0.5 text-[0.55rem] ${TONO_CHIP[intencion.tipo]}`}
              >
                <span>{TIPOS[intencion.tipo].label}</span>
              </span>
            </div>
            <p className="display mt-1 text-2xl text-accent">{intencion.name}</p>
            <p className="text-xs opacity-60">{intencion.desc}</p>
            {chanceRival !== null && (
              <p className="mt-1 text-[0.6rem] font-black uppercase tracking-[0.2em] opacity-50">
                Reloj interno: le sale {chanceRival}%
              </p>
            )}
          </div>

          {/* ------------------------- Tu respuesta ------------------------- */}
          <div className="space-y-2">
            <p className="text-[0.6rem] font-black uppercase tracking-[0.25em] opacity-50">
              Tu respuesta · {TIPOS.movimiento.short} gana a {TIPOS.presion.short}, {TIPOS.presion.short} gana a {TIPOS.ataque.short}, {TIPOS.ataque.short} gana a {TIPOS.movimiento.short}
            </p>
            {opciones.map(({ clave, mov, costo, caro, chance, lectura }) => (
              <button
                key={clave}
                type="button"
                onClick={() => onAsalto(clave)}
                className={`cn-mov clip-cut p-3 ${
                  lectura === "gana"
                    ? "cn-mov-gana"
                    : lectura === "pierde"
                      ? "cn-mov-pierde"
                      : lectura === "aguanta"
                        ? "cn-mov-aguanta"
                        : ""
                }`}
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="block">
                    <span className="display block text-lg leading-tight">{mov.name}</span>
                    <span className="mt-1 flex flex-wrap items-center gap-1.5">
                      <span
                        className={`tag-skew px-1.5 py-0.5 text-[0.5rem] ${TONO_CHIP[mov.tipo]}`}
                      >
                        <span>{TIPOS[mov.tipo].label}</span>
                      </span>
                      <span
                        className={`text-[0.6rem] font-black uppercase tracking-widest ${
                          caro ? "text-accent" : "opacity-50"
                        }`}
                      >
                        {costo} gas
                      </span>
                      {mov.a === "tap" && (
                        <span className="text-[0.6rem] font-black uppercase tracking-widest text-accent">
                          Sumisión
                        </span>
                      )}
                      {mov.a && mov.a !== "tap" && (
                        <span className="text-[0.6rem] font-black uppercase tracking-widest opacity-50">
                          → {POSICIONES[mov.a].short}
                        </span>
                      )}
                      {Boolean(mov.puntos) && (
                        <span className="text-[0.6rem] font-black uppercase tracking-widest text-primary">
                          +{mov.puntos} pts
                        </span>
                      )}
                    </span>
                    <span className="mt-1 block text-[0.7rem] opacity-55">{mov.desc}</span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="display block text-2xl text-primary">{chance}%</span>
                    <span className="block text-[0.5rem] font-black uppercase tracking-[0.15em] opacity-50">
                      {lectura === "gana"
                        ? "Le ganas"
                        : lectura === "pierde"
                          ? "Te gana"
                          : lectura === "aguanta"
                            ? "Aguanta"
                            : "Parejo"}
                    </span>
                  </span>
                </span>
              </button>
            ))}
          </div>
        </>
      )}

      {/* ------------------------- Bitácora ------------------------- */}
      {ultimas.length > 0 && (
        <div className="border border-base-300 bg-base-100 p-3">
          <p className="mb-1.5 text-[0.55rem] font-black uppercase tracking-[0.25em] opacity-40">
            Lo que va pasando
          </p>
          <ul className="space-y-0.5">
            {ultimas.map((linea, i) => (
              <li
                key={`${linea.asalto}-${i}-${linea.texto}`}
                className={`cn-linea text-xs ${TONO_LINEA[linea.tono] ?? ""}`}
              >
                <span className="mr-1.5 text-[0.6rem] font-black opacity-40">
                  {String(linea.asalto).padStart(2, "0")}
                </span>
                {linea.texto}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Tanque({ etiqueta, gas, porcentaje, puntos, bajo, rival = false }) {
  return (
    <div className="border-2 border-base-300 bg-base-200 p-2.5">
      <div className="flex items-baseline justify-between gap-2">
        <span className="truncate text-[0.55rem] font-black uppercase tracking-[0.2em] opacity-60">
          {etiqueta}
        </span>
        <span className="display text-xl">{puntos}</span>
      </div>
      <div className={`cn-bar mt-1 ${rival ? "cn-bar-rival" : ""} ${bajo ? "cn-bar-bajo" : ""}`}>
        <div className="cn-bar-fill" style={{ width: `${porcentaje}%` }} />
      </div>
      <p className="mt-1 text-[0.55rem] font-black uppercase tracking-[0.15em] opacity-40">
        {gas} de gas
      </p>
    </div>
  );
}

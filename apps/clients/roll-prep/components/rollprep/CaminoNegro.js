"use client";

import { useCallback, useEffect, useState } from "react";
import CaminoNegroHud from "./CaminoNegroHud";
import CaminoNegroPelea from "./CaminoNegroPelea";
import {
  ALMACEN,
  ATRIBUTOS,
  BLOQUES,
  DETALLES,
  ESTILOS,
  EVENTO_POR_KEY,
  JUEGO,
  MARCAS_MAXIMAS,
  MOVIMIENTOS,
  POSICIONES,
  RIVALES,
  TIPOS,
  TIPOS_DE_NODO,
  aplicarEfecto,
  avanzar,
  cerrarPelea,
  eventoDelNodo,
  gasMaximo,
  nuevaCorrida,
  nuevaPelea,
  ofertaDeDojo,
  opcionesDeDescanso,
  pasoActual,
  resolverAsalto,
  resolverOpcion,
} from "@/libs/camino-negro";

const LLAVE_EXPEDIENTE = `${ALMACEN}:expediente`;
const EXPEDIENTE_VACIO = { corridas: 0, grados: 0, mejorBloque: 0 };

// ============================================================================
// CAMINO NEGRO — la máquina de estados del juego.
//
// Todo vive en el navegador: la corrida se guarda en localStorage y no toca
// Supabase ni la gamificación del gym. Aquí no se gana XP: se juega.
// ============================================================================
export default function CaminoNegro() {
  const [juego, setJuego] = useState(null);
  const [expediente, setExpediente] = useState(EXPEDIENTE_VACIO);

  // Arranque: se lee el guardado. Hasta que no monta en el cliente no se
  // pinta nada del juego, así el HTML del servidor y el del navegador no se
  // pelean (la corrida es aleatoria por definición).
  useEffect(() => {
    let guardado = null;
    let ficha = EXPEDIENTE_VACIO;
    try {
      guardado = JSON.parse(window.localStorage.getItem(ALMACEN) ?? "null");
      ficha = JSON.parse(window.localStorage.getItem(LLAVE_EXPEDIENTE) ?? "null") ?? EXPEDIENTE_VACIO;
    } catch {
      guardado = null;
    }
    setExpediente(ficha);
    setJuego(
      guardado?.corrida?.version === JUEGO.version
        ? guardado
        : { pantalla: "inicio" }
    );
  }, []);

  useEffect(() => {
    if (!juego) return;
    try {
      window.localStorage.setItem(ALMACEN, JSON.stringify(juego));
    } catch {
      // Modo privado o cuota llena: se juega igual, sin guardar.
    }
  }, [juego]);

  const guardarExpediente = useCallback((ficha) => {
    setExpediente(ficha);
    try {
      window.localStorage.setItem(LLAVE_EXPEDIENTE, JSON.stringify(ficha));
    } catch {
      // idem
    }
  }, []);

  const terminar = useCallback(
    (corrida) => {
      guardarExpediente({
        corridas: expediente.corridas + 1,
        grados: expediente.grados + (corrida.fin?.resultado === "victoria" ? 1 : 0),
        mejorBloque: Math.max(expediente.mejorBloque, corrida.bloque + 1),
      });
      setJuego({ pantalla: "fin", corrida });
    },
    [expediente, guardarExpediente]
  );

  if (!juego) {
    return (
      <div className="border-2 border-base-300 bg-base-200 p-10 text-center">
        <p className="text-xs font-black uppercase tracking-[0.3em] opacity-40">
          Cargando el tatami...
        </p>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // Acciones
  // --------------------------------------------------------------------------
  const empezar = (estiloKey) =>
    setJuego({ pantalla: "mapa", corrida: nuevaCorrida(estiloKey) });

  const abandonar = () => {
    if (juego.corrida && !window.confirm("¿Abandonas la corrida? No se guarda nada.")) {
      return;
    }
    guardarExpediente({
      ...expediente,
      corridas: expediente.corridas + (juego.corrida ? 1 : 0),
    });
    setJuego({ pantalla: "inicio" });
  };

  const entrar = (nodo) => {
    const corrida = juego.corrida;

    if (nodo.tipo === "tope" || nodo.tipo === "jefe") {
      setJuego({
        ...juego,
        pantalla: "pelea",
        pelea: nuevaPelea(corrida, nodo.rival, {
          bloque: corrida.bloque,
          jefe: nodo.tipo === "jefe",
        }),
        resultado: null,
      });
      return;
    }

    if (nodo.tipo === "evento") {
      const key = eventoDelNodo(corrida, nodo);
      setJuego({
        ...juego,
        pantalla: "evento",
        eventoKey: key,
        corrida: { ...corrida, eventosVistos: [...corrida.eventosVistos, key] },
        resultado: null,
      });
      return;
    }

    if (nodo.tipo === "dojo") {
      setJuego({
        ...juego,
        pantalla: "dojo",
        oferta: ofertaDeDojo(corrida),
        resultado: null,
      });
      return;
    }

    setJuego({ ...juego, pantalla: "descanso", resultado: null });
  };

  const asalto = (clave) =>
    setJuego((j) => ({ ...j, pelea: resolverAsalto(j.pelea, j.corrida, clave) }));

  const cerrarTope = () => {
    const { corrida, pelea } = juego;
    const { corrida: nueva, mensajes, botin } = cerrarPelea(corrida, pelea);

    if (botin?.length) {
      setJuego({ ...juego, pantalla: "botin", corrida: nueva, botin, pelea: null, resultado: null });
      return;
    }

    if (nueva.fin) {
      terminar(nueva);
      return;
    }

    setJuego({
      ...juego,
      pantalla: "parte",
      corrida: nueva,
      pelea: null,
      resultado: {
        titulo: pelea.final.titulo,
        texto: `Una marca más: llevas ${nueva.marcas} de ${MARCAS_MAXIMAS}. El cuerpo pasa factura.`,
        mensajes,
      },
    });
  };

  const aplicar = (efecto, resultado) => {
    const { corrida, mensajes } = aplicarEfecto(juego.corrida, efecto);
    setJuego({ ...juego, corrida, resultado: { ...resultado, mensajes } });
  };

  const elegirOpcionDeEvento = (opcion) => {
    const { corrida, mensajes, texto, salio } = resolverOpcion(juego.corrida, opcion);
    setJuego({
      ...juego,
      corrida,
      resultado: {
        titulo:
          salio === null ? opcion.etiqueta : salio ? "Te salió bien" : "Te salió mal",
        texto,
        mensajes,
        tono: salio === false ? "mal" : "bien",
      },
    });
  };

  const seguir = () => {
    const avanzada = avanzar(juego.corrida);
    if (avanzada.fin) {
      terminar(avanzada);
      return;
    }
    setJuego({ pantalla: "mapa", corrida: avanzada });
  };

  // --------------------------------------------------------------------------
  // Pantallas
  // --------------------------------------------------------------------------
  if (juego.pantalla === "inicio") {
    return <Inicio expediente={expediente} onEmpezar={empezar} />;
  }

  if (juego.pantalla === "fin") {
    return (
      <Fin
        corrida={juego.corrida}
        expediente={expediente}
        onOtra={() => setJuego({ pantalla: "inicio" })}
      />
    );
  }

  const { corrida, resultado } = juego;

  return (
    <div className="space-y-4">
      <CaminoNegroHud corrida={corrida} />

      {juego.pantalla === "pelea" && (
        <CaminoNegroPelea
          corrida={corrida}
          pelea={juego.pelea}
          onAsalto={asalto}
          onSeguir={cerrarTope}
        />
      )}

      {juego.pantalla === "mapa" && <Mapa corrida={corrida} onEntrar={entrar} />}

      {juego.pantalla === "evento" && (
        <Evento
          evento={EVENTO_POR_KEY[juego.eventoKey]}
          resultado={resultado}
          onElegir={elegirOpcionDeEvento}
          onSeguir={seguir}
        />
      )}

      {juego.pantalla === "dojo" && (
        <Dojo
          oferta={juego.oferta}
          resultado={resultado}
          onElegir={(key) =>
            aplicar(
              { movimiento: key },
              { titulo: MOVIMIENTOS[key].name, texto: MOVIMIENTOS[key].desc }
            )
          }
          onSeguir={seguir}
        />
      )}

      {juego.pantalla === "descanso" && (
        <Descanso
          corrida={corrida}
          resultado={resultado}
          onElegir={(opcion) =>
            aplicar(opcion.efecto, { titulo: opcion.etiqueta, texto: opcion.detalle })
          }
          onSeguir={seguir}
        />
      )}

      {juego.pantalla === "botin" && (
        <Botin
          botin={juego.botin}
          resultado={resultado}
          onElegir={(opcion) =>
            aplicar(opcion.efecto, { titulo: opcion.etiqueta, texto: opcion.detalle })
          }
          onSeguir={seguir}
        />
      )}

      {juego.pantalla === "parte" && (
        <Panel kicker="Parte médico" titulo={resultado.titulo} texto={resultado.texto}>
          <Mensajes mensajes={resultado.mensajes} />
          <button type="button" onClick={seguir} className="btn btn-primary mt-4 w-full">
            Seguir
          </button>
        </Panel>
      )}

      <button
        type="button"
        onClick={abandonar}
        className="w-full py-2 text-[0.6rem] font-black uppercase tracking-[0.25em] opacity-40 hover:opacity-80"
      >
        Abandonar corrida
      </button>
    </div>
  );
}

// ============================================================================
// Pantalla de arranque: selección de estilo, como el character select.
// ============================================================================
function Inicio({ expediente, onEmpezar }) {
  const [estilo, setEstilo] = useState("guardero");
  const elegido = ESTILOS[estilo];

  return (
    <div className="space-y-5">
      <div className="clip-cut halftone relative overflow-hidden border-2 border-base-300 bg-base-200 p-5">
        <span
          aria-hidden="true"
          className="display text-stroke pointer-events-none absolute -bottom-6 right-2 select-none text-8xl"
        >
          BJJ
        </span>
        <div className="relative z-10 space-y-3">
          <h2 className="display text-3xl">Cómo se juega</h2>
          <ol className="space-y-2 text-sm opacity-80">
            <li>
              <b className="text-primary">01 ·</b> Tres bloques, cinco noches cada uno.
              En cada noche eliges un camino: pelear, decidir, aprender o descansar.
            </li>
            <li>
              <b className="text-primary">02 ·</b> El gas es tu vida y no se rellena
              solo entre topes. Descansar cuesta una noche.
            </li>
            <li>
              <b className="text-primary">03 ·</b> En el tope el rival canta lo que va
              a hacer. Le respondes con el tipo que le gana:
            </li>
          </ol>

          <div className="flex flex-wrap items-center gap-2 border-t border-base-300 pt-3">
            <Triangulo de="movimiento" a="presion" />
            <Triangulo de="presion" a="ataque" />
            <Triangulo de="ataque" a="movimiento" />
          </div>

          <p className="text-xs opacity-60">
            Pierdes la corrida si caes contra un jefe o si pierdes{" "}
            {MARCAS_MAXIMAS} topes. Aquí no se gana XP ni puntos de ranking: esto es
            aparte del gym.
          </p>
        </div>
      </div>

      <div>
        <p className="mb-2 text-[0.6rem] font-black uppercase tracking-[0.25em] opacity-50">
          Elige tu juego
        </p>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(ESTILOS).map(([key, dato]) => (
            <button
              key={key}
              type="button"
              onClick={() => setEstilo(key)}
              className={`cn-mov clip-cut p-3 text-left ${
                key === estilo ? "border-primary" : ""
              }`}
            >
              <span className="tag-skew bg-secondary px-1.5 py-0.5 text-[0.5rem] text-secondary-content">
                <span>{dato.kicker}</span>
              </span>
              <span className="display mt-2 block text-xl">{dato.name}</span>
              <span className="mt-1 block text-[0.7rem] opacity-60">{dato.tagline}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="border-2 border-base-300 bg-base-200 p-4">
        <div className="grid grid-cols-4 gap-1.5">
          {Object.entries(ATRIBUTOS).map(([key, attr]) => (
            <div key={key} className="border border-base-300 bg-base-100 px-2 py-1.5 text-center">
              <p className="text-[0.55rem] font-black uppercase tracking-[0.15em] opacity-50">
                {attr.short}
              </p>
              <p className="display text-xl text-primary">{elegido.atributos[key]}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[0.6rem] font-black uppercase tracking-[0.2em] opacity-50">
          Técnicas de la casa
        </p>
        <ul className="mt-1 space-y-1">
          {elegido.movimientos.map((key) => (
            <li key={key} className="text-xs">
              <b>{MOVIMIENTOS[key].name}</b>
              <span className="opacity-60"> · {MOVIMIENTOS[key].desc}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        onClick={() => onEmpezar(estilo)}
        className="btn btn-primary w-full text-lg"
      >
        Empezar corrida
      </button>

      {expediente.corridas > 0 && (
        <p className="text-center text-[0.6rem] font-black uppercase tracking-[0.2em] opacity-40">
          Expediente · {expediente.corridas} corridas · {expediente.grados} grados ·
          mejor bloque {expediente.mejorBloque}
        </p>
      )}
    </div>
  );
}

function Triangulo({ de, a }) {
  return (
    <span className="flex items-center gap-1 text-[0.6rem] font-black uppercase tracking-widest">
      <span className={`tag-skew px-1.5 py-0.5 ${TONO_TIPO[de]}`}>
        <span>{TIPOS[de].short}</span>
      </span>
      <span className="opacity-40">gana a</span>
      <span className={`tag-skew px-1.5 py-0.5 ${TONO_TIPO[a]}`}>
        <span>{TIPOS[a].short}</span>
      </span>
    </span>
  );
}

const TONO_TIPO = {
  presion: "bg-warning text-warning-content",
  movimiento: "bg-info text-info-content",
  ataque: "bg-accent text-accent-content",
  defensa: "bg-base-300 text-base-content",
};

// ============================================================================
// El mapa de la noche: dos o tres caminos, uno se toma.
// ============================================================================
function Mapa({ corrida, onEntrar }) {
  const paso = pasoActual(corrida);
  const bloque = BLOQUES[corrida.bloque];

  if (!paso) return null;

  return (
    <div className="space-y-3">
      <div className="border-l-4 border-primary pl-3">
        <p className="text-[0.6rem] font-black uppercase tracking-[0.25em] text-primary">
          Bloque {corrida.bloque + 1} de {BLOQUES.length}
        </p>
        <h2 className="display text-3xl">{bloque.nombre}</h2>
        <p className="text-xs opacity-60">{bloque.tagline}</p>
      </div>

      <p className="text-[0.6rem] font-black uppercase tracking-[0.25em] opacity-50">
        {paso.jefe ? "No hay a dónde correr" : "Escoge tu noche"}
      </p>

      <div className="space-y-2">
        {paso.opciones.map((nodo, i) => (
          <NodoCarta key={`${nodo.tipo}-${i}`} nodo={nodo} corrida={corrida} onEntrar={onEntrar} />
        ))}
      </div>
    </div>
  );
}

function NodoCarta({ nodo, corrida, onEntrar }) {
  const rival = nodo.rival ? RIVALES[nodo.rival] : null;
  const evento = nodo.tipo === "evento" ? EVENTO_POR_KEY[eventoDelNodo(corrida, nodo)] : null;

  const titulo =
    rival?.name ??
    evento?.titulo ??
    (nodo.tipo === "dojo" ? "Clase técnica" : "Descanso");

  const detalle =
    rival?.tagline ??
    (evento ? evento.kicker : null) ??
    (nodo.tipo === "dojo"
      ? "Aprendes una técnica nueva entre tres. No cuesta gas."
      : "Duermes, comes o vas al fisio. Vuelves entero.");

  const esJefe = nodo.tipo === "jefe";

  return (
    <button
      type="button"
      onClick={() => onEntrar(nodo)}
      className={`cn-mov clip-cut relative w-full p-4 ${esJefe ? "border-accent" : ""}`}
    >
      <span className="flex items-start justify-between gap-3">
        <span className="block">
          <span
            className={`tag-skew px-2 py-0.5 text-[0.55rem] ${
              esJefe
                ? "bg-accent text-accent-content blink-soft"
                : nodo.tipo === "tope"
                  ? "bg-secondary text-secondary-content"
                  : "bg-base-300 text-base-content"
            }`}
          >
            <span>{TIPOS_DE_NODO[nodo.tipo].label}</span>
          </span>
          <span className="display mt-2 block text-2xl">{titulo}</span>
          <span className="mt-1 block text-[0.7rem] uppercase tracking-widest opacity-50">
            {rival ? rival.kicker : TIPOS_DE_NODO[nodo.tipo].kicker}
          </span>
          <span className="mt-1 block max-w-[90%] text-xs opacity-60">{detalle}</span>
        </span>
      </span>
    </button>
  );
}

// ============================================================================
// Dilemas, dojo, descanso y botín: la misma carcasa, distinto contenido.
// ============================================================================
function Panel({ kicker, titulo, texto, children, tono = "primary" }) {
  return (
    <div className={`clip-cut border-2 bg-base-200 p-5 ${
      tono === "mal" ? "border-accent" : "border-base-300"
    }`}>
      <span
        className={`tag-skew px-2 py-0.5 text-[0.6rem] ${
          tono === "mal"
            ? "bg-accent text-accent-content"
            : "bg-primary text-primary-content"
        }`}
      >
        <span>{kicker}</span>
      </span>
      <h2 className="display mt-3 text-3xl">{titulo}</h2>
      {texto && <p className="mt-2 text-sm opacity-75">{texto}</p>}
      {children}
    </div>
  );
}

function Mensajes({ mensajes }) {
  if (!mensajes?.length) return null;
  return (
    <ul className="mt-3 flex flex-wrap gap-1.5">
      {mensajes.map((m, i) => (
        <li
          key={`${m.texto}-${i}`}
          className={`tag-skew px-2 py-0.5 text-[0.6rem] ${
            m.tono === "mal"
              ? "bg-accent text-accent-content"
              : m.tono === "bien"
                ? "bg-primary text-primary-content"
                : "bg-base-300 text-base-content"
          }`}
        >
          <span>{m.texto}</span>
        </li>
      ))}
    </ul>
  );
}

function Eleccion({ kicker, titulo, detalle, onClick }) {
  return (
    <button type="button" onClick={onClick} className="cn-mov clip-cut w-full p-3 text-left">
      {kicker && (
        <span className="tag-skew bg-base-300 px-1.5 py-0.5 text-[0.5rem] text-base-content">
          <span>{kicker}</span>
        </span>
      )}
      <span className="display mt-1.5 block text-lg leading-tight">{titulo}</span>
      {detalle && <span className="mt-1 block text-xs opacity-60">{detalle}</span>}
    </button>
  );
}

function Evento({ evento, resultado, onElegir, onSeguir }) {
  return (
    <div className="space-y-3">
      <Panel kicker={evento.kicker} titulo={evento.titulo} texto={evento.texto} />

      {resultado ? (
        <Panel
          kicker="Resultado"
          titulo={resultado.titulo}
          texto={resultado.texto}
          tono={resultado.tono}
        >
          <Mensajes mensajes={resultado.mensajes} />
          <button type="button" onClick={onSeguir} className="btn btn-primary mt-4 w-full">
            Seguir
          </button>
        </Panel>
      ) : (
        <div className="space-y-2">
          {evento.opciones.map((opcion) => (
            <Eleccion
              key={opcion.etiqueta}
              kicker={opcion.riesgo ? `Riesgo · ${opcion.riesgo.chance}%` : null}
              titulo={opcion.etiqueta}
              detalle={opcion.detalle}
              onClick={() => onElegir(opcion)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Dojo({ oferta, resultado, onElegir, onSeguir }) {
  if (resultado) {
    return (
      <Panel kicker="Aprendido" titulo={resultado.titulo} texto={resultado.texto}>
        <Mensajes mensajes={resultado.mensajes} />
        <button type="button" onClick={onSeguir} className="btn btn-primary mt-4 w-full">
          Seguir
        </button>
      </Panel>
    );
  }

  return (
    <div className="space-y-3">
      <Panel
        kicker="Dojo"
        titulo="Clase técnica"
        texto="El profesor abre la clase con tres cosas. Solo vas a poder llevarte una."
      />
      <div className="space-y-2">
        {oferta.length ? (
          oferta.map((key) => {
            const mov = MOVIMIENTOS[key];
            const desde =
              mov.from === "todas"
                ? "Cualquier posición"
                : mov.from.map((p) => POSICIONES[p].short).join(" · ");
            return (
              <Eleccion
                key={key}
                kicker={`${TIPOS[mov.tipo].label} · ${desde}`}
                titulo={mov.name}
                detalle={mov.desc}
                onClick={() => onElegir(key)}
              />
            );
          })
        ) : (
          <Panel kicker="Dojo" titulo="Ya te lo sabes todo" texto="No queda nada nuevo que enseñarte.">
            <button type="button" onClick={onSeguir} className="btn btn-primary mt-4 w-full">
              Seguir
            </button>
          </Panel>
        )}
      </div>
    </div>
  );
}

function Descanso({ corrida, resultado, onElegir, onSeguir }) {
  if (resultado) {
    return (
      <Panel kicker="Descanso" titulo={resultado.titulo} texto={resultado.texto}>
        <Mensajes mensajes={resultado.mensajes} />
        <button type="button" onClick={onSeguir} className="btn btn-primary mt-4 w-full">
          Seguir
        </button>
      </Panel>
    );
  }

  return (
    <div className="space-y-3">
      <Panel
        kicker="Cuerpo"
        titulo="Noche libre"
        texto={`Vas por ${corrida.gas} de ${gasMaximo(corrida)} de gas. Hoy no se pelea.`}
      />
      <div className="space-y-2">
        {opcionesDeDescanso(corrida).map((opcion) => (
          <Eleccion
            key={opcion.key}
            titulo={opcion.etiqueta}
            detalle={opcion.detalle}
            onClick={() => onElegir(opcion)}
          />
        ))}
      </div>
    </div>
  );
}

function Botin({ botin, resultado, onElegir, onSeguir }) {
  if (resultado) {
    return (
      <Panel kicker="Te lo llevas" titulo={resultado.titulo} texto={resultado.texto}>
        <Mensajes mensajes={resultado.mensajes} />
        <button type="button" onClick={onSeguir} className="btn btn-primary mt-4 w-full">
          Seguir
        </button>
      </Panel>
    );
  }

  return (
    <div className="space-y-3">
      <Panel
        kicker="Ganaste el tope"
        titulo="Algo te llevas"
        texto="De cada pelea sale algo: una técnica, un detalle o kilometraje. Una sola cosa."
      />
      <div className="space-y-2">
        {botin.map((opcion) => (
          <Eleccion
            key={opcion.key}
            kicker={opcion.kicker}
            titulo={opcion.etiqueta}
            detalle={opcion.detalle}
            onClick={() => onElegir(opcion)}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Fin de corrida.
// ============================================================================
function Fin({ corrida, expediente, onOtra }) {
  const gano = corrida.fin?.resultado === "victoria";

  return (
    <div className="space-y-4">
      <div
        className={`clip-cut halftone relative overflow-hidden border-2 p-6 ${
          gano ? "border-primary bg-primary/10" : "border-accent bg-accent/10"
        }`}
      >
        <span
          aria-hidden="true"
          className="display text-stroke pointer-events-none absolute -bottom-6 right-2 select-none text-8xl"
        >
          {gano ? "OSS" : "FIN"}
        </span>
        <div className="relative z-10">
          <span
            className={`tag-skew px-2 py-0.5 text-[0.6rem] ${
              gano ? "bg-primary text-primary-content" : "bg-accent text-accent-content"
            }`}
          >
            <span>{gano ? "Corrida completada" : "Corrida terminada"}</span>
          </span>
          <h2 className="display mt-3 text-4xl">{corrida.fin?.titulo}</h2>
          <p className="mt-2 text-sm opacity-75">{corrida.fin?.texto}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Dato etiqueta="Bloque alcanzado" valor={`${corrida.bloque + 1}/${BLOQUES.length}`} />
        <Dato etiqueta="Topes peleados" valor={corrida.peleas ?? 0} />
        <Dato etiqueta="Ganados" valor={corrida.victorias ?? 0} />
        <Dato etiqueta="Por sumisión" valor={corrida.sumisiones ?? 0} />
      </div>

      <div className="border-2 border-base-300 bg-base-200 p-4">
        <p className="text-[0.6rem] font-black uppercase tracking-[0.25em] opacity-50">
          Con lo que terminaste
        </p>
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {corrida.detalles.map((key) => (
            <li
              key={key}
              className="tag-skew bg-primary px-2 py-0.5 text-[0.6rem] text-primary-content"
            >
              <span>{DETALLES[key].name}</span>
            </li>
          ))}
          {corrida.lesiones.map((key) => (
            <li
              key={key}
              className="tag-skew bg-accent px-2 py-0.5 text-[0.6rem] text-accent-content"
            >
              <span>{LESION_CORTA(key)}</span>
            </li>
          ))}
          {!corrida.detalles.length && !corrida.lesiones.length && (
            <li className="text-xs opacity-50">Sin detalles y sin lesiones. Rarísimo.</li>
          )}
        </ul>
      </div>

      <button type="button" onClick={onOtra} className="btn btn-primary w-full text-lg">
        Otra corrida
      </button>

      <p className="text-center text-[0.6rem] font-black uppercase tracking-[0.2em] opacity-40">
        Expediente · {expediente.corridas} corridas · {expediente.grados} grados ·
        mejor bloque {expediente.mejorBloque}
      </p>
    </div>
  );
}

function Dato({ etiqueta, valor }) {
  return (
    <div className="border border-base-300 bg-base-200 px-3 py-2">
      <p className="text-[0.55rem] font-black uppercase tracking-[0.2em] opacity-50">
        {etiqueta}
      </p>
      <p className="display text-2xl">{valor}</p>
    </div>
  );
}

// Nombre corto de la lesión para la chapa del resumen.
const LESION_CORTA = (key) => {
  const nombres = {
    costilla: "Costilla",
    dedo_gordo: "Dedo",
    rodilla: "Rodilla",
    cuello: "Cuello",
    hombro: "Hombro",
    codo: "Codo",
  };
  return nombres[key] ?? key;
};

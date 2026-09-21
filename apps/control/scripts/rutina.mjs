#!/usr/bin/env node
// La rutina de un candidato, de principio a fin:
//
//   1. deja el encargo y el material en apps/clients/<carpeta>/docs/fuentes
//   2. `pnpm install` en la raíz, para que el cliente nuevo entre al workspace
//   3. `claude -p` con la skill demo-de-venta, apuntando cada paso al registro
//   4. mueve la tarjeta a «Revisión» (o la devuelve si falló) y lanza la siguiente
//
// Lo arranca libs/rutina.mjs suelto del servidor de Next, así que aquí no hay
// nadie mirando la salida: todo lo que importa se escribe en el registro y en
// el candidato.json, que es de donde lo lee el tablero.
//
// A mano:  node apps/control/scripts/rutina.mjs <id>
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { spawn, spawnSync } from "node:child_process";
import { actualizarCandidato, leerCandidato } from "../libs/almacen.mjs";
import { archivoRegistro, archivoRegistroCrudo, carpetaClientes, raiz } from "../libs/rutas.mjs";
import {
  argumentosClaude,
  configuracion,
  despachar,
  ponerCerrojo,
  puertoDePrueba,
  quitarCerrojo,
  redactarPrompt,
  sembrarFuentes,
} from "../libs/rutina.mjs";

const id = process.argv[2];
const candidato = id ? leerCandidato(id) : null;
if (!candidato) {
  console.error("Uso: node apps/control/scripts/rutina.mjs <id-del-candidato>");
  process.exit(1);
}

const RAIZ = raiz();
const registro = archivoRegistro(id);
const crudo = archivoRegistroCrudo(id);

// --- El registro ------------------------------------------------------------------

const hora = () => new Date().toTimeString().slice(0, 8);

function apunta(texto, sangria = "") {
  const lineas = String(texto)
    .replace(/\s+$/g, "")
    .split("\n")
    .map((l) => `[${hora()}] ${sangria}${l}`);
  fs.appendFileSync(registro, lineas.join("\n") + "\n");
}

const corta = (texto, largo = 220) => {
  const plano = String(texto ?? "").replace(/\s+/g, " ").trim();
  return plano.length > largo ? `${plano.slice(0, largo)}…` : plano;
};

const relativa = (archivo) =>
  typeof archivo === "string" && archivo.startsWith(RAIZ) ? path.relative(RAIZ, archivo) : archivo;

function resumirHerramienta(nombre, entrada = {}) {
  switch (nombre) {
    case "Bash":
      return `$ ${corta(entrada.command)}`;
    case "Read":
    case "Edit":
    case "Write":
    case "NotebookEdit":
      return `${nombre} ${relativa(entrada.file_path)}`;
    case "Glob":
    case "Grep":
      return `${nombre} ${corta(entrada.pattern, 120)}`;
    case "Skill":
      return `Skill /${entrada.skill}`;
    case "Task":
    case "Agent":
      return `Subagente: ${corta(entrada.description, 120)}`;
    case "TodoWrite": {
      const enCurso = (entrada.todos || []).find((t) => t.status === "in_progress");
      return enCurso ? `Ahora: ${corta(enCurso.activeForm || enCurso.content, 140)}` : "Lista de tareas actualizada";
    }
    case "WebFetch":
      return `WebFetch ${entrada.url}`;
    case "WebSearch":
      return `WebSearch ${corta(entrada.query, 120)}`;
    default:
      return `${nombre} ${corta(JSON.stringify(entrada), 140)}`;
  }
}

function textoDeResultado(contenido) {
  if (typeof contenido === "string") return contenido;
  if (Array.isArray(contenido)) return contenido.map((c) => c.text || "").join(" ");
  return "";
}

// --- El entorno -------------------------------------------------------------------

// Este script hereda el entorno del servidor de Next, que viene con
// NODE_ENV=development y sus variables internas. Si llegan hasta el
// `next build` que Claude lanza para comprobar el cliente, el build sale raro
// o directamente falla. Y las CLAUDE_CODE_* le harían creer a la sesión nueva
// que corre dentro de otra.
function entornoLimpio() {
  const limpio = {};
  for (const [clave, valor] of Object.entries(process.env)) {
    if (clave === "NODE_ENV" || clave === "PORT" || clave === "CLAUDECODE") continue;
    if (/^(__NEXT|NEXT_|TURBOPACK|CLAUDE_CODE_)/.test(clave)) continue;
    limpio[clave] = valor;
  }
  return limpio;
}

// --- La rutina --------------------------------------------------------------------

let hijoActual = null;
let detenida = false;

// «Detener» en el tablero manda SIGTERM a este proceso. Se le pasa a Claude y
// se deja que el flujo normal cierre: así la tarjeta siempre acaba en un estado
// de verdad y el cerrojo se quita.
for (const senal of ["SIGTERM", "SIGINT"]) {
  process.on(senal, () => {
    detenida = true;
    apunta("■ Detenida desde el tablero.");
    try {
      hijoActual?.kill("SIGTERM");
    } catch {}
  });
}

function lanzar(comando, args, entrada, alLeerLinea) {
  return new Promise((resolve) => {
    let hijo;
    try {
      hijo = spawn(comando, args, { cwd: RAIZ, env: entornoLimpio(), stdio: ["pipe", "pipe", "pipe"] });
    } catch (error) {
      resolve({ codigo: -1, error });
      return;
    }
    hijoActual = hijo;
    hijo.on("error", (error) => resolve({ codigo: -1, error }));
    hijo.on("close", (codigo) => {
      hijoActual = null;
      resolve({ codigo });
    });
    hijo.stdin.on("error", () => {});
    hijo.stdin.end(entrada || "");
    readline.createInterface({ input: hijo.stdout }).on("line", alLeerLinea);
    readline.createInterface({ input: hijo.stderr }).on("line", (l) => l.trim() && apunta(`! ${corta(l, 400)}`));
  });
}

async function principal() {
  ponerCerrojo(id, process.pid);
  fs.writeFileSync(registro, "");
  fs.writeFileSync(crudo, "");

  const { bin, modo, modelo } = configuracion();
  actualizarCandidato(
    id,
    {
      etapa: "en-proceso",
      rutina: {
        estado: "corriendo",
        pid: process.pid,
        inicio: new Date().toISOString(),
        fin: null,
        sesion: null,
        costo: null,
        turnos: null,
        resumen: "",
        error: "",
      },
    },
    "Empezó la rutina."
  );

  const cliente = path.join(carpetaClientes(), candidato.carpeta);
  if (!fs.existsSync(cliente)) throw new Error(`No existe apps/clients/${candidato.carpeta}.`);

  apunta(`▶ Rutina de «${candidato.nombre}» → apps/clients/${candidato.carpeta}`);
  apunta(`  Permisos: ${modo}${modelo ? ` · modelo: ${modelo}` : ""} · puerto de prueba: ${puertoDePrueba(id)}`);

  const fuentes = sembrarFuentes(leerCandidato(id));
  apunta(`✓ Encargo y material en ${path.relative(RAIZ, fuentes)}`);

  apunta("… pnpm install (para que el cliente nuevo entre al workspace)");
  const instalacion = await lanzar("pnpm", ["install"], "", (l) => {
    if (/ERR|WARN|Done in|Progress: .*done/.test(l)) apunta(corta(l, 300), "  ");
  });
  if (detenida) return { detenida: true };
  if (instalacion.codigo !== 0) {
    throw new Error(`pnpm install salió con código ${instalacion.codigo}${instalacion.error ? `: ${instalacion.error.message}` : ""}.`);
  }
  apunta("✓ Dependencias instaladas");

  apunta("… Arranca Claude");
  let final = null;
  const sesion = await lanzar(bin, argumentosClaude(candidato), redactarPrompt(candidato), (l) => {
    if (!l.trim()) return;
    fs.appendFileSync(crudo, l + "\n");
    let evento;
    try {
      evento = JSON.parse(l);
    } catch {
      apunta(corta(l, 400));
      return;
    }
    const sangria = evento.parent_tool_use_id ? "    " : "";

    if (evento.type === "system" && evento.subtype === "init") {
      apunta(`✓ Sesión ${evento.session_id} · ${evento.model}`);
      actualizarCandidato(id, { rutina: { sesion: evento.session_id } });
    } else if (evento.type === "assistant") {
      for (const bloque of evento.message?.content || []) {
        if (bloque.type === "text" && bloque.text.trim()) apunta(bloque.text.trim(), sangria);
        if (bloque.type === "tool_use") apunta(`→ ${resumirHerramienta(bloque.name, bloque.input)}`, sangria);
      }
    } else if (evento.type === "user") {
      for (const bloque of evento.message?.content || []) {
        if (bloque.type === "tool_result" && bloque.is_error) {
          apunta(`✗ ${corta(textoDeResultado(bloque.content), 300)}`, sangria);
        }
      }
    } else if (evento.type === "result") {
      final = evento;
    }
  });

  if (detenida) return { detenida: true, final };
  if (sesion.error) {
    throw new Error(
      sesion.error.code === "ENOENT"
        ? `No encuentro el ejecutable «${bin}». Pon su ruta en CONTROL_CLAUDE_BIN (apps/control/.env.local).`
        : sesion.error.message
    );
  }
  if (!final) throw new Error(`Claude terminó (código ${sesion.codigo}) sin dar un resultado. Mira el registro.`);
  if (final.is_error || sesion.codigo !== 0) {
    const motivo = corta(final.result || final.subtype || `código ${sesion.codigo}`, 400);
    const error = new Error(`Claude no terminó bien: ${motivo}`);
    error.final = final;
    throw error;
  }
  return { final };
}

const metricas = (final) =>
  final
    ? {
        ...(final.session_id ? { sesion: final.session_id } : {}),
        costo: typeof final.total_cost_usd === "number" ? final.total_cost_usd : null,
        turnos: final.num_turns ?? null,
      }
    : {};

let salida = 0;
try {
  const { final, detenida: parada } = await principal();
  const fin = new Date().toISOString();
  if (parada) {
    actualizarCandidato(
      id,
      { etapa: "preparando", rutina: { estado: "detenida", pid: null, fin, ...metricas(final) } },
      "Rutina detenida a mano."
    );
  } else {
    apunta("✓ Terminada. A revisión.");
    actualizarCandidato(
      id,
      {
        etapa: "revision",
        rutina: { estado: "terminada", pid: null, fin, resumen: String(final.result || "").trim(), ...metricas(final) },
      },
      "La rutina terminó. A revisión."
    );
  }
} catch (error) {
  salida = 1;
  apunta(`✗ ${error.message}`);
  try {
    actualizarCandidato(
      id,
      {
        etapa: "por-hacer",
        rutina: {
          estado: detenida ? "detenida" : "fallida",
          pid: null,
          fin: new Date().toISOString(),
          error: error.message,
          ...metricas(error.final),
        },
      },
      `La rutina falló: ${corta(error.message, 160)}`
    );
  } catch {}
} finally {
  // Por si Claude dejó levantado el servidor con el que probó el cliente.
  spawnSync("fuser", ["-k", `${puertoDePrueba(id)}/tcp`], { stdio: "ignore" });
  quitarCerrojo(id);
  try {
    despachar();
  } catch {}
}
process.exit(salida);

// La rutina: qué se le pide a Claude, con qué permisos, y la cola que decide a
// quién le toca. El proceso en sí vive en scripts/rutina.mjs.
//
// Corre UNA a la vez. Dos sesiones de Claude instalando dependencias y
// compilando en el mismo monorepo se pisan el pnpm-lock.yaml y la caché de
// Next, y de propina rompen la regla de la casa: un cliente por sesión.
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { actualizarCandidato, leerCandidato, listarCandidatos, listarMaterial } from "./almacen.mjs";
import {
  archivoCerrojo,
  carpetaClientes,
  carpetaControl,
  carpetaDatos,
  carpetaMaterial,
  raiz,
} from "./rutas.mjs";

// --- Configuración --------------------------------------------------------------

const MODOS = new Set(["acceptEdits", "bypassPermissions", "auto", "dontAsk"]);

export function configuracion() {
  const modo = process.env.CONTROL_CLAUDE_MODO;
  return {
    bin: process.env.CONTROL_CLAUDE_BIN || "claude",
    modo: MODOS.has(modo) ? modo : "acceptEdits",
    modelo: process.env.CONTROL_CLAUDE_MODELO || "",
  };
}

// Lo que la rutina puede ejecutar sin que nadie le diga que sí. En modo
// headless no hay quien conteste a un permiso: lo que no esté aquí, se deniega
// y Claude tiene que buscarse otra manera.
export const PERMITIDAS = [
  "Read",
  "Edit",
  "Write",
  "Glob",
  "Grep",
  "Skill",
  "TodoWrite",
  "WebFetch",
  "WebSearch",
  "Bash(pnpm *)",
  "Bash(npx next *)",
  "Bash(npx eslint *)",
  "Bash(npx playwright *)",
  "Bash(node *)",
  "Bash(python3 *)",
  "Bash(curl *)",
  "Bash(ls *)",
  "Bash(cat *)",
  "Bash(grep *)",
  "Bash(find *)",
  "Bash(wc *)",
  "Bash(file *)",
  "Bash(pdftotext *)",
  "Bash(pdftoppm *)",
  "Bash(mkdir *)",
  "Bash(cp *)",
  "Bash(mv *)",
  "Bash(fuser *)",
  "Bash(git status *)",
  "Bash(git diff *)",
];

// Y lo que no puede hacer ni en el modo sin preguntas. Todo lo que sale del
// disco —subir, desplegar, tocar una base de datos— se decide a mano, después
// de revisar. `pkill` está porque el centro de control también es un
// `next dev`: un `pkill -f "next dev"` lo tumbaría a él.
export const PROHIBIDAS = [
  "Bash(git commit *)",
  "Bash(git push *)",
  "Bash(git reset *)",
  "Bash(git checkout *)",
  "Bash(pkill *)",
  "Bash(killall *)",
  "Bash(vercel *)",
  "Bash(npx vercel *)",
  "Bash(supabase *)",
  "Bash(npx supabase *)",
  "mcp__vercel",
  "mcp__supabase",
];

// Cada rutina prueba su cliente en un puerto propio, lejos del 3000 (donde
// sueles tener un cliente abierto) y del 4000 (el centro de control).
export const puertoDePrueba = (id) => 4300 + (parseInt(id.slice(0, 4), 16) % 500);

// --- El encargo -----------------------------------------------------------------

const linea = (etiqueta, valor) => `- **${etiqueta}:** ${valor ? valor : "_sin dato_"}`;

const pesoLegible = (bytes) =>
  bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;

export function redactarEncargo(candidato) {
  const material = listarMaterial(candidato.id);
  return [
    `# Encargo — ${candidato.nombre}`,
    "",
    "> Lo escribe el centro de control (`apps/control`) cada vez que lanza la rutina.",
    "> Si hay que corregirlo, se corrige en el tablero: lo que se edite aquí se pierde.",
    "",
    "## El negocio",
    "",
    linea("Nombre", candidato.nombre),
    linea("Rubro", candidato.rubro),
    linea("Ciudad", candidato.ciudad),
    linea("Instagram", candidato.instagram),
    linea("WhatsApp", candidato.whatsapp),
    linea("Web", candidato.web),
    "",
    "## Notas de Alessandro",
    "",
    candidato.notas.trim() || "_Sin notas._",
    "",
    "## Qué se pide",
    "",
    candidato.encargo.trim() ||
      "_Sin instrucciones particulares: adaptar la plantilla al negocio y dejarla como demo de venta._",
    "",
    "## Material en esta carpeta",
    "",
    material.length
      ? material.map((m) => `- \`${m.nombre}\` (${pesoLegible(m.peso)})`).join("\n")
      : "_No se cargó material. Todo lo que no esté en este encargo va vacío o marcado como muestra._",
    "",
    "## De dónde sale la carpeta",
    "",
    `Copia literal de \`${candidato.plantilla}\` hecha el ${String(candidato.copiada || "").slice(0, 10)}.`,
    "Todo lo que todavía nombre a ese cliente es resto de la copia.",
    "",
  ].join("\n");
}

// Deja el encargo y el material dentro del cliente, en docs/fuentes, que es
// donde el resto del monorepo ya guarda el PDF o las capturas de cada negocio.
export function sembrarFuentes(candidato) {
  const fuentes = path.join(carpetaClientes(), candidato.carpeta, "docs", "fuentes");
  fs.mkdirSync(fuentes, { recursive: true });
  for (const m of listarMaterial(candidato.id)) {
    fs.copyFileSync(path.join(carpetaMaterial(candidato.id), m.nombre), path.join(fuentes, m.nombre));
  }
  fs.writeFileSync(path.join(fuentes, "encargo.md"), redactarEncargo(candidato));
  return fuentes;
}

export function redactarPrompt(candidato) {
  const cliente = `apps/clients/${candidato.carpeta}`;
  const origen = candidato.plantilla;
  const puerto = puertoDePrueba(candidato.id);
  return `Usa la skill \`demo-de-venta\` (cárgala con la herramienta Skill antes de tocar nada) para convertir \`${cliente}\` en la demo de venta de «${candidato.nombre}».

## De dónde partes

\`${cliente}\` es una copia literal de \`${origen}\`, hecha hace un momento desde el centro de control del monorepo. Compila, pero sigue siendo el otro negocio: su nombre, su paleta, su logotipo, sus textos, su catálogo y su SEO. Tu trabajo es que deje de serlo.

El material del negocio nuevo está en \`${cliente}/docs/fuentes/\`. Empieza por \`encargo.md\` y después abre TODOS los archivos de esa carpeta, uno por uno: los PDF y las imágenes también se leen con Read. Lo que dice el encargo manda sobre cualquier suposición tuya.

## Qué hay que hacer

1. Leer el encargo y el material completo.
2. Leer \`${cliente}/README.md\` y \`config.js\` para entender qué hace la plantilla antes de cambiarla.
3. Reidentificar el cliente entero: \`config.js\`, la descripción de \`package.json\`, el tema y las tipografías de \`app/globals.css\` y \`app/layout.js\`, logotipo y favicon, textos de cada página, SEO, datos de \`data/\`, y el README. La identidad sale del material, no de un gusto: si el negocio tiene gráfica propia, se hereda.
4. Seguir la skill \`demo-de-venta\` de principio a fin: el contenido transcrito a mano, los huecos de foto dibujados, lo inventado marcado con sus banderas, la puerta, los cortes en servidor, la venta, la firma y la sección del README. El precio es el del monorepo: $449, con $740 tachado.
5. Comprobar como manda la skill: \`next build\`, \`next lint\` y las pruebas con curl contra un servidor levantado en el puerto **${puerto}**.
6. Buscar restos del origen con grep (su nombre, su Instagram, su teléfono, su dominio, su ciudad) y no terminar mientras quede alguno fuera de \`docs/\`.

## Límites

- Trabaja SOLO dentro de \`${cliente}\`. Ni otros clientes, ni \`packages/\`, ni \`apps/control\`, ni la skill.
- Nada sale del disco: sin commits, sin push, sin desplegar, sin crear proyectos en Vercel ni en Supabase.
- \`.env.local\` vino copiado del origen. Pon una \`DEMO_PASSWORD\` nueva y propia de este negocio, ajusta \`SITE_URL\`, y VACÍA cualquier credencial heredada (Supabase, Resend, Stripe, OpenAI): dos clientes no comparten base de datos. Si la app no arranca sin ellas, apúntalo como pendiente en vez de reutilizarlas.
- El centro de control corre en el puerto 4000 y también es un \`next dev\`. No uses \`pkill\`: levanta tu servidor en el ${puerto} y, al acabar, ciérralo con \`fuser -k ${puerto}/tcp\`.
- No uses \`tools/instagram\`.
- Nadie va a contestar preguntas: esta sesión corre sola. Si falta un dato, va vacío o marcado como muestra, y se apunta. No inventes teléfonos, direcciones, precios ni años.

## Al terminar

Escribe \`${cliente}/docs/PENDIENTES.md\` con cuatro listas cortas: qué quedó hecho, qué falta que dé el negocio, qué es de muestra y con qué bandera está marcado, y qué decidiste tú donde el material no decía nada. La contraseña de la demo NO va ahí: se queda en \`.env.local\`.

Cierra con un resumen de cinco líneas como mucho: es lo que se verá en la tarjeta del tablero.`;
}

export function argumentosClaude(candidato) {
  const { modo, modelo } = configuracion();
  // El prompt no va aquí sino por la entrada estándar: --allowedTools acepta
  // una lista abierta y se tragaría cualquier argumento suelto que viniera
  // detrás.
  const args = [
    "--print",
    "--output-format",
    "stream-json",
    "--verbose",
    "--permission-mode",
    modo,
    "--name",
    `control · ${candidato.nombre}`.slice(0, 80),
  ];
  if (modelo) args.push("--model", modelo);
  args.push("--allowedTools", ...PERMITIDAS);
  args.push("--disallowedTools", ...PROHIBIDAS);
  return args;
}

// --- El cerrojo y la cola -------------------------------------------------------

function procesoVivo(pid) {
  if (!pid) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return error.code === "EPERM";
  }
}

export function leerCerrojo() {
  try {
    return JSON.parse(fs.readFileSync(archivoCerrojo(), "utf8"));
  } catch {
    return null;
  }
}

export function ponerCerrojo(id, pid) {
  fs.mkdirSync(carpetaDatos(), { recursive: true });
  fs.writeFileSync(archivoCerrojo(), JSON.stringify({ id, pid, desde: new Date().toISOString() }));
}

export function quitarCerrojo(id) {
  const cerrojo = leerCerrojo();
  if (!cerrojo || (id && cerrojo.id !== id)) return;
  fs.rmSync(archivoCerrojo(), { force: true });
}

// Devuelve la rutina en marcha, o null. Si el cerrojo apunta a un proceso que
// ya no existe —se apagó el equipo, se mató a mano—, recoge: quita el cerrojo
// y deja la tarjeta como fallida en vez de «corriendo» para siempre.
export function rutinaEnMarcha() {
  const cerrojo = leerCerrojo();
  if (!cerrojo) return null;
  if (procesoVivo(cerrojo.pid)) return cerrojo;

  fs.rmSync(archivoCerrojo(), { force: true });
  const candidato = leerCandidato(cerrojo.id);
  if (candidato && candidato.rutina.estado === "corriendo") {
    actualizarCandidato(
      cerrojo.id,
      {
        etapa: "por-hacer",
        rutina: {
          estado: "fallida",
          pid: null,
          fin: new Date().toISOString(),
          error: "La rutina se cortó sin avisar: el proceso desapareció.",
        },
      },
      "La rutina se cortó sin avisar."
    );
  }
  return null;
}

// Lanza la siguiente de la cola si no hay ninguna en marcha. Se puede llamar
// las veces que haga falta: si no toca, no hace nada.
export function despachar() {
  if (rutinaEnMarcha()) return null;

  const siguiente = listarCandidatos()
    .filter((c) => c.rutina.estado === "en-cola" && c.carpeta)
    .sort((a, b) => String(a.rutina.encolada).localeCompare(String(b.rutina.encolada)))[0];
  if (!siguiente) return null;

  // Suelto del servidor de Next (detached + unref): si Next se reinicia por un
  // cambio de código o se cierra la terminal, la rutina sigue hasta acabar.
  const hijo = spawn(process.execPath, [path.join(carpetaControl(), "scripts", "rutina.mjs"), siguiente.id], {
    cwd: raiz(),
    detached: true,
    stdio: "ignore",
    env: { ...process.env, CONTROL_RAIZ: raiz() },
  });
  hijo.unref();
  ponerCerrojo(siguiente.id, hijo.pid);
  return siguiente.id;
}

export function encolar(id) {
  const candidato = leerCandidato(id);
  if (!candidato) throw new Error("Ese candidato ya no existe.");
  if (!candidato.carpeta || !fs.existsSync(path.join(carpetaClientes(), candidato.carpeta))) {
    throw new Error("Antes de pasarlo a «Por hacer» hay que copiarle una plantilla.");
  }
  if (candidato.rutina.estado === "corriendo") {
    throw new Error("La rutina de este candidato ya está corriendo.");
  }
  actualizarCandidato(
    id,
    {
      etapa: "por-hacer",
      rutina: {
        estado: "en-cola",
        encolada: new Date().toISOString(),
        pid: null,
        inicio: null,
        fin: null,
        error: "",
        resumen: "",
      },
    },
    "A la cola de la rutina."
  );
  return despachar();
}

export function detener(id) {
  const candidato = leerCandidato(id);
  if (!candidato) throw new Error("Ese candidato ya no existe.");

  const cerrojo = rutinaEnMarcha();
  if (cerrojo && cerrojo.id === id) {
    // El script recoge la señal, para a Claude y deja la tarjeta como detenida.
    process.kill(cerrojo.pid, "SIGTERM");
    return "detenida";
  }
  if (candidato.rutina.estado === "en-cola") {
    actualizarCandidato(id, { etapa: "preparando", rutina: { estado: "inactiva", encolada: null } }, "Sacado de la cola.");
    return "sacada";
  }
  return "nada";
}

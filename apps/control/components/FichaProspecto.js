"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Copiable from "@/components/Copiable";
import {
  borrarProspectoAccion,
  cambiarEstadoAccion,
  guardarProspectoAccion,
  marcarContactadoAccion,
} from "@/app/acciones-prospectos";
import { CANALES, ESTADOS, TONOS_CONTACTO } from "@/libs/contacto";
import { fechaCorta, peso } from "@/libs/formato";

const TEXTOS = [
  "nombre", "ciudad", "instagram", "whatsapp", "persona", "enlace", "clave",
  "respuesta", "proximoPaso", "seguimientoEl", "notas", "canal",
];

const soloTextos = (p) => Object.fromEntries(TEXTOS.map((campo) => [campo, p[campo] || ""]));
const digitos = (numero) => String(numero || "").replace(/\D/g, "");
const usuario = (ig) => String(ig || "").replace(/^@/, "").trim();

export default function FichaProspecto({ prospecto, videos, mensajeCompuesto, mensajeDePlantilla, claveEnDisco }) {
  const router = useRouter();
  const [datos, setDatos] = useState(() => soloTextos(prospecto));
  const [guardado, setGuardado] = useState(() => soloTextos(prospecto));
  const [mensaje, setMensaje] = useState(mensajeCompuesto);
  const [mensajeGuardado, setMensajeGuardado] = useState(mensajeCompuesto);
  const [trabajando, empezar] = useTransition();

  const sucio = TEXTOS.some((campo) => datos[campo] !== guardado[campo]) || mensaje !== mensajeGuardado;
  const propio = mensaje.trim() !== mensajeDePlantilla.trim();
  const numero = digitos(datos.whatsapp);
  const cuenta = usuario(datos.instagram);

  const campo = (nombre) => ({
    value: datos[nombre],
    onChange: (e) => setDatos((d) => ({ ...d, [nombre]: e.target.value })),
  });

  async function guardar() {
    if (!sucio) return true;
    // Si el mensaje es el de la plantilla, se guarda vacío: así sigue
    // cambiando cuando cambie la plantilla. Si se retocó, se queda el suyo.
    const enviado = { ...datos, mensaje: propio ? mensaje : "" };
    const r = await guardarProspectoAccion(prospecto.id, enviado);
    if (!r.ok) {
      toast.error(r.error);
      return false;
    }
    setGuardado({ ...datos });
    setMensajeGuardado(mensaje);
    return true;
  }

  function cambiarEstado(estado) {
    empezar(async () => {
      if (!(await guardar())) return;
      const r = await cambiarEstadoAccion(prospecto.id, estado);
      if (!r.ok) toast.error(r.error);
    });
  }

  async function copiarMensaje() {
    try {
      await navigator.clipboard.writeText(mensaje);
      toast.success("Mensaje copiado.");
    } catch {
      toast.error("No pude copiar. Selecciónalo y cópialo a mano.");
    }
  }

  // Abre WhatsApp con el mensaje ya escrito. El video no puede ir por aquí:
  // se adjunta a mano (por eso está la descarga al lado).
  function abrirWhatsApp() {
    if (!numero) return toast.error("Este prospecto no tiene número de WhatsApp.");
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`, "_blank", "noopener");
  }

  function abrirInstagram() {
    if (!cuenta) return toast.error("Este prospecto no tiene Instagram.");
    window.open(`https://ig.me/m/${cuenta}`, "_blank", "noopener");
  }

  function marcarEnviado() {
    empezar(async () => {
      if (!(await guardar())) return;
      const r = await marcarContactadoAccion(prospecto.id, datos.canal || "whatsapp");
      if (!r.ok) toast.error(r.error);
      else toast.success("Apuntado como enviado.");
    });
  }

  function borrar() {
    if (!window.confirm(`¿Borro la ficha de «${prospecto.nombre}»?\n\nNi la carpeta del cliente ni el video se tocan.`)) return;
    empezar(async () => {
      const r = await borrarProspectoAccion(prospecto.id);
      if (!r.ok) toast.error(r.error);
      else router.push("/prospectos");
    });
  }

  const claveDesactualizada = claveEnDisco.clave && claveEnDisco.clave !== guardado.clave;

  return (
    <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 sm:px-6">
      <Link href="/prospectos" className="text-xs text-base-content/50 hover:text-base-content">
        ← Prospectos
      </Link>

      <header className="mb-6 mt-3">
        <h1 className="text-2xl font-semibold tracking-tight">{guardado.nombre}</h1>
        <p className="mt-1 text-sm text-base-content/50">
          {[guardado.ciudad, cuenta && `@${cuenta}`, `apps/clients/${prospecto.carpeta}`].filter(Boolean).join(" · ")}
        </p>

        <ol className="mt-5 flex flex-wrap gap-1.5">
          {ESTADOS.map((estado, i) => {
            const actual = prospecto.estado === estado.id;
            const tono = TONOS_CONTACTO[estado.tono];
            return (
              <li key={estado.id}>
                <button
                  type="button"
                  disabled={actual || trabajando}
                  onClick={() => cambiarEstado(estado.id)}
                  title={estado.ayuda}
                  className={`flex items-center gap-2 rounded-field border px-2.5 py-1.5 text-xs transition-colors ${
                    actual
                      ? `${tono.borde} bg-base-200 ${tono.texto}`
                      : "border-base-300/70 text-base-content/55 enabled:hover:border-base-content/30 enabled:hover:text-base-content disabled:opacity-60"
                  }`}
                >
                  <span className="font-mono text-[0.625rem] opacity-60">{String(i + 1).padStart(2, "0")}</span>
                  {actual && <span className={`size-1.5 rounded-full ${tono.punto}`} />}
                  {estado.nombre}
                </button>
              </li>
            );
          })}
        </ol>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="space-y-5">
          <Seccion numero="01" titulo="A quién">
            <div className="grid gap-3 sm:grid-cols-2">
              <Campo etiqueta="Negocio">
                <input {...campo("nombre")} className="input input-sm w-full" />
              </Campo>
              <Campo etiqueta="Persona (con quién hablas)">
                <input {...campo("persona")} placeholder="Nombre del dueño o de quien contesta" className="input input-sm w-full" />
              </Campo>
              <Campo etiqueta="WhatsApp">
                <input {...campo("whatsapp")} placeholder="584141234567" className="input input-sm w-full font-mono" />
              </Campo>
              <Campo etiqueta="Instagram">
                <input {...campo("instagram")} placeholder="cuenta" className="input input-sm w-full" />
              </Campo>
              <Campo etiqueta="Ciudad">
                <input {...campo("ciudad")} className="input input-sm w-full" />
              </Campo>
              <Campo etiqueta="Por dónde le escribes">
                <select {...campo("canal")} className="select select-sm w-full">
                  {CANALES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              </Campo>
            </div>
          </Seccion>

          <Seccion numero="02" titulo="Lo que se manda">
            <div className="grid gap-3 sm:grid-cols-2">
              <Campo etiqueta="Enlace de la demo">
                <input {...campo("enlace")} placeholder="https://….vercel.app" className="input input-sm w-full font-mono" />
              </Campo>
              <Campo etiqueta="Contraseña de la demo">
                <input {...campo("clave")} className="input input-sm w-full font-mono" />
              </Campo>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-base-content/50">
              {claveEnDisco.origen === "env"
                ? "La contraseña se leyó del .env.local del cliente, que es la que se manda a Vercel."
                : claveEnDisco.origen === "reserva"
                  ? "La contraseña es la de reserva escrita en libs/acceso.js. Si al publicar se puso una DEMO_PASSWORD distinta en Vercel, es esa la que abre: corrígela aquí."
                  : "No encontré la contraseña en la carpeta del cliente."}
              {claveDesactualizada && (
                <span className="text-warning"> En el disco ahora hay otra: «{claveEnDisco.clave}».</span>
              )}
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {videos.map((v) => (
                <div key={v.formato} className="rounded-box border border-base-300 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs">
                      <span className="rotulo text-[0.625rem] text-base-content/55">Video {v.formato}</span>
                      {v.existe && (
                        <span className="ml-2 font-mono text-[0.6875rem] text-base-content/45" suppressHydrationWarning>
                          {peso(v.peso)} · {fechaCorta(v.fecha)}
                        </span>
                      )}
                    </p>
                    {v.existe && (
                      <a
                        href={`/api/prospectos/${prospecto.id}/video?formato=${v.formato}&bajar=1`}
                        className="btn btn-xs btn-ghost"
                      >
                        Descargar
                      </a>
                    )}
                  </div>
                  {v.existe ? (
                    <video
                      src={`/api/prospectos/${prospecto.id}/video?formato=${v.formato}`}
                      controls
                      preload="metadata"
                      className={`mt-2 w-full rounded-field bg-black ${v.formato === "vertical" ? "max-h-72" : ""}`}
                    />
                  ) : (
                    <div className="mt-2 text-xs text-base-content/50">
                      <p>Sin renderizar. Desde <code className="font-mono">apps/video</code>:</p>
                      <Copiable texto={`scripts/render-concesionarios.sh ${v.formato} ${prospecto.id}`} className="mt-1.5 max-w-full" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-base-content/50">
              WhatsApp no deja adjuntar el video desde un enlace: descárgalo y arrástralo al chat después de pegar el mensaje.
            </p>
          </Seccion>

          <Seccion numero="03" titulo="El mensaje" acento>
            <textarea
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              rows={11}
              className="textarea textarea-sm w-full leading-relaxed"
            />
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-base-content/50">
              {propio ? (
                <>
                  <span>Este prospecto tiene su propio mensaje.</span>
                  <button type="button" onClick={() => setMensaje(mensajeDePlantilla)} className="link link-hover">
                    Volver a la plantilla
                  </button>
                </>
              ) : (
                <span>Es la plantilla común rellenada con sus datos. Si lo retocas, se guarda solo para él.</span>
              )}
              {/\[(nombre|ciudad|enlace|clave|instagram)\]/.test(mensaje) && (
                <span className="text-warning">Hay datos que faltan, entre corchetes.</span>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={copiarMensaje} className="btn btn-sm">
                Copiar mensaje
              </button>
              <button type="button" onClick={abrirWhatsApp} disabled={!numero} className="btn btn-sm btn-primary" title={numero ? `wa.me/${numero}` : "Sin número"}>
                Abrir WhatsApp con el mensaje
              </button>
              <button type="button" onClick={abrirInstagram} disabled={!cuenta} className="btn btn-sm">
                Abrir Instagram
              </button>
              <button type="button" onClick={marcarEnviado} disabled={trabajando} className="btn btn-sm btn-ghost ml-auto">
                Ya lo mandé
              </button>
            </div>
          </Seccion>

          <Seccion numero="04" titulo="Seguimiento">
            <Campo etiqueta="Qué contestó">
              <textarea {...campo("respuesta")} rows={3} placeholder="Tal cual lo dijo, con fecha si hace falta." className="textarea textarea-sm w-full leading-relaxed" />
            </Campo>
            <div className="mt-3 grid gap-3 sm:grid-cols-[minmax(0,1fr)_11rem]">
              <Campo etiqueta="Siguiente paso">
                <input {...campo("proximoPaso")} placeholder="Llamar el lunes, mandar precio con dominio…" className="input input-sm w-full" />
              </Campo>
              <Campo etiqueta="Para cuándo">
                <input {...campo("seguimientoEl")} type="date" className="input input-sm w-full font-mono" />
              </Campo>
            </div>
            <Campo etiqueta="Notas" className="mt-3">
              <textarea {...campo("notas")} rows={4} placeholder="Quién es, qué le importa, qué no le gustó, cuánto está dispuesto a pagar…" className="textarea textarea-sm w-full leading-relaxed" />
            </Campo>
          </Seccion>
        </div>

        <aside className="space-y-5">
          <section className="rounded-box border border-base-300 bg-base-200/50 p-4">
            <h2 className="rotulo mb-3 text-[0.625rem] text-base-content/55">Fechas</h2>
            <dl className="space-y-2 text-xs">
              <div>
                <dt className="text-base-content/45">Primer contacto</dt>
                <dd suppressHydrationWarning>{prospecto.contactadoEl ? fechaCorta(prospecto.contactadoEl) : "Todavía no"}</dd>
              </div>
              <div>
                <dt className="text-base-content/45">Último mensaje</dt>
                <dd suppressHydrationWarning>{prospecto.ultimoContacto ? fechaCorta(prospecto.ultimoContacto) : "—"}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-box border border-base-300 bg-base-200/50 p-4">
            <h2 className="rotulo mb-3 text-[0.625rem] text-base-content/55">Historial</h2>
            <ol className="space-y-3">
              {[...prospecto.historial].reverse().map((apunte, i) => (
                <li key={i} className="border-l border-base-300 pl-3 text-xs leading-snug">
                  <p className="text-base-content/80">{apunte.texto}</p>
                  <p className="mt-0.5 text-base-content/45" suppressHydrationWarning>
                    {fechaCorta(apunte.fecha)}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          <section className="rounded-box border border-base-300 p-4">
            <p className="font-mono text-[0.6875rem] text-base-content/45">id {prospecto.id}</p>
            <button type="button" disabled={trabajando} onClick={borrar} className="btn btn-ghost btn-xs mt-2 -ml-2 text-base-content/50 hover:text-error">
              Borrar la ficha
            </button>
          </section>
        </aside>
      </div>

      {sucio && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-base-300 bg-base-200/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
            <p className="text-sm text-base-content/60">Hay cambios sin guardar.</p>
            <button
              type="button"
              onClick={() => {
                setDatos(guardado);
                setMensaje(mensajeGuardado);
              }}
              disabled={trabajando}
              className="btn btn-sm btn-ghost ml-auto"
            >
              Descartar
            </button>
            <button
              type="button"
              disabled={trabajando}
              onClick={() =>
                empezar(async () => {
                  if (await guardar()) {
                    toast.success("Guardado.");
                    router.refresh();
                  }
                })
              }
              className="btn btn-sm btn-primary"
            >
              Guardar
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function Seccion({ numero, titulo, acento = false, children }) {
  return (
    <section className={`rounded-box border bg-base-200/50 ${acento ? "border-accent/30" : "border-base-300"}`}>
      <header className="flex items-baseline gap-3 border-b border-base-300/70 px-4 py-3 sm:px-5">
        <span className={`font-mono text-xs ${acento ? "text-accent" : "text-base-content/45"}`}>{numero}</span>
        <h2 className="rotulo text-xs">{titulo}</h2>
      </header>
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}

function Campo({ etiqueta, className = "", children }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs text-base-content/55">{etiqueta}</span>
      {children}
    </label>
  );
}

"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import SeccionPlantilla from "@/components/SeccionPlantilla";
import SeccionMaterial from "@/components/SeccionMaterial";
import SeccionRutina from "@/components/SeccionRutina";
import { borrarCandidatoAccion, guardarDatosAccion, moverCandidatoAccion } from "@/app/acciones";
import { ETAPAS, TONOS } from "@/libs/etapas";
import { fechaCorta } from "@/libs/formato";

const TEXTOS = ["nombre", "instagram", "ciudad", "rubro", "whatsapp", "web", "notas", "encargo", "enlace"];

const soloTextos = (c) => Object.fromEntries(TEXTOS.map((campo) => [campo, c[campo] || ""]));

export default function FichaCandidato({ candidato, material, plantillas, cliente, carpetaPerdida, modo }) {
  const router = useRouter();
  const [datos, setDatos] = useState(() => soloTextos(candidato));
  const [guardado, setGuardado] = useState(() => soloTextos(candidato));
  const [guardando, empezar] = useTransition();

  const sucio = TEXTOS.some((campo) => datos[campo] !== guardado[campo]);
  const corriendo = candidato.rutina.estado === "corriendo";

  const campo = (nombre) => ({
    value: datos[nombre],
    onChange: (e) => setDatos((d) => ({ ...d, [nombre]: e.target.value })),
  });

  async function guardar() {
    if (!sucio) return true;
    const enviado = { ...datos };
    const r = await guardarDatosAccion(candidato.id, enviado);
    if (!r.ok) {
      toast.error(r.error);
      return false;
    }
    setGuardado(enviado);
    return true;
  }

  function mover(etapa) {
    const destino = ETAPAS.find((e) => e.id === etapa);
    if (destino.dispara) {
      const seguro = window.confirm(
        `Esto lanza la rutina de Claude sobre apps/clients/${candidato.carpeta || "…"} con la skill demo-de-venta.\n\n¿La lanzo?`
      );
      if (!seguro) return;
    }
    empezar(async () => {
      if (destino.dispara && !(await guardar())) return;
      const r = await moverCandidatoAccion(candidato.id, etapa);
      if (!r.ok) toast.error(r.error);
    });
  }

  function borrar() {
    const aviso = candidato.carpeta
      ? `¿Borro la tarjeta de «${candidato.nombre}» y su material?\n\napps/clients/${candidato.carpeta} NO se toca.`
      : `¿Borro la tarjeta de «${candidato.nombre}» y su material?`;
    if (!window.confirm(aviso)) return;
    empezar(async () => {
      const r = await borrarCandidatoAccion(candidato.id);
      if (!r.ok) toast.error(r.error);
      else router.push("/");
    });
  }

  return (
    <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 sm:px-6">
      <Link href="/" className="text-xs text-base-content/50 hover:text-base-content">
        ← Tablero
      </Link>

      <header className="mb-6 mt-3">
        <h1 className="text-2xl font-semibold tracking-tight">{guardado.nombre}</h1>
        <p className="mt-1 text-sm text-base-content/50">
          {[guardado.rubro, guardado.ciudad, guardado.instagram].filter(Boolean).join(" · ") || "Sin datos todavía"}
        </p>

        {/* Las columnas del tablero, en fila: dónde está y a dónde puede ir. */}
        <ol className="mt-5 flex flex-wrap gap-1.5">
          {ETAPAS.map((etapa, i) => {
            const actual = candidato.etapa === etapa.id;
            const tono = TONOS[etapa.tono];
            return (
              <li key={etapa.id}>
                <button
                  type="button"
                  disabled={actual || etapa.automatica || corriendo || guardando}
                  onClick={() => mover(etapa.id)}
                  title={etapa.ayuda}
                  className={`flex items-center gap-2 rounded-field border px-2.5 py-1.5 text-xs transition-colors ${
                    actual
                      ? `${tono.borde} bg-base-200 ${tono.texto}`
                      : "border-base-300/70 text-base-content/55 enabled:hover:border-base-content/30 enabled:hover:text-base-content disabled:opacity-60"
                  }`}
                >
                  <span className="font-mono text-[0.625rem] opacity-60">{String(i + 1).padStart(2, "0")}</span>
                  {actual && <span className={`size-1.5 rounded-full ${tono.punto} ${corriendo ? "animate-latido" : ""}`} />}
                  {etapa.nombre}
                </button>
              </li>
            );
          })}
        </ol>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="space-y-5">
          <Seccion numero="01" titulo="El negocio">
            <div className="grid gap-3 sm:grid-cols-2">
              <Campo etiqueta="Nombre">
                <input {...campo("nombre")} className="input input-sm w-full" />
              </Campo>
              <Campo etiqueta="Rubro">
                <input {...campo("rubro")} placeholder="Concesionario, gimnasio, coach…" className="input input-sm w-full" />
              </Campo>
              <Campo etiqueta="Instagram">
                <input {...campo("instagram")} placeholder="@cuenta" className="input input-sm w-full" />
              </Campo>
              <Campo etiqueta="Ciudad">
                <input {...campo("ciudad")} className="input input-sm w-full" />
              </Campo>
              <Campo etiqueta="WhatsApp">
                <input {...campo("whatsapp")} placeholder="+58…" className="input input-sm w-full" />
              </Campo>
              <Campo etiqueta="Web">
                <input {...campo("web")} placeholder="https://" className="input input-sm w-full" />
              </Campo>
            </div>
            <Campo etiqueta="Notas" className="mt-3">
              <textarea
                {...campo("notas")}
                rows={4}
                placeholder="Cómo llegaste a él, con quién hablaste, qué le duele, qué publican y qué no…"
                className="textarea textarea-sm w-full leading-relaxed"
              />
            </Campo>
          </Seccion>

          <Seccion numero="02" titulo="Plantilla">
            <SeccionPlantilla
              candidato={candidato}
              plantillas={plantillas}
              cliente={cliente}
              carpetaPerdida={carpetaPerdida}
            />
          </Seccion>

          <Seccion numero="03" titulo="Material y encargo">
            <SeccionMaterial candidato={candidato} material={material} />
            <Campo etiqueta="Qué le pides a Claude" className="mt-4">
              <textarea
                {...campo("encargo")}
                rows={6}
                placeholder={
                  "Lo que no se deduce del material: qué secciones sobran de la plantilla, qué tono, qué es lo que más vende de este negocio, qué no tocar…"
                }
                className="textarea textarea-sm w-full leading-relaxed"
              />
            </Campo>
          </Seccion>

          <Seccion numero="04" titulo="Rutina" acento>
            <SeccionRutina candidato={candidato} cliente={cliente} modo={modo} antesDeLanzar={guardar} />
          </Seccion>

          <Seccion numero="05" titulo="Publicación">
            <Campo etiqueta="Enlace de la demo">
              <input {...campo("enlace")} placeholder="https://….vercel.app" className="input input-sm w-full font-mono" />
            </Campo>
            <p className="mt-3 text-xs leading-relaxed text-base-content/50">
              Publicar no lo hace la rutina: sale a internet y se decide después de revisar. Desde la terminal, con la skill{" "}
              <code className="font-mono">/publicar-en-vercel</code>. Luego pega aquí el enlace y pasa la tarjeta a «Publicada».
            </p>
          </Seccion>
        </div>

        <aside className="space-y-5">
          <section className="rounded-box border border-base-300 bg-base-200/50 p-4">
            <h2 className="rotulo mb-3 text-[0.625rem] text-base-content/55">Historial</h2>
            <ol className="space-y-3">
              {[...candidato.historial].reverse().map((apunte, i) => (
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
            <p className="font-mono text-[0.6875rem] text-base-content/45">id {candidato.id}</p>
            <button
              type="button"
              disabled={guardando || corriendo}
              onClick={borrar}
              className="btn btn-ghost btn-xs mt-2 -ml-2 text-base-content/50 hover:text-error"
            >
              Borrar la tarjeta
            </button>
          </section>
        </aside>
      </div>

      {/* Guardar solo aparece cuando hay algo que guardar. */}
      {sucio && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-base-300 bg-base-200/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
            <p className="text-sm text-base-content/60">Hay cambios sin guardar.</p>
            <button
              type="button"
              onClick={() => setDatos(guardado)}
              disabled={guardando}
              className="btn btn-sm btn-ghost ml-auto"
            >
              Descartar
            </button>
            <button
              type="button"
              disabled={guardando}
              onClick={() =>
                empezar(async () => {
                  if (await guardar()) toast.success("Guardado.");
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

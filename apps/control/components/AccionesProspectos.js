"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { guardarPlantillaAccion, importarProspectosAccion, marcarContactadoAccion } from "@/app/acciones-prospectos";
import { CAMPOS_MENSAJE } from "@/libs/contacto";

// Trae a la lista lo que tenga video en apps/video y aún no esté aquí. Los
// que ya están no se tocan: su conversación vale más que los datos de origen.
export function BotonImportar({ etiqueta = "Importar desde los videos" }) {
  const router = useRouter();
  const [trabajando, empezar] = useTransition();

  function importar() {
    empezar(async () => {
      const r = await importarProspectosAccion();
      if (!r.ok) return toast.error(r.error);
      if (r.nuevos.length) toast.success(`${r.nuevos.length} nuevo(s): ${r.nuevos.join(", ")}.`);
      else toast(`Nada nuevo: ${r.existentes.length} ya estaban.`);
      router.refresh();
    });
  }

  return (
    <button type="button" onClick={importar} disabled={trabajando} className="btn btn-sm btn-primary">
      {trabajando ? "Importando…" : etiqueta}
    </button>
  );
}

// La plantilla común del mensaje. Se escribe una vez y cada ficha la rellena
// con sus datos; un prospecto puede tener la suya propia desde su ficha.
export function PlantillaMensaje({ plantilla }) {
  const router = useRouter();
  const [texto, setTexto] = useState(plantilla);
  const [guardando, empezar] = useTransition();
  const sucio = texto.trim() !== plantilla.trim();

  function guardar() {
    empezar(async () => {
      const r = await guardarPlantillaAccion(texto);
      if (!r.ok) return toast.error(r.error);
      toast.success("Plantilla guardada.");
      router.refresh();
    });
  }

  return (
    <details className="group rounded-box border border-base-300 bg-base-200/50">
      <summary className="flex cursor-pointer items-baseline gap-3 px-4 py-3 sm:px-5">
        <span className="font-mono text-xs text-base-content/45">—</span>
        <span className="rotulo text-xs">La plantilla del mensaje</span>
        <span className="ml-auto text-xs text-base-content/45 group-open:hidden">Abrir</span>
      </summary>
      <div className="border-t border-base-300/70 p-4 sm:p-5">
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          rows={9}
          className="textarea textarea-sm w-full leading-relaxed"
        />
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-base-content/50">
          {CAMPOS_MENSAJE.map(([campo, que]) => (
            <span key={campo}>
              <code className="font-mono text-base-content/70">{campo}</code> {que}
            </span>
          ))}
        </div>
        <div className="mt-3 flex justify-end gap-2">
          <button type="button" onClick={() => setTexto(plantilla)} disabled={!sucio || guardando} className="btn btn-sm btn-ghost">
            Descartar
          </button>
          <button type="button" onClick={guardar} disabled={!sucio || guardando} className="btn btn-sm btn-primary">
            Guardar plantilla
          </button>
        </div>
      </div>
    </details>
  );
}

// Los tres gestos de escribirle a alguien, en la fila de la lista: copiar el
// mensaje ya rellenado, abrir WhatsApp con él escrito y apuntar que se mandó.
// Así los que quedan por contactar se despachan desde la lista sin abrir cada
// ficha; la ficha queda para cuando ya hay conversación.
export function BotonesMensaje({ id, mensaje, whatsapp, canal }) {
  const router = useRouter();
  const [trabajando, empezar] = useTransition();
  const numero = String(whatsapp || "").replace(/\D/g, "");

  async function copiar() {
    try {
      await navigator.clipboard.writeText(mensaje);
      toast.success("Mensaje copiado.");
    } catch {
      toast.error("No pude copiar. Ábrelo en la ficha y cópialo a mano.");
    }
  }

  function abrirWhatsApp() {
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`, "_blank", "noopener");
  }

  function marcarEnviado() {
    empezar(async () => {
      const r = await marcarContactadoAccion(id, numero ? "whatsapp" : canal || "instagram");
      if (!r.ok) return toast.error(r.error);
      toast.success("Apuntado como enviado.");
      router.refresh();
    });
  }

  return (
    <div className="flex flex-wrap gap-1">
      <button type="button" onClick={copiar} className="btn btn-xs" title="Copia el mensaje con su enlace y su contraseña">
        Copiar mensaje
      </button>
      <button
        type="button"
        onClick={abrirWhatsApp}
        disabled={!numero}
        className="btn btn-xs btn-primary"
        title={numero ? `wa.me/${numero}` : "Sin número de WhatsApp"}
      >
        WhatsApp
      </button>
      <button type="button" onClick={marcarEnviado} disabled={trabajando} className="btn btn-xs btn-ghost" title="Fecha el contacto y pasa la ficha a «Contactado»">
        Ya lo mandé
      </button>
    </div>
  );
}

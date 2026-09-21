"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { crearCandidatoAccion } from "@/app/acciones";

const VACIO = { nombre: "", instagram: "", ciudad: "", rubro: "" };

// Apuntar un candidato tiene que costar diez segundos: nombre y poco más. El
// resto se rellena en su ficha cuando de verdad se vaya a trabajar.
export default function NuevoCandidato() {
  const router = useRouter();
  const [abierto, setAbierto] = useState(false);
  const [datos, setDatos] = useState(VACIO);
  const [guardando, empezar] = useTransition();

  const campo = (nombre) => ({
    value: datos[nombre],
    onChange: (e) => setDatos((d) => ({ ...d, [nombre]: e.target.value })),
  });

  function enviar(e, abrirFicha) {
    e.preventDefault();
    empezar(async () => {
      const respuesta = await crearCandidatoAccion(datos);
      if (!respuesta.ok) {
        toast.error(respuesta.error);
        return;
      }
      setDatos(VACIO);
      setAbierto(false);
      if (abrirFicha) router.push(`/candidatos/${respuesta.id}`);
    });
  }

  if (!abierto) {
    return (
      <button
        type="button"
        onClick={() => setAbierto(true)}
        className="rounded-box border border-dashed border-base-content/20 px-3 py-2.5 text-left text-sm text-base-content/55 transition-colors hover:border-base-content/40 hover:text-base-content"
      >
        + Nuevo candidato
      </button>
    );
  }

  return (
    <form onSubmit={(e) => enviar(e, false)} className="space-y-2 rounded-box border border-base-content/25 bg-base-100 p-2.5">
      <input
        {...campo("nombre")}
        autoFocus
        required
        placeholder="Nombre del negocio"
        className="input input-sm w-full"
        onKeyDown={(e) => e.key === "Escape" && setAbierto(false)}
      />
      <input {...campo("instagram")} placeholder="@instagram" className="input input-sm w-full" />
      <div className="grid grid-cols-2 gap-2">
        <input {...campo("ciudad")} placeholder="Ciudad" className="input input-sm w-full" />
        <input {...campo("rubro")} placeholder="Rubro" className="input input-sm w-full" />
      </div>
      <div className="flex items-center gap-1.5 pt-0.5">
        <button type="submit" disabled={guardando} className="btn btn-sm btn-neutral flex-1">
          Apuntar
        </button>
        <button type="button" disabled={guardando} onClick={(e) => enviar(e, true)} className="btn btn-sm btn-primary flex-1">
          Apuntar y abrir
        </button>
        <button type="button" onClick={() => setAbierto(false)} className="btn btn-sm btn-ghost btn-square" aria-label="Cancelar">
          ✕
        </button>
      </div>
    </form>
  );
}

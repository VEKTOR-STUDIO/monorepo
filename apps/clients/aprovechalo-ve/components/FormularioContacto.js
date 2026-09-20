"use client";

import { useState } from "react";
import toast from "react-hot-toast";

/**
 * El formulario de contacto.
 *
 * En demo el botón se pulsa y la petición sale de verdad: es la ruta del
 * servidor la que responde 403 y explica por qué. Se hace así a propósito —en
 * vez de deshabilitar el botón— porque enseña que el bloqueo es real y no un
 * adorno, y porque el mensaje de vuelta cuenta qué haría el sistema entregado.
 */
export default function FormularioContacto() {
  const [enviando, setEnviando] = useState(false);

  const enviar = async (evento) => {
    evento.preventDefault();
    if (enviando) return;

    const datos = Object.fromEntries(new FormData(evento.currentTarget));
    setEnviando(true);

    try {
      const respuesta = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });

      const cuerpo = await respuesta.json().catch(() => ({}));

      if (!respuesta.ok) {
        toast(cuerpo.error || "No se pudo enviar.", { icon: "🔒", duration: 7000 });
        return;
      }

      toast.success("Mensaje enviado. Te escribimos enseguida.");
      evento.target.reset();
    } catch {
      toast.error("No se pudo enviar. Inténtalo otra vez.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={enviar} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="nombre" className="mb-1.5 block text-sm text-base-content/60">
            Tu nombre
          </label>
          <input id="nombre" name="nombre" required className="entrada" placeholder="Nombre y apellido" />
        </div>

        <div>
          <label htmlFor="telefono" className="mb-1.5 block text-sm text-base-content/60">
            Teléfono
          </label>
          <input
            id="telefono"
            name="telefono"
            required
            inputMode="tel"
            className="entrada"
            placeholder="0412 000 0000"
          />
        </div>
      </div>

      <div>
        <label htmlFor="mensaje" className="mb-1.5 block text-sm text-base-content/60">
          Qué buscas
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          required
          rows={4}
          className="entrada"
          placeholder="Busco una camioneta 4x4 hasta $35.000, con papeles en regla."
        />
      </div>

      <button type="submit" disabled={enviando} className="btn btn-primary w-full sm:w-auto sm:px-10">
        {enviando ? "Enviando…" : "Enviar mensaje"}
      </button>
    </form>
  );
}

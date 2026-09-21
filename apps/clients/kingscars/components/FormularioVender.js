"use client";

import { useState } from "react";
import toast from "react-hot-toast";

/**
 * El formulario de «publica tu vehículo gratis».
 *
 * Es el otro lado del negocio y el que Kings Cars anuncia en su publicación
 * fijada: ellos hacen el avalúo, las fotos, la promoción y el seguimiento, sin
 * cobrar. Lo que hace falta para arrancar eso es lo que se pide aquí y nada
 * más: cómo contactarte y qué carro es. Pedir veinte campos en el primer paso
 * es la forma más segura de que nadie lo rellene.
 *
 * En demo el botón se pulsa y la petición sale de verdad: es la ruta del
 * servidor la que responde 403 y explica por qué. Se hace así a propósito —en
 * vez de deshabilitar el botón— porque enseña que el bloqueo es real y no un
 * adorno, y porque el mensaje de vuelta cuenta qué haría el sistema entregado.
 */
export default function FormularioVender() {
  const [enviando, setEnviando] = useState(false);

  const enviar = async (evento) => {
    evento.preventDefault();
    if (enviando) return;

    const datos = Object.fromEntries(new FormData(evento.currentTarget));
    setEnviando(true);

    try {
      const respuesta = await fetch("/api/vender", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });

      const cuerpo = await respuesta.json().catch(() => ({}));

      if (!respuesta.ok) {
        toast(cuerpo.error || "No se pudo enviar.", { icon: "🔒", duration: 7000 });
        return;
      }

      toast.success("Recibido. Te escribimos con el avalúo.");
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
          <input
            id="nombre"
            name="nombre"
            required
            className="entrada"
            placeholder="Nombre y apellido"
          />
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

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <label htmlFor="vehiculo" className="mb-1.5 block text-sm text-base-content/60">
            Marca y modelo
          </label>
          <input
            id="vehiculo"
            name="vehiculo"
            required
            className="entrada"
            placeholder="Toyota Corolla GLI"
          />
        </div>

        <div>
          <label htmlFor="anio" className="mb-1.5 block text-sm text-base-content/60">
            Año
          </label>
          <input
            id="anio"
            name="anio"
            required
            inputMode="numeric"
            className="entrada"
            placeholder="2006"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="km" className="mb-1.5 block text-sm text-base-content/60">
            Kilometraje
          </label>
          <input
            id="km"
            name="km"
            inputMode="numeric"
            className="entrada"
            placeholder="161.000"
          />
        </div>

        <div>
          <label htmlFor="transmision" className="mb-1.5 block text-sm text-base-content/60">
            Transmisión
          </label>
          <select id="transmision" name="transmision" className="entrada" defaultValue="">
            <option value="">Sin especificar</option>
            <option value="Automática">Automática</option>
            <option value="Sincrónica">Sincrónica</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="notas" className="mb-1.5 block text-sm text-base-content/60">
          Algo que debamos saber{" "}
          <span className="text-base-content/35">(opcional)</span>
        </label>
        <textarea
          id="notas"
          name="notas"
          rows={3}
          className="entrada"
          placeholder="Único dueño, papeles al día, cauchos nuevos. Tengo una idea de precio pero quiero el avalúo."
        />
      </div>

      <button
        type="submit"
        disabled={enviando}
        className="btn btn-rojo w-full sm:w-auto sm:px-10"
      >
        {enviando ? "Enviando…" : "Pedir mi avalúo gratis"}
      </button>
    </form>
  );
}

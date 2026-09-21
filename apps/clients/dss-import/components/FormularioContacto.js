"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import config from "@/config";

/**
 * La solicitud de crédito.
 *
 * No es un "formulario de contacto" genérico: pide exactamente los cuatro datos
 * con los que en la oficina se puede armar un plan sin tener que escribir de
 * vuelta —qué quiere, cuánto puede pagar, cada cuánto, y por dónde llamarle—.
 * Cada campo que falta aquí es un mensaje de ida y vuelta por WhatsApp.
 *
 * Lo que NO se pide, y es deliberado: cédula, dirección, recibos de pago, foto
 * del carnet. Eso son datos sensibles y esto es un formulario público sin
 * cifrado de extremo a extremo ni un sitio donde guardarlos; se piden en la
 * oficina, que es donde se firma. Una web que recoge cédulas de gente que busca
 * crédito es exactamente el sitio que un estafador querría imitar.
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

      toast.success("Solicitud enviada. Te escribimos enseguida.");
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

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="interes" className="mb-1.5 block text-sm text-base-content/60">
            Qué quieres financiar
          </label>
          <select id="interes" name="interes" required className="entrada cursor-pointer">
            <option value="vehiculo">Un vehículo</option>
            <option value="moto">Una moto</option>
            <option value="cualquiera">Lo que entre en mi presupuesto</option>
          </select>
        </div>

        <div>
          <label htmlFor="cuota" className="mb-1.5 block text-sm text-base-content/60">
            Cuánto puedes pagar
          </label>
          <div className="flex gap-2">
            <input
              id="cuota"
              name="cuota"
              required
              inputMode="numeric"
              className="entrada"
              placeholder={`${config.credito.cuotaDesde}`}
              aria-describedby="cuota-ayuda"
            />
            <select
              name="periodo"
              aria-label="Cada cuánto"
              className="entrada max-w-32 cursor-pointer"
            >
              <option value="semanal">por semana</option>
              <option value="mensual">por mes</option>
            </select>
          </div>
          <p id="cuota-ayuda" className="mt-1.5 text-[0.7rem] text-base-content/40">
            En dólares. Con esto te armamos el plan.
          </p>
        </div>
      </div>

      <div>
        <label htmlFor="mensaje" className="mb-1.5 block text-sm text-base-content/60">
          Algo más que debamos saber
          <span className="ml-1.5 text-base-content/35">(opcional)</span>
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          rows={3}
          className="entrada"
          placeholder="Busco un sedán automático, o una moto para trabajar. Puedo dar más inicial."
        />
      </div>

      <button
        type="submit"
        disabled={enviando}
        className="btn btn-primary w-full sm:w-auto sm:px-10"
      >
        {enviando ? "Enviando…" : "Enviar solicitud"}
      </button>

      <p className="text-[0.7rem] leading-relaxed text-base-content/35">
        No pedimos cédula, dirección ni documentos por aquí. Eso se entrega en la oficina,
        que es donde se firma.
      </p>
    </form>
  );
}

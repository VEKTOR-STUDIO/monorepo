"use client";

import { useState } from "react";
import toast from "react-hot-toast";

/**
 * El formulario de contacto.
 *
 * Aquí llegan las DOS conversaciones de esta casa y no son la misma: una es la
 * de quien busca un carro y la otra la de quien quiere dejar el suyo en
 * consignación. Atenderlas con un único cuadro de texto obliga a SUSU a
 * preguntar por WhatsApp lo que el formulario podría haber pedido ya —marca,
 * año, kilometraje—, así que el motivo se elige arriba y los campos del
 * vehículo aparecen solo cuando hacen falta.
 *
 * En demo el botón se pulsa y la petición sale de verdad: es la ruta del
 * servidor la que responde 403 y explica por qué. Se hace así a propósito —en
 * vez de deshabilitar el botón— porque enseña que el bloqueo es real y no un
 * adorno, y porque el mensaje de vuelta cuenta qué haría el sistema entregado.
 *
 * @param {"comprar"|"consignar"} motivoInicial  con qué pestaña abre
 */
export default function FormularioContacto({ motivoInicial = "comprar" }) {
  const [enviando, setEnviando] = useState(false);
  const [motivo, setMotivo] = useState(motivoInicial);

  const consignando = motivo === "consignar";

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
      {/* El motivo, en dos botones grandes en vez de un desplegable: es la
          primera decisión y conviene que se vea de entrada cuál de las dos
          cosas hace esta casa. El valor viaja en un campo oculto para que
          llegue igual al servidor. */}
      <input type="hidden" name="motivo" value={motivo} />

      <div className="grid grid-cols-2 gap-2" role="group" aria-label="Qué necesitas">
        {[
          { valor: "comprar", texto: "Quiero comprar" },
          { valor: "consignar", texto: "Quiero vender el mío" },
        ].map((opcion) => (
          <button
            key={opcion.valor}
            type="button"
            onClick={() => setMotivo(opcion.valor)}
            aria-pressed={motivo === opcion.valor}
            className={`display-recto border px-4 py-3 text-xs transition-colors ${
              motivo === opcion.valor
                ? "border-primary/70 bg-primary/10 text-base-content"
                : "border-base-content/15 text-base-content/50 hover:border-base-content/35"
            }`}
          >
            {opcion.texto}
          </button>
        ))}
      </div>

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

      {/* Solo para quien viene a consignar. Son los tres datos con los que se
          puede dar un precio de salida sin ver el carro; el resto se habla. */}
      {consignando && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="vehiculo" className="mb-1.5 block text-sm text-base-content/60">
              Vehículo
            </label>
            <input
              id="vehiculo"
              name="vehiculo"
              className="entrada"
              placeholder="Toyota Corolla"
            />
          </div>
          <div>
            <label htmlFor="anio" className="mb-1.5 block text-sm text-base-content/60">
              Año
            </label>
            <input id="anio" name="anio" inputMode="numeric" className="entrada" placeholder="2016" />
          </div>
          <div>
            <label htmlFor="km" className="mb-1.5 block text-sm text-base-content/60">
              Kilometraje
            </label>
            <input id="km" name="km" inputMode="numeric" className="entrada" placeholder="102.000" />
          </div>
        </div>
      )}

      <div>
        <label htmlFor="mensaje" className="mb-1.5 block text-sm text-base-content/60">
          {consignando ? "Cuéntanos del vehículo" : "Qué buscas"}
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          required
          rows={4}
          className="entrada"
          placeholder={
            consignando
              ? "Papeles al día, un solo dueño, quiero pedir $16.000 pero escucho ofertas."
              : "Busco una camioneta 4x4 hasta $35.000, con papeles en regla."
          }
        />
      </div>

      <button type="submit" disabled={enviando} className="btn btn-primary w-full sm:w-auto sm:px-10">
        {enviando ? "Enviando…" : consignando ? "Quiero consignarlo" : "Enviar mensaje"}
      </button>
    </form>
  );
}

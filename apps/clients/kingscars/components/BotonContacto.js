"use client";

import toast from "react-hot-toast";
import { mensajePorVehiculo, mensajeParaVender } from "@/libs/demo";
import config from "@/config";

/**
 * "Me interesa esta unidad".
 *
 * Fuera de demo abre la conversación con la unidad ya escrita en el mensaje y
 * con la cita pedida en la misma línea, porque aquí se atiende con cita previa.
 * Es el único paso que de verdad importa en este negocio: el comprador escribe
 * sabiendo qué pregunta y con la hora ya puesta sobre la mesa.
 *
 * POR DÓNDE ESCRIBE depende de lo que haya en el config. Kings Cars no publica
 * ningún número de teléfono —su bio manda a un enlace de agenda—, así que hoy
 * el botón lleva al DM de Instagram, que es el canal por el que los contactan
 * de verdad. El día que den un WhatsApp, se rellena `business.whatsapp` y todos
 * los botones de la web cambian solos.
 *
 * En demo NO abre nada. No es un adorno desactivado: el negocio existe y
 * atiende con cita previa, así que si abriera, cualquiera que esté probando la
 * demo podría apartarles una hora del local para nadie. En su lugar explica qué
 * haría el sistema entregado.
 *
 * El enlace se arma en el cliente y no en el servidor a propósito: así el
 * destino no viaja en el HTML de todas las fichas, donde lo cosecharía
 * cualquier rastreador.
 */
export default function BotonContacto({
  vehiculo,
  vender = false,
  className = "btn btn-primary",
  children,
  demo = false,
}) {
  const texto = children || "Me interesa";
  const mensaje = vender ? mensajeParaVender() : mensajePorVehiculo(vehiculo);
  const numero = config.business.whatsapp?.trim();

  if (demo) {
    return (
      <button
        type="button"
        className={className}
        onClick={() =>
          toast(
            `En la página entregada, esto abre ${
              numero ? `WhatsApp (${config.business.whatsappVisible || numero})` : "tu Instagram"
            } con el mensaje ya escrito: «${mensaje}»`,
            { icon: "🔒", duration: 6000 }
          )
        }
      >
        {texto}
      </button>
    );
  }

  const destino = numero
    ? `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`
    : config.business.instagramUrl;

  return (
    <a href={destino} target="_blank" rel="noopener noreferrer" className={className}>
      {texto}
    </a>
  );
}

"use client";

import toast from "react-hot-toast";
import { mensajePorVehiculo, sedeDe } from "@/libs/demo";
import config from "@/config";

/**
 * "Me interesa esta unidad".
 *
 * Fuera de demo abre WhatsApp con la unidad ya escrita en el mensaje: el
 * comprador escribe sabiendo qué pregunta —ese lote, o ese modelo a pedido— y
 * a Lone Star le llega la conversación con la mitad del trabajo hecho.
 *
 * En demo NO abre nada. No es un adorno desactivado: el número es real y va
 * impreso en su emblema, así que si abriera, cualquiera que esté probando la demo le estaría
 * mandando mensajes falsos al negocio. En su lugar explica qué haría el sistema
 * entregado.
 *
 * El enlace se arma en el cliente y no en el servidor a propósito: así el
 * número no viaja en el HTML de todas las fichas, donde lo cosecharía
 * cualquier rastreador.
 */
export default function BotonContacto({
  vehiculo,
  className = "btn btn-primary",
  children,
  demo = false,
}) {
  const texto = children || "Me interesa";
  const sede = sedeDe(vehiculo);

  if (demo) {
    return (
      <button
        type="button"
        className={className}
        onClick={() =>
          toast(
            `En la página entregada, esto abre WhatsApp con el ${
              sede?.telefono || config.business.whatsappVisible
            } y el mensaje ya escrito: «${mensajePorVehiculo(vehiculo)}»`,
            { icon: "🔒", duration: 6000 }
          )
        }
      >
        {texto}
      </button>
    );
  }

  const numero = sede?.whatsapp || config.business.whatsapp;

  const destino = numero
    ? `https://wa.me/${numero}?text=${encodeURIComponent(mensajePorVehiculo(vehiculo))}`
    : config.business.instagramUrl;

  return (
    <a href={destino} target="_blank" rel="noopener noreferrer" className={className}>
      {texto}
    </a>
  );
}

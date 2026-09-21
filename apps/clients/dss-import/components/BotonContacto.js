"use client";

import toast from "react-hot-toast";
import { mensajePorVehiculo, hayWhatsapp } from "@/libs/demo";
import config from "@/config";

/**
 * "Quiero esta unidad".
 *
 * Fuera de demo abre WhatsApp con la unidad Y SU CUOTA ya escritas en el
 * mensaje. Eso último es lo que de verdad importa en este negocio: quien
 * escribe no pregunta un precio, pregunta si califica para el plan, y que el
 * mensaje llegue con la cuota dentro ahorra la mitad de la conversación a las
 * dos partes.
 *
 * MIENTRAS NO HAYA NÚMERO —hoy no lo hay, ver el PENDIENTE de config.js— cae al
 * DM de Instagram, que sí está publicado. Ahí el mensaje se pierde, porque
 * Instagram no admite texto prerrellenado en un enlace; es una razón más para
 * pedirles el WhatsApp antes de entregar.
 *
 * En demo NO abre nada. No es un adorno desactivado: lo que llega por aquí es
 * una SOLICITUD DE CRÉDITO, así que si abriera de verdad, cualquiera que esté
 * probando la demo le estaría metiendo solicitudes falsas en la bandeja al
 * negocio. En su lugar explica qué haría el sistema entregado.
 *
 * El enlace se arma en el cliente y no en el servidor a propósito: así el
 * número no viaja en el HTML de todas las fichas, donde lo cosecharía cualquier
 * rastreador.
 */
export default function BotonContacto({
  vehiculo,
  className = "btn btn-primary",
  children,
  demo = false,
}) {
  const texto = children || "Me interesa";

  if (demo) {
    return (
      <button
        type="button"
        className={className}
        onClick={() =>
          toast(
            `En la página entregada, esto abre ${
              hayWhatsapp() ? "WhatsApp" : "tu Instagram"
            } con el mensaje ya escrito: «${mensajePorVehiculo(vehiculo)}»`,
            { icon: "🔒", duration: 6000 }
          )
        }
      >
        {texto}
      </button>
    );
  }

  const numero = config.business.whatsapp;

  const destino = numero
    ? `https://wa.me/${numero}?text=${encodeURIComponent(mensajePorVehiculo(vehiculo))}`
    : config.business.instagramUrl;

  return (
    <a href={destino} target="_blank" rel="noopener noreferrer" className={className}>
      {texto}
    </a>
  );
}

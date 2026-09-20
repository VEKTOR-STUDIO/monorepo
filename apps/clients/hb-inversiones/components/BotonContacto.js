"use client";

import toast from "react-hot-toast";
import { mensajePorVehiculo } from "@/libs/demo";
import config from "@/config";

/**
 * "Me interesa este vehículo".
 *
 * Fuera de demo abre WhatsApp con el vehículo ya escrito en el mensaje, que es
 * el único paso que de verdad importa en este negocio: el comprador escribe
 * sabiendo qué está preguntando y el vendedor no pierde el hilo.
 *
 * En demo NO abre nada. No es un adorno desactivado: si abriera, cualquiera
 * que esté probando la demo le estaría mandando mensajes falsos al negocio
 * real. En su lugar explica qué haría el sistema entregado.
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

  if (demo) {
    return (
      <button
        type="button"
        className={className}
        onClick={() =>
          toast(
            `En la página entregada, esto abre WhatsApp con el mensaje ya escrito: «${mensajePorVehiculo(vehiculo)}»`,
            { icon: "🔒", duration: 6000 }
          )
        }
      >
        {texto}
      </button>
    );
  }

  const { whatsapp, instagramUrl } = config.business;

  const destino = whatsapp
    ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(mensajePorVehiculo(vehiculo))}`
    : instagramUrl;

  return (
    <a href={destino} target="_blank" rel="noopener noreferrer" className={className}>
      {texto}
    </a>
  );
}

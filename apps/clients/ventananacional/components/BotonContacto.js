"use client";

import toast from "react-hot-toast";
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
 * El enlace se arma en el navegador y no en el servidor: así el mensaje se
 * compone con el vehículo que se está mirando sin repetir el número en cada
 * enlace del HTML. (Sí aparece una vez por página, en el JSON-LD del negocio,
 * y ahí es deliberado: es el teléfono público del perfil y es lo que hace que
 * Google pueda enseñarlo en la ficha de la concesionaria.)
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
            vehiculo
              ? `En la página entregada, esto abre WhatsApp con el mensaje ya escrito: «Hola, me interesa el ${vehiculo.tituloLargo} ${vehiculo.anio}. ¿Sigue disponible?»`
              : "En la página entregada, esto abre WhatsApp con el mensaje ya escrito.",
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
    ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(
        vehiculo
          ? `Hola, me interesa el ${vehiculo.tituloLargo} ${vehiculo.anio}. ¿Sigue disponible?`
          : "Hola, vi la página y quiero información sobre los vehículos."
      )}`
    : instagramUrl;

  return (
    <a href={destino} target="_blank" rel="noopener noreferrer" className={className}>
      {texto}
    </a>
  );
}

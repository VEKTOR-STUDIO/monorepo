"use client";

import toast from "react-hot-toast";
import { mensajePorVehiculo, mensajeParaVender } from "@/libs/demo";
import config from "@/config";

/**
 * "Me interesa esta unidad".
 *
 * Fuera de demo abre WhatsApp —el de su bio, "Link Directo al WhatsApp 👇"—
 * con la unidad ya escrita en el mensaje y la visita pedida en la misma línea.
 * Es el único paso que de verdad importa en este negocio: el comprador escribe
 * sabiendo qué pregunta, y quien atiende sabe de qué carro le hablan sin tener
 * que pedir una captura.
 *
 * Si algún día se vaciara `business.whatsapp`, el botón cae al DM de
 * Instagram en vez de a un enlace roto.
 *
 * En demo NO abre nada. No es un adorno desactivado: ese WhatsApp es el que
 * atiende a los compradores de verdad de una cuenta de 71,8 mil seguidores, y
 * cualquiera que esté probando la demo le haría llegar preguntas por carros de
 * muestra. En su lugar explica qué haría el sistema entregado.
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

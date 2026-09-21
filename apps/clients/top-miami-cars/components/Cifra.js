"use client";

import { useEffect, useRef } from "react";
import { contexto, contarHasta } from "@/libs/animaciones";
import { enDolares } from "@/libs/formato";

/**
 * Una cifra que sube hasta su valor cuando entra en pantalla.
 *
 * El HTML del servidor ya trae el número final escrito, así que quien no tenga
 * JavaScript, quien pida menos movimiento o quien lo lea con un lector de
 * pantalla ve la cifra correcta desde el primer momento. Lo único que hace
 * GSAP es reescribir ese texto sesenta veces por segundo mientras sube.
 *
 * Por eso tampoco lleva `data-anima`: si la animación no llega a montarse, el
 * número tiene que quedarse a la vista, no invisible.
 */
export default function Cifra({
  valor,
  formato = "numero",
  className = "",
  as: Etiqueta = "span",
}) {
  const nodo = useRef(null);

  useEffect(
    () =>
      contexto((g) => {
        contarHasta(g, nodo.current, valor, {
          formato: FORMATOS[formato] || FORMATOS.numero,
        });
      }, nodo),
    [valor, formato]
  );

  const pintar = FORMATOS[formato] || FORMATOS.numero;

  return (
    <Etiqueta ref={nodo} className={className}>
      {pintar(valor)}
    </Etiqueta>
  );
}

const FORMATOS = {
  numero: (n) => Math.round(n).toLocaleString("es-VE"),
  dolares: (n) => enDolares(Math.round(n)),
  // Redondeado al millar, para los precios "desde": subir de uno en uno hasta
  // 7.500 se ve como una máquina tragamonedas y distrae de lo que dice.
  dolaresRedondos: (n) => enDolares(Math.round(n / 100) * 100),
};

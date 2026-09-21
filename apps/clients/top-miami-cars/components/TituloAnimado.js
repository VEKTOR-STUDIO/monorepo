"use client";

import { useEffect, useRef } from "react";
import { contexto, revelarTexto } from "@/libs/animaciones";

/**
 * Un titular que asoma línea a línea desde detrás de una máscara.
 *
 * Es el movimiento principal de la página, y no es un adorno: en el logotipo
 * de Top Miami Cars el rótulo va montado POR DELANTE del escudo, tapándolo, y
 * esto es lo mismo en movimiento —el texto no aparece, SALE de detrás de algo—.
 *
 * Se usa donde iría el `<h1>`/`<h2>` y se le pasa la etiqueta:
 *
 *   <TituloAnimado as="h2" className="display text-4xl">
 *     Lo último que entró
 *   </TituloAnimado>
 *
 * Dentro no puede haber bloques ni elementos posicionados: SplitText reescribe
 * el contenido en líneas y se llevaría por delante cualquier maquetación. Para
 * resaltar una palabra, un `<span>` en línea sí vale.
 */
export default function TituloAnimado({
  children,
  as: Etiqueta = "h2",
  className = "",
  retraso = 0,
  escalonado = 0.09,
  sesgo = true,
  id,
}) {
  const nodo = useRef(null);

  useEffect(
    () =>
      contexto((g) => revelarTexto(g, nodo.current, { retraso, escalonado, sesgo }), nodo),
    [retraso, escalonado, sesgo]
  );

  return (
    <Etiqueta ref={nodo} id={id} data-anima className={className}>
      {children}
    </Etiqueta>
  );
}

"use client";

import { useState } from "react";
import UploadForm from "./UploadForm";

/**
 * Botón flotante "+" (siempre visible, abajo a la derecha) que abre un
 * modal con el formulario para publicar en la galería. `concepts` son los
 * conceptos ya revelados (si hay alguno, el formulario muestra el
 * desplegable para elegir a cuál pertenece la foto).
 */
export default function UploadModal({ concepts }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Comparte tu fotografía"
        title="Comparte tu fotografía"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-white text-3xl font-light text-black shadow-lg shadow-black/40 transition-transform duration-200 hover:scale-110 focus-visible:scale-110"
      >
        +
      </button>

      {isOpen && (
        <div className="modal modal-open" role="dialog" aria-modal="true">
          <div className="modal-box relative w-full max-w-xl bg-transparent p-0 shadow-none">
            <button
              type="button"
              aria-label="Cerrar"
              onClick={() => setIsOpen(false)}
              className="btn btn-circle btn-ghost btn-sm absolute right-3 top-3 z-10"
            >
              ✕
            </button>
            <UploadForm concepts={concepts} onSuccess={() => setIsOpen(false)} />
          </div>
          <button
            type="button"
            aria-label="Cerrar"
            onClick={() => setIsOpen(false)}
            className="modal-backdrop"
          />
        </div>
      )}
    </>
  );
}

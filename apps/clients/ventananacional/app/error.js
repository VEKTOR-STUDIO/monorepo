"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Sin esto el fallo se traga en silencio y nadie se entera de que pasó.
    console.error("[error]", error);
  }, [error]);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-base-200 px-6 text-center">
      <div className="malla absolute inset-0" aria-hidden="true" />

      <div className="relative">
        <span className="banda mx-auto" aria-hidden="true" />

        <h1 className="display mt-6 text-3xl sm:text-4xl">
          Algo se <span className="text-primary">rompió</span>
        </h1>

        <p className="mx-auto mt-5 max-w-sm text-base-content/60">
          No pudimos cargar esta página. Vuelve a intentarlo; si sigue igual,
          escríbenos y lo resolvemos.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={reset} className="btn btn-primary">
            Reintentar
          </button>
          <Link href="/" className="btn btn-vidrio">
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}

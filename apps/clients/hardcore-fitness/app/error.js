"use client";

import Link from "next/link";
import { useEffect } from "react";
import config from "@/config";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Sin esto el fallo se traga en silencio y nadie se entera de que pasó.
    console.error("[error]", error);
  }, [error]);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div className="humo absolute inset-0" aria-hidden="true" />

      <div className="relative">
        <h1 className="display text-3xl sm:text-4xl">
          ALGO SE <span className="text-primary texto-glow">ROMPIÓ</span>
        </h1>

        <p className="mx-auto mt-5 max-w-sm text-base-content/60">
          No pudimos cargar esta página. Vuelve a intentarlo; si sigue igual, escríbenos y lo
          resolvemos por WhatsApp.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={reset} className="btn btn-primary">
            Reintentar
          </button>
          <Link href="/" className="btn btn-outline">
            Ir al inicio
          </Link>
          <a
            href={`https://wa.me/${config.business.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
          >
            WhatsApp
          </a>
        </div>

        {error?.digest && (
          <p className="cifra mt-8 text-xs text-base-content/30">Ref. {error.digest}</p>
        )}
      </div>
    </main>
  );
}

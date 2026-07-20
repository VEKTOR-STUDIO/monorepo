"use client";

import Link from "next/link";
import { useState } from "react";
import config from "@/config";
import FooterFoot from "@/components/FooterFoot";

export default function Login() {
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  return (
    <main className="min-h-screen relative overflow-hidden" data-theme={config.colors.theme}>
      <div className="relative grid md:grid-cols-2 min-h-screen z-10">
        <div className="relative hidden overflow-hidden border-r border-base-300 bg-base-200 md:block">
          <span
            aria-hidden="true"
            className="display text-stroke pointer-events-none absolute inset-0 flex items-center justify-center select-none text-[9rem] leading-none opacity-60"
          >
            FM
          </span>
          <div className="absolute bottom-10 left-10 max-w-xs">
            <span className="display text-4xl leading-none text-base-content">
              Entrena
              <br />
              <span className="text-primary">sin excusas.</span>
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center p-8 md:p-12">
          <div className="w-full max-w-md space-y-6">
            <div className="border border-base-300 bg-base-100 p-6 md:p-8">
              <div className="flex items-center justify-between mb-4">
                <Link href="/" className="btn btn-ghost btn-sm rounded-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Volver
                </Link>
                <span className="text-xs text-base-content/60">{config.appName}</span>
              </div>

              <h1 className="display mb-2 text-4xl md:text-5xl">Acceso atletas</h1>
              <p className="text-base-content/70 text-sm mb-6">
                Entra a tu cuenta para ver sesiones, material y reservas. Configura Google OAuth en Supabase y despliega
                las variables de entorno.
              </p>

              <div className="space-y-6">
                <button
                  type="button"
                  className="btn btn-primary btn-block rounded-md border border-primary/80 shadow-sm"
                  onClick={() => setShowPreviewModal(true)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 48 48">
                    <path
                      fill="#FFC107"
                      d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
                    />
                    <path
                      fill="#FF3D00"
                      d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
                    />
                    <path
                      fill="#4CAF50"
                      d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
                    />
                    <path
                      fill="#1976D2"
                      d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
                    />
                  </svg>
                  Continuar con Google
                </button>

                <p className="text-xs text-base-content/60">
                  Al continuar aceptas nuestros{" "}
                  <Link href="/tos" className="link">
                    Términos
                  </Link>{" "}
                  y{" "}
                  <Link href="/privacy-policy" className="link">
                    Política de privacidad
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPreviewModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-base-content/40 backdrop-blur-sm"
          onClick={() => setShowPreviewModal(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Vista previa"
        >
          <div
            className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-md border border-base-300 bg-base-200 p-5 md:p-6 shadow-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute top-4 right-4 btn btn-ghost btn-sm btn-square rounded-md text-base-content/70"
              onClick={() => setShowPreviewModal(false)}
              aria-label="Cerrar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary/90 mb-3">Incluido en la demo</p>
            <h2 className="text-lg md:text-xl font-bold text-base-content mb-4 pr-10">Tu espacio deportivo</h2>
            <ul className="space-y-3">
              <li className="flex gap-3 items-start">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-base-300 bg-base-100 text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </span>
                <div>
                  <span className="font-semibold text-base-content">Sesiones en video</span>
                  <span className="block text-sm text-base-content/70">Biblioteca VOD y progresiones de carga.</span>
                </div>
              </li>
              <li className="flex gap-3 items-start">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-base-300 bg-base-100 text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </span>
                <div>
                  <span className="font-semibold text-base-content">Plan y material</span>
                  <span className="block text-sm text-base-content/70">PDFs, calendario y recordatorios (según integres).</span>
                </div>
              </li>
              <li className="flex gap-3 items-start">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-base-300 bg-base-100 text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </span>
                <div>
                  <span className="font-semibold text-base-content">Reservas</span>
                  <span className="block text-sm text-base-content/70">Gestión de citas vía Supabase si está activo.</span>
                </div>
              </li>
            </ul>
            <p className="mt-4 text-sm text-base-content/60 text-center">
              Vista previa. Habilita OAuth en producción para iniciar sesión de verdad.
            </p>
            <div className="mt-5 flex flex-col gap-2">
              <button
                type="button"
                className="btn btn-ghost btn-block rounded-md border border-base-300"
                onClick={() => setShowPreviewModal(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      <FooterFoot />
    </main>
  );
}

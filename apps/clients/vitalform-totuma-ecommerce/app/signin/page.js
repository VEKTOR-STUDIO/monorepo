"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import config from "@/config";
import FooterFoot from "@/components/FooterFoot";
import { Calendar, Package, CheckCircle, History, User } from "lucide-react";

const PREVIEW_BENEFITS = [
  {
    icon: User,
    title: "Panel personal",
    description: "Los clientes ven sus próximas consultas nutricionales (VitalForm Fit) y pedidos de totumas (Totuma Mealpreps) en un vistazo.",
  },
  {
    icon: Calendar,
    title: "Reservar y gestionar",
    description: "Agendar consultas nutricionales; hacer y seguir pedidos de mealpreps. Todo desde el mismo dashboard.",
  },
  {
    icon: CheckCircle,
    title: "Confirmaciones",
    description: "Confirmación de fechas de consulta, horarios, y entregas o pick up para los pedidos.",
  },
  {
    icon: History,
    title: "Historial",
    description: "Consultas realizadas y pedidos pasados en un solo lugar para cada usuario.",
  },
  {
    icon: Package,
    title: "Una sola cuenta",
    description: "VitalForm Fit y Totuma Mealpreps unificados: el cliente gestiona nutrición y mealpreps desde una cuenta.",
  },
];

export default function SignInPage() {
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Demo de venta: mostrar el modal al cargar para que se vea qué incluye la plataforma
  useEffect(() => {
    setShowPreviewModal(true);
  }, []);

  return (
    <main className="min-h-screen relative overflow-hidden" data-theme={config.colors.theme}>
      <div className="relative grid md:grid-cols-2 min-h-screen z-10">
        {/* Left: imagen mealprep */}
        <div className="relative hidden md:block min-h-screen">
          <Image
            src="/mealprep.png"
            alt="VitalForm Fit · Totuma Mealpreps — Nutrición y mealpreps"
            fill
            priority
            className="object-cover object-center"
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-base-100/30 via-transparent to-base-100/80" />
          <div className="absolute inset-0 flex items-end p-8 pb-12">
            <p className="text-base-content/90 text-sm max-w-xs drop-shadow-md">
              Nutrición basada en evidencia y mealpreps listos para la semana. Una sola cuenta para todo.
            </p>
          </div>
        </div>

        {/* Right: tarjeta demo (sin login real) */}
        <div className="flex items-center justify-center p-8 md:p-12">
          <div className="w-full max-w-md bg-base-100/90 backdrop-blur-xl border border-base-content/20 rounded-2xl p-6 md:p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <Link href="/" className="btn btn-ghost btn-sm">
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

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">
              Iniciar sesión
            </h1>
            <p className="text-base-content/60 text-sm mb-6">
              Página de acceso para clientes de VitalForm Fit y Totuma Mealpreps. En esta demo podés ver qué incluye el área privada.
            </p>

            <div className="space-y-4 p-4 rounded-xl bg-base-200/80 border border-base-content/10 mb-6">
              <p className="text-xs text-base-content/70">
                <strong>Vista previa para demo.</strong> El botón de acceso con Google está desactivado en esta versión. Usá el botón de abajo para ver qué verán tus clientes al iniciar sesión.
              </p>
            </div>

            <div className="space-y-6">
              <button
                type="button"
                className="btn btn-primary btn-block"
                onClick={() => setShowPreviewModal(true)}
              >
                Ver qué incluye el área de clientes
              </button>

              <p className="text-xs text-base-content/50 text-center">
                Términos y Privacidad: <Link href="/tos" className="link">Términos</Link> · <Link href="/privacy-policy" className="link">Privacidad</Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: qué incluye la plataforma (para quien compra la página) */}
      {showPreviewModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-base-content/50 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Qué incluye esta plataforma"
          onClick={() => setShowPreviewModal(false)}
        >
          <div
            className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-primary/30 bg-base-200 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-base-300 transition-colors"
              onClick={() => setShowPreviewModal(false)}
              aria-label="Cerrar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-base-content/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-6 md:p-8 pt-12">
              <p className="text-primary font-medium text-xs uppercase mb-2" style={{ letterSpacing: "0.2em" }}>
                Lo que incluye esta plataforma
              </p>
              <h2 className="text-xl md:text-2xl font-bold text-base-content mb-1">
                Qué verán tus clientes al iniciar sesión
              </h2>
              <p className="text-base-content/60 text-sm mb-6">
                Esta web une VitalForm Fit (consultas nutricionales) y Totuma Mealpreps (pedidos de totumas). Con una sola cuenta, tus clientes acceden a todo lo siguiente.
              </p>

              <ul className="space-y-4 mb-8">
                {PREVIEW_BENEFITS.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <li key={i} className="flex gap-3">
                      <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-base-content">{item.title}</h3>
                        <p className="text-sm text-base-content/60">{item.description}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <p className="text-base-content/70 text-sm mb-6 text-center">
                Todo referido a esta página: VitalForm Fit · Totuma Mealpreps.
              </p>

              <button
                type="button"
                className="btn btn-primary btn-block"
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

"use client";

import NextTopLoader from "nextjs-toploader";
import { Toaster } from "react-hot-toast";
import config from "@/config";

/**
 * Los envoltorios que necesitan navegador y por eso no pueden vivir en el
 * layout del servidor:
 *
 *   · NextTopLoader — la barra de progreso al navegar entre páginas.
 *   · Toaster — los mensajes de "listo" y "no se pudo", desde cualquier sitio.
 *
 * Aquí antes había además Crisp y una consulta de sesión a Supabase. Los dos
 * se fueron con la tienda: esta página no tiene cuentas ni chat, el contacto
 * es por WhatsApp.
 */
export default function ClientLayout({ children }) {
  return (
    <>
      <NextTopLoader color={config.colors.main} showSpinner={false} />
      {children}
      {/* Los avisos van oscuros como el resto: el blanco de fábrica de
          react-hot-toast sobre esta página parece un error de carga. */}
      <Toaster
        toastOptions={{
          duration: 3500,
          style: {
            background: "#1f1f1f",
            color: "#f7f7f7",
            border: "1px solid rgba(255,255,255,0.12)",
            fontSize: "0.875rem",
          },
        }}
      />
    </>
  );
}

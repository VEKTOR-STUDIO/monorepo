"use client";

import { Toaster } from "react-hot-toast";

// Los mensajes de «hecho» y «no se pudo», con los colores del tema en vez del
// blanco que trae la librería.
export default function Avisos() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "var(--color-base-200)",
          color: "var(--color-base-content)",
          border: "1px solid var(--color-base-300)",
          borderRadius: "var(--radius-box)",
          fontSize: "0.8125rem",
          maxWidth: "26rem",
        },
        success: { iconTheme: { primary: "var(--color-success)", secondary: "var(--color-base-200)" } },
        error: { duration: 7000, iconTheme: { primary: "var(--color-error)", secondary: "var(--color-base-200)" } },
      }}
    />
  );
}

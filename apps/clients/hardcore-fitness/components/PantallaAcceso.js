"use client";

import { useEffect, useRef, useState } from "react";
import { LogoCuadrado } from "@/components/Logo";

/**
 * La puerta de la demo.
 *
 * Primero se enciende el logo, después aparece el formulario. La animación no
 * bloquea nada: quien ya sabe la contraseña puede escribirla desde el primer
 * momento, solo que el campo llega solo a los 1,7 s.
 *
 * Esto es la cara del candado; el candado de verdad está en el middleware.
 * Sin la cookie correcta el servidor no sirve ni una página de la tienda, así
 * que saltarse esta pantalla con las herramientas del navegador no lleva a
 * ningún sitio.
 */
export default function PantallaAcceso({ destino = "/" }) {
  const [clave, setClave] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [abierto, setAbierto] = useState(false);
  const campo = useRef(null);

  // Al terminar la entrada, el cursor ya está en el campo.
  useEffect(() => {
    const t = setTimeout(() => campo.current?.focus(), 1700);
    return () => clearTimeout(t);
  }, []);

  const enviar = async (evento) => {
    evento.preventDefault();
    if (enviando || abierto || !clave) return;

    setEnviando(true);
    setError("");

    try {
      const respuesta = await fetch("/api/entrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clave }),
      });

      if (!respuesta.ok) {
        const { error: mensaje } = await respuesta.json().catch(() => ({}));
        setError(mensaje || "Esa no es.");
        setClave("");
        setEnviando(false);
        campo.current?.focus();
        return;
      }

      // Acertó: se deja correr la animación de salida y se entra con una
      // navegación completa, para que el servidor vuelva a leer la cookie.
      setAbierto(true);
      setTimeout(() => {
        window.location.href = destino;
      }, 620);
    } catch {
      setError("No se pudo comprobar. Inténtalo otra vez.");
      setEnviando(false);
    }
  };

  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6"
      style={abierto ? { animation: "abrir-paso 0.62s cubic-bezier(0.7, 0, 0.84, 0) forwards" } : undefined}
    >
      <div className="malla malla-centro absolute inset-0" aria-hidden="true" />

      {/* Halo rojo detrás del logo */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 size-[32rem] -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--color-primary) 34%, transparent), transparent 62%)",
          filter: "blur(70px)",
          animation: "halo 1.4s cubic-bezier(0.16, 1, 0.3, 1) both",
        }}
      />

      <div className="relative flex w-full max-w-sm flex-col items-center">
        {/* Logo con su anillo */}
        <div className="relative" style={{ animation: "encender 1.1s cubic-bezier(0.16, 1, 0.3, 1) both" }}>
          <div
            className="absolute -inset-5 rounded-full opacity-60"
            aria-hidden="true"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0deg, color-mix(in oklab, var(--color-primary) 85%, transparent) 55deg, transparent 130deg)",
              mask: "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))",
              WebkitMask:
                "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))",
              animation: "girar 4.5s linear infinite",
            }}
          />

          <div className="relative overflow-hidden rounded-2xl">
            <LogoCuadrado lado={232} prioridad />

            {/* Barrido de luz sobre el logo */}
            <div
              className="pointer-events-none absolute inset-x-0 h-1/3"
              aria-hidden="true"
              style={{
                background:
                  "linear-gradient(to bottom, transparent, color-mix(in oklab, var(--color-primary) 22%, transparent), transparent)",
                animation: "barrer 4.5s ease-in-out 1s infinite",
              }}
            />
          </div>
        </div>

        <p
          className="rotulo mt-8"
          style={{ animation: "surgir 0.6s cubic-bezier(0.16, 1, 0.3, 1) 1.15s both" }}
        >
          Acceso privado
        </p>

        <h1
          className="display mt-3 text-center text-2xl"
          style={{ animation: "surgir 0.6s cubic-bezier(0.16, 1, 0.3, 1) 1.3s both" }}
        >
          ESTA DEMO ES CON INVITACIÓN
        </h1>

        <form
          onSubmit={enviar}
          className="mt-8 w-full"
          style={{ animation: "surgir 0.6s cubic-bezier(0.16, 1, 0.3, 1) 1.5s both" }}
        >
          {/* Campo de usuario oculto: aquí no hay usuarios, pero sin él los
              gestores de contraseñas no saben a qué cuenta asociar la clave y
              Chrome se queja. Va oculto y fuera del recorrido del tabulador. */}
          <input
            type="text"
            name="username"
            value="hardcore-demo"
            autoComplete="username"
            readOnly
            tabIndex={-1}
            aria-hidden="true"
            className="sr-only"
          />

          <label htmlFor="clave" className="sr-only">
            Contraseña de acceso
          </label>

          <div style={error ? { animation: "negar 0.42s ease-in-out" } : undefined}>
            <input
              ref={campo}
              id="clave"
              type="password"
              value={clave}
              onChange={(e) => {
                setClave(e.target.value);
                if (error) setError("");
              }}
              disabled={enviando || abierto}
              autoComplete="current-password"
              placeholder="Contraseña"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "error-clave" : undefined}
              className={`entrada text-center tracking-[0.3em] ${
                error ? "border-error!" : ""
              }`}
            />
          </div>

          <button
            type="submit"
            disabled={enviando || abierto || !clave}
            className="btn btn-primary mt-3 w-full"
          >
            {abierto ? "Pasa" : enviando ? "Comprobando…" : "Entrar"}
          </button>

          <p
            id="error-clave"
            role="alert"
            className={`mt-3 text-center text-sm text-error transition-opacity ${
              error ? "opacity-100" : "opacity-0"
            }`}
          >
            {error || " "}
          </p>
        </form>

        <p
          className="mt-4 text-center text-xs leading-relaxed text-base-content/35"
          style={{ animation: "surgir 0.6s cubic-bezier(0.16, 1, 0.3, 1) 1.7s both" }}
        >
          Tienda de demostración. Si llegaste aquí sin contraseña, escríbenos y
          te damos acceso.
        </p>
      </div>
    </main>
  );
}

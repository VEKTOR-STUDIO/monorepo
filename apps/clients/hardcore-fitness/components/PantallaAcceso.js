"use client";

import { useEffect, useRef, useState } from "react";
import { LogoCuadrado } from "@/components/Logo";
import { contexto, usarGsap } from "@/libs/animaciones";

/**
 * La puerta de la demo.
 *
 * Primero se enciende el logo, después aparece el formulario. La animación no
 * bloquea nada: quien ya sabe la contraseña puede escribirla desde el primer
 * momento, solo que el campo llega solo a los 1,7 s.
 *
 * Toda la secuencia es una línea de tiempo de GSAP. Frente a los @keyframes de
 * antes gana en que los tres momentos —entrada, error y salida— comparten los
 * mismos elementos y se pueden encadenar o interrumpir entre sí.
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
  const raiz = useRef(null);

  // Entrada
  useEffect(
    () =>
      contexto((g) => {
        const linea = g.timeline();

        linea
          .from("[data-puerta='halo']", { opacity: 0, scale: 0.4, duration: 1.4 }, 0)
          // El logo llega desenfocado y sobreexpuesto, y se asienta: da la
          // sensación de un rótulo que se enciende.
          .from(
            "[data-puerta='logo']",
            {
              opacity: 0,
              scale: 0.72,
              filter: "blur(16px) brightness(2.4)",
              duration: 1.1,
            },
            0
          )
          .from("[data-puerta='anillo']", { opacity: 0, duration: 0.8 }, 0.5)
          .from("[data-puerta='rotulo']", { opacity: 0, y: 14 }, 1.05)
          .from("[data-puerta='titulo']", { opacity: 0, y: 16 }, 1.2)
          .from("[data-puerta='forma']", { opacity: 0, y: 16 }, 1.4)
          .from("[data-puerta='pie']", { opacity: 0, y: 12 }, 1.6);

        // El anillo gira mientras la pantalla esté viva.
        g.to("[data-puerta='anillo']", {
          rotation: 360,
          duration: 4.5,
          ease: "none",
          repeat: -1,
        });

        // La luz que repasa el logo, cada pocos segundos.
        g.fromTo(
          "[data-puerta='barrido']",
          { yPercent: -160, opacity: 0 },
          {
            yPercent: 160,
            opacity: 1,
            duration: 1.6,
            ease: "power1.inOut",
            repeat: -1,
            repeatDelay: 2.4,
            delay: 1,
          }
        );
      }, raiz),
    []
  );

  // Al terminar la entrada, el cursor ya está en el campo.
  useEffect(() => {
    const t = setTimeout(() => campo.current?.focus(), 1700);
    return () => clearTimeout(t);
  }, []);

  // Contraseña incorrecta: sacudida.
  useEffect(() => {
    if (!error || !campo.current) return;
    const { gsap } = usarGsap();
    gsap.fromTo(
      campo.current.parentElement,
      { x: -9 },
      { x: 0, duration: 0.5, ease: "elastic.out(1, 0.35)" }
    );
  }, [error]);

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

      // Acertó: la pantalla se abre y se entra con una navegación completa,
      // para que el servidor vuelva a leer la cookie.
      setAbierto(true);
      const { gsap } = usarGsap();
      gsap
        .timeline({ onComplete: () => (window.location.href = destino) })
        .to("[data-puerta='logo']", { scale: 1.08, duration: 0.25, ease: "power2.in" })
        .to(raiz.current, { opacity: 0, scale: 1.12, duration: 0.45, ease: "power2.in" }, "-=0.1");
    } catch {
      setError("No se pudo comprobar. Inténtalo otra vez.");
      setEnviando(false);
    }
  };

  return (
    <main
      ref={raiz}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6"
    >
      <div className="malla malla-centro absolute inset-0" aria-hidden="true" />

      {/* Halo rojo detrás del logo */}
      <div
        data-puerta="halo"
        className="pointer-events-none absolute left-1/2 top-1/2 size-[32rem] -translate-x-1/2 -translate-y-1/2 opacity-75"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--color-primary) 34%, transparent), transparent 62%)",
          filter: "blur(70px)",
        }}
      />

      <div className="relative flex w-full max-w-sm flex-col items-center">
        {/* Logo con su anillo */}
        <div data-puerta="logo" className="relative">
          <div
            data-puerta="anillo"
            className="absolute -inset-5 rounded-full opacity-60"
            aria-hidden="true"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0deg, color-mix(in oklab, var(--color-primary) 85%, transparent) 55deg, transparent 130deg)",
              mask: "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))",
              WebkitMask:
                "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))",
            }}
          />

          <div className="relative overflow-hidden rounded-2xl">
            <LogoCuadrado lado={232} prioridad />

            {/* Barrido de luz sobre el logo */}
            <div
              data-puerta="barrido"
              className="pointer-events-none absolute inset-x-0 h-1/3"
              aria-hidden="true"
              style={{
                background:
                  "linear-gradient(to bottom, transparent, color-mix(in oklab, var(--color-primary) 24%, transparent), transparent)",
              }}
            />
          </div>
        </div>

        <p data-puerta="rotulo" className="rotulo mt-8">
          Acceso privado
        </p>

        <h1 data-puerta="titulo" className="display mt-3 text-center text-2xl">
          ESTA DEMO ES CON INVITACIÓN
        </h1>

        <form data-puerta="forma" onSubmit={enviar} className="cristal mt-8 w-full p-5">
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

          <div>
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
              className={`entrada text-center tracking-[0.3em] ${error ? "border-error!" : ""}`}
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
          data-puerta="pie"
          className="mt-4 text-center text-xs leading-relaxed text-base-content/35"
        >
          Tienda de demostración. Si llegaste aquí sin contraseña, escríbenos y
          te damos acceso.
        </p>
      </div>
    </main>
  );
}

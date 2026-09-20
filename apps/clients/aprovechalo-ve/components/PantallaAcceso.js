"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { LogoFoto } from "@/components/Logo";
import Cintillo from "@/components/Cintillo";
import Contador from "@/components/demo/Contador";
import { contexto, usarGsap } from "@/libs/animaciones";
import config from "@/config";

/**
 * La puerta de la demo.
 *
 * No es una pantalla de login: es el escaparate donde se vende el sistema, y
 * la única pantalla que ve seguro quien recibe el enlace. Por eso está montada
 * como la carátula de una edición —insignia, lo que trae, rebaja, cuenta atrás
 * y cintas de texto corriendo— con la caja de acceso a la derecha, que es
 * donde la vista termina cayendo.
 *
 * Todo lo que anuncia es verdad y está en `config.demo`: el precio, el precio
 * de antes, la fecha en que se acaba y la lista de lo que se lleva quien
 * compre. Si se vacía `precioAnterior`, el sello de rebaja desaparece solo.
 *
 * Aquí manda la firma de Alessandrovaru y no la marca de Aprovéchalo: quien
 * llega todavía no es cliente de Aprovéchalo, es alguien a quien se le está
 * enseñando un trabajo. Al entrar, la jerarquía se invierte.
 *
 * Esto es la cara del candado; el candado de verdad está en el middleware.
 * Sin la cookie correcta el servidor no sirve ni una página, así que saltarse
 * esta pantalla con las herramientas del navegador no lleva a ningún sitio.
 */

/** "$690" y "$399" → 42. Null si no hay rebaja que anunciar. */
function calcularDescuento(antes, ahora) {
  const limpiar = (v) => Number(String(v ?? "").replace(/[^\d.]/g, ""));
  const a = limpiar(antes);
  const b = limpiar(ahora);
  if (!a || !b || b >= a) return null;
  return Math.round((1 - b / a) * 100);
}

export default function PantallaAcceso({ destino = "/" }) {
  const [clave, setClave] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [abierto, setAbierto] = useState(false);
  const campo = useRef(null);
  const raiz = useRef(null);

  const { precio, precioAnterior, precioNota, incluye } = config.demo;
  const descuento = calcularDescuento(precioAnterior, precio);

  // Entrada
  useEffect(
    () =>
      contexto((g) => {
        const linea = g.timeline();

        linea
          .from("[data-puerta='halo']", { opacity: 0, scale: 0.4, duration: 1.4 }, 0)
          .from(
            "[data-puerta='logo']",
            {
              opacity: 0,
              scale: 0.82,
              filter: "blur(14px) brightness(2.2)",
              duration: 1,
              clearProps: "filter,transform",
            },
            0
          )
          .from("[data-puerta='marca']", { opacity: 0, y: -12 }, 0.6)
          .from("[data-puerta='insignia']", { opacity: 0, scale: 0.85, duration: 0.7 }, 0.85)
          .from("[data-puerta='titulo']", { opacity: 0, y: 16 }, 1.0)
          .from("[data-puerta='caja']", { opacity: 0, y: 24, duration: 0.9 }, 1.1)
          .from("[data-puerta='sello']", { opacity: 0, scale: 0.4, rotate: -40, duration: 0.6 }, 1.5)
          .from(
            "[data-puerta='dlc'] > *",
            { opacity: 0, x: -18, duration: 0.5, stagger: 0.07 },
            1.3
          )
          .from("[data-puerta='pie']", { opacity: 0, y: 12 }, 1.8);
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
        .to("[data-puerta='logo']", { scale: 1.06, duration: 0.25, ease: "power2.in" })
        .to(raiz.current, { opacity: 0, scale: 1.1, duration: 0.45, ease: "power2.in" }, "-=0.1");
    } catch {
      setError("No se pudo comprobar. Inténtalo otra vez.");
      setEnviando(false);
    }
  };

  return (
    <main ref={raiz} className="puerta relative flex h-svh flex-col overflow-hidden bg-base-content">
      {/* ---------------- Fondo ---------------- */}
      <Image
        src="/landing/puerta.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-20"
      />
      <div className="absolute inset-0 bg-base-content/70" aria-hidden="true" />
      <div className="malla malla-centro absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="textura textura-oscura absolute inset-0" aria-hidden="true" />
      <div
        className="textura-estrellas textura-estrellas-claras absolute inset-0"
        aria-hidden="true"
      />
      <div
        data-puerta="halo"
        className="pointer-events-none absolute left-1/2 top-1/3 size-[40rem] -translate-x-1/2 -translate-y-1/2 opacity-60"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--color-base-100) 30%, transparent), transparent 62%)",
          filter: "blur(90px)",
        }}
      />

      {/* El plástico, lo último del fondo: arruga por igual el halo y las capas
          de abajo, como si la portada entera viniera envuelta. */}
      <div className="plastico absolute inset-0" aria-hidden="true" />

      {/* ---------------- Cinta de arriba ---------------- */}
      <Cintillo variante="puerta" velocidad={26} className="relative z-20 shrink-0" />

      {/* ---------------- Cuerpo ----------------
          Entre las dos cintas y ni un píxel más. Lo de dentro se centra con
          `m-auto` y no con `items-center` a propósito: si en alguna pantalla
          rara no cupiera, se desplazaría por dentro en vez de comerse el
          principio. La página, por fuera, no hace scroll nunca.

          El `z-10` abre un contexto de apilamiento, y eso apaga el
          `mix-blend-screen` con el que LogoCuadrado/LogoFoto se comen su
          propio fondo negro: por eso el logotipo sale aquí dentro de un
          cuadrado que en la cabecera no se ve. Quitarlo lo arregla —el fondo
          va antes en el árbol, así que el cuerpo queda encima igual—, pero
          cambia la carátula, así que se deja como estaba. */}
      <div className="relative z-10 flex min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">
        <div className="m-auto grid w-full max-w-6xl gap-x-[clamp(1.5rem,4vw,3.5rem)] gap-y-[var(--puerta-v4)] px-5 py-[var(--puerta-v2)] lg:grid-cols-[1.15fr_1fr]">
          {/* ============ Columna izquierda: la carátula ============ */}
          <div className="flex min-w-0 flex-col items-center text-center lg:items-start lg:text-left">
            <div data-puerta="marca" className="flex items-center gap-2 sm:gap-3">
              <a
                href="https://alessandrovaru.com"
                target="_blank"
                rel="noopener noreferrer"
                className="microgramma text-xs text-base-100/80 transition-colors hover:text-base-100"
                style={{ fontFamily: "var(--microgramma-font)", letterSpacing: "0.22em" }}
              >
                Alessandrovaru
              </a>
              <span className="h-px w-4 bg-base-100/25 sm:w-8" aria-hidden="true" />
              <span className="microgramma whitespace-nowrap text-[0.6rem] text-base-100/45">
                Sistemas a medida
              </span>
            </div>

            {/* Repite lo que ya dice la cinta de arriba. En escritorio es un
                adorno que cabe; en el móvil son 39 px de lo mismo. */}
            <div data-puerta="insignia" className="mt-[var(--puerta-v3)] hidden lg:block">
              <span className="insignia-edicion px-4 py-2">
                <span className="microgramma text-[0.65rem] text-base-100">
                  ◆ Edición completa · Acceso anticipado
                </span>
              </span>
            </div>

            <div data-puerta="logo" className="mt-[var(--puerta-v3)] flex flex-col items-center lg:items-start">
              <p className="puerta-cortesia microgramma text-[0.6rem] text-base-100/40">Demo privada de</p>
              <LogoFoto lado="var(--puerta-logo)" className="mt-1" prioridad />
              <h1 className="display -mt-3 text-[clamp(1.6rem,4.4vh,3rem)] text-base-100">Aprovéchalo</h1>
            </div>

            <p
              data-puerta="titulo"
              className="puerta-presentacion mt-[var(--puerta-v3)] max-w-md leading-relaxed text-sm text-base-100/65"
            >
              La página de venta de vehículos, entera y funcionando. Entra con tu
              contraseña y recórrela: lo que ves es lo que se entrega.
            </p>

            {/* Lo que trae la edición. */}
            <div className="puerta-incluido mt-[var(--puerta-v3)] w-full">
              <p className="microgramma text-[0.6rem] text-base-100/45">
                Incluido en esta edición
              </p>

              <ul data-puerta="dlc" className="puerta-incluye mt-[var(--puerta-v2)]">
                {incluye.map((cosa, i) => (
                  <li
                    key={cosa}
                    className="linea-dlc flex items-start gap-3 rounded-md px-3 py-[var(--puerta-v1)] text-left"
                  >
                    <span className="microgramma shrink-0 text-[0.65rem] text-base-100/35">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-xs leading-snug text-base-100/80">{cosa}</span>
                    <span
                      className="ml-auto shrink-0 text-base-100/30"
                      aria-hidden="true"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                        <path d="m20 6-11 11-5-5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ============ Columna derecha: la caja de acceso ============ */}
          <div className="min-w-0 lg:self-center">
            <div
              data-puerta="caja"
              className="resplandor relative rounded-xl border border-base-100/15 bg-base-content/70 p-[var(--puerta-v3)] backdrop-blur-md"
            >
              {/* El sello de rebaja, pegado en la esquina. */}
              {descuento && (
                <div
                  data-puerta="sello"
                  className="sello-descuento absolute -right-3 -top-4 rounded-lg px-3 py-2 text-center sm:-right-5"
                >
                  <p className="cifra text-lg font-bold leading-none">−{descuento}%</p>
                  <p className="microgramma mt-0.5 text-[0.5rem] opacity-90">hoy</p>
                </div>
              )}

              <p className="microgramma flex items-center gap-2 text-[0.6rem] text-base-100/50">
                <span
                  className="inline-block size-1.5 rounded-full bg-error"
                  style={{ animation: "pulso 1.8s ease-in-out infinite" }}
                  aria-hidden="true"
                />
                Oferta de lanzamiento
              </p>

              <div className="mt-[var(--puerta-v2)] flex items-end gap-3">
                {precioAnterior && (
                  <span className="cifra text-xl text-base-100/35 line-through">
                    {precioAnterior}
                  </span>
                )}
                <span className="cifra text-[clamp(1.9rem,5vh,3rem)] font-bold leading-none text-base-100">
                  {precio}
                </span>
              </div>
              <p className="mt-[var(--puerta-v1)] text-xs text-base-100/45">{precioNota}</p>

              <div className="mt-[var(--puerta-v2)] flex items-center justify-between gap-3 lg:block">
                <p className="microgramma text-[0.6rem] text-base-100/45">Termina en</p>
                {/* Las cuatro cajas son de escritorio: en el móvil se comen 48 px
                    justo encima del formulario, así que ahí va la misma cuenta en
                    una línea y pegada a su etiqueta. */}
                <span className="lg:hidden">
                  <Contador formato="compacto" className="text-sm" />
                </span>
                <div className="hidden lg:block">
                  <Contador formato="completo" className="mt-[var(--puerta-v1)]" />
                </div>
              </div>

              {/* La llave. */}
              <form onSubmit={enviar} className="mt-[var(--puerta-v3)] border-t border-base-100/12 pt-[var(--puerta-v3)]">
                <p className="microgramma text-[0.65rem] text-base-100/60">
                  Acceso privado · con invitación
                </p>

                {/* Campo de usuario oculto: aquí no hay usuarios, pero sin él los
                    gestores de contraseñas no saben a qué cuenta asociar la clave
                    y el navegador se queja. Fuera del tabulador. */}
                <input
                  type="text"
                  name="username"
                  value="aprovechalo-demo"
                  autoComplete="username"
                  readOnly
                  tabIndex={-1}
                  aria-hidden="true"
                  className="sr-only"
                />

                <label htmlFor="clave" className="sr-only">
                  Contraseña de acceso
                </label>

                <div className="mt-[var(--puerta-v1)]">
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
                    className={`entrada border-base-100/20 bg-base-100/10 text-center tracking-[0.3em] text-base-100 placeholder:text-base-100/35 ${
                      error ? "border-error!" : ""
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={enviando || abierto || !clave}
                  className="btn btn-primary mt-[var(--puerta-v1)] w-full border border-base-100/20 bg-base-100 text-base-content hover:bg-base-100/90"
                >
                  {abierto ? "Pasa" : enviando ? "Comprobando…" : "Entrar a la demo"}
                </button>

                <p
                  id="error-clave"
                  role="alert"
                  className={`mt-[var(--puerta-v1)] text-center text-sm text-error transition-opacity ${
                    error ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {error || " "}
                </p>
              </form>
            </div>

            <p
              data-puerta="pie"
              className="mt-[var(--puerta-v2)] text-center text-xs leading-relaxed text-base-100/40"
            >
              Construida por{" "}
              <a
                href="https://alessandrovaru.com"
                target="_blank"
                rel="noopener noreferrer"
                className="microgramma text-base-100/70 underline-offset-4 transition-colors hover:text-base-100 hover:underline"
                style={{ fontFamily: "var(--microgramma-font)" }}
              >
                Alessandrovaru
              </a>
              .{" "}
              <span className="hidden lg:inline">
                Si llegaste sin contraseña, escríbeme y te doy acceso.
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* ---------------- Cinta de abajo, al revés ---------------- */}
      <Cintillo
        variante="puertaInversa"
        invertido
        velocidad={32}
        className="relative z-20 shrink-0"
      />
    </main>
  );
}

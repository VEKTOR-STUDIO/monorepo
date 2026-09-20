"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { LogoFoto } from "@/components/Logo";
import { contexto, usarGsap } from "@/libs/animaciones";

/**
 * La puerta de la demo.
 *
 * Va sobre fondo oscuro, al revés que el resto del sitio: esta pantalla no
 * vende nada, corta el paso, y el contraste lo deja claro antes de leer una
 * palabra.
 *
 * Aquí manda la firma de Alessandrovaru y no la marca de Aprovéchalo, y es a
 * propósito: quien llega todavía no es cliente de Aprovéchalo —es alguien a
 * quien se le está enseñando un trabajo—. La marca del cliente aparece debajo,
 * presentada como lo que hay detrás de la puerta. En cuanto se entra, la
 * jerarquía se invierte y la página entera pasa a ser suya.
 *
 * Primero se enciende el logotipo, después aparece el formulario. La animación
 * no bloquea nada: quien ya sabe la contraseña puede escribirla desde el primer
 * momento, solo que el campo se enfoca solo a los 1,7 s.
 *
 * Esto es la cara del candado; el candado de verdad está en el middleware. Sin
 * la cookie correcta el servidor no sirve ni una página, así que saltarse esta
 * pantalla con las herramientas del navegador no lleva a ningún sitio.
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
          // El logotipo llega desenfocado y sobreexpuesto, y se asienta: da la
          // sensación de un rótulo que se enciende.
          .from(
            "[data-puerta='logo']",
            {
              opacity: 0,
              scale: 0.78,
              filter: "blur(14px) brightness(2.2)",
              duration: 1.1,
              clearProps: "filter,transform",
            },
            0
          )
          .from("[data-puerta='marca']", { opacity: 0, y: -12 }, 0.75)
          .from("[data-puerta='rotulo']", { opacity: 0, y: 14 }, 1.0)
          .from("[data-puerta='titulo']", { opacity: 0, y: 16 }, 1.15)
          .from("[data-puerta='forma']", { opacity: 0, y: 16 }, 1.35)
          .from("[data-puerta='pie']", { opacity: 0, y: 12 }, 1.55);
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
    <main
      ref={raiz}
      // Se le descuenta el crédito del pie para que no quede un scroll de dos
      // dedos en una pantalla que debería caber justa.
      className="relative flex min-h-[calc(100svh-var(--alto-credito))] flex-col items-center justify-center overflow-hidden bg-base-content px-6"
    >
      {/* La fotografía del fondo, muy apagada: da contexto sin restarle
          protagonismo al formulario, que es lo único que importa aquí. */}
      <Image
        src="/landing/puerta.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-20"
      />
      <div className="absolute inset-0 bg-base-content/55" aria-hidden="true" />

      <div className="malla malla-centro absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="textura textura-oscura absolute inset-0" aria-hidden="true" />
      <div
        className="textura-estrellas textura-estrellas-claras absolute inset-0"
        aria-hidden="true"
      />

      {/* Halo azul detrás del logotipo. */}
      <div
        data-puerta="halo"
        className="pointer-events-none absolute left-1/2 top-1/2 size-[32rem] -translate-x-1/2 -translate-y-1/2 opacity-70"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--color-primary) 55%, transparent), transparent 62%)",
          filter: "blur(80px)",
        }}
      />

      <div className="relative flex w-full max-w-sm flex-col items-center">
        {/* La firma, arriba del todo: esto lo enseña Alessandrovaru. */}
        <div data-puerta="marca" className="flex flex-col items-center">
          <a
            href="https://alessandrovaru.com"
            target="_blank"
            rel="noopener noreferrer"
            className="microgramma text-sm text-base-100/90 transition-colors hover:text-base-100"
            style={{ fontFamily: "var(--microgramma-font)", letterSpacing: "0.22em" }}
          >
            Alessandrovaru
          </a>
          <span className="mt-3 h-px w-16 bg-base-100/25" aria-hidden="true" />
          <p className="microgramma mt-3 text-[0.6rem] text-base-100/45">
            Sistemas a medida
          </p>
        </div>

        {/* Y debajo, de quién es lo que hay detrás de la puerta. */}
        <div data-puerta="logo" className="mt-10 flex flex-col items-center">
          <p className="microgramma text-[0.6rem] text-base-100/40">Demo privada de</p>
          <LogoFoto lado={128} className="mt-2" prioridad />
          <p className="display -mt-3 text-2xl text-base-100">Aprovéchalo</p>
        </div>

        <p data-puerta="rotulo" className="microgramma mt-8 text-[0.65rem] text-base-100/60">
          Acceso privado
        </p>

        <h1 data-puerta="titulo" className="display mt-3 text-center text-2xl text-base-100">
          Esta demo es con invitación
        </h1>

        <form
          data-puerta="forma"
          onSubmit={enviar}
          className="mt-8 w-full rounded-lg border border-base-100/15 bg-base-100/6 p-5 backdrop-blur-sm"
        >
          {/* Campo de usuario oculto: aquí no hay usuarios, pero sin él los
              gestores de contraseñas no saben a qué cuenta asociar la clave y
              el navegador se queja. Va oculto y fuera del tabulador. */}
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
              className={`entrada border-base-100/20 bg-base-100/10 text-center tracking-[0.3em] text-base-100 placeholder:text-base-100/35 ${
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
            {error || " "}
          </p>
        </form>

        <p
          data-puerta="pie"
          className="mt-4 text-center text-xs leading-relaxed text-base-100/40"
        >
          Página de demostración construida por{" "}
          <a
            href="https://alessandrovaru.com"
            target="_blank"
            rel="noopener noreferrer"
            className="microgramma text-base-100/70 underline-offset-4 transition-colors hover:text-base-100 hover:underline"
            style={{ fontFamily: "var(--microgramma-font)" }}
          >
            Alessandrovaru
          </a>
          . Si llegaste sin contraseña, escríbeme y te doy acceso.
        </p>
      </div>
    </main>
  );
}

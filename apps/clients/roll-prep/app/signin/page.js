"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/libs/supabase/client";
import toast from "react-hot-toast";
import { sanitizeNextPath } from "@/libs/redirect";
import config from "@/config";

// This a login/singup page for Supabase Auth.
// Successfull login redirects to /api/auth/callback where the Code Exchange is processed (see app/api/auth/callback/route.js).
export default function Login() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  // A dónde iba el alumno antes de que le pidiéramos cuenta: llega en ?next=
  // desde la landing y hay que pasárselo al callback para no perderlo.
  const [next, setNext] = useState(null);

  // El callback del magic link devuelve aquí con ?error= cuando el enlace
  // venció o ya se usó (ver app/api/auth/callback/route.js).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const destination = sanitizeNextPath(params.get("next"));
    setNext(destination);

    // El que ya tiene sesión no tiene nada que pedir aquí: llegó por el
    // historial, un link viejo o un marcador. Pedirle otra vez el correo es
    // mandarlo a revisar el buzón para entrar a donde ya podía entrar.
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        router.replace(destination ?? config.auth.callbackUrl);
      }
    });

    const error = params.get("error");
    if (!error) return;

    toast.error(error);
    // Limpiar el error de la URL sin tirar el destino con él: si se borra la
    // query entera, el segundo intento de login termina en el menú.
    const kept = destination
      ? `?next=${encodeURIComponent(destination)}`
      : "";
    window.history.replaceState({}, "", window.location.pathname + kept);
    // Se lee la URL y la sesión una sola vez, al montar: volver a correrlo
    // pisaría el error que acabamos de limpiar de la barra de direcciones.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSignup = async (e, options) => {
    e?.preventDefault();

    setIsLoading(true);

    try {
      const { type, provider } = options;
      const callbackUrl = new URL(
        "/api/auth/callback",
        window.location.origin
      );
      if (next) callbackUrl.searchParams.set("next", next);
      const redirectURL = callbackUrl.toString();

      if (type === "oauth") {
        const { error } = await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: redirectURL,
          },
        });

        if (error) throw error;
      } else if (type === "magic_link") {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: redirectURL,
            // full_name llega a raw_user_meta_data y el trigger
            // handle_new_user lo copia a profiles.full_name.
            data: fullName ? { full_name: fullName } : undefined,
          },
        });

        if (error) throw error;

        toast.success("¡Revisa tu correo!");

        setIsDisabled(true);
      }
    } catch (error) {
      // Supabase NO lanza: devuelve el error en la respuesta. Sin esto, si el
      // envío fallaba (límite de correos, dominio sin verificar) el alumno
      // igual leía "revisa tu correo" y se quedaba esperando.
      toast.error(
        error?.message || "No se pudo enviar el enlace. Intenta de nuevo."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main
      className="relative flex min-h-screen flex-col overflow-hidden bg-base-100 text-base-content"
      data-theme={config.colors.theme}
    >
      {/* Número gigante de fondo */}
      <span
        aria-hidden="true"
        className="display text-stroke pointer-events-none absolute -bottom-10 -right-4 select-none text-[12rem] leading-none md:text-[20rem]"
      >
        OSS
      </span>

      <header className="relative z-10 mx-auto w-full max-w-6xl px-5 py-5">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-70 transition-opacity hover:opacity-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4"
          >
            <path
              fillRule="evenodd"
              d="M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z"
              clipRule="evenodd"
            />
          </svg>
          Inicio
        </Link>
      </header>

      <div className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 pb-16">
        <span className="tag-skew rise rise-1 self-start bg-primary px-3 py-1 text-xs text-primary-content">
          <span>Acceso al equipo</span>
        </span>

        <h1 className="display rise rise-2 mt-5 text-5xl md:text-6xl">
          Entra a{" "}
          <span className="text-primary">{config.appName}</span>
        </h1>

        {/* El que llegó con destino se queda más tranquilo si se lo decimos. */}
        {next && (
          <p className="rise rise-2 mt-4 text-sm font-semibold opacity-70">
            En cuanto entres te llevamos directo a donde ibas.
          </p>
        )}

        <div className="rise rise-3 mt-10 space-y-6">
          <button
            className="btn btn-secondary btn-block btn-lg"
            onClick={(e) =>
              handleSignup(e, { type: "oauth", provider: "google" })
            }
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 48 48"
              >
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
            )}
            Continuar con Google
          </button>

          <div className="flex items-center gap-4">
            <span className="h-px flex-1 bg-base-300" />
            <span className="text-xs font-bold uppercase tracking-widest opacity-50">
              o con tu correo
            </span>
            <span className="h-px flex-1 bg-base-300" />
          </div>

          <form
            className="space-y-4"
            onSubmit={(e) => handleSignup(e, { type: "magic_link" })}
          >
            <input
              type="text"
              value={fullName}
              autoComplete="name"
              placeholder="Tu nombre (ej. Carlos Gracie)"
              className="input input-bordered input-lg w-full placeholder:opacity-50"
              onChange={(e) => setFullName(e.target.value)}
            />

            <input
              required
              type="email"
              value={email}
              autoComplete="email"
              placeholder="tu@correo.com"
              className="input input-bordered input-lg w-full placeholder:opacity-50"
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              className="btn btn-primary btn-block btn-lg"
              disabled={isLoading || isDisabled}
              type="submit"
            >
              {isLoading && (
                <span className="loading loading-spinner loading-xs"></span>
              )}
              Enviar Magic Link
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

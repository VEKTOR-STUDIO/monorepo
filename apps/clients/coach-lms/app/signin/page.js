"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { createClient } from "@/libs/supabase/client";
import config from "@/config";
import FooterFoot from "@/components/FooterFoot";

// -----------------------------------------------------------------------------
// Acceso al área de atletas. Sin contraseñas: nadie tiene que recordar nada.
//
// Dos caminos:
//   1. Enlace por correo -> el alumno escribe su correo, le llega un enlace y
//      entra con un clic. El mismo enlace sirve para entrar y para registrarse:
//      si el correo no tenía cuenta, Supabase la crea.
//   2. Google            -> un clic, si el alumno tiene cuenta de Google.
//
// El enlace vuelve por /api/auth/callback, que canjea el código por la sesión.
//
// En Supabase hace falta:
//   Authentication -> Providers -> Email -> "Magic Link" activado.
//   Authentication -> URL Configuration -> la URL del sitio y
//     <sitio>/api/auth/callback en "Redirect URLs".
// Ojo: el SMTP por defecto de Supabase manda pocos correos por hora. Con
// alumnos de verdad, configura SMTP propio (Resend) en Authentication -> SMTP.
// -----------------------------------------------------------------------------

const ERROR_MESSAGES = {
  "Unable to validate email address: invalid format":
    "Ese correo no parece válido.",
  "Email rate limit exceeded":
    "Se enviaron demasiados correos seguidos. Espera unos minutos e inténtalo otra vez.",
  "Signups not allowed for otp":
    "Ese correo todavía no tiene cuenta. Pídele acceso al entrenador.",
  "Error sending magic link email":
    "No pudimos enviar el correo. Inténtalo otra vez en un momento.",
};

const translateError = (message) => {
  if (!message) return "Algo salió mal. Inténtalo otra vez.";
  if (ERROR_MESSAGES[message]) return ERROR_MESSAGES[message];
  // "For security purposes, you can only request this after 41 seconds."
  const wait = message.match(/after (\d+) seconds/);
  if (wait) return `Espera ${wait[1]} segundos antes de pedir otro enlace.`;
  return message;
};

function SignInForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || config.auth.callbackUrl;

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  // Si el callback nos devolvió con error, mostrarlo de entrada.
  const [error, setError] = useState(() =>
    searchParams.get("error") ? translateError(searchParams.get("error")) : ""
  );
  const [sentTo, setSentTo] = useState("");

  const supabase = createClient();

  const callbackUrl = () =>
    `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(
      redirectTo
    )}`;

  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: callbackUrl() },
    });
    if (oauthError) {
      setError(translateError(oauthError.message));
      setLoading(false);
    }
  };

  const sendMagicLink = async (event) => {
    event?.preventDefault();
    const address = email.trim();
    if (!address) return;

    setError("");
    setLoading(true);

    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: address,
      options: {
        emailRedirectTo: callbackUrl(),
        // Solo se usa si el correo aún no tiene cuenta: la crea con su nombre.
        ...(fullName.trim() ? { data: { full_name: fullName.trim() } } : {}),
      },
    });

    setLoading(false);
    if (otpError) setError(translateError(otpError.message));
    else setSentTo(address);
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="border border-base-300 bg-base-100 p-6 md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="btn btn-ghost btn-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5"
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

        {sentTo ? (
          <>
            <h1 className="display mb-2 text-4xl md:text-5xl">Revisa tu correo</h1>
            <p className="mb-6 text-sm text-base-content/70">
              Te enviamos un enlace a <strong>{sentTo}</strong>. Ábrelo desde este
              mismo dispositivo y entras directo, sin contraseña.
            </p>

            {error && (
              <p className="mb-4 border border-error/40 bg-error/10 px-3 py-2 text-sm text-error">
                {error}
              </p>
            )}

            <div className="space-y-2 text-sm">
              <button
                type="button"
                className="btn btn-block border border-base-300 bg-base-200 hover:bg-base-300"
                onClick={sendMagicLink}
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  "Reenviar el enlace"
                )}
              </button>
              <button
                type="button"
                className="link text-base-content/50"
                onClick={() => {
                  setSentTo("");
                  setError("");
                }}
              >
                Usar otro correo
              </button>
            </div>

            <p className="mt-6 text-xs text-base-content/50">
              ¿No llega? Mira en spam o correo no deseado. El enlace caduca en una
              hora.
            </p>
          </>
        ) : (
          <>
            <h1 className="display mb-2 text-4xl md:text-5xl">Acceso atletas</h1>
            <p className="mb-6 text-sm text-base-content/70">
              Entra para ver tu plan, registrar tus sesiones y seguir tu progreso.
              Sin contraseñas: te mandamos un enlace al correo.
            </p>

            <button
              type="button"
              onClick={handleGoogle}
              disabled={loading}
              className="btn btn-block border border-base-300 bg-base-200 hover:bg-base-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
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
              Continuar con Google
            </button>

            <div className="my-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-base-300" />
              <span className="text-xs uppercase tracking-widest text-base-content/40">
                o
              </span>
              <span className="h-px flex-1 bg-base-300" />
            </div>

            <form onSubmit={sendMagicLink} className="space-y-4">
              <label className="block">
                <span className="mb-1 block text-sm font-semibold">Correo</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  autoComplete="email"
                  placeholder="tucorreo@ejemplo.com"
                  className="input input-bordered w-full"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-semibold">
                  Tu nombre{" "}
                  <span className="font-normal text-base-content/50">
                    (solo la primera vez)
                  </span>
                </span>
                <input
                  type="text"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  autoComplete="name"
                  placeholder="Nombre y apellido"
                  className="input input-bordered w-full"
                />
              </label>

              {error && (
                <p className="border border-error/40 bg-error/10 px-3 py-2 text-sm text-error">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  "Enviarme el enlace de acceso"
                )}
              </button>
            </form>

            <p className="mt-5 text-sm text-base-content/70">
              ¿Primera vez? Con el mismo enlace se crea tu cuenta y el entrenador
              te asigna tu plan.
            </p>
          </>
        )}

        <p className="mt-6 text-xs text-base-content/50">
          Al continuar aceptas nuestros{" "}
          <Link href="/tos" className="link">
            Términos
          </Link>{" "}
          y la{" "}
          <Link href="/privacy-policy" className="link">
            Política de privacidad
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

export default function SignIn() {
  return (
    <main className="relative min-h-screen overflow-hidden" data-theme={config.colors.theme}>
      <div className="relative z-10 grid min-h-screen md:grid-cols-2">
        <div className="relative hidden overflow-hidden border-r border-base-300 bg-base-200 md:block">
          <span
            aria-hidden="true"
            className="display text-stroke pointer-events-none absolute inset-0 flex select-none items-center justify-center text-[9rem] leading-none opacity-60"
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
          <Suspense
            fallback={<span className="loading loading-spinner loading-lg text-primary" />}
          >
            <SignInForm />
          </Suspense>
        </div>
      </div>

      <FooterFoot />
    </main>
  );
}

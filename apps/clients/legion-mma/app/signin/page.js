"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { createClient } from "@/libs/supabase/client";
import config from "@/config";
import FooterFoot from "@/components/FooterFoot";

// Login con Supabase Auth (Google OAuth). Tras autenticarse, el code exchange
// ocurre en /api/auth/callback y redirige al dashboard, donde el peleador
// completa su ficha de registro para entrar al roster de Legión.
export default function Login() {
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e) => {
    e?.preventDefault();
    setIsLoading(true);

    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          // Use the current origin so OAuth returns to the same domain the user
          // is on (localhost, vercel.app, or production), keeping the session valid.
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen relative overflow-hidden"
      data-theme={config.colors.theme}
    >
      <div className="relative grid md:grid-cols-2 min-h-screen z-10">
        {/* Left: imagen editorial de combate */}
        <div className="relative hidden md:block">
          <Image
            src="https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=1200&q=80"
            alt="Peleador de MMA en el octágono"
            fill
            priority
            className="object-cover object-center opacity-70 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-base-100/20 via-transparent to-base-100" />
          <div className="absolute bottom-10 left-10 right-10">
            <p className="text-primary font-bold text-xs uppercase tracking-[0.4em] mb-3">
              Base de datos oficial
            </p>
            <p
              className="font-display text-base-content leading-[0.9]"
              style={{ fontSize: "clamp(2.5rem, 4vw, 4rem)" }}
            >
              Entra al <span className="text-primary">roster</span> de Legión
            </p>
          </div>
        </div>

        {/* Right: auth card */}
        <div className="flex items-center justify-center p-8 md:p-12">
          <div className="w-full max-w-md bg-base-200/90 backdrop-blur-xl border border-primary/30 p-6 md:p-8 shadow-2xl">
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

            <h1 className="font-display text-3xl md:text-4xl leading-none mb-2">
              Zona de <span className="text-primary">peleadores</span>
            </h1>
            <p className="text-sm text-base-content/60 mb-6">
              Inicia sesión para registrarte como peleador de Legión y gestionar
              tu ficha: disciplina, récord, división y más.
            </p>

            <div className="space-y-6">
              <button
                className="btn btn-primary btn-block"
                onClick={handleSignup}
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

              <p className="text-xs text-base-content/60">
                Al continuar aceptas nuestros{" "}
                <Link href="/tos" className="link">Términos</Link> y la{" "}
                <Link href="/privacy-policy" className="link">Política de Privacidad</Link>.
              </p>
            </div>
          </div>
        </div>
      </div>

      <FooterFoot />
    </main>
  );
}

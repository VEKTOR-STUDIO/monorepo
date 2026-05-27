"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@/libs/supabase/client";
import toast from "react-hot-toast";
import config from "@/config";
import FooterFoot from "@/components/FooterFoot";

// This a login/singup page for Supabase Auth.
// Successful login redirects to /api/auth/callback where the Code Exchange is processed (see app/api/auth/callback/route.js).
export default function Login() {
  const supabase = createClient();
  // eslint-disable-next-line no-unused-vars -- setEmail used in commented magic link form
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, setIsDisabled] = useState(false);
  const videoRef = useRef(null);
  const [loadVideo, setLoadVideo] = useState(false);

  // Detectar si debe cargar el video (respetando preferencias de usuario)
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const prefersReducedData = window.matchMedia('(prefers-reduced-data: reduce)').matches;
    
    // Cargar video en todos los dispositivos si el usuario no ha solicitado reducir movimiento o datos
    if (!prefersReducedMotion && !prefersReducedData) {
      setLoadVideo(true);
    }
  }, []);

  // Forzar reproducción en iOS/Safari cuando el video esté listo
  useEffect(() => {
    if (loadVideo && videoRef.current) {
      const video = videoRef.current;
      
      const playVideo = () => {
        video.play().catch((error) => {
          console.log("Autoplay prevented, will retry:", error);
        });
      };

      video.addEventListener('loadedmetadata', playVideo);
      
      if (video.readyState >= 3) {
        playVideo();
      }

      return () => {
        video.removeEventListener('loadedmetadata', playVideo);
      };
    }
  }, [loadVideo]);

  const handleSignup = async (e, options) => {
    e?.preventDefault();

    setIsLoading(true);

    try {
      const { type, provider } = options;
      const redirectURL = config.siteUrl + "/api/auth/callback";

      if (type === "oauth") {
        await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: redirectURL,
          },
        });
      } else if (type === "magic_link") {
        await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: redirectURL,
          },
        });

        toast.success("Check your email for the magic link!");

        setIsDisabled(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden" data-theme={config.colors.theme}>
 

      <div className="relative grid md:grid-cols-2 min-h-screen z-10">
        {/* Left: Imagen editorial de referencia */}
        <div className="relative hidden md:block">
          <Image
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80"
            alt="Estudio de belleza — referencia visual"
            fill
            priority
            className="object-cover object-center opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-base-100/10 via-transparent to-base-100/60" />
        </div>

        {/* Right: Auth card */}
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
                Back
              </Link>
              <span className="text-xs text-base-content/60">{config.appName}</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-6">
              Sign in to {config.appName}
            </h1>

            <div className="space-y-6">
              <button
                className="btn btn-primary btn-block"
                onClick={(e) => handleSignup(e, { type: "oauth", provider: "google" })}
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
                Continue with Google
              </button>

              {/* <div className="divider text-xs text-base-content/50 font-medium">or</div> */}

              {/* <form
                className="form-control w-full space-y-4"
                onSubmit={(e) => handleSignup(e, { type: "magic_link" })}
              >
                <input
                  required
                  type="email"
                  value={email}
                  autoComplete="email"
                  placeholder="your-email@example.com"
                  className="input input-bordered w-full placeholder:opacity-60"
                  onChange={(e) => setEmail(e.target.value)}
                />

                <button
                  className="btn btn-outline btn-block"
                  disabled={isLoading || isDisabled}
                  type="submit"
                >
                  {isLoading && (
                    <span className="loading loading-spinner loading-xs"></span>
                  )}
                  Send magic link
                </button>
              </form> */}

              <p className="text-xs text-base-content/60">
                By continuing you agree to our <Link href="/tos" className="link">Terms</Link> and <Link href="/privacy-policy" className="link">Privacy Policy</Link>.
              </p>
            </div>
          </div>
        </div>
      </div>

      <FooterFoot />
    </main>
  );
}

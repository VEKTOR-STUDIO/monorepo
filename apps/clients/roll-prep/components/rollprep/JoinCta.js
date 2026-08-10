"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/libs/supabase/client";
import { sanitizeNextPath } from "@/libs/redirect";
import config from "@/config";

/**
 * Botón de la landing que sobrevive al registro: manda a /signin llevando el
 * destino en ?next=, y el callback del login deja al alumno justo ahí en vez
 * del menú (ver app/api/auth/callback/route.js).
 *
 * Si ya hay sesión no hay nada que registrar: el link va directo al destino.
 * Mientras se resuelve la sesión apunta al login, que es lo correcto para el
 * visitante nuevo — el caso normal en una landing — y el que ya entró igual
 * termina en su destino después del rebote.
 */
export default function JoinCta({ next, children, extraStyle = "" }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const destination = sanitizeNextPath(next) ?? config.auth.callbackUrl;

  useEffect(() => {
    const supabase = createClient();

    supabase.auth
      .getUser()
      .then(({ data }) => setIsSignedIn(Boolean(data?.user)));
  }, []);

  const href = isSignedIn
    ? destination
    : `${config.auth.loginUrl}?next=${encodeURIComponent(destination)}`;

  return (
    <Link href={href} className={`btn ${extraStyle}`}>
      {children}
    </Link>
  );
}

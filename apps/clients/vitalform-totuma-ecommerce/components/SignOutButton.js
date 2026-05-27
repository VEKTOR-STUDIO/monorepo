"use client";

import { useState } from "react";
import { createClient } from "@/libs/supabase/client";

export default function SignOutButton({ className = "btn", children = "Cerrar sesión", redirectTo = "/" }) {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      window.location.href = redirectTo;
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleSignOut} className={className} disabled={loading}>
      {loading ? <span className="loading loading-spinner loading-xs" /> : children}
    </button>
  );
}

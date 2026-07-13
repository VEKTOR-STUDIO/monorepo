"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/libs/supabase/client";

// Suscripción realtime: cuando entra un voto o una tarea completada,
// refresca los Server Components del panel para actualizar las métricas.
export default function AdminLiveRefresh() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("admin-metrics")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "poll_votes" },
        () => router.refresh()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "assignment_completions" },
        () => router.refresh()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  return null;
}

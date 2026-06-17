import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/libs/supabase/server";
import config from "@/config";
import SignOutButton from "@/components/SignOutButton";
import FighterDashboard from "@/components/fighter/FighterDashboard";
import AdminRoster from "@/components/fighter/AdminRoster";

export const dynamic = "force-dynamic";

// Dashboard de Legión: el peleador registra/gestiona su ficha (estilo UFC) y
// el admin gestiona la base de datos del roster.
export default async function Dashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, image, role")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === "admin";

  let fighter = null;
  let allFighters = [];

  if (isAdmin) {
    const { data } = await supabase
      .from("fighters")
      .select("*, fighter_payments(*)")
      .order("created_at", { ascending: false });
    allFighters = data || [];
  } else {
    const { data } = await supabase
      .from("fighters")
      .select("*, fighter_payments(*)")
      .eq("user_id", user.id)
      .maybeSingle();
    fighter = data;
  }

  const displayName =
    fighter?.full_name ||
    profile?.name ||
    user?.user_metadata?.full_name ||
    (user?.email ? user.email.split("@")[0] : "");

  const avatarUrl =
    fighter?.photo_url || profile?.image || user?.user_metadata?.avatar_url || "";

  // user es un objeto complejo: pasamos solo lo serializable que necesita el form
  const safeUser = {
    id: user.id,
    email: user.email,
    user_metadata: { full_name: user.user_metadata?.full_name || "" },
  };

  return (
    <main
      className="min-h-screen bg-base-100 relative overflow-hidden"
      data-theme={config.colors.theme}
    >
      {/* Textura diagonal sutil de fondo */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, var(--color-primary) 0 2px, transparent 2px 24px)",
        }}
        aria-hidden
      />

      <div className="relative min-h-screen p-4 md:p-6 py-8 md:py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="border border-primary/30 bg-base-200/80 p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 md:w-20 md:h-20 border-2 border-primary/50 overflow-hidden shrink-0">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt={displayName}
                      fill
                      className="object-cover object-top"
                      sizes="80px"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center font-display text-primary text-3xl bg-base-300">
                      {displayName?.[0]?.toUpperCase() || "?"}
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-[0.65rem] text-base-content/50 uppercase tracking-[0.3em] font-bold">
                      {isAdmin ? "Panel de administración" : "Zona de peleadores"}
                    </p>
                    {isAdmin && (
                      <span className="badge badge-sm border border-primary/50 text-primary bg-primary/10 text-[0.6rem] tracking-widest uppercase font-bold">
                        Admin
                      </span>
                    )}
                  </div>
                  <h1 className="font-display text-2xl md:text-4xl text-primary leading-none">
                    {displayName}
                  </h1>
                  <p className="text-xs text-base-content/50 mt-1">{user.email}</p>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap justify-center">
                {isAdmin && (
                  <Link
                    href="/dashboard/events"
                    className="btn btn-primary btn-sm"
                  >
                    Carteleras
                  </Link>
                )}
                <Link
                  href="/"
                  className="btn btn-ghost btn-sm border border-primary/30 text-base-content/70 hover:border-primary/60"
                >
                  Inicio
                </Link>
                <SignOutButton className="btn btn-ghost btn-sm text-base-content/70 hover:bg-error/10" />
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          {isAdmin ? (
            <AdminRoster fighters={allFighters} />
          ) : (
            <FighterDashboard user={safeUser} fighter={fighter} />
          )}
        </div>
      </div>
    </main>
  );
}

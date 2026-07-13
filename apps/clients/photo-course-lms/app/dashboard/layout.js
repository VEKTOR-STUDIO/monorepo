import { redirect } from "next/navigation";
import { createClient } from "@/libs/supabase/server";
import config from "@/config";
import BottomNav from "@/components/rollprep/BottomNav";

// Layout privado: exige sesión y monta la navegación inferior mobile-first.
// Aplica a todas las subpáginas de /dashboard.
export default async function LayoutPrivate({ children }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(config.auth.loginUrl);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return (
    <>
      <div className="pb-24">{children}</div>
      <BottomNav isAdmin={profile?.role === "admin"} />
    </>
  );
}

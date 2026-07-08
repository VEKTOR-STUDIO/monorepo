import { redirect } from "next/navigation";
import { createClient } from "@/libs/supabase/server";

// Guard de rol: solo el profesor (admin) puede entrar al panel de control.
export default async function AdminLayout({ children }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  return <>{children}</>;
}

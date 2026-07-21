import { notFound } from "next/navigation";
import { createClient } from "@/libs/supabase/server";
import ClassView from "../ClassView";

export const dynamic = "force-dynamic";

// Detalle de cualquier clase (activa o del archivo), con sus comentarios.
// Se llega desde el calendario y la videoteca.
export default async function ClaseDetalle({ params }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: assignment } = await supabase
    .from("assignments")
    .select("id, title, video_url, notes, scheduled_for, created_at, is_active")
    .eq("id", id)
    .maybeSingle();

  if (!assignment) notFound();

  return <ClassView assignment={assignment} />;
}

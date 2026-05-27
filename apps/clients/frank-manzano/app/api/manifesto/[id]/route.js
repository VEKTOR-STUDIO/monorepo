import { NextResponse } from "next/server";
import { createClient } from "@/libs/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "No autorizado", status: 401 };
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return { error: "Forbidden", status: 403 };
  return { supabase };
}

export async function PATCH(req, { params }) {
  const auth = await requireAdmin();
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { supabase } = auth;
  const { id } = await params();
  if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });

  try {
    const body = await req.json();
    const updates = {};
    if (body.title !== undefined) updates.title = String(body.title).trim();
    if (body.content !== undefined) updates.content = String(body.content).trim();
    const { data, error } = await supabase
      .from("manifesto_posts")
      .update(updates)
      .eq("id", id)
      .select("id, title, content, created_at")
      .single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e.message || "Error al actualizar" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const auth = await requireAdmin();
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { supabase } = auth;
  const { id } = await params();
  if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });

  try {
    const { error } = await supabase.from("manifesto_posts").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e.message || "Error al eliminar" }, { status: 500 });
  }
}

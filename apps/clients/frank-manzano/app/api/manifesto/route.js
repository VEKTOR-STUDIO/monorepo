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

export async function POST(req) {
  const auth = await requireAdmin();
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { supabase } = auth;

  try {
    const body = await req.json();
    const { title, content } = body;
    if (!title || !content) {
      return NextResponse.json({ error: "Título y contenido son obligatorios" }, { status: 400 });
    }
    const { data, error } = await supabase
      .from("manifesto_posts")
      .insert({ title: String(title).trim(), content: String(content).trim() })
      .select("id, title, content, created_at")
      .single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e.message || "Error al crear" }, { status: 500 });
  }
}

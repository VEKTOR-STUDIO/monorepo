import { NextResponse } from "next/server";
import { createClient } from "@/libs/supabase/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, phone, current_fitness_level, goals } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Nombre y teléfono son obligatorios" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("elite_leads")
      .insert({
        name: String(name).trim(),
        phone: String(phone).trim(),
        current_fitness_level: current_fitness_level ? String(current_fitness_level).trim() : null,
        goals: goals ? String(goals).trim() : null,
      })
      .select("id")
      .single();

    if (error) {
      console.error("elite-lead insert error:", error);
      return NextResponse.json(
        { error: error.message || "Error al guardar la aplicación" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, id: data?.id });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: e.message || "Error del servidor" },
      { status: 500 }
    );
  }
}

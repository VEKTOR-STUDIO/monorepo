"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/libs/supabase/server";
import { createAdminClient } from "@/libs/supabase/admin";
import { ACADEMIES_MIGRATION, isAcademyId, isMissingAcademies } from "@/libs/academies";

const ROLES = ["admin", "student"];

async function getAdminSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("No autenticado");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    throw new Error("Solo el profesor puede hacer esto");
  }

  return { supabase, user };
}

function revalidateUserPaths() {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/admin/usuarios");
  revalidatePath("/dashboard/perfil");
  revalidatePath("/dashboard/ranking");
}

/**
 * Edita la ficha de un usuario desde el panel: nombre, rol y academia.
 *
 * El profesor no puede quitarse a sí mismo el rol de admin: sería quedarse
 * fuera del panel sin forma de volver a entrar desde la app.
 */
export async function updateUser(formData) {
  const { supabase, user } = await getAdminSession();

  const id = formData.get("id")?.trim();
  const fullName = formData.get("full_name")?.trim();
  const role = formData.get("role");

  if (!id) return { error: "Falta el usuario." };
  if (!fullName) return { error: "El nombre no puede estar vacío." };
  if (fullName.length > 80) return { error: "Máximo 80 caracteres." };
  if (!ROLES.includes(role)) return { error: "Rol inválido." };
  if (id === user.id && role !== "admin") {
    return { error: "No puedes quitarte a ti mismo el rol de profesor." };
  }

  const changes = { full_name: fullName, role };

  if (formData.has("academy_id")) {
    const academyId = formData.get("academy_id")?.trim() || null;
    if (academyId && !isAcademyId(academyId)) {
      return { error: "Esa academia no existe." };
    }
    changes.academy_id = academyId;
  }

  const { error } = await supabase.from("profiles").update(changes).eq("id", id);

  if (isMissingAcademies(error)) {
    return { error: `Falta correr ${ACADEMIES_MIGRATION} en Supabase.` };
  }
  if (error) return { error: "No se pudo guardar el usuario." };

  revalidateUserPaths();
  return { success: true };
}

/**
 * Elimina la cuenta completa de un alumno (auth + perfil en cascada: XP,
 * clases marcadas, votos, comentarios y su paso por los topes).
 *
 * Borrar en auth necesita service role, así que va por el cliente admin y
 * solo después de confirmar que quien llama es el profesor.
 */
export async function deleteUser(userId) {
  const { user } = await getAdminSession();

  if (!userId) return { error: "Falta el usuario." };
  if (userId === user.id) {
    return { error: "No puedes eliminar tu propia cuenta." };
  }

  const admin = createAdminClient();
  if (!admin) {
    return {
      error: "Falta SUPABASE_SERVICE_ROLE_KEY en el servidor.",
    };
  }

  const { error } = await admin.auth.admin.deleteUser(userId);

  if (error) {
    // Si la migración de academias no está corrida, el perfil todavía no
    // cascadea desde auth.users y el borrado choca contra la FK.
    return {
      error: `No se pudo eliminar la cuenta: ${error.message}. Si menciona una clave foránea, falta correr ${ACADEMIES_MIGRATION}.`,
    };
  }

  revalidateUserPaths();
  return { success: true };
}

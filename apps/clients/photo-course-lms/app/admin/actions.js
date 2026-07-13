"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/libs/supabase/server";
import { createAdminClient } from "@/libs/supabase/admin";

/**
 * Verifica que quien llama tiene sesión y role = 'admin' en profiles.
 * Devuelve el cliente service role para operar sin restricciones de RLS.
 */
async function assertGalleryAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("No autenticado.");

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    throw new Error("Solo el administrador puede hacer esto.");
  }

  return admin;
}

/**
 * Borra una publicación de la galería: primero el registro y luego la
 * imagen del bucket.
 */
export async function deleteGalleryPost(postId) {
  let admin;
  try {
    admin = await assertGalleryAdmin();
  } catch (error) {
    return { error: error.message };
  }

  const { data: post, error: fetchError } = await admin
    .from("gallery_posts")
    .select("image_path")
    .eq("id", postId)
    .single();

  if (fetchError || !post) {
    return { error: "No se encontró la publicación." };
  }

  const { error: deleteError } = await admin
    .from("gallery_posts")
    .delete()
    .eq("id", postId);

  if (deleteError) {
    return { error: "No se pudo borrar la publicación. Intenta de nuevo." };
  }

  // Si el borrado del archivo falla, la publicación ya no es visible;
  // solo quedaría un archivo huérfano en el bucket.
  await admin.storage.from("gallery").remove([post.image_path]);

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

const MAX_CONCEPT_NAME_LENGTH = 60;

async function updateConcept(conceptId, updates) {
  let admin;
  try {
    admin = await assertGalleryAdmin();
  } catch (error) {
    return { error: error.message };
  }

  const { error } = await admin
    .from("gallery_concepts")
    .update(updates)
    .eq("id", conceptId);

  if (error) {
    console.error("Error actualizando concepto:", error.message);
    return { error: "No se pudo actualizar el concepto. Intenta de nuevo." };
  }

  revalidatePath("/");
  revalidatePath("/admin/conceptos");
  return { success: true };
}

/**
 * Crea un nuevo concepto (p. ej. "masa confusa"). Queda al final del orden
 * actual. `reveal_now` lo revela de inmediato; `reveal_at` (opcional)
 * programa un revelado automático para más adelante. Ambos pueden
 * combinarse: si `reveal_now` está marcado, se revela ya, sin importar la
 * fecha programada.
 */
export async function createConcept(formData) {
  let admin;
  try {
    admin = await assertGalleryAdmin();
  } catch (error) {
    return { error: error.message };
  }

  const name = formData.get("name")?.trim();
  const revealNow = formData.get("reveal_now") === "on";
  const revealAtRaw = formData.get("reveal_at")?.trim();

  if (!name) {
    return { error: "Escribe el nombre del concepto." };
  }

  if (name.length > MAX_CONCEPT_NAME_LENGTH) {
    return {
      error: `El nombre no puede superar los ${MAX_CONCEPT_NAME_LENGTH} caracteres.`,
    };
  }

  let revealAt = null;
  if (revealAtRaw) {
    const parsed = new Date(revealAtRaw);
    if (Number.isNaN(parsed.getTime())) {
      return { error: "La fecha de revelado no es válida." };
    }
    revealAt = parsed.toISOString();
  }

  const { count } = await admin
    .from("gallery_concepts")
    .select("id", { count: "exact", head: true });

  const { error: insertError } = await admin.from("gallery_concepts").insert({
    name,
    is_revealed: revealNow,
    reveal_at: revealAt,
    sort_order: count ?? 0,
  });

  if (insertError) {
    console.error("Error creando concepto:", insertError.message);
    return { error: "No se pudo crear el concepto. Intenta de nuevo." };
  }

  revalidatePath("/");
  revalidatePath("/admin/conceptos");
  return { success: true };
}

/** Revela u oculta un concepto de inmediato (anula/ignora la fecha programada). */
export async function toggleConceptRevealed(conceptId, isRevealed) {
  return updateConcept(conceptId, { is_revealed: Boolean(isRevealed) });
}

/** Programa (o quita) la fecha de revelado automático de un concepto. */
export async function setConceptSchedule(conceptId, revealAtRaw) {
  let revealAt = null;
  if (revealAtRaw) {
    const parsed = new Date(revealAtRaw);
    if (Number.isNaN(parsed.getTime())) {
      return { error: "La fecha de revelado no es válida." };
    }
    revealAt = parsed.toISOString();
  }
  return updateConcept(conceptId, { reveal_at: revealAt });
}

/** Cambia el orden en que aparece un concepto (menor = primero). */
export async function setConceptOrder(conceptId, sortOrder) {
  const order = Number(sortOrder);
  if (!Number.isFinite(order)) {
    return { error: "El orden debe ser un número." };
  }
  return updateConcept(conceptId, { sort_order: order });
}

/**
 * Borra un concepto. Las fotos que tenía asociadas NO se borran: quedan
 * como "General" (ver `on delete set null` en el esquema).
 */
export async function deleteConcept(conceptId) {
  let admin;
  try {
    admin = await assertGalleryAdmin();
  } catch (error) {
    return { error: error.message };
  }

  const { error } = await admin
    .from("gallery_concepts")
    .delete()
    .eq("id", conceptId);

  if (error) {
    console.error("Error borrando concepto:", error.message);
    return { error: "No se pudo borrar el concepto. Intenta de nuevo." };
  }

  revalidatePath("/");
  revalidatePath("/admin/conceptos");
  return { success: true };
}

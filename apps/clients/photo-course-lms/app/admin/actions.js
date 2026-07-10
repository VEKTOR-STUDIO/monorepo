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

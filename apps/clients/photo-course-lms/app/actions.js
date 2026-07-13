"use server";

import { revalidatePath } from "next/cache";
import DOMPurify from "isomorphic-dompurify";
import { createClient } from "@/libs/supabase/server";
import {
  ALLOWED_DESCRIPTION_ATTR,
  ALLOWED_DESCRIPTION_TAGS,
  MAX_AUTHOR_LENGTH,
  MAX_FILE_SIZE_MB,
  stripHtml,
} from "@/libs/gallery";

const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024; // mismo límite que el bucket
const ALLOWED_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

/**
 * Sube la foto al bucket `gallery` y registra la publicación en
 * `gallery_posts`. La galería es anónima: no requiere sesión (RLS permite
 * insert a `anon`, ver supabase/gallery-schema.sql).
 */
export async function createGalleryPost(formData) {
  const file = formData.get("image");
  const rawDescription = formData.get("description")?.trim();
  const authorName = formData.get("author_name")?.trim() || null;
  const conceptId = formData.get("concept_id")?.trim() || null;

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Adjunta una imagen para publicar." };
  }

  const extension = ALLOWED_TYPES[file.type];
  if (!extension) {
    return { error: "Formato no soportado. Usa JPG, PNG, WebP o GIF." };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { error: `La imagen supera el límite de ${MAX_FILE_SIZE_MB} MB.` };
  }

  if (!rawDescription) {
    return { error: "Escribe un texto para acompañar tu foto." };
  }

  // El editor de texto rico manda HTML: se sanitiza (solo tags/atributos
  // permitidos, sin scripts ni estilos inline) antes de guardarlo. No hay
  // límite de longitud: el texto puede ser tan largo como quiera el autor.
  const description = DOMPurify.sanitize(rawDescription, {
    ALLOWED_TAGS: ALLOWED_DESCRIPTION_TAGS,
    ALLOWED_ATTR: ALLOWED_DESCRIPTION_ATTR,
  });

  if (!stripHtml(description)) {
    return { error: "Escribe un texto para acompañar tu foto." };
  }

  if (authorName && authorName.length > MAX_AUTHOR_LENGTH) {
    return {
      error: `El nombre no puede superar los ${MAX_AUTHOR_LENGTH} caracteres.`,
    };
  }

  const supabase = await createClient();

  // Si viene un concepto, confirmar que sigue existiendo y revelado (la
  // política RLS de select en gallery_concepts ya filtra por eso). Evita
  // subir la imagen para nada si el concepto se ocultó justo antes de que
  // el participante publique.
  if (conceptId) {
    const { data: concept } = await supabase
      .from("gallery_concepts")
      .select("id")
      .eq("id", conceptId)
      .maybeSingle();

    if (!concept) {
      return {
        error:
          "Ese concepto ya no está disponible. Actualiza la página e intenta de nuevo.",
      };
    }
  }

  // 1. Subir la imagen al bucket con un nombre único.
  const imagePath = `uploads/${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("gallery")
    .upload(imagePath, file, { contentType: file.type });

  if (uploadError) {
    console.error("Error subiendo imagen:", uploadError.message);
    return { error: "No se pudo subir la imagen. Intenta de nuevo." };
  }

  // 2. Obtener la URL pública del archivo recién subido.
  const {
    data: { publicUrl },
  } = supabase.storage.from("gallery").getPublicUrl(imagePath);

  // 3. Registrar la publicación en la base de datos.
  const { error: insertError } = await supabase.from("gallery_posts").insert({
    image_url: publicUrl,
    image_path: imagePath,
    description,
    author_name: authorName,
    concept_id: conceptId,
  });

  if (insertError) {
    // No dejar imágenes huérfanas en el bucket si el registro falló.
    await supabase.storage.from("gallery").remove([imagePath]);
    console.error("Error registrando publicación:", insertError.message);
    return { error: "No se pudo guardar la publicación. Intenta de nuevo." };
  }

  revalidatePath("/");
  return { success: true };
}

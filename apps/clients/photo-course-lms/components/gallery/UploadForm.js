"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { createGalleryPost } from "@/app/actions";
import { MAX_AUTHOR_LENGTH, MAX_FILE_SIZE_MB, stripHtml } from "@/libs/gallery";
import RichTextEditor from "./RichTextEditor";

/**
 * Formulario público para publicar una foto + texto en la galería. Maneja
 * preview de la imagen, estado de carga y feedback con toasts. Si hay
 * conceptos ya revelados (`concepts`), muestra un desplegable para elegir a
 * cuál pertenece la foto; si todavía no se reveló ninguno, se omite y la
 * foto queda como "General". `onSuccess` se invoca tras publicar (p. ej.
 * para cerrar el modal que lo contiene).
 */
export default function UploadForm({ concepts, onSuccess }) {
  const formRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (preview) URL.revokeObjectURL(preview);

    if (!file) {
      setPreview(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error(`La imagen supera el límite de ${MAX_FILE_SIZE_MB} MB.`);
      e.target.value = "";
      setPreview(null);
      return;
    }

    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!stripHtml(description)) {
      toast.error("Escribe un texto para acompañar tu foto.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createGalleryPost(new FormData(e.currentTarget));

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      toast.success("¡Tu foto ya es parte de la galería!");
      formRef.current?.reset();
      if (preview) URL.revokeObjectURL(preview);
      setPreview(null);
      setDescription("");
      onSuccess?.();
    } catch {
      toast.error("Algo salió mal. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="card w-full border border-base-content/15 bg-base-100 shadow-sm"
    >
      <div className="card-body gap-4">
        <h2 className="card-title">Comparte tu fotografía</h2>

        {/* Imagen */}
        <div className="form-control gap-2">
          <label className="label p-0" htmlFor="image">
            <span className="label-text">
              Tu foto (JPG, PNG, WebP o GIF · máx. {MAX_FILE_SIZE_MB} MB)
            </span>
          </label>
          <input
            id="image"
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            required
            disabled={isSubmitting}
            onChange={handleFileChange}
            className="file-input file-input-bordered w-full"
          />
        </div>

        {preview && (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-base-content/15">
            <Image
              src={preview}
              alt="Vista previa de tu foto"
              fill
              unoptimized
              className="object-contain"
            />
          </div>
        )}

        {/* Concepto: solo se muestra si ya hay al menos uno revelado */}
        {concepts?.length > 0 && (
          <div className="form-control gap-2">
            <label className="label p-0" htmlFor="concept_id">
              <span className="label-text">¿A qué concepto pertenece?</span>
            </label>
            <select
              id="concept_id"
              name="concept_id"
              required
              disabled={isSubmitting}
              defaultValue=""
              className="select select-bordered w-full"
            >
              <option value="" disabled>
                Elige un concepto…
              </option>
              {concepts.map((concept) => (
                <option key={concept.id} value={concept.id}>
                  {concept.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Autor */}
        <div className="form-control gap-2">
          <label className="label p-0" htmlFor="author_name">
            <span className="label-text">Tu nombre o usuario (opcional)</span>
          </label>
          <input
            id="author_name"
            name="author_name"
            type="text"
            maxLength={MAX_AUTHOR_LENGTH}
            disabled={isSubmitting}
            placeholder="¿Cómo quieres firmar tu foto?"
            autoComplete="name"
            className="input input-bordered w-full"
          />
        </div>

        {/* Texto (rich text, sin límite de caracteres) */}
        <div className="form-control gap-2">
          <label className="label p-0" htmlFor="description">
            <span className="label-text">¿Qué expresa esta imagen?</span>
          </label>
          <RichTextEditor
            value={description}
            onChange={setDescription}
            disabled={isSubmitting}
            placeholder="Cuenta lo que quieras sobre tu fotografía…"
          />
          {/* FormData lee este input oculto; el editor de texto rico no es
              un elemento de formulario nativo. */}
          <input type="hidden" name="description" value={description} />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn border-0 bg-white text-black hover:bg-white/85 disabled:bg-white/30"
        >
          {isSubmitting ? (
            <>
              <span className="loading loading-spinner loading-sm" />
              Publicando…
            </>
          ) : (
            "Publicar en la galería"
          )}
        </button>
      </div>
    </form>
  );
}

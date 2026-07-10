"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { deleteGalleryPost } from "@/app/admin/actions";

export default function DeletePostButton({ postId }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (
      !window.confirm(
        "¿Borrar esta publicación? La imagen se eliminará y no se puede deshacer."
      )
    ) {
      return;
    }

    setIsDeleting(true);

    try {
      const result = await deleteGalleryPost(postId);

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Publicación borrada");
      // revalidatePath en la action refresca la lista automáticamente.
    } catch {
      toast.error("Algo salió mal. Intenta de nuevo.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="btn btn-outline btn-error btn-sm"
    >
      {isDeleting ? (
        <span className="loading loading-spinner loading-xs" />
      ) : (
        "Borrar"
      )}
    </button>
  );
}

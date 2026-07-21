"use client";

import { useRef, useTransition } from "react";
import toast from "react-hot-toast";
import { addComment, deleteComment } from "@/app/dashboard/actions";

function timeAgo(dateString) {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (seconds < 60) return "hace un momento";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.floor(hours / 24);
  return `hace ${days} d`;
}

// Chat de la clase: preguntas y comentarios de los alumnos.
// El primer comentario en cada clase otorga XP (trigger en DB).
export default function CommentsSection({ assignmentId, comments, userId, isAdmin }) {
  const formRef = useRef(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData) => {
    const body = formData.get("body");

    startTransition(async () => {
      const result = await addComment(assignmentId, body);

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      formRef.current?.reset();
      toast.success("Comentario publicado 💬");
    });
  };

  const handleDelete = (commentId) => {
    startTransition(async () => {
      const result = await deleteComment(commentId, assignmentId);
      if (result?.error) toast.error(result.error);
    });
  };

  return (
    <section className="space-y-4">
      <div className="flex items-baseline justify-between">
        <h3 className="display text-2xl">
          Comentarios<span className="text-primary">.</span>
        </h3>
        <span className="text-[0.65rem] font-bold uppercase tracking-widest opacity-50">
          {comments.length} en el tatami
        </span>
      </div>

      <form ref={formRef} action={handleSubmit} className="space-y-2">
        <textarea
          name="body"
          rows={2}
          required
          maxLength={1000}
          disabled={isPending}
          placeholder="Pregunta, detalle que viste, duda para el profesor..."
          className="textarea textarea-bordered w-full"
        />
        <div className="flex items-center justify-between">
          <span className="text-[0.6rem] font-bold uppercase tracking-widest text-primary">
            Primer comentario de la clase: +5 XP
          </span>
          <button className="btn btn-primary btn-sm" disabled={isPending}>
            {isPending && <span className="loading loading-spinner loading-xs" />}
            Enviar
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {!comments.length && (
          <div className="stripes border border-base-300 p-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest opacity-60">
              Nadie ha comentado todavía. Rompe el hielo.
            </p>
          </div>
        )}

        {comments.map((comment) => {
          const canDelete = isAdmin || comment.student_id === userId;
          const name = comment.profiles?.full_name || "Alumno";

          return (
            <article
              key={comment.id}
              className="border border-base-300 bg-base-200 p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center border border-primary bg-base-100">
                    <span className="display text-xs text-primary">
                      {name.trim().charAt(0).toUpperCase()}
                    </span>
                  </span>
                  <p className="text-xs font-black uppercase tracking-widest">
                    {name}
                    {comment.student_id === userId && (
                      <span className="ml-1 text-primary">(tú)</span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[0.6rem] font-semibold uppercase tracking-widest opacity-40">
                    {timeAgo(comment.created_at)}
                  </span>
                  {canDelete && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      disabled={isPending}
                      aria-label="Borrar comentario"
                      className="opacity-40 transition-opacity hover:text-error hover:opacity-100"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        className="h-3.5 w-3.5"
                      >
                        <path d="M4 7h16M9 7V5h6v2m-8 0 1 13h8l1-13" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed opacity-85">
                {comment.body}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

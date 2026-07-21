import Link from "next/link";
import VideoEmbed from "@/components/rollprep/VideoEmbed";
import CompleteAssignmentButton from "@/components/rollprep/CompleteAssignmentButton";
import CommentsSection from "@/components/rollprep/CommentsSection";
import { createClient } from "@/libs/supabase/server";

// Vista completa de una clase: video, notas, botón de completar (solo si la
// clase está activa) y el hilo de comentarios. La usan /clase y /clase/[id].
export default async function ClassView({ assignment }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: profile }, { data: completion }, { data: comments }] =
    await Promise.all([
      supabase.from("profiles").select("role").eq("id", user.id).single(),
      supabase
        .from("assignment_completions")
        .select("completed_at")
        .eq("assignment_id", assignment.id)
        .eq("student_id", user.id)
        .maybeSingle(),
      supabase
        .from("assignment_comments")
        .select("id, body, created_at, student_id, profiles:student_id (full_name)")
        .eq("assignment_id", assignment.id)
        .order("created_at", { ascending: false }),
    ]);

  const classDate = assignment.scheduled_for ?? assignment.created_at;

  return (
    <main className="min-h-screen bg-base-100 p-4 text-base-content md:p-8">
      <section className="mx-auto max-w-xl space-y-6">
        <div className="rise rise-1 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="tile-cta text-[0.65rem] font-black uppercase tracking-[0.2em] opacity-60 hover:text-primary hover:opacity-100"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="h-3 w-3 rotate-180"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
            Menú
          </Link>
          {assignment.is_active ? (
            <span className="tag-skew blink-soft bg-primary px-3 py-1 text-xs text-primary-content">
              <span>Clase activa</span>
            </span>
          ) : (
            <span className="tag-skew bg-base-300 px-3 py-1 text-xs">
              <span>Archivo</span>
            </span>
          )}
        </div>

        <div className="space-y-1">
          <p className="rise rise-1 text-xs font-bold uppercase tracking-[0.25em] text-primary">
            {new Date(classDate).toLocaleDateString("es-VE", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <h1 className="display rise rise-2 text-4xl md:text-5xl">
            {assignment.title}
          </h1>
        </div>

        <div className="rise rise-3">
          <VideoEmbed videoUrl={assignment.video_url} title={assignment.title} />
        </div>

        {assignment.notes && (
          <div className="rise rise-4 border-l-4 border-primary bg-base-200 p-4">
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-primary">
              Notas del profesor
            </p>
            <p className="whitespace-pre-line text-sm leading-relaxed opacity-80">
              {assignment.notes}
            </p>
          </div>
        )}

        {assignment.is_active && (
          <div className="rise rise-5">
            <CompleteAssignmentButton
              assignmentId={assignment.id}
              isCompleted={Boolean(completion)}
            />
            {!completion && (
              <p className="mt-2 text-center text-[0.65rem] font-bold uppercase tracking-widest text-primary">
                Marcar como estudiada: +50 XP
              </p>
            )}
          </div>
        )}

        <div className="rise rise-5 border-t-2 border-base-300 pt-6">
          <CommentsSection
            assignmentId={assignment.id}
            comments={comments ?? []}
            userId={user.id}
            isAdmin={profile?.role === "admin"}
          />
        </div>
      </section>
    </main>
  );
}

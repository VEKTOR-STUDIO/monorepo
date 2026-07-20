import VideoEmbed from "@/components/rollprep/VideoEmbed";
import { createClient } from "@/libs/supabase/server";

export const dynamic = "force-dynamic";

// Videoteca: archivo histórico de las tareas y temas pasados.
export default async function Videoteca() {
  const supabase = await createClient();

  const { data: assignments } = await supabase
    .from("assignments")
    .select("id, title, video_url, notes, created_at, is_active")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-base-100 p-4 text-base-content md:p-8">
      <section className="mx-auto max-w-xl space-y-8">
        <div className="rise rise-1">
          <span className="tag-skew bg-secondary px-3 py-1 text-xs text-secondary-content">
            <span>Archivo técnico</span>
          </span>
          <h1 className="display mt-4 text-5xl">
            Video<span className="text-primary">teca</span>
          </h1>
          <p className="mt-2 text-sm font-medium opacity-70">
            Todo lo que hemos estudiado, clase por clase.
          </p>
        </div>

        {!assignments?.length && (
          <div className="border border-base-300 bg-base-200 p-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest opacity-60">
              Aún no hay videos en el archivo
            </p>
          </div>
        )}

        <div className="space-y-10">
          {assignments?.map((assignment, index) => (
            <article
              key={assignment.id}
              className="rise rise-2 border border-base-300 bg-base-200"
            >
              <div className="flex items-start gap-4 p-5">
                <span className="display text-stroke select-none text-4xl">
                  {String(assignments.length - index).padStart(2, "0")}
                </span>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="display text-2xl">{assignment.title}</h2>
                    {assignment.is_active && (
                      <span className="tag-skew shrink-0 bg-primary px-2 py-0.5 text-[0.65rem] text-primary-content">
                        <span>Activa</span>
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-widest opacity-50">
                    {new Date(assignment.created_at).toLocaleDateString("es-VE", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <VideoEmbed
                videoUrl={assignment.video_url}
                title={assignment.title}
              />

              {assignment.notes && (
                <p className="whitespace-pre-line p-5 text-sm leading-relaxed opacity-80">
                  {assignment.notes}
                </p>
              )}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

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
    <main className="min-h-screen p-4 md:p-8">
      <section className="mx-auto max-w-xl space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold">Videoteca 📚</h1>
          <p className="opacity-70">
            Todo lo que hemos estudiado, clase por clase.
          </p>
        </div>

        {!assignments?.length && (
          <div className="rounded-2xl bg-base-200 p-10 text-center">
            <p className="opacity-70">Aún no hay videos en el archivo.</p>
          </div>
        )}

        <div className="space-y-8">
          {assignments?.map((assignment) => (
            <article key={assignment.id} className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg font-bold">{assignment.title}</h2>
                {assignment.is_active && (
                  <span className="badge badge-primary badge-sm">Activa</span>
                )}
              </div>
              <p className="text-xs opacity-60">
                {new Date(assignment.created_at).toLocaleDateString("es-VE", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <VideoEmbed
                videoUrl={assignment.video_url}
                title={assignment.title}
              />
              {assignment.notes && (
                <p className="text-sm opacity-80 whitespace-pre-line">
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

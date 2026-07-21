import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/libs/supabase/server";

export const dynamic = "force-dynamic";

// Analíticas históricas de una clase: quién marcó "Visto y Estudiado" y cuántos comentarios hubo.
export default async function ClassAnalytics({ params }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: assignment } = await supabase
    .from("assignments")
    .select("id, title, scheduled_for, is_active")
    .eq("id", id)
    .maybeSingle();

  if (!assignment) notFound();

  const [
    { data: completions },
    { count: studentCount },
    { count: commentCount },
  ] = await Promise.all([
    supabase
      .from("assignment_completions")
      .select("completed_at, profiles:student_id (full_name)")
      .eq("assignment_id", assignment.id)
      .order("completed_at", { ascending: true }),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "student"),
    supabase
      .from("assignment_comments")
      .select("id", { count: "exact", head: true })
      .eq("assignment_id", assignment.id),
  ]);

  return (
    <main className="min-h-screen bg-base-100 p-4 text-base-content md:p-8">
      <section className="mx-auto max-w-xl space-y-6">
        <div className="rise rise-1">
          <Link
            href="/dashboard/admin"
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
            Panel
          </Link>
        </div>

        <div className="rise rise-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="tag-skew bg-base-300 px-3 py-1 text-xs">
              <span>Analíticas</span>
            </span>
            {assignment.is_active && (
              <span className="tag-skew bg-primary px-3 py-1 text-xs text-primary-content">
                <span>Activa</span>
              </span>
            )}
          </div>
          <h1 className="display mt-4 text-4xl md:text-5xl">
            {assignment.title}
            <span className="text-primary">.</span>
          </h1>
          {assignment.scheduled_for && (
            <p className="mt-2 text-xs font-bold uppercase tracking-widest text-primary">
              {new Date(
                `${assignment.scheduled_for}T12:00:00`
              ).toLocaleDateString("es-VE", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          )}
        </div>

        <div className="rise rise-2 grid grid-cols-2 gap-4">
          <div className="border border-base-300 bg-base-200 p-4">
            <div className="flex items-baseline gap-2">
              <span className="display text-5xl text-primary">
                {completions?.length ?? 0}
              </span>
              <span className="display text-stroke text-2xl">
                / {studentCount ?? 0}
              </span>
            </div>
            <p className="mt-1 text-[0.65rem] font-bold uppercase tracking-widest opacity-60">
              Visto y Estudiado
            </p>
          </div>
          <div className="border border-base-300 bg-base-200 p-4">
            <span className="display text-5xl text-primary">
              {commentCount ?? 0}
            </span>
            <p className="mt-1 text-[0.65rem] font-bold uppercase tracking-widest opacity-60">
              Comentario{commentCount === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        <div className="rise rise-3 border border-base-300 bg-base-200">
          <div className="border-b border-base-300 px-6 py-4">
            <h2 className="display text-xl">Quién la completó</h2>
            <p className="mt-1 text-xs font-medium opacity-60">
              Alumnos que marcaron &ldquo;Visto y Estudiado&rdquo;
            </p>
          </div>
          <ul className="space-y-2 p-6 text-sm">
            {completions?.map((completion, i) => (
              <li
                key={i}
                className="flex items-center gap-3 border-l-2 border-primary bg-base-100 px-3 py-2"
              >
                <span className="font-semibold">
                  {completion.profiles?.full_name ?? "Alumno"}
                </span>
                <span className="ml-auto text-xs font-semibold uppercase tracking-wider opacity-50">
                  {new Date(completion.completed_at).toLocaleDateString(
                    "es-VE",
                    { day: "numeric", month: "short", year: "numeric" }
                  )}
                </span>
              </li>
            ))}
            {!completions?.length && (
              <li className="text-sm opacity-60">
                Nadie la ha completado aún.
              </li>
            )}
          </ul>
        </div>
      </section>
    </main>
  );
}

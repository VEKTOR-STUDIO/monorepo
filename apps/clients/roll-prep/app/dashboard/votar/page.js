import Link from "next/link";
import PollVoteCards from "@/components/rollprep/PollVoteCards";
import { createClient } from "@/libs/supabase/server";

export const dynamic = "force-dynamic";

// Votación del próximo tema: el alumno elige entre las opciones del profesor.
export default async function Votar() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: poll } = await supabase
    .from("polls")
    .select("id, question, poll_options (id, title, description)")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let currentVote = null;
  if (poll) {
    ({ data: currentVote } = await supabase
      .from("poll_votes")
      .select("option_id")
      .eq("poll_id", poll.id)
      .eq("student_id", user.id)
      .maybeSingle());
  }

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
          {poll && (
            <span className="tag-skew blink-soft bg-accent px-3 py-1 text-xs text-accent-content">
              <span>Votación abierta</span>
            </span>
          )}
        </div>

        {poll ? (
          <>
            <h1 className="display rise rise-2 text-4xl md:text-5xl">
              {poll.question}
            </h1>

            <p className="rise rise-3 text-sm font-medium opacity-70">
              Elige el tema que quieres estudiar en la próxima clase.
              {!currentVote && (
                <span className="ml-1 font-bold uppercase text-primary">
                  Tu primer voto: +10 XP.
                </span>
              )}
            </p>

            <div className="rise rise-4">
              <PollVoteCards
                poll={poll}
                options={poll.poll_options}
                currentVoteOptionId={currentVote?.option_id ?? null}
              />
            </div>
          </>
        ) : (
          <div className="rise rise-2 stripes relative overflow-hidden border-2 border-base-300 bg-base-200 p-10 text-center">
            <span
              aria-hidden="true"
              className="display text-stroke pointer-events-none absolute -bottom-6 -right-2 select-none text-8xl"
            >
              VOTE
            </span>
            <h1 className="display text-3xl">No hay votación abierta</h1>
            <p className="mt-3 text-sm font-medium opacity-70">
              El profesor abrirá la próxima votación después de la clase del
              jueves. Vuelve pronto.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

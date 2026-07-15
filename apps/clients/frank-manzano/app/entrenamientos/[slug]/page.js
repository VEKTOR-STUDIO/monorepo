import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProgramContent from "@/components/lms/ProgramContent";
import { getProgramBySlug } from "@/libs/lms";
import { LEVEL_LABELS } from "@/libs/lms-utils";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);
  if (!program) return getSEOTags({ title: `Programa | ${config.appName}` });

  return getSEOTags({
    title: `${program.title} | ${config.appName}`,
    description: program.subtitle || program.description,
    canonicalUrlRelative: `/entrenamientos/${slug}`,
  });
}

export default async function ProgramPage({ params }) {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);

  if (!program) notFound();

  const totalExercises = (program.workouts || []).reduce(
    (acc, w) => acc + (w.exercises?.length || 0),
    0
  );

  return (
    <>
      <Suspense>
        <Header />
      </Suspense>

      <main className="pt-24">
        {/* Cabecera del programa */}
        <section className="border-b border-base-300 bg-gradient-to-b from-base-100 to-base-200/50 px-6 py-12 sm:px-8 md:py-16">
          <div className="mx-auto max-w-6xl">
            <Link
              href="/entrenamientos"
              className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-base-content/60 hover:text-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
              </svg>
              Todos los entrenamientos
            </Link>

            <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wide text-base-content/50">
              {program.category && (
                <span className="rounded-md bg-primary/10 px-2 py-1 font-semibold text-primary">
                  {program.category}
                </span>
              )}
              <span>{LEVEL_LABELS[program.level] || program.level}</span>
              {program.duration_weeks ? <span>· {program.duration_weeks} semanas</span> : null}
              {(program.workouts || []).length > 0 && (
                <span>· {program.workouts.length} sesiones</span>
              )}
              {totalExercises > 0 && <span>· {totalExercises} ejercicios</span>}
            </div>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-base-content sm:text-4xl">
              {program.title}
            </h1>
            {program.subtitle && (
              <p className="mt-2 text-lg text-base-content/80">{program.subtitle}</p>
            )}
            {program.description && (
              <p className="mt-3 max-w-3xl text-sm text-base-content/70">
                {program.description}
              </p>
            )}
          </div>
        </section>

        {/* Contenido: reproductor + sesiones */}
        <section className="px-6 py-10 sm:px-8 md:py-14">
          <div className="mx-auto max-w-6xl">
            <ProgramContent workouts={program.workouts || []} />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

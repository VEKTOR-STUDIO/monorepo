import { Suspense } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProgramCard from "@/components/lms/ProgramCard";
import VideoLibrary from "@/components/lms/VideoLibrary";
import { getPrograms, getVideos } from "@/libs/lms";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

export const dynamic = "force-dynamic";

export const metadata = getSEOTags({
  title: `Entrenamientos | ${config.appName}`,
  description:
    "Programas de entrenamiento funcional, rutinas y videos guiados. Entrena con método desde cualquier lugar.",
  canonicalUrlRelative: "/entrenamientos",
});

export default async function EntrenamientosPage() {
  const [programs, videos] = await Promise.all([getPrograms(), getVideos()]);

  return (
    <>
      <Suspense>
        <Header />
      </Suspense>

      <main className="pt-24">
        {/* Encabezado */}
        <section className="relative overflow-hidden border-b border-base-300 bg-base-200 px-6 py-20 sm:px-8 md:py-24">
          <span
            aria-hidden="true"
            className="display text-stroke pointer-events-none absolute -right-2 top-2 select-none text-[7rem] leading-none opacity-50 md:text-[13rem]"
          >
            VOD
          </span>
          <div className="relative mx-auto max-w-5xl text-center">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Área de entrenamiento
            </p>
            <h1 className="display mb-4 text-5xl text-base-content sm:text-6xl md:text-7xl">
              Entrena con método
            </h1>
            <p className="mx-auto max-w-2xl text-base text-base-content/60 md:text-lg">
              Programas de entrenamiento funcional, rutinas por sesión y videos
              guiados paso a paso. Elige tu plan y empieza a moverte mejor.
            </p>
          </div>
        </section>

        {/* Programas */}
        <section className="px-6 py-16 sm:px-8 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <h2 className="display text-3xl text-base-content sm:text-4xl">
                  Programas
                </h2>
                <p className="mt-1 text-sm text-base-content/60">
                  Planes completos con progresión semanal.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {programs.map((program) => (
                <ProgramCard key={program.id} program={program} />
              ))}
            </div>
          </div>
        </section>

        {/* Biblioteca de video */}
        {videos.length > 0 && (
          <section className="border-t border-base-300 bg-base-200 px-6 py-16 sm:px-8 md:py-20">
            <div className="mx-auto max-w-6xl">
              <div className="mb-8">
                <h2 className="display text-3xl text-base-content sm:text-4xl">
                  Biblioteca de video
                </h2>
                <p className="mt-1 text-sm text-base-content/60">
                  Clases sueltas de técnica, movilidad y teoría.
                </p>
              </div>
              <VideoLibrary videos={videos} />
            </div>
          </section>
        )}

        {/* CTA volver */}
        <section className="px-6 py-12 sm:px-8">
          <div className="mx-auto max-w-6xl text-center">
            <Link
              href="/"
              className="text-sm font-medium text-base-content/60 hover:text-primary"
            >
              ← Volver al inicio
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

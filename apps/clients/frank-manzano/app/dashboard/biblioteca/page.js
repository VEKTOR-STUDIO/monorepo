import ExerciseBook from "@/components/training/ExerciseBook";
import { getBookFilters, getExerciseBook } from "@/libs/training";
import config from "@/config";

export const dynamic = "force-dynamic";

export const metadata = { title: `Libro de ejercicios | ${config.appName}` };

export default async function ExerciseBookPage() {
  const [exercises, filters] = await Promise.all([getExerciseBook(), getBookFilters()]);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-primary">
          Libro de entrenamiento
        </p>
        <h1 className="display mt-1 text-4xl text-base-content sm:text-5xl">
          Todos los ejercicios
        </h1>
        <p className="mt-2 max-w-2xl text-base-content/60">
          Busca cualquier ejercicio y mira cómo se hace. Toca uno para verlo en grande.
        </p>
      </header>

      {exercises.length === 0 ? (
        <p className="border border-dashed border-base-300 p-10 text-center text-base-content/60">
          El libro está vacío. Ejecuta{" "}
          <code className="text-primary">supabase/seeds/exercise_library_seed.sql</code> en
          Supabase para cargar los 302 ejercicios.
        </p>
      ) : (
        <ExerciseBook exercises={exercises} filters={filters} />
      )}
    </div>
  );
}

import ExerciseBook from "@/components/training/ExerciseBook";
import NewLibraryExercise from "@/components/admin/NewLibraryExercise";
import { getBookFilters, getExerciseBook } from "@/libs/training";

export const dynamic = "force-dynamic";

export default async function AdminLibraryPage() {
  const [exercises, filters] = await Promise.all([getExerciseBook(), getBookFilters()]);

  // Para el desplegable de "reutilizar animación" solo hacen falta los que la tienen.
  const animations = exercises
    .filter((exercise) => exercise.animation_slug)
    .map((exercise) => ({
      slug: exercise.slug,
      name: exercise.name,
      animation_slug: exercise.animation_slug,
    }));

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-4xl text-base-content sm:text-5xl">
            Libro de ejercicios
          </h1>
          <p className="mt-2 max-w-2xl text-base-content/60">
            {exercises.length} ejercicios con su animación. Es de donde eliges al armar
            las sesiones de un plan.
          </p>
        </div>
        <NewLibraryExercise animations={animations} />
      </header>

      {exercises.length === 0 ? (
        <div className="border border-dashed border-base-300 p-10 text-center">
          <p className="display text-2xl text-base-content">El libro está vacío</p>
          <p className="mx-auto mt-3 max-w-lg text-sm text-base-content/60">
            Ejecuta el archivo{" "}
            <code className="text-primary">supabase/seeds/exercise_library_seed.sql</code>{" "}
            en el editor SQL de Supabase para cargar los 302 ejercicios con animación.
          </p>
        </div>
      ) : (
        <ExerciseBook exercises={exercises} filters={filters} />
      )}
    </div>
  );
}

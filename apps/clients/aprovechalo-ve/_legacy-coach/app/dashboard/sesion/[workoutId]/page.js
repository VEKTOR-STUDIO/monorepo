import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import WorkoutRunner from "@/components/training/WorkoutRunner";
import { getCurrentUser, getWorkoutDetail } from "@/libs/training";
import config from "@/config";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { workoutId } = await params;
  const workout = await getWorkoutDetail(workoutId);
  return { title: `${workout?.title || "Sesión"} | ${config.appName}` };
}

export default async function SessionPage({ params, searchParams }) {
  const { user } = await getCurrentUser();
  if (!user) redirect(config.auth.loginUrl);

  const { workoutId } = await params;
  const { plan } = await searchParams;

  // Si RLS no deja leerla, la sesión no es de este alumno: 404 sin dar pistas.
  const workout = await getWorkoutDetail(workoutId);
  if (!workout) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard/plan"
          className="text-sm font-medium text-base-content/50 hover:text-primary"
        >
          ← Volver a mi plan
        </Link>
        <p className="mt-3 text-xs uppercase tracking-[0.16em] text-primary">
          {workout.programs?.title}
        </p>
        <h1 className="display text-4xl text-base-content sm:text-5xl">{workout.title}</h1>
        {workout.description && (
          <p className="mt-2 max-w-2xl text-base-content/70">{workout.description}</p>
        )}
      </div>

      <WorkoutRunner workout={workout} assignmentId={plan || null} />
    </div>
  );
}

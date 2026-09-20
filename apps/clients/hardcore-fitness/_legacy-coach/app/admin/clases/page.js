import ClassManager from "@/components/admin/ClassManager";
import { getClasses } from "@/libs/training";

export const dynamic = "force-dynamic";

export default async function ClassesPage() {
  const classes = await getClasses();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="display text-4xl text-base-content sm:text-5xl">Clases</h1>
        <p className="mt-2 max-w-2xl text-base-content/60">
          Clases con día, hora y número de plazas. Los alumnos ven las publicadas y se
          apuntan; cuando se llena el cupo, la web deja de aceptar reservas.
        </p>
      </header>

      <ClassManager classes={classes} />
    </div>
  );
}

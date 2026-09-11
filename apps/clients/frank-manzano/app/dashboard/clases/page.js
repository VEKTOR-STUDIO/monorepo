import { redirect } from "next/navigation";
import ClassList from "@/components/training/ClassList";
import { getCurrentUser, getUpcomingClasses } from "@/libs/training";
import config from "@/config";

export const dynamic = "force-dynamic";

export const metadata = { title: `Clases | ${config.appName}` };

export default async function ClassesPage() {
  const { user } = await getCurrentUser();
  if (!user) redirect(config.auth.loginUrl);

  const classes = await getUpcomingClasses(user.id);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="display text-4xl text-base-content sm:text-5xl">Clases</h1>
        <p className="mt-2 max-w-2xl text-base-content/60">
          Apúntate a las clases con cupo. Si no puedes ir, anula tu plaza para que la
          aproveche otro compañero.
        </p>
      </header>

      <ClassList classes={classes} />
    </div>
  );
}

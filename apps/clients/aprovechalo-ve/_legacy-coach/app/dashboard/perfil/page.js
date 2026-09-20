import { redirect } from "next/navigation";
import ProfileForm from "@/components/training/ProfileForm";
import { getCurrentUser } from "@/libs/training";
import config from "@/config";

export const dynamic = "force-dynamic";

export const metadata = { title: `Mis datos | ${config.appName}` };

export default async function ProfilePage() {
  const { user, profile } = await getCurrentUser();
  if (!user) redirect(config.auth.loginUrl);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="display text-4xl text-base-content sm:text-5xl">Mis datos</h1>
        <p className="mt-2 text-base-content/60">
          Esta información la ve tu entrenador para ajustar tu plan.
        </p>
      </header>

      <ProfileForm profile={profile} email={user.email} />

      {profile?.level && (
        <p className="text-sm text-base-content/50">
          Nivel asignado por el entrenador: <strong>{profile.level}</strong>
        </p>
      )}
    </div>
  );
}

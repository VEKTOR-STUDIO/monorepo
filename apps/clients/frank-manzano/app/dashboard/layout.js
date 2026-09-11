import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getCurrentUser, displayNameOf } from "@/libs/training";
import AthleteNav from "@/components/training/AthleteNav";
import SignOutButton from "@/components/SignOutButton";
import config from "@/config";

export const dynamic = "force-dynamic";

// Marco del área de atletas: cabecera con el nombre, navegación y salir.
export default async function AthleteLayout({ children }) {
  const { user, profile, isAdmin } = await getCurrentUser();

  if (!user) redirect(config.auth.loginUrl);

  const name = displayNameOf(user, profile);
  const avatar =
    profile?.image ||
    user.user_metadata?.avatar_url ||
    `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(name)}`;

  return (
    <div className="min-h-screen bg-base-100">
      <header className="border-b border-base-300 bg-base-200/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/" className="display text-xl leading-none">
            Frank<span className="text-primary">Manzano</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden text-right sm:block">
              <span className="block text-sm font-bold text-base-content">{name}</span>
              <span className="block text-xs text-base-content/45">{user.email}</span>
            </span>
            <span className="h-10 w-10 overflow-hidden border border-base-300">
              <Image
                src={avatar}
                alt=""
                width={40}
                height={40}
                className="h-full w-full object-cover"
                unoptimized
              />
            </span>
            <SignOutButton className="btn btn-ghost btn-sm border border-base-300 text-base-content/70" />
          </div>
        </div>
      </header>

      <AthleteNav isAdmin={isAdmin} />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-10">{children}</main>
    </div>
  );
}

import { redirect } from "next/navigation";
import Link from "next/link";
import AdminNav from "@/components/admin/AdminNav";
import SignOutButton from "@/components/SignOutButton";
import { getCurrentUser, displayNameOf } from "@/libs/training";
import config from "@/config";

export const dynamic = "force-dynamic";

export const metadata = { title: `Panel del entrenador | ${config.appName}` };

// El middleware ya exige sesión. Aquí comprobamos que además sea el entrenador:
// un alumno que escriba /admin a mano acaba en su propia pantalla.
export default async function AdminLayout({ children }) {
  const { user, profile, isAdmin } = await getCurrentUser();

  if (!user) redirect(config.auth.loginUrl);
  if (!isAdmin) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-base-100">
      <header className="border-b border-base-300 bg-base-200/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="display text-xl leading-none">
              Frank<span className="text-primary">Manzano</span>
            </Link>
            <span className="border border-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
              Entrenador
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-right sm:block">
              <span className="block text-sm font-bold text-base-content">
                {displayNameOf(user, profile)}
              </span>
              <span className="block text-xs text-base-content/45">{user.email}</span>
            </span>
            <SignOutButton className="btn btn-ghost btn-sm border border-base-300 text-base-content/70" />
          </div>
        </div>
      </header>

      <AdminNav />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-10">{children}</main>
    </div>
  );
}

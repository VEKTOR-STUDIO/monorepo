import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getSEOTags } from "@/libs/seo";
import { createClient } from "@/libs/supabase/server";
import { createAdminClient } from "@/libs/supabase/admin";
import { stripHtml } from "@/libs/gallery";
import DeletePostButton from "@/components/admin/DeletePostButton";
import config from "@/config";

export const metadata = getSEOTags({
  title: `Administración — ${config.appName}`,
  canonicalUrlRelative: "/admin",
});

export const dynamic = "force-dynamic";

/**
 * Panel del administrador: lista todas las publicaciones de la galería
 * y permite borrarlas. Requiere sesión con role = 'admin' en profiles
 * (ver supabase/gallery-schema.sql para promover al facilitador).
 */
export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(config.auth.loginUrl);

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/");

  const [{ data: posts }, { data: concepts }] = await Promise.all([
    admin
      .from("gallery_posts")
      .select("id, image_url, description, author_name, created_at, concept_id")
      .order("created_at", { ascending: false }),
    admin
      .from("gallery_concepts")
      .select("id, name")
      .order("sort_order", { ascending: true }),
  ]);

  const conceptNameById = new Map((concepts || []).map((c) => [c.id, c.name]));

  return (
    <main className="mx-auto max-w-4xl px-4 pb-24">
      <header className="flex flex-wrap items-center justify-between gap-4 py-10">
        <div>
          <h1 className="text-2xl font-extrabold md:text-3xl">
            Administración de la galería
          </h1>
          <p className="text-sm opacity-60">
            {posts?.length || 0}{" "}
            {posts?.length === 1 ? "publicación" : "publicaciones"}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/conceptos" className="btn btn-outline btn-sm">
            Gestionar conceptos
          </Link>
          <Link href="/" className="btn btn-outline btn-sm">
            Ver la galería
          </Link>
        </div>
      </header>

      {!posts?.length ? (
        <p className="py-16 text-center opacity-60">
          No hay publicaciones todavía.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {posts.map((post) => {
            const plainText = stripHtml(post.description);
            const conceptName = post.concept_id
              ? conceptNameById.get(post.concept_id) || "Concepto borrado"
              : "General";
            return (
              <li
                key={post.id}
                className="flex items-center gap-4 rounded-xl border border-base-content/15 bg-base-100 p-3"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-base-content/5">
                  <Image
                    src={post.image_url}
                    alt={plainText}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm">{plainText}</p>
                  <p className="mt-1 flex flex-wrap items-center gap-2 text-xs opacity-50">
                    <span className="badge badge-ghost badge-xs">
                      {conceptName}
                    </span>
                    {post.author_name || "Anónimo"} ·{" "}
                    {new Date(post.created_at).toLocaleDateString("es", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <DeletePostButton postId={post.id} />
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { getSEOTags } from "@/libs/seo";
import { createClient } from "@/libs/supabase/server";
import { createAdminClient } from "@/libs/supabase/admin";
import ConceptForm from "@/components/admin/ConceptForm";
import ConceptRow from "@/components/admin/ConceptRow";
import config from "@/config";

export const metadata = getSEOTags({
  title: `Conceptos — ${config.appName}`,
  canonicalUrlRelative: "/admin/conceptos",
});

export const dynamic = "force-dynamic";

/**
 * Panel para gestionar los "conceptos" del taller (p. ej. "masa confusa"):
 * crearlos, revelarlos/ocultarlos, programar su revelado automático,
 * reordenarlos y borrarlos. Requiere sesión con role = 'admin' en profiles
 * (mismo guard que /admin).
 */
export default async function ConceptsAdminPage() {
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

  const [{ data: concepts }, { data: posts }] = await Promise.all([
    admin
      .from("gallery_concepts")
      .select("id, name, sort_order, is_revealed, reveal_at, created_at")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true }),
    admin.from("gallery_posts").select("concept_id"),
  ]);

  const postCountByConcept = new Map();
  for (const post of posts || []) {
    if (!post.concept_id) continue;
    postCountByConcept.set(
      post.concept_id,
      (postCountByConcept.get(post.concept_id) || 0) + 1
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 pb-24">
      <header className="flex flex-wrap items-center justify-between gap-4 py-10">
        <div>
          <h1 className="text-2xl font-extrabold md:text-3xl">
            Conceptos del taller
          </h1>
          <p className="max-w-lg text-sm opacity-60">
            Cada foto se puede asociar a un concepto (p. ej. &ldquo;masa
            confusa&rdquo;). Los participantes solo ven en el desplegable de
            subida y en la galería los conceptos ya revelados — así podés ir
            liberándolos de a poco.
          </p>
        </div>
        <Link href="/admin" className="btn btn-outline btn-sm">
          Volver a moderación
        </Link>
      </header>

      <div className="flex flex-col gap-6">
        <ConceptForm />

        {!concepts?.length ? (
          <p className="py-10 text-center opacity-60">
            Todavía no creaste ningún concepto.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {concepts.map((concept) => (
              <ConceptRow
                key={concept.id}
                concept={concept}
                postCount={postCountByConcept.get(concept.id) || 0}
              />
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

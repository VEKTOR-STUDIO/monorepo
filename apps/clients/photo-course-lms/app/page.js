import { getSEOTags } from "@/libs/seo";
import { createClient } from "@/libs/supabase/server";
import PhotoGallery from "@/components/gallery/PhotoGallery";
import UploadModal from "@/components/gallery/UploadModal";
import config from "@/config";

export const metadata = getSEOTags({
  title: `${config.appName} — Galería del taller`,
  canonicalUrlRelative: "/",
});

export const dynamic = "force-dynamic";

/**
 * Trae los conceptos ya revelados (la política RLS de `gallery_concepts`
 * oculta el resto automáticamente) y las publicaciones. Las fotos con un
 * concepto que todavía no está revelado (o que dejó de estarlo) se
 * excluyen de la galería pública; las que no tienen concepto se muestran
 * siempre, agrupadas como "General".
 */
async function getGalleryData() {
  const supabase = await createClient();

  const [{ data: concepts, error: conceptsError }, { data: posts, error: postsError }] =
    await Promise.all([
      supabase
        .from("gallery_concepts")
        .select("id, name, sort_order")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
      supabase
        .from("gallery_posts")
        .select("id, image_url, description, author_name, created_at, concept_id")
        .order("created_at", { ascending: false }),
    ]);

  if (conceptsError) {
    console.error("Error cargando los conceptos:", conceptsError.message);
  }
  if (postsError) {
    console.error("Error cargando la galería:", postsError.message);
  }

  const revealedConcepts = concepts || [];
  const revealedConceptIds = new Set(revealedConcepts.map((c) => c.id));
  const conceptNameById = new Map(revealedConcepts.map((c) => [c.id, c.name]));

  const visiblePosts = (posts || [])
    .filter((post) => !post.concept_id || revealedConceptIds.has(post.concept_id))
    .map((post) => ({
      ...post,
      concept_name: post.concept_id
        ? conceptNameById.get(post.concept_id)
        : null,
    }));

  return { concepts: revealedConcepts, posts: visiblePosts };
}

export default async function Page() {
  const { concepts, posts } = await getGalleryData();

  return (
    <main className="mx-auto max-w-6xl px-4 pb-28">
      {/* Encabezado del taller */}
      <header className="flex flex-col items-center gap-3 py-12 text-center md:py-16">
        <p className="text-xs uppercase tracking-[0.3em] opacity-50">
          Taller de Mediación Artística y Psicoanálisis Junguiano
        </p>
        <h1 className="max-w-3xl text-3xl font-extrabold uppercase leading-tight md:text-5xl">
          Fotografía como expresión del ser
        </h1>
        <p className="max-w-xl text-sm opacity-70 md:text-base">
          La galería colectiva del taller. Haz clic en cualquier fotografía
          para verla en grande con su historia, y comparte la tuya con el
          botón&nbsp;+
        </p>
      </header>

      {/* La galería es la protagonista */}
      <PhotoGallery posts={posts} concepts={concepts} />

      {/* Botón flotante + modal de subida */}
      <UploadModal concepts={concepts} />

      <footer className="mt-16 pb-4 text-center text-xs uppercase tracking-widest opacity-40">
        {posts.length} {posts.length === 1 ? "fotografía" : "fotografías"} · vas
        hermeticum
      </footer>
    </main>
  );
}

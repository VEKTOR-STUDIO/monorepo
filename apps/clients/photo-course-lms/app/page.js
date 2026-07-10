import { getSEOTags } from "@/libs/seo";
import { createClient } from "@/libs/supabase/server";
import PhotoGallery from "@/components/gallery/PhotoGallery";
import UploadModal from "@/components/gallery/UploadModal";
import config from "@/config";

export const metadata = getSEOTags({
  title: `${config.appName} — Galería del taller`,
  canonicalUrlRelative: "/",
});

async function getGalleryPosts() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("gallery_posts")
    .select("id, image_url, description, author_name, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error cargando la galería:", error.message);
    return [];
  }

  return data;
}

export default async function Page() {
  const posts = await getGalleryPosts();

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
      <PhotoGallery posts={posts} />

      {/* Botón flotante + modal de subida */}
      <UploadModal />

      <footer className="mt-16 pb-4 text-center text-xs uppercase tracking-widest opacity-40">
        {posts.length} {posts.length === 1 ? "fotografía" : "fotografías"} · vas
        hermeticum
      </footer>
    </main>
  );
}

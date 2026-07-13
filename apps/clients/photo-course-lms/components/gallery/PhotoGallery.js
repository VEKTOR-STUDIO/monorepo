"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import Lightbox from "./Lightbox";
import { stripHtml } from "@/libs/gallery";

// Patrón bento: en un ciclo de 10 fotos hay una protagonista (2×2),
// una vertical (1×2) y una panorámica (2×1); el resto son 1×1.
// grid-flow-dense rellena los huecos para que el mosaico quede compacto.
function bentoSpan(index) {
  const position = index % 10;
  if (position === 0) return "col-span-2 row-span-2";
  if (position === 5) return "row-span-2";
  if (position === 8) return "col-span-2";
  return "";
}

/**
 * Mosaico bento de la galería. Las fotos entran con un stagger de GSAP y
 * al hacer clic se abren en grande (Lightbox) junto a su texto y autor.
 * Si hay conceptos revelados (`concepts`), se muestran pestañas para
 * filtrar ("Todas" + "General" para las fotos sin concepto + una por cada
 * concepto revelado); si no hay ninguno, la galería es un solo feed plano
 * como antes.
 */
export default function PhotoGallery({ posts, concepts }) {
  const gridRef = useRef(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  const hasGeneralPosts = useMemo(
    () => (posts || []).some((post) => !post.concept_id),
    [posts]
  );

  const tabs = useMemo(() => {
    const list = [{ id: "all", label: "Todas" }];
    if (hasGeneralPosts) list.push({ id: "general", label: "General" });
    for (const concept of concepts || []) {
      list.push({ id: concept.id, label: concept.name });
    }
    return list;
  }, [concepts, hasGeneralPosts]);

  const filteredPosts = useMemo(() => {
    const all = posts || [];
    if (activeTab === "all") return all;
    if (activeTab === "general") return all.filter((post) => !post.concept_id);
    return all.filter((post) => post.concept_id === activeTab);
  }, [posts, activeTab]);

  useEffect(() => {
    if (!gridRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-gallery-item]",
        { autoAlpha: 0, y: 32, scale: 0.96 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.06,
        }
      );
    }, gridRef);

    return () => ctx.revert();
  }, [filteredPosts.length, activeTab]);

  if (!posts?.length) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-base-content/20 py-20 text-center opacity-70">
        <p className="text-3xl">📷</p>
        <p className="font-medium">La galería está esperando su primera foto</p>
        <p className="text-sm">Sé quien comience: pulsa el botón +</p>
      </div>
    );
  }

  return (
    <>
      {tabs.length > 1 && (
        <div
          role="tablist"
          className="mb-6 flex flex-wrap justify-center gap-2"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`btn btn-sm ${
                activeTab === tab.id ? "btn-neutral" : "btn-outline"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {filteredPosts.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-base-content/20 py-20 text-center opacity-70">
          <p className="text-3xl">📷</p>
          <p className="font-medium">Todavía no hay fotos en este concepto</p>
          <p className="text-sm">Sé quien comience: pulsa el botón +</p>
        </div>
      ) : (
        <div
          ref={gridRef}
          className="grid auto-rows-[9rem] grid-flow-dense grid-cols-2 gap-2 sm:auto-rows-[11rem] md:grid-cols-4 md:gap-3 lg:auto-rows-[13rem]"
        >
          {filteredPosts.map((post, index) => {
            const plainText = stripHtml(post.description);
            return (
              <button
                key={post.id}
                type="button"
                data-gallery-item
                onClick={() => setSelectedPost(post)}
                aria-label={`Ver en grande: ${plainText}`}
                className={`group relative cursor-pointer overflow-hidden rounded-xl bg-base-content/5 outline-none focus-visible:ring-2 focus-visible:ring-base-content ${bentoSpan(index)}`}
              >
                <Image
                  src={post.image_url}
                  alt={plainText}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Firma del autor al hacer hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <p className="absolute bottom-2 left-3 right-3 truncate text-left text-xs text-white/90">
                    {post.author_name || "Anónimo"}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {selectedPost && (
        <Lightbox post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}
    </>
  );
}

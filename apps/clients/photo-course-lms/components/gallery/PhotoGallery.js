"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Lightbox from "./Lightbox";

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
 */
export default function PhotoGallery({ posts }) {
  const gridRef = useRef(null);
  const [selectedPost, setSelectedPost] = useState(null);

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
  }, [posts?.length]);

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
      <div
        ref={gridRef}
        className="grid auto-rows-[9rem] grid-flow-dense grid-cols-2 gap-2 sm:auto-rows-[11rem] md:grid-cols-4 md:gap-3 lg:auto-rows-[13rem]"
      >
        {posts.map((post, index) => (
          <button
            key={post.id}
            type="button"
            data-gallery-item
            onClick={() => setSelectedPost(post)}
            aria-label={`Ver en grande: ${post.description}`}
            className={`group relative cursor-pointer overflow-hidden rounded-xl bg-base-content/5 outline-none focus-visible:ring-2 focus-visible:ring-base-content ${bentoSpan(index)}`}
          >
            <Image
              src={post.image_url}
              alt={post.description}
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
        ))}
      </div>

      {selectedPost && (
        <Lightbox post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}
    </>
  );
}

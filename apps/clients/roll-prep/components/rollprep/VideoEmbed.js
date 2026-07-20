import { getVideoEmbed } from "@/libs/rollprep";

// Embebe un video de YouTube o Instagram. Si la URL no es reconocida,
// muestra un link externo como fallback.
export default function VideoEmbed({ videoUrl, title }) {
  const { type, embedUrl } = getVideoEmbed(videoUrl);

  if (type === "youtube") {
    return (
      <div className="aspect-video w-full overflow-hidden border border-base-300 bg-black">
        <iframe
          src={embedUrl}
          title={title}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (type === "instagram") {
    return (
      <div className="aspect-[4/5] w-full overflow-hidden border border-base-300 bg-black">
        <iframe
          src={embedUrl}
          title={title}
          className="h-full w-full"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <a
      href={videoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-outline btn-block"
    >
      Ver video
    </a>
  );
}

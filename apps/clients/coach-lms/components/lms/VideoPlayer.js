"use client";

import { getVideoEmbed } from "@/libs/lms-utils";

const VideoPlayer = ({ url, title = "Video", className = "" }) => {
  const embed = getVideoEmbed(url);

  if (!embed) {
    return (
      <div
        className={`aspect-video w-full rounded-md border border-base-300 bg-base-200 flex items-center justify-center text-base-content/40 text-sm ${className}`}
      >
        Video no disponible
      </div>
    );
  }

  return (
    <div
      className={`aspect-video w-full overflow-hidden rounded-md border border-base-300 bg-black shadow-sm ${className}`}
    >
      {embed.type === "file" ? (
        <video src={embed.src} controls className="h-full w-full" title={title} />
      ) : (
        <iframe
          src={embed.src}
          title={title}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      )}
    </div>
  );
};

export default VideoPlayer;

"use client";

import { useState } from "react";
import VideoPlayer from "@/components/lms/VideoPlayer";
import { formatDuration, LEVEL_LABELS } from "@/libs/lms-utils";

const VideoLibrary = ({ videos = [] }) => {
  const [active, setActive] = useState(videos[0] || null);

  if (!videos.length) return null;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <div className="lg:sticky lg:top-24">
          {active && (
            <>
              <VideoPlayer url={active.video_url} title={active.title} />
              <h3 className="mt-3 text-base font-semibold text-base-content">
                {active.title}
              </h3>
              {active.description && (
                <p className="mt-1 text-sm text-base-content/70">{active.description}</p>
              )}
            </>
          )}
        </div>
      </div>

      <div className="space-y-2 lg:col-span-2">
        {videos.map((v) => {
          const isActive = active?.id === v.id;
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => setActive(v)}
              className={`flex w-full items-start gap-3 rounded-md border p-3 text-left transition-colors ${
                isActive
                  ? "border-primary/50 bg-primary/5"
                  : "border-base-300 bg-base-100 hover:bg-base-200/60"
              }`}
            >
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-primary/40 text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <span className="flex-1">
                <span className="flex items-center gap-2">
                  <span className="text-sm font-medium text-base-content">{v.title}</span>
                  {v.is_free_preview && (
                    <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-primary">
                      Gratis
                    </span>
                  )}
                </span>
                <span className="mt-0.5 block text-xs text-base-content/50">
                  {[
                    v.category,
                    LEVEL_LABELS[v.level] || v.level,
                    formatDuration(v.duration_seconds),
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default VideoLibrary;

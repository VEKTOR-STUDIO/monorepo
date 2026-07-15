import Link from "next/link";
import Image from "next/image";
import { LEVEL_LABELS } from "@/libs/lms-utils";

const ProgramCard = ({ program }) => {
  const {
    slug,
    title,
    subtitle,
    level,
    category,
    cover_image_url,
    duration_weeks,
    sessions_count,
  } = program;

  return (
    <Link
      href={`/entrenamientos/${slug}`}
      className="group flex flex-col overflow-hidden rounded-md border border-base-300 bg-base-100 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-base-200">
        {cover_image_url ? (
          <Image
            src={cover_image_url}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-base-200 to-base-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-base-content/20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        )}
        {category && (
          <span className="absolute left-3 top-3 rounded-md bg-base-100/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
            {category}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-wide text-base-content/50">
          <span>{LEVEL_LABELS[level] || level}</span>
          {duration_weeks ? (
            <>
              <span aria-hidden>·</span>
              <span>{duration_weeks} semanas</span>
            </>
          ) : null}
          {sessions_count ? (
            <>
              <span aria-hidden>·</span>
              <span>{sessions_count} sesiones</span>
            </>
          ) : null}
        </div>
        <h3 className="text-lg font-semibold text-base-content group-hover:text-primary">
          {title}
        </h3>
        {subtitle && (
          <p className="mt-1 text-sm text-base-content/70">{subtitle}</p>
        )}
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
          Ver programa
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </span>
      </div>
    </Link>
  );
};

export default ProgramCard;

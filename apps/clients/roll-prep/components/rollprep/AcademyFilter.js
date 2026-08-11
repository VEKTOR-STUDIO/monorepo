import Link from "next/link";

// Chips para filtrar un ranking por academia, con la chapa de cada una.
//
// `basePath` es la ruta del tablero y `params` los otros filtros vigentes
// (el tipo de evento en el CAOS, por ejemplo): se conservan al cambiar de
// academia para que un filtro no borre al otro.
export default function AcademyFilter({
  academies,
  activeSlug,
  basePath,
  params = {},
}) {
  if (!academies.length) return null;

  const hrefFor = (slug) => {
    const search = new URLSearchParams(
      Object.entries(params).filter(([, value]) => Boolean(value))
    );
    if (slug) search.set("academia", slug);

    const query = search.toString();
    return query ? `${basePath}?${query}` : basePath;
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={hrefFor(null)}
        className={`tag-skew border-2 px-3 py-1 text-[0.6rem] ${
          activeSlug
            ? "border-base-300 opacity-60 hover:opacity-100"
            : "border-primary bg-primary text-primary-content"
        }`}
      >
        <span>Todo el gym</span>
      </Link>

      {academies.map((academy) => {
        const isActive = academy.slug === activeSlug;

        return (
          <Link
            key={academy.slug}
            href={hrefFor(academy.slug)}
            className={`tag-skew border-2 px-3 py-1 text-[0.6rem] ${
              isActive ? "text-white" : "opacity-60 hover:opacity-100"
            }`}
            style={{
              borderColor: academy.color,
              backgroundColor: isActive ? academy.color : "transparent",
            }}
          >
            <span>{academy.name}</span>
          </Link>
        );
      })}
    </div>
  );
}

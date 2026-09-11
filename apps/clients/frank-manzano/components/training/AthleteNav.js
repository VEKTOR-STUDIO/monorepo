"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Navegación del área de atletas. Pocas opciones, nombres claros y siempre
// visibles: nada de menús escondidos.
const LINKS = [
  { href: "/dashboard", label: "Inicio", exact: true },
  { href: "/dashboard/plan", label: "Mi plan" },
  { href: "/dashboard/biblioteca", label: "Ejercicios" },
  { href: "/dashboard/clases", label: "Clases" },
  { href: "/dashboard/ranking", label: "Ranking" },
  { href: "/dashboard/logros", label: "Medallas" },
  { href: "/dashboard/perfil", label: "Mis datos" },
];

const AthleteNav = ({ isAdmin = false }) => {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-30 border-b border-base-300 bg-base-100/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-4 py-2 sm:px-6">
        {LINKS.map((link) => {
          const active = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`shrink-0 px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] transition-colors ${
                active
                  ? "border-b-2 border-primary text-primary"
                  : "border-b-2 border-transparent text-base-content/50 hover:text-base-content"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
        {isAdmin && (
          <Link
            href="/admin"
            className="ml-auto shrink-0 px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-accent hover:text-accent/80"
          >
            Panel entrenador →
          </Link>
        )}
      </div>
    </nav>
  );
};

export default AthleteNav;

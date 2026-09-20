"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Panel del entrenador. Seis secciones, nombres en cristiano, siempre visibles.
const LINKS = [
  { href: "/admin", label: "Resumen", exact: true },
  { href: "/admin/alumnos", label: "Alumnos" },
  { href: "/admin/programas", label: "Planes" },
  { href: "/admin/biblioteca", label: "Ejercicios" },
  { href: "/admin/clases", label: "Clases" },
  { href: "/admin/citas", label: "Citas y solicitudes" },
];

const AdminNav = () => {
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
        <Link
          href="/dashboard"
          className="ml-auto shrink-0 px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-base-content/40 hover:text-base-content"
        >
          Ver como alumno →
        </Link>
      </div>
    </nav>
  );
};

export default AdminNav;

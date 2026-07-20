"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const HomeIcon = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="square"
    className={className}
  >
    <path d="M3 11.5 12 4l9 7.5" />
    <path d="M5.5 10v10h13V10" />
  </svg>
);

const LibraryIcon = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="square"
    className={className}
  >
    <rect x="3" y="5" width="18" height="14" />
    <path d="m10 9.5 5 2.5-5 2.5v-5z" fill="currentColor" stroke="none" />
  </svg>
);

const PanelIcon = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="square"
    className={className}
  >
    <path d="M4 20V10" />
    <path d="M12 20V4" />
    <path d="M20 20v-7" />
  </svg>
);

// Navegación inferior mobile-first para el dashboard.
export default function BottomNav({ isAdmin }) {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Hoy", Icon: HomeIcon },
    { href: "/dashboard/videoteca", label: "Videoteca", Icon: LibraryIcon },
    ...(isAdmin
      ? [{ href: "/dashboard/admin", label: "Panel", Icon: PanelIcon }]
      : []),
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-base-300 bg-base-100/90 backdrop-blur">
      <div className="mx-auto flex max-w-xl">
        {links.map(({ href, label, Icon }) => {
          const isActive = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={`relative flex flex-1 flex-col items-center gap-1 py-3 transition-colors ${
                isActive ? "text-primary" : "opacity-60 hover:opacity-100"
              }`}
            >
              {isActive && (
                <span className="absolute inset-x-6 top-0 h-0.5 bg-primary" />
              )}
              <Icon className="h-5 w-5" />
              <span className="text-[0.65rem] font-bold uppercase tracking-widest">
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

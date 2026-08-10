"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import FooterFoot from "@/components/rollprep/FooterFoot";

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

const CalendarIcon = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="square"
    className={className}
  >
    <rect x="3" y="5" width="18" height="16" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </svg>
);

const ProfileIcon = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="square"
    className={className}
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c1.5-4 5-5.5 8-5.5s6.5 1.5 8 5.5" />
  </svg>
);

// Navegación inferior mobile-first para el dashboard.
export default function BottomNav({ isAdmin }) {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Menú", Icon: HomeIcon },
    { href: "/dashboard/calendario", label: "Agenda", Icon: CalendarIcon },
    { href: "/dashboard/videoteca", label: "Videoteca", Icon: LibraryIcon },
    { href: "/dashboard/perfil", label: "Perfil", Icon: ProfileIcon },
    ...(isAdmin
      ? [{ href: "/dashboard/admin", label: "Panel", Icon: PanelIcon }]
      : []),
  ];

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-base-300 bg-base-100/90 backdrop-blur">
      <nav className="mx-auto flex max-w-xl">
        {links.map(({ href, label, Icon }) => {
          const isActive =
            href === "/dashboard"
              ? pathname === href
              : pathname === href || pathname.startsWith(`${href}/`);

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
      </nav>

      <FooterFoot />
    </div>
  );
}

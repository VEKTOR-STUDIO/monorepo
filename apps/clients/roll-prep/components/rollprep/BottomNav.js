"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Navegación inferior mobile-first para el dashboard.
export default function BottomNav({ isAdmin }) {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Hoy", icon: "🥋" },
    { href: "/dashboard/videoteca", label: "Videoteca", icon: "📚" },
    ...(isAdmin
      ? [{ href: "/dashboard/admin", label: "Panel", icon: "📊" }]
      : []),
  ];

  return (
    <nav className="dock dock-md z-40 border-t border-base-300 bg-base-100">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={pathname === link.href ? "dock-active text-primary" : ""}
        >
          <span className="text-xl">{link.icon}</span>
          <span className="dock-label text-xs font-medium">{link.label}</span>
        </Link>
      ))}
    </nav>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ENLACES = [
  { href: "/", texto: "Tablero", activo: (ruta) => ruta === "/" || ruta.startsWith("/candidatos") },
  { href: "/clientes", texto: "Clientes", activo: (ruta) => ruta.startsWith("/clientes") },
  { href: "/prospectos", texto: "Prospectos", activo: (ruta) => ruta.startsWith("/prospectos") },
];

export default function Navegacion() {
  const ruta = usePathname();
  return (
    <nav className="flex items-center gap-1 text-sm">
      {ENLACES.map((enlace) => {
        const activo = enlace.activo(ruta);
        return (
          <Link
            key={enlace.href}
            href={enlace.href}
            aria-current={activo ? "page" : undefined}
            className={`rounded-field px-2.5 py-1.5 transition-colors ${
              activo ? "bg-base-300/70 text-base-content" : "text-base-content/55 hover:text-base-content"
            }`}
          >
            {enlace.texto}
          </Link>
        );
      })}
    </nav>
  );
}

import Link from "next/link";
import Navegacion from "@/components/Navegacion";
import { leerCandidato, listarCandidatos } from "@/libs/almacen.mjs";
import { rutinaEnMarcha } from "@/libs/rutina.mjs";

// La barra de arriba. A la derecha, el único dato que interesa desde cualquier
// página: si hay una rutina corriendo, de quién es y cuántas esperan detrás.
export default function Cabecera() {
  const cerrojo = rutinaEnMarcha();
  const enMarcha = cerrojo ? leerCandidato(cerrojo.id) : null;
  const enCola = listarCandidatos().filter((c) => c.rutina.estado === "en-cola").length;

  return (
    <header className="sticky top-0 z-30 border-b border-base-300 bg-base-100/85 backdrop-blur">
      <div className="flex h-14 items-center gap-6 px-4 sm:px-6">
        <Link href="/" className="flex items-baseline gap-2.5">
          <span className="rotulo text-sm text-base-content">Alessandrovaru</span>
          <span className="rotulo hidden text-[0.6rem] text-base-content/55 sm:inline">Control</span>
        </Link>

        <Navegacion />

        <div className="ml-auto flex items-center gap-2 text-xs">
          {enMarcha ? (
            <Link
              href={`/candidatos/${enMarcha.id}`}
              className="flex items-center gap-2 rounded-field border border-accent/40 bg-accent/10 px-2.5 py-1.5 text-accent transition-colors hover:bg-accent/20"
            >
              <span className="size-1.5 animate-latido rounded-full bg-accent" />
              <span className="max-w-40 truncate font-medium">{enMarcha.nombre}</span>
              {enCola > 0 && <span className="font-mono text-accent/70">+{enCola}</span>}
            </Link>
          ) : (
            <span className="flex items-center gap-2 px-1 text-base-content/55">
              <span className="size-1.5 rounded-full bg-base-content/30" />
              Rutina libre
            </span>
          )}
        </div>
      </div>
    </header>
  );
}

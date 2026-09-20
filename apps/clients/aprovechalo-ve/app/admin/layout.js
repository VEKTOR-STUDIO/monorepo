import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/libs/supabase/server";
import { haySupabase } from "@/libs/supabase/admin";
import { DEV_NO_LOGIN } from "@/libs/dev-mode";
import SignOutButton from "@/components/SignOutButton";
import BotonComprar from "@/components/demo/BotonComprar";
import { esDemo } from "@/libs/demo";

export const dynamic = "force-dynamic";

const SECCIONES = [
  { href: "/admin", texto: "Resumen" },
  { href: "/admin/importar", texto: "Importar PDF" },
  { href: "/admin/productos", texto: "Productos" },
  { href: "/admin/pedidos", texto: "Pedidos" },
  { href: "/admin/tasa", texto: "Tasa BCV" },
];

/**
 * Puerta del panel.
 *
 * El middleware ya exige sesión para /admin; aquí se comprueba además que esa
 * sesión sea de alguien con rol admin, que es lo que de verdad separa a un
 * cliente registrado del equipo de Hardcore.
 */
export default async function AdminLayout({ children }) {
  const demo = esDemo();
  let correo = demo ? "solo lectura" : "modo local";

  // En demo el panel está abierto a propósito: es la mitad de lo que se vende.
  // Lo que no puede hacer nadie es escribir; eso se corta en acciones.js, y las
  // pantallas no consultan pedidos reales (ver libs/demo.js).
  if (!DEV_NO_LOGIN && !demo) {
    if (!haySupabase()) {
      return <SinSupabase />;
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/signin?redirect=/admin");

    const { data: perfil } = await supabase
      .from("perfiles")
      .select("rol, nombre, email")
      .eq("id", user.id)
      .maybeSingle();

    if (perfil?.rol !== "admin") {
      return <SinPermiso email={user.email} />;
    }

    correo = perfil.email || user.email;
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-base-content/10 bg-base-100/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
          <Link href="/admin" className="display text-lg">
            HARDCORE
            <span className="ml-2 align-middle text-[0.6rem] font-medium tracking-[0.2em] text-primary">
              PANEL
            </span>
          </Link>

          <nav className="ml-4 hidden gap-1 md:flex" aria-label="Panel">
            {SECCIONES.map((seccion) => (
              <Link
                key={seccion.href}
                href={seccion.href}
                className="rounded-lg px-3 py-2 text-sm text-base-content/65 transition-colors hover:bg-base-200 hover:text-base-content"
              >
                {seccion.texto}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-xs text-base-content/40 sm:inline">{correo}</span>
            <Link href="/" className="btn btn-sm btn-ghost">
              Ver tienda
            </Link>
            {!DEV_NO_LOGIN && !demo && <SignOutButton />}
          </div>
        </div>

        <nav className="flex gap-1 overflow-x-auto border-t border-base-content/10 px-4 py-2 md:hidden" aria-label="Panel móvil">
          {SECCIONES.map((seccion) => (
            <Link
              key={seccion.href}
              href={seccion.href}
              className="shrink-0 rounded-lg px-3 py-1.5 text-sm text-base-content/65 transition-colors hover:bg-base-200"
            >
              {seccion.texto}
            </Link>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {demo && (
          <div className="mb-8 flex flex-wrap items-center gap-4 rounded-xl border border-primary/35 bg-primary/8 px-5 py-4">
            <div className="min-w-0 flex-1">
              <p className="rotulo">Panel en modo demo</p>
              <p className="mt-1.5 text-sm leading-relaxed text-base-content/70">
                Puedes recorrerlo entero, pero no guarda nada. Los pedidos que ves son de
                ejemplo; los reales solo aparecen en el sistema instalado.
              </p>
            </div>
            <BotonComprar className="btn btn-primary btn-sm shrink-0" />
          </div>
        )}

        {children}
      </main>
    </div>
  );
}

function SinSupabase() {
  return (
    <Aviso titulo="FALTA CONECTAR SUPABASE">
      <p>
        El panel necesita la base de datos. Añade <code className="cifra">NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
        <code className="cifra">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> y{" "}
        <code className="cifra">SUPABASE_SERVICE_ROLE_KEY</code> a <code className="cifra">.env.local</code>,
        corre la migración de <code className="cifra">supabase/migrations/</code> y vuelve a entrar.
      </p>
      <p className="mt-3 text-base-content/45">
        Mientras tanto la tienda funciona: lee el catálogo de <code className="cifra">data/catalogo.json</code>.
      </p>
    </Aviso>
  );
}

function SinPermiso({ email }) {
  return (
    <Aviso titulo="ESTA ZONA NO ES TUYA">
      <p>
        La cuenta <span className="cifra text-base-content/80">{email}</span> no tiene permisos de
        administración.
      </p>
      <p className="mt-3 text-base-content/45">
        Para darle acceso, en el SQL Editor de Supabase:
      </p>
      <pre className="mt-2 overflow-x-auto rounded-lg border border-base-content/10 bg-base-200/60 p-3 text-left text-xs">
        <code>{`update public.perfiles set rol = 'admin'\nwhere email = '${email}';`}</code>
      </pre>
    </Aviso>
  );
}

function Aviso({ titulo, children }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="ficha max-w-lg p-8 text-center">
        <h1 className="display text-2xl">{titulo}</h1>
        <div className="mt-5 text-sm leading-relaxed text-base-content/65">{children}</div>
        <Link href="/" className="btn btn-primary mt-7">
          Volver a la tienda
        </Link>
      </div>
    </div>
  );
}

import Link from "next/link";
import Emblema from "@/components/MarcaTopMiami";

export default function NoEncontrado() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-base-200 px-6 text-center">
      <div className="malla absolute inset-0" aria-hidden="true" />

      {/* Su emblema, de fondo y muy bajado: que se sepa de quién es la página
          aunque esta no exista. */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.14]"
        aria-hidden="true"
      >
        <Emblema className="w-[130%] max-w-3xl shrink-0" />
      </div>

      <div className="relative">
        <p className="display text-7xl sm:text-8xl">
          <span className="rotulo-marca">404</span>
        </p>

        <h1 className="display mt-6 text-2xl text-primary sm:text-3xl">Aquí no hay nada</h1>

        <p className="mx-auto mt-5 max-w-sm text-base-content/70">
          La página que buscas no existe, o la unidad que venías a ver ya se vendió y
          salió del inventario.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/vehiculos" className="btn btn-primary">
            Ver inventario
          </Link>
          <Link href="/contacto" className="btn btn-filo">
            Escribirnos
          </Link>
        </div>

        <Link
          href="/"
          className="mt-8 inline-block text-sm text-base-content/55 underline-offset-4 hover:text-primary hover:underline"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}

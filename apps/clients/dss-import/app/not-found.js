import Link from "next/link";
import Silueta from "@/components/Silueta";

export default function NoEncontrado() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-base-200 px-6 text-center">
      <div className="malla absolute inset-0" aria-hidden="true" />

      <div
        className="pointer-events-none absolute inset-x-0 bottom-[18%] flex justify-center opacity-[0.06]"
        aria-hidden="true"
      >
        <Silueta tipo="moto" className="w-[120%] max-w-3xl text-base-content" />
      </div>

      <div className="relative">
        <p className="cifra text-7xl font-bold text-primary/25 sm:text-8xl">404</p>

        <h1 className="display mt-4 text-3xl sm:text-4xl">Aquí no hay nada</h1>

        <p className="mx-auto mt-5 max-w-sm text-base-content/60">
          La página que buscas no existe, o la unidad que venías a ver ya se entregó y
          salió del catálogo.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/catalogo" className="btn btn-primary">
            Ver catálogo
          </Link>
          <Link href="/contacto" className="btn btn-filo">
            Escribirnos
          </Link>
        </div>

        <Link
          href="/"
          className="mt-8 inline-block text-sm text-base-content/40 underline-offset-4 hover:text-primary hover:underline"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}

import Link from "next/link";
import config from "@/config";

export default function NoEncontrado() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div className="humo absolute inset-0" aria-hidden="true" />
      <div className="malla absolute inset-0" aria-hidden="true" />

      <div className="relative">
        <p className="cifra text-7xl font-bold text-primary/25 sm:text-8xl">404</p>

        <h1 className="display mt-4 text-3xl sm:text-4xl">ESTO NO ESTÁ EN LA LISTA</h1>

        <p className="mx-auto mt-5 max-w-sm text-base-content/60">
          La página que buscas no existe o el producto ya no viene en el catálogo.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/tienda" className="btn btn-primary">
            Ver catálogo
          </Link>
          <a
            href={`https://wa.me/${config.business.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            Preguntar por WhatsApp
          </a>
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

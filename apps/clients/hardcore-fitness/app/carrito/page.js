import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Carrito from "@/components/Carrito";
import { leerTasa } from "@/libs/catalogo";
import { getSEOTags } from "@/libs/seo";

export const metadata = getSEOTags({
  title: "Tu carrito · Hardcore",
  description: "Revisa tu pedido antes de confirmarlo por WhatsApp.",
  extraTags: { robots: { index: false, follow: false } },
});

export default async function PaginaCarrito() {
  const tasa = await leerTasa();

  return (
    <>
      <Suspense>
        <Header />
      </Suspense>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <h1 className="display mb-8 text-3xl sm:text-4xl">TU CARRITO</h1>
        <Carrito tasa={tasa} />
      </main>

      <Footer />
    </>
  );
}

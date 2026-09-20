import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Checkout from "@/components/Checkout";
import { leerTasa } from "@/libs/catalogo";
import { getSEOTags } from "@/libs/seo";

export const metadata = getSEOTags({
  title: "Confirmar pedido · Hardcore",
  description: "Últimos datos antes de cerrar el pedido por WhatsApp.",
  extraTags: { robots: { index: false, follow: false } },
});

export default async function PaginaCheckout() {
  const tasa = await leerTasa();

  return (
    <>
      <Suspense>
        <Header />
      </Suspense>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <h1 className="display mb-2 text-3xl sm:text-4xl">CONFIRMAR PEDIDO</h1>
        <p className="mb-8 text-sm text-base-content/55">
          Rellena tus datos y elige cómo pagas. Al confirmar se abre WhatsApp con el resumen.
        </p>

        <Checkout tasa={tasa} />
      </main>

      <Footer />
    </>
  );
}

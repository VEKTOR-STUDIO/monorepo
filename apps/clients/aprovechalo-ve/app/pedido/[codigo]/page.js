import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PedidoConfirmado from "@/components/PedidoConfirmado";
import { getSEOTags } from "@/libs/seo";

export const metadata = getSEOTags({
  title: "Pedido confirmado · Hardcore",
  extraTags: { robots: { index: false, follow: false } },
});

export default async function PaginaPedido({ params }) {
  const { codigo } = await params;

  return (
    <>
      <Suspense>
        <Header />
      </Suspense>

      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <PedidoConfirmado codigo={decodeURIComponent(codigo)} />
      </main>

      <Footer />
    </>
  );
}

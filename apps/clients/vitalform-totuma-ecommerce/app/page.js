import { Suspense } from "react";
import { createClient } from "@/libs/supabase/server";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import ServiciosSection from "@/components/ServiciosSection";
import ProductGrid from "@/components/ProductGrid";
import ComoFuncionaSection from "@/components/ComoFuncionaSection";
import DeliverySection from "@/components/DeliverySection";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

async function getProducts() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("id, name, description, price, ingredients, category, image_url")
      .order("created_at", { ascending: false });
    if (error) return [];
    return data ?? [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();

  return (
    <>
      <Suspense>
        <Header />
      </Suspense>
      <main>
        <Hero />
        <Marquee />
        <ServiciosSection />
        <ProductGrid products={products} />
        <ComoFuncionaSection />
        <DeliverySection />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}

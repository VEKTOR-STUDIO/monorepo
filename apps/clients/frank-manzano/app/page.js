import { Suspense } from "react";
import { createClient } from "@/libs/supabase/server";
import Header from "@/components/Header";
import HeroFrank from "@/components/HeroFrank";
import Marquee from "@/components/Marquee";
import ManifiestoSection from "@/components/ManifiestoSection";
import CredencialesSection from "@/components/CredencialesSection";
import DisciplinesSection from "@/components/DisciplinesSection";
import HorariosSection from "@/components/HorariosSection";
import Pricing from "@/components/Pricing";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

async function getDisciplines() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("disciplines")
      .select("id, name, description, required_level")
      .order("name");
    return data || [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const disciplines = await getDisciplines();

  return (
    <>
      <Suspense>
        <Header />
      </Suspense>
      <main>
        <HeroFrank />
        <Marquee />
        <ManifiestoSection />
        <CredencialesSection />
        <DisciplinesSection disciplines={disciplines} />
        <HorariosSection />
        <Pricing />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}

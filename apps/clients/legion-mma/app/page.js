import { Suspense } from 'react'
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import NextEvent from "@/components/NextEvent";
import FightCard from "@/components/FightCard";
import AboutLegion from "@/components/Problem";
import Moments from "@/components/Moments";
import Roster from "@/components/Roster";
import JoinRoster from "@/components/JoinRoster";
import EditionsTimeline from "@/components/FeaturesAccordion";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Suspense>
        <Header />
      </Suspense>
      <main>
        <Hero />
        <NextEvent />
        <FightCard />
        <AboutLegion />
        <Moments />
        <Roster />
        <JoinRoster />
        <EditionsTimeline />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}

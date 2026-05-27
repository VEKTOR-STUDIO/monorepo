import { Hero as SharedHero } from "@alessandrovaru/ui";
import TestimonialsAvatars from "./TestimonialsAvatars";
import config from "@/config";

// Thin wrapper sobre `@alessandrovaru/ui` Hero. Cada cliente compone su propio copy
// y CTAs; el componente compartido se queda con el layout y las animaciones.
const Hero = () => (
  <>
    <SharedHero
      title={
        <>
          Ship your startup in{" "}
          <span className="text-primary">days</span>, not weeks
        </>
      }
      description="The NextJS boilerplate with all you need to build your SaaS, AI tool, or any other web app. From idea to production in 5 minutes."
      primaryCta={{
        href: "/#pricing",
        label: `Get ${config.appName}`,
        gradient: false,
      }}
      image={{
        src: "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80",
        alt: "Product Demo",
        width: 500,
        height: 500,
      }}
    />
    <div className="max-w-7xl mx-auto px-8 -mt-12">
      <TestimonialsAvatars priority />
    </div>
  </>
);

export default Hero;

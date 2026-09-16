"use client";

import Image from "next/image";

export default function LastFightSection() {
  return (
    <section
      id="ultima-pelea"
      className="relative py-12 lg:py-16 scroll-mt-20"
      aria-labelledby="ultima-pelea-heading"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="max-w-5xl mx-auto px-6 sm:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-10 xl:gap-12 gap-8">
          {/* Texto */}
          <div className="flex-1 min-w-0 text-center lg:text-left">
            <h2
              id="ultima-pelea-heading"
              className="text-xl md:text-2xl font-bold tracking-tight text-base-content mb-2"
            >
              Mi última pelea
            </h2>
            <p className="text-base-content/60 text-sm md:text-base max-w-md lg:max-w-none">
              Competí en Brazilian Jiu Jitsu en Legión MMA
            </p>
          </div>

          {/* Imagen como tarjeta pequeña */}
          <div className="flex-shrink-0 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[260px] xl:max-w-[300px] rounded-xl overflow-hidden border border-primary/20 shadow-lg aspect-[4/3]">
              <Image
                src="/danielLastFight.png"
                alt="Daniel Tamayo en su última pelea de BJJ"
                width={400}
                height={300}
                className="w-full h-full object-cover"
                sizes="(max-width: 640px) 280px, (max-width: 1024px) 320px, 300px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

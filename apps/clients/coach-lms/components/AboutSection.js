"use client";

import Image from "next/image";

const quotes = [
  "Quizás no sea el mejor, pero entreno con los mejores.",
  "Soy el que más duro trabaja.",
  "No paro de aprender.",
  "No voy a parar de luchar para serlo.",
  "Soy el más feliz cuando hago este deporte.",
  "Me respalda mi gente, somos pocos pero juntos nadie nos va a parar.",
];

export default function AboutSection() {
  return (
    <section
      id="sobre"
      className="relative py-24 lg:py-32 scroll-mt-20"
      aria-labelledby="sobre-heading"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/30 to-transparent" />

      <div className="max-w-6xl mx-auto px-8">
        <h2
          id="sobre-heading"
          className="text-2xl md:text-4xl font-bold tracking-tight text-base-content mb-4 text-center"
        >
          Sobre Daniel
        </h2>
        <p className="text-base-content/70 text-base md:text-lg mb-12 max-w-2xl mx-auto text-center">
          Fisioterapeuta y atleta de Brazilian Jiu Jitsu. Su filosofía: excelencia,
          trabajo duro y el respaldo de su gente.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="relative rounded-2xl overflow-hidden border border-primary/20 shadow-xl order-2 lg:order-1">
            <Image
              src="/danielWithPatient.png"
              alt="Daniel Tamayo en consulta con paciente"
              width={600}
              height={400}
              className="w-full h-auto object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="space-y-6 order-1 lg:order-2">
            {quotes.map((q) => (
              <blockquote
                key={q}
                className="text-base-content/90 text-lg md:text-xl font-medium italic border-l-4 border-primary pl-6 py-2 text-left"
              >
                &ldquo;{q}&rdquo;
              </blockquote>
            ))}
            <p className="mt-6 text-base-content/50 text-sm">
              @dtamayo_ft
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

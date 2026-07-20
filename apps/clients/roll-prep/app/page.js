import Link from "next/link";
import ButtonSignin from "@/components/ButtonSignin";
import config from "@/config";

const marqueeItems = [
  "Martes · Entreno",
  "Estudia el video",
  "Jueves · Entreno",
  "Vota el próximo tema",
  "Oss",
];

const features = [
  {
    number: "01",
    title: "Tarea semanal",
    description:
      "De martes a jueves: el profesor asigna un video y tú llegas preparado a clase. Sin excusas.",
  },
  {
    number: "02",
    title: "Tú eliges el tema",
    description:
      "De jueves a martes: vota entre 3 opciones qué se estudia en la próxima clase. El tatami es de todos.",
  },
  {
    number: "03",
    title: "Videoteca",
    description:
      "El archivo completo de todo lo estudiado, clase por clase. Tu memoria técnica siempre disponible.",
  },
];

export default function Page() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-base-100 text-base-content">
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <span className="display text-2xl">
          Roll<span className="text-primary">Prep</span>
        </span>
        <ButtonSignin text="Entrar" extraStyle="btn-primary btn-sm md:btn-md" />
      </header>

      <main className="relative z-10">
        {/* ------------------------------ HERO --------------------------- */}
        <section className="relative mx-auto max-w-6xl px-5 pb-20 pt-12 md:pt-20">
          {/* Número gigante de fondo, contorneado */}
          <span
            aria-hidden="true"
            className="display text-stroke pointer-events-none absolute -top-6 right-0 select-none text-[10rem] leading-none md:text-[18rem]"
          >
            BJJ
          </span>

          <div className="rise rise-1">
            <span className="tag-skew bg-primary px-3 py-1 text-xs text-primary-content">
              <span>Jiu-Jitsu Brasileño · Mar &amp; Jue</span>
            </span>
          </div>

          <h1 className="display rise rise-2 mt-6 max-w-4xl text-6xl md:text-8xl lg:text-9xl">
            El estudio no termina{" "}
            <span className="text-primary">al salir del tatami</span>
          </h1>

          <p className="rise rise-3 mt-8 max-w-xl text-lg font-medium leading-relaxed opacity-70">
            {config.appName} conecta a la clase entre entrenos: estudia el video
            asignado por el profesor y vota el tema de la próxima clase. Llega
            siempre un paso adelante.
          </p>

          <div className="rise rise-4 mt-10 flex flex-wrap items-center gap-4">
            <Link href="/signin" className="btn btn-primary btn-lg px-10">
              Empezar a entrenar
            </Link>
            <Link href="/signin" className="btn btn-outline btn-lg">
              Ya tengo cuenta
            </Link>
          </div>
        </section>

        {/* --------------------------- MARQUEE --------------------------- */}
        <div className="overflow-hidden border-y border-base-300 bg-primary py-3 text-primary-content">
          <div className="marquee-track">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0" aria-hidden={copy === 1}>
                {marqueeItems.concat(marqueeItems).map((item, i) => (
                  <span
                    key={i}
                    className="display mx-6 whitespace-nowrap text-xl tracking-wide"
                  >
                    {item} <span className="mx-2 opacity-40">/</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* --------------------------- FEATURES -------------------------- */}
        <section className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="display mb-12 text-4xl md:text-5xl">
            Así funciona<span className="text-primary">.</span>
          </h2>

          <div className="grid gap-px overflow-hidden border border-base-300 bg-base-300 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.number}
                className="group relative bg-base-100 p-8 transition-colors duration-300 hover:bg-base-200"
              >
                <span className="display text-stroke text-6xl transition-colors group-hover:text-primary group-hover:[-webkit-text-stroke:0px]">
                  {feature.number}
                </span>
                <h3 className="display mt-6 text-2xl">{feature.title}</h3>
                <p className="mt-3 text-sm font-medium leading-relaxed opacity-70">
                  {feature.description}
                </p>
                <span className="absolute bottom-0 left-0 h-1 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
              </div>
            ))}
          </div>
        </section>

        {/* ----------------------------- CTA ----------------------------- */}
        <section className="mx-auto max-w-6xl px-5 pb-24">
          <div className="relative overflow-hidden border border-base-300 bg-base-200 p-10 md:p-16">
            <span
              aria-hidden="true"
              className="display text-stroke pointer-events-none absolute -bottom-8 -right-2 select-none text-[8rem] leading-none md:text-[12rem]"
            >
              OSS
            </span>
            <h2 className="display max-w-2xl text-4xl md:text-6xl">
              Entrena con la mente. <span className="text-primary">Gana</span>{" "}
              en el tatami.
            </h2>
            <Link href="/signin" className="btn btn-primary btn-lg mt-8 px-10">
              Unirme al equipo
            </Link>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-base-300">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-5 py-6 text-xs font-semibold uppercase tracking-widest opacity-60">
          <span>
            {config.appName} — {new Date().getFullYear()}
          </span>
          <span>Martes &amp; Jueves · {config.timezone}</span>
        </div>
      </footer>
    </div>
  );
}

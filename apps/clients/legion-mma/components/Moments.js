import Image from "next/image";

// Fotos reales de las noches de Legión (carpeta /public/fotos)
const photos = [
  { src: "/fotos/campeon-festejo.jpg", alt: "Campeón de Legión festejando con el cinturón" },
  { src: "/fotos/campeon-bandera.jpg", alt: "Campeón de Legión con la bandera de Venezuela" },
  { src: "/fotos/victoria-peleadora.jpg", alt: "Peleadora de Legión celebrando su victoria" },
  { src: "/fotos/campeon-cinturon.jpg", alt: "Campeón de Legión posando con el cinturón" },
  { src: "/fotos/campeon-penacho-2.jpg", alt: "Campeón de Legión arrodillado con el cinturón" },
  { src: "/fotos/victoria-peleador.jpg", alt: "Peleador de Legión con el brazo en alto tras ganar" },
  { src: "/fotos/campeon-penacho-1.jpg", alt: "Campeón de Legión homenajeando con penacho" },
];

const Moments = () => (
  <section id="galeria" className="relative bg-base-200 py-20 lg:py-28">
    <div className="absolute top-0 left-0 w-2 h-full bg-primary/80" />

    <div className="max-w-7xl mx-auto px-6 lg:px-10">
      {/* Encabezado */}
      <div className="inline-flex items-center gap-3 mb-4">
        <span className="w-10 h-px bg-primary" />
        <p className="text-primary font-bold text-xs uppercase tracking-[0.4em]">
          Momentos
        </p>
      </div>
      <h2
        className="font-display leading-none mb-10 lg:mb-14"
        style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
      >
        La Legión <span className="text-primary">en acción</span>
      </h2>

      {/* Video destacado */}
      <div className="relative mb-12 lg:mb-16">
        <div
          className="absolute inset-0 border-2 border-primary pointer-events-none"
          style={{ transform: "translate(14px, 14px)", zIndex: 0 }}
        />
        <div className="relative overflow-hidden border-2 border-primary/60" style={{ zIndex: 1 }}>
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/fotos/campeon-festejo.jpg"
            className="w-full h-full object-cover aspect-video bg-base-300"
          >
            <source src="/legion-highlight.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-base-100/30 via-transparent to-primary/10" />
        </div>
      </div>

      {/* Galería de fotos */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
        {photos.map((photo) => (
          <div
            key={photo.src}
            className="group relative aspect-[3/4] overflow-hidden border border-primary/30"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover object-top transition-all duration-500 grayscale-[0.25] group-hover:grayscale-0 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-base-100/60 via-transparent to-transparent opacity-70 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none" />
            <div className="absolute inset-0 ring-0 group-hover:ring-2 ring-primary ring-inset transition-all duration-300 pointer-events-none" />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Moments;

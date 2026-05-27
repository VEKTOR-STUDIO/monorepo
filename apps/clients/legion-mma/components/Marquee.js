"use client";

import { useRef } from "react";

// Palabras clave genéricas — micropigmentación / belleza premium
const defaultKeywords = [
  "Micropigmentación",
  "Microblading",
  "Lip blush",
  "Laminado de Cejas",
  "Diseño de Cejas",
  "Arte Facial",
  "PMU",
  "Permanent Makeup",
  "Cejas",
  "Labios",
  "Demipermanente",
  "Maquillaje Semipermanente",
  "Estudio premium",
  "Tu ciudad",
  "Brow Lamination",
  "Lip Blush",
  "Confianza",
  "Estética",
  "Belleza",
  "Cejas naturales",
  "Coloración",
  "Diseño facial",
  "Tratamientos cejas",
  "Labios naturales",
];

const Marquee = ({ 
  keywords = defaultKeywords, 
  speed = 30, 
  direction = "left",
  pauseOnHover = true,
  className = "",
  itemClassName = ""
}) => {
  const marqueeRef = useRef(null);

  return (
    <div className={`overflow-hidden bg-base-200 border-y border-base-content/10 ${className}`}>
      <div 
        ref={marqueeRef}
        className={`flex gap-8 py-4 ${pauseOnHover ? "hover:pause" : ""}`}
        style={{
          animation: `marquee ${speed}s linear infinite`,
          animationDirection: direction === "right" ? "reverse" : "normal",
        }}
      >
        {/* Primera copia de las palabras */}
        {keywords.map((keyword, index) => (
          <span
            key={`keyword-1-${index}`}
            className={`text-base-content/70 font-medium whitespace-nowrap text-sm md:text-base ${itemClassName}`}
          >
            {keyword}
          </span>
        ))}
        
        {/* Segunda copia para seamless loop */}
        {keywords.map((keyword, index) => (
          <span
            key={`keyword-2-${index}`}
            className={`text-base-content/70 font-medium whitespace-nowrap text-sm md:text-base ${itemClassName}`}
          >
            {keyword}
          </span>
        ))}
        
        {/* Tercera copia para mayor fluidez */}
        {keywords.map((keyword, index) => (
          <span
            key={`keyword-3-${index}`}
            className={`text-base-content/70 font-medium whitespace-nowrap text-sm md:text-base ${itemClassName}`}
          >
            {keyword}
          </span>
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }

        .hover\\:pause:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default Marquee;
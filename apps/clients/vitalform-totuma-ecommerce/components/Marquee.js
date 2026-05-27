"use client";

import { useRef } from "react";
import { useTheme } from "@/contexts/ThemeContext";

const vitalformKeywords = [
  "Nutrición",
  "Real Fooding",
  "Juan Vielma",
  "Consulta nutricional",
  "Planes personalizados",
  "Evidencia",
  "VitalForm Fit",
  "Control",
  "Pack mensual",
];

const totumaKeywords = [
  "Totuma Mealpreps",
  "Delivery",
  "Pick up",
  "Comida real",
  "No procesados",
  "Totumas",
  "Semana",
  "Saludable",
];

const Marquee = ({
  keywords,
  speed = 30,
  direction = "left",
  pauseOnHover = true,
  className = "",
  itemClassName = "",
}) => {
  const marqueeRef = useRef(null);
  const { activeProfile } = useTheme();
  const list = keywords ?? (activeProfile === "totuma" ? totumaKeywords : vitalformKeywords);

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
        {list.map((keyword, index) => (
          <span
            key={`keyword-1-${index}`}
            className={`text-base-content/70 font-medium whitespace-nowrap text-sm md:text-base ${itemClassName}`}
          >
            {keyword}
          </span>
        ))}
        {list.map((keyword, index) => (
          <span
            key={`keyword-2-${index}`}
            className={`text-base-content/70 font-medium whitespace-nowrap text-sm md:text-base ${itemClassName}`}
          >
            {keyword}
          </span>
        ))}
        {list.map((keyword, index) => (
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

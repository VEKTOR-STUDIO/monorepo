"use client";

import Image from "next/image";
import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import config from "@/config";

const medalColors = {
  gold: "text-yellow-500",
  silver: "text-base-content/70",
  bronze: "text-amber-700",
  other: "text-primary",
};

export default function AchievementsGrid({ achievements = [] }) {
  const { activeProfile } = useTheme();

  if (activeProfile !== "athlete") return null;

  return (
    <section id="logros" className="relative py-24 md:py-32 bg-base-200 overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <p className="text-primary font-medium text-xs uppercase mb-4" style={{ letterSpacing: "0.35em" }}>
          Palmarés
        </p>
        <h2 className="font-bold text-4xl md:text-5xl tracking-tight mb-8">
          Logros en el <span className="text-primary italic">tatami</span>
        </h2>

        {/* Galería de momentos — World Champion y Legion */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
          <motion.figure
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative aspect-[4/3] overflow-hidden border border-primary/20 bg-base-100"
          >
            <Image
              src="/barbaraWorldChampion.png"
              alt="Barbara Felizola — World Master Champion"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-base-100/80 to-transparent p-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary-content">World Master Champion</span>
            </div>
          </motion.figure>
          <motion.figure
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative aspect-[4/3] overflow-hidden border border-primary/20 bg-base-100"
          >
            <Image
              src="/barbaraLegion.png"
              alt="Barbara Felizola — BJJ en acción"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-base-100/80 to-transparent p-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary-content">En el tatami</span>
            </div>
          </motion.figure>
        </div>

        {(() => {
          const defaultAchievements = [
            { title: "IBJJF Master European Champion", year: 2026, organization: "IBJJF", medal_type: "gold", count: 2 },
            { title: "IBJJF World Master Champion", year: 2024, organization: "IBJJF", medal_type: "gold", count: 1 },
            { title: "IBJJF Open Champion", year: 2025, organization: "IBJJF", medal_type: "gold", count: 2 },
            { title: "IBJJF Open NoGi Champion", year: 2025, organization: "IBJJF", medal_type: "gold", count: 2 },
          ];
          const list = achievements.length > 0 ? achievements : defaultAchievements;
          const isDefault = achievements.length === 0;

          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {list.map((item, i) => (
                <motion.article
                  key={isDefault ? i : item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="border border-primary/20 bg-base-100 p-6 flex items-start gap-4"
                >
                  <div className="shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Trophy className={`w-6 h-6 ${medalColors[item.medal_type] || medalColors.other}`} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-lg text-base-content">{item.title}</h3>
                    <p className="text-base-content/60 text-sm mt-0.5">
                      <time dateTime={String(item.year)}>{item.year}</time>
                      {item.organization && ` · ${item.organization}`}
                      {(item.count ?? item.medal_count) != null && (item.count ?? item.medal_count) > 0 && (
                        <span className="ml-2 font-semibold text-accent/90">
                          · 🥇×{item.count ?? item.medal_count}
                        </span>
                      )}
                    </p>
                  </div>
                </motion.article>
              ))}
            </div>
          );
        })()}

        <div className="mt-12 text-center">
          <a
            href={config.business?.whatsapp ? `${config.business.whatsapp}?text=${encodeURIComponent(config.business.whatsappMessageAthlete || "Hola, me interesa agendar seminario con Barbara Felizola")}` : "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ borderRadius: 0, letterSpacing: "0.15em", fontSize: "0.7rem" }}
          >
            AGENDAR SEMINARIO / CLASE
          </a>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";
import Image from "next/image";
import config from "@/config";

export default function ProductGrid({ products = [] }) {
  const { activeProfile } = useTheme();

  if (activeProfile !== "totuma") return null;

  const defaultProducts = [
    { name: "Totuma Clásica", description: "Comida real, lista para la semana. Proteína, vegetales y carbohidratos balanceados. No procesados.", price: null, category: "totuma", ingredients: "Ingredientes frescos, sin conservantes." },
    { name: "Totuma Verde", description: "Opción verde: más vegetales, misma filosofía. Soluciones saludables para llevar.", price: null, category: "totuma", ingredients: "Vegetales, granos, proteína." },
  ];

  const list = products.length > 0 ? products : defaultProducts;

  return (
    <section id="productos" className="relative py-24 md:py-32 overflow-hidden bg-base-200">
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <p className="text-primary font-medium text-xs uppercase mb-4" style={{ letterSpacing: "0.35em" }}>
          Totuma Mealpreps
        </p>
        <h2 className="font-bold text-4xl md:text-5xl tracking-tight mb-4">
          Totumas listas para <span className="text-primary italic">comer en la semana</span>
        </h2>
        <p className="text-base-content/60 max-w-xl mb-8">
          No son bowls ni poke. Soluciones saludables, no procesados. Delivery o pick up.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {list.map((p, i) => (
            <motion.article
              key={p.id || i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="border border-primary/15 bg-base-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="aspect-[4/3] bg-base-200 relative">
                {p.image_url ? (
                  <Image src={p.image_url} alt={p.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-6xl text-primary/20">🥣</div>
                )}
              </div>
              <div className="p-6">
                <p className="text-primary/80 text-xs uppercase mb-1" style={{ letterSpacing: "0.15em" }}>{p.category || "Totuma"}</p>
                <h3 className="font-bold text-xl text-base-content mb-2">{p.name}</h3>
                <p className="text-base-content/60 text-sm mb-4">{p.description}</p>
                {p.ingredients && (
                  <p className="text-base-content/50 text-xs mb-4">
                    <span className="font-medium text-base-content/70">Ingredientes:</span> {p.ingredients}
                  </p>
                )}
                {p.price != null && (
                  <p className="font-bold text-primary text-lg">${typeof p.price === "number" ? p.price : Number(p.price)?.toFixed(2) ?? p.price}</p>
                )}
                <a
                  href={config.business?.whatsapp ? `${config.business.whatsapp}?text=${encodeURIComponent(`Hola, quiero pedir: ${p.name}`)}` : "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-sm mt-4 w-full"
                  style={{ borderRadius: 0.5 }}
                >
                  Pedir por WhatsApp
                </a>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href={config.business?.whatsapp ? `${config.business.whatsapp}?text=${encodeURIComponent(config.business.whatsappMessageTotuma || "Hola, quiero hacer un pedido de Totuma Mealpreps (delivery/pick up).")}` : "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ borderRadius: 0.5, letterSpacing: "0.12em", fontSize: "0.7rem" }}
          >
            PEDIR POR WHATSAPP
          </a>
        </div>
      </div>
    </section>
  );
}

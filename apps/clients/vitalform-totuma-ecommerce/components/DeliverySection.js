"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";
import { Truck, MapPin } from "lucide-react";
import config from "@/config";

export default function DeliverySection() {
  const { activeProfile } = useTheme();

  if (activeProfile !== "totuma") return null;

  const whatsappUrl = config.business?.whatsapp
    ? `${config.business.whatsapp}?text=${encodeURIComponent(config.business.whatsappMessageTotuma || "Hola, quiero hacer un pedido de Totuma Mealpreps (delivery/pick up).")}`
    : "#";

  return (
    <section id="delivery" className="relative py-24 md:py-32 bg-base-100 border-t border-primary/10">
      <div className="max-w-4xl mx-auto px-8">
        <p className="text-primary font-medium text-xs uppercase mb-4 text-center" style={{ letterSpacing: "0.35em" }}>
          Cómo recibís
        </p>
        <h2 className="font-bold text-3xl md:text-4xl tracking-tight mb-8 text-center">
          Delivery o <span className="text-primary italic">Pick up</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <motion.article
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="border border-primary/15 bg-base-200 p-6 rounded-lg"
          >
            <Truck className="w-10 h-10 text-primary mb-4" />
            <h3 className="font-bold text-xl text-base-content mb-2">Delivery</h3>
            <p className="text-base-content/60 text-sm">
              Te llevamos las totumas a tu zona. Consultá por WhatsApp las zonas de entrega y horarios.
            </p>
          </motion.article>
          <motion.article
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="border border-primary/15 bg-base-200 p-6 rounded-lg"
          >
            <MapPin className="w-10 h-10 text-primary mb-4" />
            <h3 className="font-bold text-xl text-base-content mb-2">Pick up</h3>
            <p className="text-base-content/60 text-sm">
              Pasá a retirar tu pedido en el punto acordado. Rápido y sin costo de envío.
            </p>
          </motion.article>
        </div>

        <div className="text-center">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-lg"
            style={{ borderRadius: 0, letterSpacing: "0.15em", fontSize: "0.75rem" }}
          >
            PEDIR POR WHATSAPP
          </a>
        </div>
      </div>
    </section>
  );
}

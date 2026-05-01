"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Locale, getDictionary } from "@/lib/locale";

interface TrustStripProps {
  locale: Locale;
  showPilotStats: boolean;
  showPartnerLogos: boolean;
}

export default function TrustStrip({ locale, showPilotStats, showPartnerLogos }: TrustStripProps) {
  const t = getDictionary(locale);

  const pilotStats = [
    { label: "точек в пилоте", value: "300" },
    { label: "сегментов бизнеса", value: "5" },
    { label: "ключевых сценариев", value: "6" },
  ];

  return (
    <section className="py-10 bg-white border-b border-card-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showPilotStats ? (
          <div className="grid grid-cols-3 gap-8">
            {pilotStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl lg:text-4xl font-bold text-primary-green">{stat.value}</div>
                <div className="text-sm text-text-muted mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 text-sm text-text-muted"
            >
              <CheckCircle2 size={18} className="text-cta-green flex-shrink-0" />
              {t.trustPilot}
            </motion.div>
            <div className="hidden sm:block w-px h-6 bg-card-border" />
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 text-sm text-text-muted"
            >
              <CheckCircle2 size={18} className="text-cta-green flex-shrink-0" />
              {t.trustIntegrations}
            </motion.div>
          </div>
        )}

        {showPartnerLogos && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-8 pt-8 border-t border-card-border"
          >
            <p className="text-center text-xs text-text-muted mb-4">Интеграции и партнёры</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-50">
              {["Click", "Payme", "Uzum", "ГНК / OFD", "Telegram"].map((partner) => (
                <div key={partner} className="text-sm font-semibold text-text-muted">{partner}</div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

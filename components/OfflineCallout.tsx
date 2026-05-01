"use client";

import { motion } from "framer-motion";
import { WifiOff, CheckCircle2 } from "lucide-react";
import { Locale, getDictionary } from "@/lib/locale";

interface OfflineCalloutProps {
  locale: Locale;
}

export default function OfflineCallout({ locale }: OfflineCalloutProps) {
  const t = getDictionary(locale);

  const bullets = [
    t.offlineBullet1,
    t.offlineBullet2,
    t.offlineBullet3,
    t.offlineBullet4,
  ];

  return (
    <section className="py-16 lg:py-24 bg-primary-dark-green text-white overflow-hidden relative">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-lime-accent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary-green rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full text-sm text-lime-accent font-medium mb-6">
              <WifiOff size={16} />
              Offline-first
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              {t.offlineTitle}
            </h2>
            <p className="text-white/80 leading-relaxed mb-6">
              {t.offlineText}
            </p>
            <ul className="space-y-3">
              {bullets.map((bullet, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 size={20} className="text-lime-accent flex-shrink-0 mt-0.5" />
                  <span className="text-white/90 text-sm">{bullet}</span>
                </motion.li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-white/50">{t.offlineNote}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              {/* Signal visualization */}
              <div className="flex items-center justify-center gap-1 mb-6">
                {[1, 2, 3, 4].map((bar) => (
                  <motion.div
                    key={bar}
                    initial={{ height: 8 }}
                    animate={{ height: [8, 32, 16, 40, 8] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: bar * 0.2,
                    }}
                    className="w-3 bg-lime-accent rounded-full"
                  />
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-lime-accent" />
                  <span className="text-sm">Продажа #1042 — сохранено локально</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-lime-accent" />
                  <span className="text-sm">Продажа #1043 — сохранено локально</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg opacity-60">
                  <div className="w-2 h-2 rounded-full bg-white/30 animate-pulse" />
                  <span className="text-sm">Ожидание синхронизации...</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-lime-accent/20 rounded-lg text-center">
                <span className="text-sm text-lime-accent font-medium">✓ Синхронизация восстановлена</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { Smartphone, Tablet, Monitor, Bluetooth, Printer } from "lucide-react";
import { Locale, getDictionary } from "@/lib/locale";

interface AppScreensProps {
  locale: Locale;
}

export default function AppScreens({ locale }: AppScreensProps) {
  const t = getDictionary(locale);

  const devices = [
    {
      icon: Smartphone,
      title: "Смартфон",
      subtitle: "Сканирование и корзина",
      color: "from-primary-green to-accent-green",
    },
    {
      icon: Tablet,
      title: "Планшет",
      subtitle: "POS-режим кассира",
      color: "from-primary-dark-green to-primary-green",
    },
    {
      icon: Monitor,
      title: "Аналитика",
      subtitle: "Дашборд владельца",
      color: "from-accent-green to-cta-green",
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-soft-green-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-dark mb-4">
            {t.screensTitle}
          </h2>
        </motion.div>

        {/* Device cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {devices.map((device, i) => (
            <motion.div
              key={device.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative"
            >
              <div className={`bg-gradient-to-br ${device.color} rounded-2xl p-6 text-white h-full`}>
                <device.icon size={32} className="mb-4 opacity-80" />
                <h3 className="text-xl font-bold mb-1">{device.title}</h3>
                <p className="text-white/80 text-sm">{device.subtitle}</p>

                {/* Mini UI preview */}
                <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-xl p-3 space-y-2">
                  {i === 0 && (
                    <>
                      <div className="flex justify-between text-xs">
                        <span className="opacity-70">Молоко 1л</span>
                        <span>14 000</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="opacity-70">Хлеб</span>
                        <span>4 000</span>
                      </div>
                      <div className="border-t border-white/20 pt-1 flex justify-between text-xs font-semibold">
                        <span>Итого</span>
                        <span>18 000</span>
                      </div>
                    </>
                  )}
                  {i === 1 && (
                    <>
                      <div className="grid grid-cols-3 gap-1">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                          <div key={n} className="aspect-square bg-white/20 rounded flex items-center justify-center text-xs">
                            {n}
                          </div>
                        ))}
                      </div>
                      <div className="text-center text-xs opacity-70">Быстрые кнопки</div>
                    </>
                  )}
                  {i === 2 && (
                    <>
                      <div className="flex items-end gap-1 h-16">
                        {[30, 50, 40, 70, 60, 80, 90].map((h, j) => (
                          <div key={j} className="flex-1 bg-white/30 rounded-t" style={{ height: `${h}%` }} />
                        ))}
                      </div>
                      <div className="text-center text-xs opacity-70">Выручка за неделю</div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Hardware strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl p-6 lg:p-8 border border-card-border"
        >
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-soft-mint flex items-center justify-center">
                <Bluetooth size={24} className="text-primary-green" />
              </div>
              <div className="w-12 h-12 rounded-xl bg-soft-mint flex items-center justify-center">
                <Printer size={24} className="text-primary-green" />
              </div>
            </div>
            <div className="flex-1 text-center lg:text-left">
              <p className="text-text-muted text-sm">{t.screensHardware}</p>
              <p className="text-primary-green font-semibold text-sm mt-1">{t.screensStart}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

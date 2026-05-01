"use client";

import { motion } from "framer-motion";
import { Store, ShoppingBasket, Coffee, Pill, Shirt, Wrench } from "lucide-react";
import { Locale, getDictionary } from "@/lib/locale";

interface SegmentsProps {
  locale: Locale;
}

export default function Segments({ locale }: SegmentsProps) {
  const t = getDictionary(locale);

  const segmentData = [
    { icon: Store, title: t.segConvenience, pain: "Небольшой ассортимент, нужна простая касса и учёт.", help: "Ipak Savdo: сканер, QR, чек и базовый отчёт." },
    { icon: ShoppingBasket, title: t.segMinimarket, pain: "Много SKU, нужен контроль остатков и быстрая касса.", help: "Ipak Savdo: каталог, склад, QR, отчёт по кассиру." },
    { icon: Coffee, title: t.segCafe, pain: "Меню, модификаторы, быстрый расчёт столиков.", help: "Ipak Savdo: каталог товаров, QR-оплата, чеки." },
    { icon: Pill, title: t.segPharmacy, pain: "Серийный учёт, сроки годности, отчётность.", help: "Ipak Savdo: остатки, отчёты, электронный чек." },
    { icon: Shirt, title: t.segClothing, pain: "Размеры, цвета, возвраты, сезонность.", help: "Ipak Savdo: SKU с атрибутами, возвраты, отчёты." },
    { icon: Wrench, title: t.segService, pain: "Услуги, материалы, запись, расчёт.", help: "Ipak Savdo: услуги + товары, QR-оплата, чек." },
  ];

  return (
    <section id="segments" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-dark">
            {t.segmentsTitle}
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {segmentData.map((segment, i) => (
            <motion.div
              key={segment.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-6 rounded-2xl bg-soft-green-bg border border-card-border hover:border-primary-green/30 hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-white border border-card-border flex items-center justify-center mb-4 shadow-sm group-hover:border-primary-green/30 transition-colors">
                <segment.icon size={24} className="text-primary-green" />
              </div>
              <h3 className="text-lg font-semibold text-text-dark mb-2">{segment.title}</h3>
              <p className="text-sm text-text-muted mb-3">{segment.pain}</p>
              <p className="text-sm text-primary-green font-medium">{segment.help}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

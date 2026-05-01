"use client";

import { motion } from "framer-motion";
import { ScanLine, Package, QrCode, FileText, Users, BarChart3 } from "lucide-react";
import { Locale, getDictionary } from "@/lib/locale";

interface FeaturesProps {
  locale: Locale;
}

export default function Features({ locale }: FeaturesProps) {
  const t = getDictionary(locale);

  const featureCards = [
    {
      icon: ScanLine,
      title: t.featPosTitle,
      desc: t.featPosDesc,
      preview: (
        <div className="mt-4 p-3 bg-white rounded-lg border border-card-border space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-soft-mint flex items-center justify-center text-xs">📷</div>
            <div className="text-xs text-text-muted">Сканер / Камера</div>
          </div>
          <div className="flex gap-2">
            <span className="px-2 py-1 bg-soft-mint rounded text-[10px] text-primary-green">Скидка 10%</span>
            <span className="px-2 py-1 bg-soft-mint rounded text-[10px] text-primary-green">Возврат</span>
          </div>
        </div>
      ),
    },
    {
      icon: Package,
      title: t.featCatalogTitle,
      desc: t.featCatalogDesc,
      preview: (
        <div className="mt-4 p-3 bg-white rounded-lg border border-card-border space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-text-muted">Молоко 1л</span>
            <span className="font-medium">18 шт</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-text-muted">Хлеб</span>
            <span className="font-medium text-orange-500">6 шт ⚠️</span>
          </div>
          <div className="w-full h-1.5 bg-soft-mint rounded-full overflow-hidden">
            <div className="w-1/4 h-full bg-orange-400 rounded-full" />
          </div>
        </div>
      ),
    },
    {
      icon: QrCode,
      title: t.featQRTitle,
      desc: t.featQRDesc,
      preview: (
        <div className="mt-4 p-3 bg-white rounded-lg border border-card-border flex items-center justify-center">
          <div className="w-20 h-20 border-2 border-primary-green rounded-lg flex items-center justify-center">
            <QrCode size={32} className="text-primary-green" />
          </div>
        </div>
      ),
    },
    {
      icon: FileText,
      title: t.featFiscalTitle,
      desc: t.featFiscalDesc,
      preview: (
        <div className="mt-4 p-3 bg-white rounded-lg border border-card-border space-y-2">
          <div className="text-center">
            <p className="text-xs font-semibold text-text-dark">Чек № 1042</p>
            <p className="text-[10px] text-text-muted">20 500 сум</p>
          </div>
          <div className="flex items-center gap-1 justify-center">
            <span className="text-[10px] bg-soft-mint px-2 py-0.5 rounded text-primary-green">✓ Telegram</span>
          </div>
        </div>
      ),
    },
    {
      icon: Users,
      title: t.featRolesTitle,
      desc: t.featRolesDesc,
      preview: (
        <div className="mt-4 p-3 bg-white rounded-lg border border-card-border space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary-green flex items-center justify-center text-[10px] text-white">В</div>
            <span className="text-xs">Владелец — полный доступ</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-accent-green flex items-center justify-center text-[10px] text-white">К</div>
            <span className="text-xs">Кассир — продажи</span>
          </div>
        </div>
      ),
    },
    {
      icon: BarChart3,
      title: t.featReportsTitle,
      desc: t.featReportsDesc,
      preview: (
        <div className="mt-4 p-3 bg-white rounded-lg border border-card-border">
          <div className="flex items-end gap-1 h-12">
            {[40, 65, 45, 80, 55, 70, 90].map((h, i) => (
              <div key={i} className="flex-1 bg-primary-green/20 rounded-t" style={{ height: `${h}%` }}>
                <div className="w-full bg-primary-green rounded-t" style={{ height: `${h * 0.6}%` }} />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-text-muted mt-1">
            <span>Пн</span><span>Вт</span><span>Ср</span><span>Чт</span><span>Пт</span><span>Сб</span><span>Вс</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="features" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-dark">
            {t.featuresTitle}
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureCards.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-soft-green-bg border border-card-border hover:shadow-lg hover:border-primary-green/20 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-white border border-card-border flex items-center justify-center mb-4 shadow-sm">
                <feature.icon size={24} className="text-primary-green" />
              </div>
              <h3 className="text-lg font-semibold text-text-dark mb-2">{feature.title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">{feature.desc}</p>
              {feature.preview}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

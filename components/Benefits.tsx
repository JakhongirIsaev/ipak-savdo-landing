"use client";

import { motion } from "framer-motion";
import { Zap, ClipboardCheck, TrendingUp, QrCode, Receipt, Users, FileBarChart, Target } from "lucide-react";
import { Locale, getDictionary } from "@/lib/locale";

interface BenefitsProps {
  locale: Locale;
}

export default function Benefits({ locale }: BenefitsProps) {
  const t = getDictionary(locale);

  const benefitsList = [
    { icon: Zap, text: t.ben1 },
    { icon: ClipboardCheck, text: t.ben2 },
    { icon: TrendingUp, text: t.ben3 },
    { icon: QrCode, text: t.ben4 },
    { icon: Receipt, text: t.ben5 },
    { icon: Users, text: t.ben6 },
    { icon: FileBarChart, text: t.ben7 },
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
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-dark">
            {t.benefitsTitle}
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {benefitsList.map((benefit, i) => (
            <motion.div
              key={benefit.text}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-start gap-4 p-5 bg-white rounded-xl border border-card-border hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 rounded-lg bg-soft-mint flex items-center justify-center flex-shrink-0">
                <benefit.icon size={20} className="text-primary-green" />
              </div>
              <p className="text-sm font-medium text-text-dark leading-relaxed pt-2">{benefit.text}</p>
            </motion.div>
          ))}
        </div>

        {/* Summary card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary-dark-green to-primary-green rounded-2xl p-8 text-white text-center"
        >
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
            <Target size={32} className="text-lime-accent" />
          </div>
          <p className="text-xl lg:text-2xl font-bold">{t.benSummary}</p>
        </motion.div>
      </div>
    </section>
  );
}

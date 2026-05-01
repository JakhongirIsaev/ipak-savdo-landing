"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Locale, getDictionary } from "@/lib/locale";

interface LaunchOfferProps {
  locale: Locale;
  showFreemiumOffer: boolean;
  onOpenModal: () => void;
}

export default function LaunchOffer({ locale, showFreemiumOffer, onOpenModal }: LaunchOfferProps) {
  const t = getDictionary(locale);

  return (
    <section id="launch" className="py-16 lg:py-24 bg-gradient-to-br from-primary-dark-green via-primary-green to-accent-green text-white overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-lime-accent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-white rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm text-lime-accent font-medium mb-6">
            <Sparkles size={16} />
            {showFreemiumOffer ? "Специальное предложение" : "Ранний доступ"}
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
            {t.launchTitle}
          </h2>

          <p className="text-white/80 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            {showFreemiumOffer
              ? "Первые 6 месяцев — бесплатно для участников пилота."
              : t.launchText}
          </p>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenModal}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-dark-green font-bold rounded-xl hover:bg-soft-mint transition-colors shadow-xl"
          >
            {t.launchCta}
            <ArrowRight size={20} />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

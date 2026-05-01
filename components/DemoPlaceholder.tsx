"use client";

import { motion } from "framer-motion";
import { Play, X } from "lucide-react";
import { useState } from "react";
import { Locale, getDictionary } from "@/lib/locale";

interface DemoPlaceholderProps {
  locale: Locale;
}

export default function DemoPlaceholder({ locale }: DemoPlaceholderProps) {
  const t = getDictionary(locale);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-dark mb-4">
              {t.demoTitle}
            </h2>
            <p className="text-text-muted max-w-2xl mx-auto">
              {t.demoText}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative max-w-3xl mx-auto"
          >
            <div
              onClick={() => setIsOpen(true)}
              className="relative aspect-video bg-gradient-to-br from-primary-dark-green to-primary-green rounded-2xl overflow-hidden cursor-pointer group shadow-xl"
            >
              {/* Abstract UI pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-8 left-8 w-32 h-20 bg-white/10 rounded-lg" />
                <div className="absolute top-8 right-8 w-24 h-20 bg-white/10 rounded-lg" />
                <div className="absolute bottom-8 left-8 right-8 h-16 bg-white/10 rounded-lg" />
                <div className="absolute top-32 left-8 right-8 h-24 bg-white/5 rounded-lg" />
              </div>

              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 group-hover:bg-white/30 transition-colors"
                >
                  <Play size={32} className="text-white ml-1" fill="white" />
                </motion.div>
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <span className="text-white/80 text-sm font-medium">{t.demoWatch}</span>
                <span className="text-white/60 text-xs">2:30</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modal */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 rounded-full bg-soft-mint flex items-center justify-center mx-auto mb-4">
              <Play size={28} className="text-primary-green" />
            </div>
            <h3 className="text-xl font-bold text-text-dark mb-2">{t.demoWatch}</h3>
            <p className="text-text-muted mb-6">{t.demoModalText}</p>
            <button
              onClick={() => setIsOpen(false)}
              className="px-6 py-2.5 bg-primary-green text-white font-semibold rounded-xl hover:bg-accent-green transition-colors"
            >
              {t.modalClose}
            </button>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}

"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Locale, getDictionary } from "@/lib/locale";

interface StickyCTAProps {
  locale: Locale;
  onOpenModal: () => void;
}

export default function StickyCTA({ locale, onOpenModal }: StickyCTAProps) {
  const t = getDictionary(locale);

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 2, type: "spring", stiffness: 100 }}
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-card-border shadow-lg lg:hidden"
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        <button
          onClick={onOpenModal}
          className="w-full py-3 bg-cta-green text-white font-semibold rounded-xl hover:bg-accent-green transition-colors flex items-center justify-center gap-2"
        >
          {t.ctaApply}
          <ArrowRight size={18} />
        </button>
      </div>
    </motion.div>
  );
}

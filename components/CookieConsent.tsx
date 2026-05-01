"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Locale, getDictionary } from "@/lib/locale";

interface CookieConsentProps {
  locale: Locale;
}

export default function CookieConsent({ locale }: CookieConsentProps) {
  const t = getDictionary(locale);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    setVisible(false);
  };

  const handleLater = () => {
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-card-border shadow-2xl"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-text-muted text-center sm:text-left">
                {t.cookieText}
              </p>
              <div className="flex items-center gap-3 flex-shrink-0">
                <button
                  onClick={handleLater}
                  className="px-4 py-2 text-sm text-text-muted hover:text-text-dark transition-colors"
                >
                  {t.cookieLater}
                </button>
                <button
                  onClick={handleAccept}
                  className="px-4 py-2 bg-cta-green text-white text-sm font-semibold rounded-lg hover:bg-accent-green transition-colors"
                >
                  {t.cookieAccept}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

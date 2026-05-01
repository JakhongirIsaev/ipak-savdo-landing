"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Locale, getDictionary } from "@/lib/locale";
import { cn } from "@/lib/utils";

interface HeaderProps {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  onOpenModal: () => void;
}

export default function Header({ locale, onLocaleChange, onOpenModal }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const t = getDictionary(locale);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: t.navFeatures, href: "#features" },
    { label: t.navHowItWorks, href: "#workflow" },
    { label: t.navForWhom, href: "#segments" },
    { label: t.navPricing, href: "#launch" },
    { label: t.navFAQ, href: "#faq" },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/90 backdrop-blur-md border-b border-card-border shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-green flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18" />
                <path d="M9 21V9" />
              </svg>
            </div>
            <span className="text-xl font-bold text-text-dark">{t.logo}</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className="text-sm font-medium text-text-muted hover:text-primary-green transition-colors"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <div className="hidden sm:flex items-center gap-1 text-sm font-medium">
              <button
                onClick={() => onLocaleChange("ru")}
                className={cn(
                  "px-2 py-1 rounded transition-colors",
                  locale === "ru" ? "text-primary-green bg-soft-mint" : "text-text-muted hover:text-text-dark"
                )}
              >
                {t.langRu}
              </button>
              <span className="text-card-border">|</span>
              <button
                onClick={() => onLocaleChange("uz")}
                className={cn(
                  "px-2 py-1 rounded transition-colors",
                  locale === "uz" ? "text-primary-green bg-soft-mint" : "text-text-muted hover:text-text-dark"
                )}
              >
                {t.langUz}
              </button>
            </div>

            {/* CTA Button */}
            <button
              onClick={onOpenModal}
              className="hidden sm:inline-flex items-center px-4 py-2 bg-cta-green text-white text-sm font-semibold rounded-lg hover:bg-accent-green transition-colors shadow-sm"
            >
              {t.ctaApply}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-text-dark"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-card-border overflow-hidden"
          >
            <div className="px-4 py-4 space-y-3">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className="block w-full text-left py-2 text-text-dark font-medium"
                >
                  {item.label}
                </button>
              ))}
              <div className="flex items-center gap-2 pt-2 border-t border-card-border">
                <button
                  onClick={() => onLocaleChange("ru")}
                  className={cn(
                    "px-3 py-1 rounded text-sm",
                    locale === "ru" ? "text-primary-green bg-soft-mint font-semibold" : "text-text-muted"
                  )}
                >
                  {t.langRu}
                </button>
                <button
                  onClick={() => onLocaleChange("uz")}
                  className={cn(
                    "px-3 py-1 rounded text-sm",
                    locale === "uz" ? "text-primary-green bg-soft-mint font-semibold" : "text-text-muted"
                  )}
                >
                  {t.langUz}
                </button>
              </div>
              <button
                onClick={onOpenModal}
                className="w-full py-3 bg-cta-green text-white font-semibold rounded-lg"
              >
                {t.ctaApply}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

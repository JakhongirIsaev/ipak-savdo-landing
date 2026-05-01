"use client";

import { motion } from "framer-motion";
import { QrCode, Package, Wifi, BarChart3, ArrowRight, MessageCircle, Play } from "lucide-react";
import { Locale, getDictionary } from "@/lib/locale";
import { cn } from "@/lib/utils";

interface HeroProps {
  locale: Locale;
  onOpenModal: () => void;
  showBankBadge: boolean;
}

export default function Hero({ locale, onOpenModal, showBankBadge }: HeroProps) {
  const t = getDictionary(locale);

  const badges = [
    { icon: QrCode, text: t.badgeQR },
    { icon: Package, text: t.badgeStock },
    { icon: Wifi, text: t.badgeOffline },
    { icon: BarChart3, text: t.badgeReports },
  ];

  const floatingCards = [
    { label: "QR оплата", value: "успешно", color: "bg-cta-green" },
    { label: "Остатки", value: "обновлены", color: "bg-primary-green" },
    { label: "Чек", value: "в Telegram", color: "bg-accent-green" },
    { label: "Выручка", value: "3 450 000 сум", color: "bg-primary-dark-green" },
  ];

  return (
    <section className="relative pt-24 lg:pt-32 pb-16 lg:pb-24 overflow-hidden bg-gradient-to-b from-soft-green-bg to-white">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-lime-accent/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-soft-mint/50 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {showBankBadge && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-soft-mint rounded-full text-sm text-primary-green font-medium"
              >
                <div className="w-2 h-2 rounded-full bg-cta-green" />
                {t.bankBadge}
              </motion.div>
            )}

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-dark leading-tight">
              {t.heroTitle}
            </h1>

            <p className="text-lg text-text-muted leading-relaxed max-w-xl">
              {t.heroSubtitle}
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {badges.map((badge, i) => (
                <motion.div
                  key={badge.text}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border border-card-border text-sm text-text-dark shadow-sm"
                >
                  <badge.icon size={14} className="text-primary-green" />
                  <span>{badge.text}</span>
                </motion.div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onOpenModal}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-cta-green text-white font-semibold rounded-xl hover:bg-accent-green transition-colors shadow-lg shadow-cta-green/25"
              >
                {t.primaryCta}
                <ArrowRight size={18} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onOpenModal}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-text-dark font-semibold rounded-xl border border-card-border hover:bg-soft-green-bg transition-colors"
              >
                <MessageCircle size={18} className="text-primary-green" />
                {t.telegramCta}
              </motion.button>
            </div>

            <button
              onClick={onOpenModal}
              className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary-green transition-colors"
            >
              <Play size={16} />
              {t.demoCta}
            </button>

            <p className="text-sm text-text-muted pt-2">
              {t.trustLine}
            </p>
          </motion.div>

          {/* Right - Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            {/* Phone frame */}
            <div className="relative mx-auto w-72 sm:w-80">
              <div className="relative bg-text-dark rounded-[2.5rem] p-3 shadow-2xl">
                <div className="bg-white rounded-[2rem] overflow-hidden">
                  {/* Status bar */}
                  <div className="bg-primary-dark-green text-white px-6 py-2 flex justify-between items-center text-xs">
                    <span>9:41</span>
                    <div className="flex gap-1">
                      <div className="w-4 h-2.5 bg-white/30 rounded-sm" />
                      <div className="w-4 h-2.5 bg-white/30 rounded-sm" />
                      <div className="w-4 h-2.5 bg-white rounded-sm" />
                    </div>
                  </div>

                  {/* App content */}
                  <div className="p-4 space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-text-dark">Ipak Savdo</span>
                      <div className="w-8 h-8 rounded-full bg-soft-mint flex items-center justify-center">
                        <span className="text-xs font-bold text-primary-green">ИП</span>
                      </div>
                    </div>

                    {/* Revenue card */}
                    <div className="bg-gradient-to-r from-primary-green to-accent-green rounded-xl p-3 text-white">
                      <p className="text-xs opacity-80">Выручка сегодня</p>
                      <p className="text-xl font-bold">3 450 000 сум</p>
                      <div className="flex gap-4 mt-2 text-xs opacity-80">
                        <span>42 продажи</span>
                        <span>Средний чек: 87 000</span>
                      </div>
                    </div>

                    {/* Cart items */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center py-2 border-b border-card-border">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-soft-mint flex items-center justify-center text-xs">🥛</div>
                          <div>
                            <p className="text-sm font-medium">Молоко 1л</p>
                            <p className="text-xs text-text-muted">1 шт × 14 000</p>
                          </div>
                        </div>
                        <span className="text-sm font-semibold">14 000</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-card-border">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-soft-mint flex items-center justify-center text-xs">🍞</div>
                          <div>
                            <p className="text-sm font-medium">Хлеб</p>
                            <p className="text-xs text-text-muted">1 шт × 4 000</p>
                          </div>
                        </div>
                        <span className="text-sm font-semibold">4 000</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-soft-mint flex items-center justify-center text-xs">☕</div>
                          <div>
                            <p className="text-sm font-medium">Кофе 3в1</p>
                            <p className="text-xs text-text-muted">1 шт × 2 500</p>
                          </div>
                        </div>
                        <span className="text-sm font-semibold">2 500</span>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-center pt-2 border-t-2 border-text-dark">
                      <span className="font-semibold">Итого</span>
                      <span className="text-lg font-bold text-primary-green">20 500 сум</span>
                    </div>

                    {/* QR Button */}
                    <button className="w-full py-3 bg-cta-green text-white font-semibold rounded-xl flex items-center justify-center gap-2">
                      <QrCode size={18} />
                      Оплатить по QR
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating cards */}
              {floatingCards.map((card, i) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.15, duration: 0.5 }}
                  className={cn(
                    "absolute px-3 py-2 rounded-lg text-white text-xs font-medium shadow-lg",
                    card.color,
                    i === 0 && "-top-4 -right-4",
                    i === 1 && "top-20 -left-8",
                    i === 2 && "bottom-24 -right-6",
                    i === 3 && "-bottom-4 left-8"
                  )}
                >
                  <div className="text-[10px] opacity-80">{card.label}</div>
                  <div className="font-semibold">{card.value}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

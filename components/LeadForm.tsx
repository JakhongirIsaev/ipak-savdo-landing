"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";
import { Locale, getDictionary } from "@/lib/locale";

interface LeadFormProps {
  locale: Locale;
}

export default function LeadForm({ locale }: LeadFormProps) {
  const t = getDictionary(locale);
  const [showOptional, setShowOptional] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    businessType: "",
    telegram: "",
    city: "",
    points: "",
    comment: "",
  });

  const businessTypes = locale === "ru" ? [
    "Магазин у дома",
    "Минимаркет",
    "Кафе / общепит",
    "Аптека",
    "Одежда / бутик",
    "Сервисная точка",
    "Другое",
  ] : [
    "Uy yonidagi do'kon",
    "Minimarket",
    "Kafe / oshxona",
    "Dorixona",
    "Kiyim / butik",
    "Xizmat ko'rsatish nuqtasi",
    "Boshqa",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: connect lead form to backend API or webhook
    console.log("Form submitted:", formData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 bg-soft-green-bg rounded-2xl border border-card-border"
          >
            <div className="w-16 h-16 rounded-full bg-cta-green/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} className="text-cta-green" />
            </div>
            <h3 className="text-xl font-bold text-text-dark mb-2">{t.formSuccess}</h3>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="bg-soft-green-bg rounded-2xl p-6 lg:p-8 border border-card-border"
        >
          <h3 className="text-xl font-bold text-text-dark mb-6 text-center">{t.modalTitle}</h3>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5">{t.formName} *</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-card-border bg-white text-text-dark placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all"
                placeholder={locale === "ru" ? "Иван Иванов" : "Ism Familiya"}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5">{t.formPhone} *</label>
              <input
                required
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-card-border bg-white text-text-dark placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all"
                placeholder="+998 90 123 45 67"
              />
            </div>

            {/* Business Type */}
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5">{t.formBusinessType} *</label>
              <select
                required
                value={formData.businessType}
                onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-card-border bg-white text-text-dark focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all appearance-none"
              >
                <option value="">{locale === "ru" ? "Выберите тип бизнеса" : "Biznes turini tanlang"}</option>
                {businessTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Optional fields toggle */}
            <button
              type="button"
              onClick={() => setShowOptional(!showOptional)}
              className="flex items-center gap-2 text-sm text-primary-green font-medium hover:text-accent-green transition-colors"
            >
              {showOptional ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              {t.formOptional}
            </button>

            {/* Optional fields */}
            {showOptional && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 pt-2"
              >
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1.5">{t.formTelegram}</label>
                  <input
                    type="text"
                    value={formData.telegram}
                    onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-card-border bg-white text-text-dark placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all"
                    placeholder="@username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1.5">{t.formCity}</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-card-border bg-white text-text-dark placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all"
                    placeholder={locale === "ru" ? "Ташкент" : "Toshkent"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1.5">{t.formPoints}</label>
                  <input
                    type="number"
                    value={formData.points}
                    onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-card-border bg-white text-text-dark placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all"
                    placeholder="1"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1.5">{t.formComment}</label>
                  <textarea
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-card-border bg-white text-text-dark placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all resize-none"
                    placeholder={locale === "ru" ? "Дополнительная информация..." : "Qo'shimcha ma'lumot..."}
                  />
                </div>
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              className="w-full py-3.5 bg-cta-green text-white font-semibold rounded-xl hover:bg-accent-green transition-colors shadow-lg shadow-cta-green/25 flex items-center justify-center gap-2"
            >
              <Send size={18} />
              {t.formSubmit}
            </motion.button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}

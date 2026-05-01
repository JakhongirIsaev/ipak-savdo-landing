"use client";

import { motion } from "framer-motion";
import { FileText, Download, Play } from "lucide-react";
import { Locale, getDictionary } from "@/lib/locale";

interface HowToStartProps {
  locale: Locale;
}

export default function HowToStart({ locale }: HowToStartProps) {
  const t = getDictionary(locale);

  const steps = [
    { icon: FileText, num: "1", title: t.step1Title, desc: t.step1Desc },
    { icon: Download, num: "2", title: t.step2Title, desc: t.step2Desc },
    { icon: Play, num: "3", title: t.step3Title, desc: t.step3Desc },
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
            {t.howToStartTitle}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-white border border-card-border flex items-center justify-center mx-auto mb-4 shadow-sm">
                <step.icon size={28} className="text-primary-green" />
              </div>
              <div className="w-8 h-8 rounded-full bg-cta-green text-white font-bold text-sm flex items-center justify-center mx-auto -mt-12 mb-4 relative z-10 border-4 border-soft-green-bg">
                {step.num}
              </div>
              <h3 className="text-lg font-semibold text-text-dark mb-2">{step.title}</h3>
              <p className="text-sm text-text-muted">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { CreditCard, Eye, Receipt, FileX } from "lucide-react";
import { Locale, getDictionary } from "@/lib/locale";

interface ProblemSectionProps {
  locale: Locale;
}

export default function ProblemSection({ locale }: ProblemSectionProps) {
  const t = getDictionary(locale);

  const problems = [
    { icon: CreditCard, title: t.problem1Title, desc: t.problem1Desc },
    { icon: Eye, title: t.problem2Title, desc: t.problem2Desc },
    { icon: Receipt, title: t.problem3Title, desc: t.problem3Desc },
    { icon: FileX, title: t.problem4Title, desc: t.problem4Desc },
  ];

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-dark max-w-3xl mx-auto">
            {t.problemTitle}
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, i) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-soft-green-bg border border-card-border hover:border-primary-green/30 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center mb-4">
                <problem.icon size={24} className="text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold text-text-dark mb-2">{problem.title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">{problem.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

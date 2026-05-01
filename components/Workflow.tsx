"use client";

import { motion } from "framer-motion";
import { ScanLine, ShoppingCart, QrCode, Banknote, FileText, Package, BarChart3, ArrowRight } from "lucide-react";
import { Locale, getDictionary } from "@/lib/locale";

interface WorkflowProps {
  locale: Locale;
}

export default function Workflow({ locale }: WorkflowProps) {
  const t = getDictionary(locale);

  const steps = [
    { icon: ScanLine, label: t.stepScan },
    { icon: ShoppingCart, label: t.stepCart },
    { icon: QrCode, label: t.stepQR },
    { icon: Banknote, label: t.stepPay },
    { icon: FileText, label: t.stepReceipt },
    { icon: Package, label: t.stepStock },
    { icon: BarChart3, label: t.stepReport },
  ];

  return (
    <section id="workflow" className="py-16 lg:py-24 bg-soft-green-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-dark mb-4">
            {t.workflowTitle}
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto">
            {t.workflowSubtitle}
          </p>
        </motion.div>

        {/* Desktop horizontal workflow */}
        <div className="hidden lg:flex items-center justify-center gap-2">
          {steps.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-xl bg-white border border-card-border flex items-center justify-center shadow-sm">
                  <step.icon size={24} className="text-primary-green" />
                </div>
                <span className="text-xs font-medium text-text-dark">{step.label}</span>
              </div>
              {i < steps.length - 1 && (
                <ArrowRight size={16} className="text-card-border mx-2 flex-shrink-0" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Mobile vertical workflow */}
        <div className="lg:hidden space-y-4 max-w-sm mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-white border border-card-border flex items-center justify-center shadow-sm flex-shrink-0">
                <step.icon size={20} className="text-primary-green" />
              </div>
              <span className="text-sm font-medium text-text-dark">{step.label}</span>
              {i < steps.length - 1 && (
                <div className="ml-auto">
                  <ArrowRight size={14} className="text-card-border rotate-90" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

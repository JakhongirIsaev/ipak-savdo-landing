"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock, Rocket } from "lucide-react";
import { Locale, getDictionary } from "@/lib/locale";

interface RoadmapProps {
  locale: Locale;
}

export default function Roadmap({ locale }: RoadmapProps) {
  const t = getDictionary(locale);

  const phases = [
    {
      icon: CheckCircle2,
      title: t.roadmapNow,
      desc: t.roadmapNowDesc,
      status: "active" as const,
      color: "bg-cta-green",
    },
    {
      icon: Clock,
      title: t.roadmapSoon,
      desc: t.roadmapSoonDesc,
      status: "upcoming" as const,
      color: "bg-primary-green",
    },
    {
      icon: Rocket,
      title: t.roadmapLater,
      desc: t.roadmapLaterDesc,
      status: "future" as const,
      color: "bg-primary-dark-green",
    },
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
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-dark mb-4">
            {t.roadmapTitle}
          </h2>
          <p className="text-text-muted max-w-3xl mx-auto">
            {t.roadmapText}
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line - desktop */}
          <div className="hidden lg:block absolute top-8 left-0 right-0 h-0.5 bg-card-border" />

          <div className="grid lg:grid-cols-3 gap-8">
            {phases.map((phase, i) => (
              <motion.div
                key={phase.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative"
              >
                {/* Timeline dot - desktop */}
                <div className="hidden lg:flex justify-center mb-6">
                  <div className={`w-16 h-16 rounded-full ${phase.color} flex items-center justify-center shadow-lg z-10`}>
                    <phase.icon size={28} className="text-white" />
                  </div>
                </div>

                <div className="bg-soft-green-bg rounded-2xl p-6 border border-card-border h-full">
                  <div className="lg:hidden flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-full ${phase.color} flex items-center justify-center`}>
                      <phase.icon size={20} className="text-white" />
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      phase.status === "active" ? "bg-cta-green/10 text-cta-green" :
                      phase.status === "upcoming" ? "bg-primary-green/10 text-primary-green" :
                      "bg-primary-dark-green/10 text-primary-dark-green"
                    }`}>
                      {phase.status === "active" ? "Сейчас" : phase.status === "upcoming" ? "Скоро" : "Далее"}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-text-dark mb-2">{phase.title}</h3>
                  <p className="text-text-muted text-sm leading-relaxed">{phase.desc}</p>

                  {phase.status === "active" && (
                    <div className="mt-4 flex items-center gap-2 text-cta-green text-sm font-medium">
                      <div className="w-2 h-2 rounded-full bg-cta-green animate-pulse" />
                      В разработке
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

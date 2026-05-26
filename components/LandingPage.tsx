"use client";

import { useCallback, useEffect, useState } from "react";
import { dicts } from "@/lib/landing/i18n";
import { useAttribution } from "@/lib/use-attribution";
import type { Locale } from "@/components/landing/_shared";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { TrustStrip } from "@/components/landing/TrustStrip";
import { Pain } from "@/components/landing/Pain";
import { Capabilities } from "@/components/landing/Capabilities";
import { VoiceInsert } from "@/components/landing/VoiceInsert";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { ForOwner } from "@/components/landing/ForOwner";
import { WhyBirliy } from "@/components/landing/WhyBirliy";
import { SegmentsV2 } from "@/components/landing/SegmentsV2";
import { Equipment } from "@/components/landing/Equipment";
import { Freemium } from "@/components/landing/Freemium";
import { Roadmap } from "@/components/landing/Roadmap";
import { EarlyAccess } from "@/components/landing/EarlyAccess";
import { LeadSection } from "@/components/landing/LeadSection";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";
import { Cookie } from "@/components/landing/Cookie";

export default function LandingPage() {
  const [locale, setLocale] = useState<Locale>("ru");
  const attribution = useAttribution();
  const t = dicts[locale];

  useEffect(() => {
    const saved = localStorage.getItem("birliy-locale") as Locale | null;
    if (saved === "ru" || saved === "uz") setLocale(saved);
  }, []);

  const switchLocale = useCallback((loc: Locale) => {
    setLocale(loc);
    localStorage.setItem("birliy-locale", loc);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const navTargets = ["capabilities", "equipment", "faq"];

  return (
    <main className="min-h-screen bg-paper text-ink-900 antialiased">
      <Header t={t} locale={locale} switchLocale={switchLocale} scrollTo={scrollTo} navTargets={navTargets} />
      <Hero t={t} />
      <TrustStrip t={t.trustStrip} />
      <Pain t={t.pain} />
      <HowItWorks id="how-it-works" t={t.howItWorks} />
      <Capabilities t={t} />
      <VoiceInsert t={t} />
      <ForOwner id="owner" t={t.owner} />
      <WhyBirliy t={t} />
      <SegmentsV2 id="segments" t={t.segmentsV2} />
      <Equipment t={t} />
      <Freemium id="freemium" t={t.freemium} />
      <Roadmap t={t} />
      <EarlyAccess t={t.earlyAccess} />
      <LeadSection t={t} locale={locale} attribution={attribution} />
      <FAQ t={t} />
      <Footer t={t} locale={locale} switchLocale={switchLocale} />
      <Cookie t={t} />
    </main>
  );
}

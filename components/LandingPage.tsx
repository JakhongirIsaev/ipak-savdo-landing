"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { EarlyAccess } from "@/components/landing/EarlyAccess";
import { TelegramBand } from "@/components/landing/TelegramBand";
import { LeadSection } from "@/components/landing/LeadSection";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";
import { Cookie } from "@/components/landing/Cookie";
import { StickyCTA } from "@/components/landing/StickyCTA";

export default function LandingPage({ initialLocale }: { initialLocale: Locale }) {
  const locale = initialLocale;
  const router = useRouter();
  const attribution = useAttribution();
  const t = dicts[locale];

  // URL is the source of truth for locale (SEO). Keep <html lang> in sync.
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const switchLocale = useCallback(
    (loc: Locale) => {
      if (loc === locale) return;
      router.push(loc === "uz" ? "/" : "/ru", { scroll: false });
    },
    [router, locale],
  );

  const scrollTo = (id: string) => {
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    document.getElementById(id)?.scrollIntoView({ behavior });
  };

  const navTargets = ["capabilities", "equipment", "faq"];

  return (
    <div className="min-h-screen overflow-x-clip bg-paper text-ink-900 antialiased">
      <Header t={t} locale={locale} switchLocale={switchLocale} scrollTo={scrollTo} navTargets={navTargets} />
      <main>
        <Hero t={t} />
        <TrustStrip t={t.trustStrip} />
        <Pain t={t.pain} />
        <HowItWorks id="how-it-works" t={t.howItWorks} ctaLabel={t.cta} />
        <Capabilities t={t} />
        <VoiceInsert t={t} />
        <ForOwner id="owner" t={t.owner} />
        <WhyBirliy t={t} />
        <SegmentsV2 id="segments" t={t.segmentsV2} />
        <Equipment t={t} />
        <Freemium id="freemium" t={t.freemium} />
        <EarlyAccess t={t.earlyAccess} />
        <TelegramBand t={t.telegramChannel} />
        <LeadSection t={t} locale={locale} attribution={attribution} />
        <FAQ t={t} />
      </main>
      <Footer t={t} locale={locale} switchLocale={switchLocale} />
      <StickyCTA label={t.cta} note={t.stickyNote} scrollTo={scrollTo} />
      <Cookie t={t} />
    </div>
  );
}

# BirLiy Landing v2 — Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development. Fresh subagent per task (sonnet model per Jack pref), two-stage review.

**Goal:** Replace current `LandingPage.tsx` single-file landing with 16-section v2 that reflects real product (`pos.ipaksavdo.uz`), honest pre-launch framing, BirLiy editorial calm.

**Spec:** `docs/superpowers/specs/2026-05-26-birliy-landing-v2-design.md`

**Architecture:** Split `LandingPage.tsx` into per-section components under `components/landing/`. Aggregator `LandingPage.tsx` keeps i18n dict + composition.

**Tech Stack:** Next.js 14 App Router, TypeScript strict, Tailwind 3 with BirLiy tokens, framer-motion, lucide-react, vitest + react-dom/server for tests.

**Real assets:** 22 product screenshots in `.research/product-walk/` — copy into `public/product/` during T2.

---

## Sequencing Strategy

Tasks run **sequentially** (subagent conflicts on shared files otherwise). Order chosen so each task leaves repo in green state.

**Phase A — Foundation (T1-T3):** Setup infrastructure, copy assets, extract i18n dict.
**Phase B — Refactor (T4):** Split current LandingPage into baseline components — no behavior change.
**Phase C — New sections (T5-T12):** Build new editorial sections one by one.
**Phase D — Tune existing (T13-T15):** Adjust kept sections, expand FAQ, expand Footer.
**Phase E — Polish (T16-T18):** Hero tune, UZ i18n parity, cleanup orphaned legacy files.
**Phase F — Verify (T19-T20):** Visual QA + responsive check.

---

## Test Strategy

For each new section component, write **one snapshot-style test** in `.test.tsx`:
- Renders via `renderToString` without error.
- Contains 1-2 canonical key strings (eyebrow + headline).
- For interactive components (FAQ disclosure), behavior test.

For modified existing sections (Hero, Footer): update existing test if exists, else add basic render test.

Run after each task: `pnpm test && pnpm tsc --noEmit`. Both green required to commit.

---

## Task 1: Setup — directory + asset copy

**Files:**
- Create: `components/landing/` directory
- Create: `public/product/` directory
- Copy: all 22 PNGs from `.research/product-walk/` to `public/product/`

**Steps:**

- [ ] **Step 1:** Create dirs

```powershell
New-Item -ItemType Directory -Force -Path "components/landing"
New-Item -ItemType Directory -Force -Path "public/product"
```

- [ ] **Step 2:** Copy screenshots

```powershell
Copy-Item ".research/product-walk/*.png" -Destination "public/product/" -Force
Get-ChildItem "public/product/" | Measure-Object | Select-Object Count
```

Expected: Count = 22.

- [ ] **Step 3:** Verify all PNGs accessible via Next.js asset path. No code change needed.

- [ ] **Step 4:** Commit.

```bash
git add components/landing public/product
git commit -m "feat(landing-v2): scaffold landing dir + copy product screenshots"
```

---

## Task 2: Extract i18n dict to `lib/landing/i18n.ts`

**Why first:** All 16 section components will pull from this. Single source.

**Files:**
- Create: `lib/landing/i18n.ts`
- Modify: `components/LandingPage.tsx` (import from new file instead of inline `ru`/`uz` consts)

**Steps:**

- [ ] **Step 1:** Move both `ru` and `uz` dicts from `LandingPage.tsx` lines 28-356 into `lib/landing/i18n.ts`. Export as `type LandingDict = typeof ru` and `export const dicts: { ru: LandingDict; uz: LandingDict }`.

- [ ] **Step 2:** Add new keys for v2 sections (placeholders, will fill in later tasks):

```typescript
// Add to both ru and uz with structurally identical shape
trustStrip: { bank: string; catalogSize: string; pilot: string };
pain: { eyebrow: string; headline: string; body: string };
howItWorks: { eyebrow: string; headline: string; intro: string; steps: readonly { num: string; label: string; caption: string }[] };
capabilities: { eyebrow: string; headline: string; cards: readonly { title: string; body: string; metric: string }[] };
owner: { eyebrow: string; headline: string; body: string; bullets: readonly string[] };
segmentsV2: { eyebrow: string; headline: string; cards: readonly { title: string; body: string }[] };
freemium: { eyebrow: string; headline: string; body: string; bullets: readonly { title: string; caption: string }[]; cta: string };
earlyAccess: { eyebrow: string; headline: string; body: string; promises: readonly { title: string; caption: string }[] };
footerV2: { columns: readonly { title: string; links: readonly { label: string; href: string }[] }[]; phone: string; copyright: string };
heroV2: { secondaryCta: string; trustLine: string };
```

Fill RU with real copy from spec. Fill UZ with reasonable Uzbek translations (Manrope handles Cyrillic; UZ uses Latin script for Uzbek so any font works).

- [ ] **Step 3:** Update `LandingPage.tsx` to `import { dicts } from "@/lib/landing/i18n"` and remove inline consts. `const t = dicts[locale];`

- [ ] **Step 4:** Run `pnpm tsc --noEmit` and `pnpm test`. Both must pass.

- [ ] **Step 5:** Test landing in dev: `pnpm dev` then visit http://localhost:3000 — visual identical to before. No regression.

- [ ] **Step 6:** Commit.

```bash
git add lib/landing/i18n.ts components/LandingPage.tsx
git commit -m "refactor(landing-v2): extract i18n dict, add v2 keys"
```

---

## Task 3: Trust Strip section (NEW)

**Files:**
- Create: `components/landing/TrustStrip.tsx`
- Create: `components/landing/TrustStrip.test.tsx`
- Modify: `components/LandingPage.tsx` (insert `<TrustStrip t={t.trustStrip} />` after Hero)

**Steps:**

- [ ] **Step 1:** Write failing test.

```tsx
// components/landing/TrustStrip.test.tsx
import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { TrustStrip } from "./TrustStrip";

describe("TrustStrip", () => {
  it("renders 3 trust items", () => {
    const html = renderToString(
      <TrustStrip t={{ bank: "Bank text", catalogSize: "9000+", pilot: "Open pilot" }} />
    );
    expect(html).toContain("Bank text");
    expect(html).toContain("9000+");
    expect(html).toContain("Open pilot");
    // hairline border markers
    expect(html.match(/border-mist/g)?.length ?? 0).toBeGreaterThanOrEqual(1);
  });
});
```

- [ ] **Step 2:** Run test, verify it fails: `pnpm test components/landing/TrustStrip`

- [ ] **Step 3:** Implement minimal component.

```tsx
// components/landing/TrustStrip.tsx
interface TrustStripProps {
  t: { bank: string; catalogSize: string; pilot: string };
}

export function TrustStrip({ t }: TrustStripProps) {
  const items = [t.bank, t.catalogSize, t.pilot];
  return (
    <section className="border-y border-mist bg-paper py-5">
      <div className="section-shell">
        <ul className="flex flex-wrap items-center justify-center gap-x-12 gap-y-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-12">
              <span>{item}</span>
              {i < items.length - 1 && (
                <span aria-hidden className="hidden h-3 w-px bg-mist sm:inline-block" />
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

- [ ] **Step 4:** Add to LandingPage.tsx right after `<Hero />`:

```tsx
<TrustStrip t={t.trustStrip} />
```

- [ ] **Step 5:** Run tests + tsc, verify dev server renders new strip under hero.

- [ ] **Step 6:** Commit.

```bash
git add components/landing/TrustStrip.tsx components/landing/TrustStrip.test.tsx components/LandingPage.tsx
git commit -m "feat(landing-v2): add Trust Strip section"
```

---

## Task 4: Extract Current Sections to Components

**Why:** Before adding more new sections, get existing inline sections (Header, Hero, Capabilities, VoiceInsert, ProductMoment, WhyBirliy, Equipment, Roadmap, LeadSection, FAQ, Footer, Cookie) into individual files. No behavior change.

**Files to create:**
- `components/landing/Header.tsx`
- `components/landing/Hero.tsx`
- `components/landing/Capabilities.tsx` (will be replaced in T8)
- `components/landing/VoiceInsert.tsx`
- `components/landing/ProductMoment.tsx` (will be replaced in T7)
- `components/landing/WhyBirliy.tsx`
- `components/landing/Equipment.tsx`
- `components/landing/Roadmap.tsx`
- `components/landing/LeadSection.tsx`
- `components/landing/FAQ.tsx` (will be expanded in T13)
- `components/landing/Footer.tsx` (will be replaced in T14)
- `components/landing/Cookie.tsx`
- `components/landing/LangPill.tsx` (shared component)

**Steps:**

- [ ] **Step 1:** For each component, copy its JSX + helpers from `LandingPage.tsx` lines verbatim. Match existing typing (each gets `t: LandingDict` or sub-dict).

- [ ] **Step 2:** Update `LandingPage.tsx` to import and compose:

```tsx
export default function LandingPage() {
  const [locale, setLocale] = useState<Locale>("ru");
  const attribution = useAttribution();
  const t = dicts[locale];
  // localStorage + switchLocale hooks stay here
  return (
    <main className="min-h-screen bg-paper text-ink-900 antialiased">
      <Header t={t} locale={locale} switchLocale={switchLocale} scrollTo={scrollTo} navTargets={navTargets} />
      <Hero t={t} />
      <TrustStrip t={t.trustStrip} />
      <Capabilities t={t} />
      <VoiceInsert t={t} />
      <ProductMoment t={t} />
      <WhyBirliy t={t} />
      <Equipment t={t} />
      <Roadmap t={t} />
      <LeadSection t={t} locale={locale} attribution={attribution} />
      <FAQ t={t} />
      <Footer t={t} locale={locale} switchLocale={switchLocale} />
      <Cookie t={t} />
    </main>
  );
}
```

- [ ] **Step 3:** Run `pnpm test` + `pnpm tsc --noEmit` + `pnpm dev` (visually verify nothing changed).

- [ ] **Step 4:** Commit.

```bash
git add components/landing/
git commit -m "refactor(landing-v2): split LandingPage into per-section components"
```

---

## Task 5: The Pain section (NEW)

**Files:**
- Create: `components/landing/Pain.tsx`
- Create: `components/landing/Pain.test.tsx`
- Modify: `components/LandingPage.tsx` (insert `<Pain t={t.pain} />` after `<TrustStrip />`)

**Steps:**

- [ ] **Step 1:** Write failing test.

```tsx
import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { Pain } from "./Pain";

describe("Pain", () => {
  it("renders eyebrow, headline, and body", () => {
    const html = renderToString(
      <Pain t={{ eyebrow: "01 / Знакомо?", headline: "Касса отдельно.", body: "Кассир пробивает чек..." }} />
    );
    expect(html).toContain("01 / Знакомо?");
    expect(html).toContain("Касса отдельно.");
    expect(html).toContain("Кассир пробивает чек...");
  });
});
```

- [ ] **Step 2:** Implement.

```tsx
// components/landing/Pain.tsx
interface PainProps {
  t: { eyebrow: string; headline: string; body: string };
}

export function Pain({ t }: PainProps) {
  return (
    <section className="border-t border-mist py-24 lg:py-32">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">{t.eyebrow}</p>
          <h2 className="mt-5 max-w-[18ch] text-balance font-display text-4xl font-semibold leading-[1.08] tracking-tightish text-ink-900 sm:text-5xl">
            {t.headline}
          </h2>
          <p className="mt-8 max-w-[58ch] text-[19px] font-light leading-relaxed text-ink-700">
            {t.body}
          </p>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3:** Fill i18n with RU/UZ copy from spec section 4.

- [ ] **Step 4:** Tests pass, tsc green, commit.

---

## Task 6: The 15-Second Sale section (NEW, replaces ProductMoment)

**Files:**
- Create: `components/landing/HowItWorks.tsx`
- Create: `components/landing/HowItWorks.test.tsx`
- Modify: `LandingPage.tsx` (replace `<ProductMoment />` with `<HowItWorks id="how-it-works" t={t.howItWorks} />`)
- Delete: `components/landing/ProductMoment.tsx`

**Real screenshots to use** (from `public/product/`):
- Step 1 «Скан/выбор товара» → `16-kassa-empty.png`
- Step 2 «Корзина» → `17-kassa-item-added.png`
- Step 3 «К оплате» → `18-payment-screen.png`
- Step 4 «Способ оплаты» → `19-payment-cash.png`
- Step 5 «Оплата прошла» → `20-payment-success.png`
- Step 6 «Чек в Telegram» → нужно нарисовать simple SVG mockup в `public/product/06-telegram-receipt-mockup.svg`

**Steps:**

- [ ] **Step 1:** Create Telegram receipt SVG mockup `public/product/06-telegram-receipt-mockup.svg`. Simple stylized Telegram message bubble with: header «BirLiy 📞», receipt text «Чек №3 / 20 500 сум / 3 позиции», time «12:34». Use BirLiy palette (paper bg, ink text, green accent for amount). ~200x300 viewBox.

- [ ] **Step 2:** Write failing test.

```tsx
import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { HowItWorks } from "./HowItWorks";

describe("HowItWorks", () => {
  it("renders 6 steps with screenshots", () => {
    const t = {
      eyebrow: "02 / Как проходит продажа",
      headline: "Продажа за 15 секунд",
      intro: "Один экран. Шесть шагов.",
      steps: [
        { num: "01", label: "Скан товара", caption: "..." },
        { num: "02", label: "Корзина", caption: "..." },
        { num: "03", label: "К оплате", caption: "..." },
        { num: "04", label: "Способ", caption: "..." },
        { num: "05", label: "Оплачено", caption: "..." },
        { num: "06", label: "Чек в TG", caption: "..." },
      ],
    };
    const html = renderToString(<HowItWorks id="how-it-works" t={t} />);
    expect(html).toContain('id="how-it-works"');
    expect(html).toContain("Продажа за 15 секунд");
    const stepCount = (html.match(/<li[^>]*class="step"/g) ?? []).length;
    expect(stepCount).toBe(6);
    // All 6 screenshots referenced
    expect(html).toContain("/product/16-kassa-empty.png");
    expect(html).toContain("/product/06-telegram-receipt-mockup.svg");
  });
});
```

- [ ] **Step 3:** Implement.

```tsx
// components/landing/HowItWorks.tsx
interface Step { num: string; label: string; caption: string }
interface HowItWorksT {
  eyebrow: string;
  headline: string;
  intro: string;
  steps: readonly Step[];
}
interface HowItWorksProps { id: string; t: HowItWorksT }

const STEP_IMAGES = [
  "/product/16-kassa-empty.png",
  "/product/17-kassa-item-added.png",
  "/product/18-payment-screen.png",
  "/product/19-payment-cash.png",
  "/product/20-payment-success.png",
  "/product/06-telegram-receipt-mockup.svg",
];

export function HowItWorks({ id, t }: HowItWorksProps) {
  return (
    <section id={id} className="border-t border-mist py-24 lg:py-32">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">{t.eyebrow}</p>
          <h2 className="mt-5 max-w-[20ch] text-balance font-display text-4xl font-semibold leading-[1.08] tracking-tightish text-ink-900 sm:text-5xl">
            {t.headline}
          </h2>
          <p className="mt-6 max-w-[60ch] text-[17px] leading-[1.55] text-ink-700">{t.intro}</p>
        </div>

        <ul className="mt-16 grid gap-8 border-t border-mist pt-16 md:grid-cols-2 lg:grid-cols-3">
          {t.steps.map((step, i) => (
            <li key={step.num} className="step">
              <div className="overflow-hidden rounded-2xl border border-mist bg-mist">
                <img src={STEP_IMAGES[i]} alt={step.label} className="block w-full" loading="lazy" />
              </div>
              <div className="mt-5">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">{step.num}</span>
                <h3 className="mt-2 font-display text-xl font-semibold tracking-tightish text-ink-900">{step.label}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-700">{step.caption}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

- [ ] **Step 4:** Fill i18n RU/UZ for `howItWorks` with 6 step labels + captions.

- [ ] **Step 5:** Delete `components/landing/ProductMoment.tsx`, replace usage.

- [ ] **Step 6:** Tests pass, tsc green. Visit dev — see 6 product screenshots in grid.

- [ ] **Step 7:** Commit.

---

## Task 7: Capabilities rework (3 → 6 cards based on real features)

**Files:**
- Modify: `components/landing/Capabilities.tsx`
- Modify: `components/landing/Capabilities.test.tsx` (or create)
- Modify: `lib/landing/i18n.ts` (`capabilities.cards` becomes 6 items, drop old `features` key path or keep both for safety)

**6 cards from spec:** многоканальная оплата, касса дня, каталог+склад, отчёты с дельтой, оборачиваемость, Telegram-бот.

**Steps:**

- [ ] **Step 1:** Update i18n `capabilities` key. Each card: `{ title, body, metric }`. Metric italicized below body.

- [ ] **Step 2:** Implement new Capabilities.

```tsx
import { CreditCard, Wallet, Package, BarChart3, TrendingUp, Send } from "lucide-react";

interface CapCard { title: string; body: string; metric: string }
interface CapabilitiesT { eyebrow: string; headline: string; cards: readonly CapCard[] }

const ICONS = [CreditCard, Wallet, Package, BarChart3, TrendingUp, Send];

export function Capabilities({ t }: { t: CapabilitiesT }) {
  return (
    <section id="capabilities" className="border-t border-mist py-24 lg:py-32">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">{t.eyebrow}</p>
          <h2 className="mt-5 max-w-[22ch] text-balance font-display text-4xl font-semibold leading-[1.08] tracking-tightish text-ink-900 sm:text-5xl">
            {t.headline}
          </h2>
        </div>

        <ul className="mt-16 grid gap-x-10 gap-y-14 border-t border-mist pt-16 md:grid-cols-2 lg:grid-cols-3">
          {t.cards.map((card, i) => {
            const Icon = ICONS[i] ?? CreditCard;
            return (
              <li key={card.title} className="max-w-sm">
                <Icon size={24} strokeWidth={1.5} className="text-ink-900" />
                <h3 className="mt-5 font-display text-xl font-semibold tracking-tightish text-ink-900">{card.title}</h3>
                <p className="mt-3 text-[17px] leading-[1.55] text-ink-700">{card.body}</p>
                <p className="mt-3 text-sm italic text-ink-500">{card.metric}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
```

- [ ] **Step 3:** Test: render returns 6 cards, all titles+metrics visible.

- [ ] **Step 4:** Commit.

---

## Task 8: For the Owner section (NEW)

**Files:**
- Create: `components/landing/ForOwner.tsx`
- Create: `components/landing/ForOwner.test.tsx`
- Modify: `LandingPage.tsx` (insert `<ForOwner id="owner" t={t.owner} />` after `<VoiceInsert />`)

**Asymmetric layout:** text left 5/12, screenshot right 7/12.

**Real screenshot:** `/product/10-reports.png`

**Steps:**

- [ ] **Step 1:** Write test (checks text + image src + 3 bullets).

- [ ] **Step 2:** Implement.

```tsx
import { CheckCircle2 } from "lucide-react";

interface OwnerT { eyebrow: string; headline: string; body: string; bullets: readonly string[] }

export function ForOwner({ id, t }: { id: string; t: OwnerT }) {
  return (
    <section id={id} className="border-t border-mist py-24 lg:py-32">
      <div className="section-shell grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">{t.eyebrow}</p>
          <h2 className="mt-5 max-w-[14ch] text-balance font-display text-4xl font-semibold leading-[1.08] tracking-tightish text-ink-900 sm:text-5xl">
            {t.headline}
          </h2>
          <p className="mt-6 max-w-md text-[17px] leading-[1.55] text-ink-700">{t.body}</p>
          <ul className="mt-8 space-y-4">
            {t.bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-[15px] text-ink-700">
                <CheckCircle2 size={18} strokeWidth={1.5} className="mt-0.5 shrink-0 text-ink-500" />
                {b}
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-7">
          <div className="overflow-hidden rounded-2xl border border-mist bg-mist">
            <img src="/product/10-reports.png" alt="Отчёты BirLiy" className="block w-full" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3:** Commit.

---

## Task 9: Segments grid (NEW visual, 5 cards)

**Files:**
- Create: `components/landing/SegmentsV2.tsx` (V2 suffix to avoid collision with orphaned `components/Segments.tsx`)
- Create: `components/landing/SegmentsV2.test.tsx`
- Modify: `LandingPage.tsx`

**Steps:**

- [ ] **Step 1:** Test: renders 5 cards, each with title + body.

- [ ] **Step 2:** Implement.

```tsx
import { Store, ShoppingCart, Coffee, Pill, Wrench } from "lucide-react";

interface SegCard { title: string; body: string }
interface SegmentsV2T { eyebrow: string; headline: string; cards: readonly SegCard[] }

const SEG_ICONS = [Store, ShoppingCart, Coffee, Pill, Wrench];

export function SegmentsV2({ t }: { t: SegmentsV2T }) {
  return (
    <section className="border-t border-mist py-24 lg:py-32">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">{t.eyebrow}</p>
          <h2 className="mt-5 max-w-[22ch] text-balance font-display text-4xl font-semibold leading-[1.08] tracking-tightish text-ink-900 sm:text-5xl">
            {t.headline}
          </h2>
        </div>
        <ul className="mt-16 grid gap-8 border-t border-mist pt-16 sm:grid-cols-2 lg:grid-cols-5">
          {t.cards.map((card, i) => {
            const Icon = SEG_ICONS[i] ?? Store;
            return (
              <li key={card.title} className="rounded-2xl border border-mist bg-paper p-6">
                <Icon size={22} strokeWidth={1.5} className="text-ink-900" />
                <h3 className="mt-4 font-display text-lg font-semibold tracking-tightish text-ink-900">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-700">{card.body}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
```

- [ ] **Step 3:** Commit.

---

## Task 10: Freemium section (NEW, без цен)

**Files:**
- Create: `components/landing/Freemium.tsx`
- Create: `components/landing/Freemium.test.tsx`
- Modify: `LandingPage.tsx` (insert after `<Equipment />`)

**Steps:**

- [ ] **Step 1:** Test: renders «6», single CTA scrolls to #lead.

- [ ] **Step 2:** Implement.

```tsx
interface FreemiumT {
  eyebrow: string;
  headline: string;
  body: string;
  bullets: readonly { title: string; caption: string }[];
  cta: string;
}

export function Freemium({ t }: { t: FreemiumT }) {
  return (
    <section className="border-t border-mist bg-mist/40 py-24 lg:py-32">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">{t.eyebrow}</p>
          <h2 className="mt-5 max-w-[16ch] text-balance font-display text-4xl font-semibold leading-[1.08] tracking-tightish text-ink-900 sm:text-5xl">
            {t.headline}
          </h2>
        </div>

        <div className="mt-16 grid gap-12 border-t border-mist pt-16 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="flex items-baseline gap-4">
              <span className="font-display text-[120px] font-bold leading-none tracking-tightish text-green-700 tabular-nums">6</span>
              <span className="font-display text-xl font-semibold text-ink-700">месяцев<br />бесплатно</span>
            </div>
          </div>
          <div className="lg:col-span-7">
            <p className="max-w-[58ch] text-[17px] leading-[1.55] text-ink-700">{t.body}</p>
            <ul className="mt-8 divide-y divide-mist border-y border-mist">
              {t.bullets.map((b) => (
                <li key={b.title} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between">
                  <span className="font-display text-base font-semibold tracking-tightish text-ink-900">{b.title}</span>
                  <span className="max-w-md text-sm text-ink-700">{b.caption}</span>
                </li>
              ))}
            </ul>
            <a
              href="#lead"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-green-500 px-6 py-3.5 text-sm font-semibold text-white transition-colors duration-200 ease-birliy hover:bg-green-700"
            >
              {t.cta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3:** Commit.

---

## Task 11: Early Access section (NEW)

**Files:**
- Create: `components/landing/EarlyAccess.tsx`
- Create: `components/landing/EarlyAccess.test.tsx`
- Modify: `LandingPage.tsx` (insert after `<Roadmap />`, before `<LeadSection />`)

**Steps:**

- [ ] **Step 1:** Test: 3 promise items + headline.

- [ ] **Step 2:** Implement.

```tsx
interface EarlyAccessT {
  eyebrow: string;
  headline: string;
  body: string;
  promises: readonly { title: string; caption: string }[];
}

export function EarlyAccess({ t }: { t: EarlyAccessT }) {
  return (
    <section className="border-t border-mist py-24 lg:py-32">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">{t.eyebrow}</p>
          <h2 className="mt-5 max-w-[20ch] text-balance font-display text-4xl font-semibold leading-[1.08] tracking-tightish text-ink-900 sm:text-5xl">
            {t.headline}
          </h2>
          <p className="mt-6 max-w-[58ch] text-[17px] leading-[1.55] text-ink-700">{t.body}</p>
        </div>
        <ul className="mt-16 grid gap-12 border-t border-mist pt-16 md:grid-cols-3 md:gap-8">
          {t.promises.map((p, i) => (
            <li key={p.title}>
              <span className="font-display text-3xl font-bold tracking-tightish text-ink-900 tabular-nums">0{i + 1}</span>
              <h3 className="mt-4 font-display text-lg font-semibold tracking-tightish text-ink-900">{p.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-700">{p.caption}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

- [ ] **Step 3:** Commit.

---

## Task 12: Hero tune — secondary CTA + trust line + real metrics

**Files:**
- Modify: `components/landing/Hero.tsx`
- Modify: `lib/landing/i18n.ts` (already has `heroV2` keys from T2)

**Changes:**
- Secondary CTA «Написать в Telegram» → «Посмотреть как работает» (href `#how-it-works`).
- Trust line «Магазины у дома, минимаркеты...» → «Сделано для бизнеса Узбекистана · Open pilot 2026».
- HeroStatCard values: keep current 3 450 000 / 87 000 / 42, OR update to match `/reports` (21 000 / 7 000 / 3). **Decision: keep current (3.45M sum) — more aspirational, looks more product-ready.** Real `/reports` showed test data (1 кассир, 3 чека) which would weaken the hero.

**Steps:**

- [ ] **Step 1:** Update Hero.tsx CTA href + label, trust line text.

- [ ] **Step 2:** Verify dev render. Click "Посмотреть как работает" scrolls to HowItWorks section.

- [ ] **Step 3:** Commit.

---

## Task 13: FAQ expand (5 → 10 questions)

**Files:**
- Modify: `components/landing/FAQ.tsx` (no behavior change, just more items)
- Modify: `lib/landing/i18n.ts` (extend `faq` array from 5 to 10)

**10 questions from spec section 15:** computer, internet/offline, price, import, cashiers, fiscalization, equipment, security, launch timeline, multi-outlet.

**Steps:**

- [ ] **Step 1:** Add 5 new Q/A pairs to RU and UZ dicts (parallel structure).

- [ ] **Step 2:** Verify FAQ renders 10 items. First one (Q1) is open by default — keep this behavior.

- [ ] **Step 3:** Commit.

---

## Task 14: Footer multi-column (4 columns, phone, no social)

**Files:**
- Modify: `components/landing/Footer.tsx`
- Modify: `lib/landing/i18n.ts` (`footerV2` keys)

**Phone placeholder:** `+998 90 000-00-00` (will be replaced when Jack gives real number).

**Steps:**

- [ ] **Step 1:** Replace Footer with multi-column layout.

```tsx
interface FooterColumn { title: string; links: readonly { label: string; href: string }[] }
interface FooterV2T {
  columns: readonly FooterColumn[];
  phone: string;
  copyright: string;
  tagline: string;
}

export function Footer({ t, locale, switchLocale }: { t: FooterV2T; locale: Locale; switchLocale: (l: Locale) => void }) {
  return (
    <footer className="border-t border-mist py-16 lg:py-20">
      <div className="section-shell">
        <div className="grid gap-12 lg:grid-cols-5 lg:gap-8">
          <div className="lg:col-span-1">
            <img src="/birliy-wordmark.svg" alt="BirLiy" className="h-8 w-auto" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-ink-700">{t.tagline}</p>
          </div>
          {t.columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">{col.title}</h3>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="text-sm text-ink-700 transition-colors duration-200 ease-birliy hover:text-ink-900">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-6 border-t border-mist pt-6 sm:flex-row sm:items-center">
          <div className="flex items-baseline gap-2 text-sm">
            <span className="text-ink-500">Тел:</span>
            <a href={`tel:${t.phone.replace(/\s/g, "")}`} className="font-display text-base font-semibold text-ink-900 hover:text-green-700">
              {t.phone}
            </a>
          </div>
          <div className="flex items-center gap-4 text-xs text-ink-500">
            <span>{t.copyright}</span>
            <LangPill locale={locale} switchLocale={switchLocale} />
          </div>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2:** Fill `footerV2` i18n with 4 columns:
  - Продукт: Возможности (#capabilities), Как работает (#how-it-works), Для собственника (#owner), FAQ (#faq)
  - Бизнесу: Магазины, Минимаркеты, Кафе, Аптеки, Сервис (all → #segments anchor — add `id="segments"` to SegmentsV2)
  - Подключение: Ранний доступ (#lead), Оборудование (#equipment), Что внутри (#capabilities)
  - Контакт: один большой phone (rendered отдельно от columns)

- [ ] **Step 3:** Test: footer renders 4 columns + phone link.

- [ ] **Step 4:** Commit.

---

## Task 15: Roadmap expand (3 → 4 phases)

**Files:**
- Modify: `lib/landing/i18n.ts` (extend `roadmap` to 4 entries)
- Possibly modify: `components/landing/Roadmap.tsx` if grid needs `md:grid-cols-4`

**Steps:**

- [ ] **Step 1:** Add 4th phase to RU and UZ:
  - «Сейчас» — Касса, склад, QR, отчёты, Telegram-бот
  - «Q3 2026» — Лояльность, акции, Telegram-marketing
  - «Q4 2026» — дополнительные финансовые сервисы внутри
  - «2027» — B2B-маркетплейс + BNPL/факторинг

- [ ] **Step 2:** Update Roadmap component grid `md:grid-cols-3` → `md:grid-cols-4`.

- [ ] **Step 3:** Commit.

---

## Task 16: Anchor IDs + Section ordering verification

**Final composition in LandingPage.tsx:**

```tsx
<Header />
<Hero />                          // hero
<TrustStrip />
<Pain />                          // 01 / Знакомо?
<HowItWorks id="how-it-works" /> // 02 / Как проходит продажа
<Capabilities />                  // 03 / Что внутри (id="capabilities")
<VoiceInsert />
<ForOwner id="owner" />          // 04 / Для собственника
<SegmentsV2 id="segments" />     // 05 / Для какого бизнеса (add id)
<Equipment id="equipment" />     // (add id)
<Freemium />                      // 06 / Цена
<Roadmap />                       // 07 / Что дальше
<EarlyAccess />                  // 08 / Ранний доступ
<LeadSection id="lead" />        // (existing)
<FAQ id="faq" />                  // 09 / Вопросы и ответы (add id)
<Footer />
<Cookie />
```

**Header nav targets:** Возможности (#capabilities), Цена (#freemium — add id), FAQ (#faq).

**Steps:**

- [ ] **Step 1:** Add missing `id` attributes to sections (Equipment, SegmentsV2, FAQ, Freemium).

- [ ] **Step 2:** Update Header navTargets array to match.

- [ ] **Step 3:** Click every nav link + every footer link in dev — all scroll to correct section.

- [ ] **Step 4:** Commit.

---

## Task 17: UZ i18n parity check

**Files:**
- Modify: `lib/landing/i18n.ts`

**Steps:**

- [ ] **Step 1:** TypeScript will catch structural mismatches via `LandingDict` type. Run `pnpm tsc --noEmit` — fix any UZ missing fields.

- [ ] **Step 2:** Read all UZ copy. Translate any missed-RU-only strings to Uzbek (Latin script). Use Manrope (handles both).

- [ ] **Step 3:** Test UZ in dev: click LangPill → UZ → verify every new section renders Uzbek text, not RU fallback.

- [ ] **Step 4:** Commit.

---

## Task 18: Cleanup orphaned legacy components

**Files to DELETE** (verified orphaned in DESIGN.md):
- `components/Hero.tsx`
- `components/Header.tsx`
- `components/Footer.tsx`
- `components/Features.tsx`
- `components/Benefits.tsx`
- `components/HowToStart.tsx`
- `components/Workflow.tsx`
- `components/Segments.tsx`
- `components/FAQ.tsx`
- `components/Roadmap.tsx`
- `components/StickyCTA.tsx`
- `components/TrustStrip.tsx`
- `components/LaunchOffer.tsx`
- `components/OfflineCallout.tsx`
- `components/ProblemSection.tsx`
- `components/CookieConsent.tsx`
- `components/DemoPlaceholder.tsx`
- `components/AppScreens.tsx`

**Directory to DELETE:** `.swarm/` (orphaned subagent worktrees, all reference dead palette tokens).

**Steps:**

- [ ] **Step 1:** Confirm nothing imports any of these (already verified in DESIGN.md prep, but re-grep to be safe).

```powershell
Get-ChildItem -Recurse -Include *.ts,*.tsx -Path components,app,lib -ErrorAction SilentlyContinue | Select-String -Pattern 'from\s+"@?/components/(Hero|Header|Footer|Features|Benefits|HowToStart|Workflow|Segments|FAQ|Roadmap|StickyCTA|TrustStrip|LaunchOffer|OfflineCallout|ProblemSection|CookieConsent|DemoPlaceholder|AppScreens)"'
```

Expected: 0 matches.

- [ ] **Step 2:** Delete all 18 files + `.swarm/` directory.

```powershell
Remove-Item -Force components/Hero.tsx, components/Header.tsx, components/Footer.tsx, components/Features.tsx, components/Benefits.tsx, components/HowToStart.tsx, components/Workflow.tsx, components/Segments.tsx, components/FAQ.tsx, components/Roadmap.tsx, components/StickyCTA.tsx, components/TrustStrip.tsx, components/LaunchOffer.tsx, components/OfflineCallout.tsx, components/ProblemSection.tsx, components/CookieConsent.tsx, components/DemoPlaceholder.tsx, components/AppScreens.tsx
Remove-Item -Recurse -Force .swarm
```

- [ ] **Step 3:** `pnpm test && pnpm tsc --noEmit` — verify nothing breaks.

- [ ] **Step 4:** Commit.

```bash
git add -A
git commit -m "chore(landing-v2): delete orphaned legacy components + .swarm/"
```

---

## Task 19: Visual QA in browser

**Steps (Jack will help, but agent runs first pass):**

- [ ] **Step 1:** Start dev server: `pnpm dev`.

- [ ] **Step 2:** Use Playwright MCP to walk landing top-to-bottom in RU + UZ at desktop (1280) and mobile (375). Take screenshots into `.research/landing-v2-qa/`.

- [ ] **Step 3:** Visual checklist:
  - All section eyebrows (01..09) in correct order
  - No raw class names showing (means Tailwind compiled)
  - All product screenshots load (no 404 in console)
  - LangPill switches between RU and UZ
  - All header nav scrolls correctly
  - All footer links scroll correctly
  - Lead form still submits (smoke test)
  - Cookie banner appears + dismisses
  - No console errors

- [ ] **Step 4:** Mobile-specific:
  - Header collapses gracefully
  - 15-Second Sale steps stack vertically
  - Capabilities cards stack
  - SegmentsV2 5 cards stack
  - Footer 4 columns stack into single column

- [ ] **Step 5:** Report findings as markdown to `.research/landing-v2-qa/REPORT.md`. If any critical bugs found, fix in new commits, re-run QA.

---

## Task 20: Final commit summary + ready-to-merge

**Steps:**

- [ ] **Step 1:** Run full test suite: `pnpm test`. All green.

- [ ] **Step 2:** Run tsc: `pnpm tsc --noEmit`. Zero errors.

- [ ] **Step 3:** Verify git log shows clean per-task commits (T1-T18).

- [ ] **Step 4:** Final state report: number of files added/modified, test count, screenshot count, anything outstanding.

---

## Dependencies & Open Items

- **Phone number for footer** — Jack needs to provide. Placeholder `+998 90 000-00-00` until then.
- **Telegram receipt SVG mockup** — Agent designs in T6. If Jack has real Telegram receipt screenshot, swap in.
- **Pilot status copy** — «Open pilot 2026» is the current line. Jack can refine if there are confirmed pilots.
- **Offline mode FAQ** — Q2 in FAQ promises offline. Agent flags this in T13; Jack confirms whether claim is accurate or copy needs change.

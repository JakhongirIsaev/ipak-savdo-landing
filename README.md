# Ipak Savdo Landing Page

Modern, production-quality landing page for **Ipak Savdo** — a mobile-first Mini ERP / POS app for small and micro businesses in Uzbekistan.

## Features

- **Bilingual**: Russian (RU) and Uzbek (UZ) language support
- **Mobile-first**: Responsive design optimized for mobile networks
- **Feature flags**: Control sensitive content with flags
- **Lead form**: Contact modal with optional fields
- **Framer Motion**: Subtle, restrained animations
- **No external links**: All CTAs open modals/forms (no fake links)

## Tech Stack

- Next.js 14 (App Router)
- React 18 + TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React icons

## Feature Flags

Edit in `app/page.tsx`:

```ts
const showPilotStats = false;      // Show pilot statistics
const showPartnerLogos = false;    // Show partner logo strip
const showBankBadge = true;        // Show "Ipak Yuli Bank" badge
const showFreemiumOffer = false;   // Show 6-month freemium offer
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Build for Production

```bash
npm run build
```

Static export will be generated in the `out/` directory.

## Project Structure

```
app/
  layout.tsx          # Root layout with metadata
  page.tsx            # Main landing page
  globals.css         # Global styles + Tailwind
components/
  Header.tsx          # Sticky header with nav + lang switcher
  Hero.tsx            # Hero section with phone mockup
  TrustStrip.tsx      # Trust/credibility strip
  ProblemSection.tsx  # Problem statement cards
  Workflow.tsx        # Sales workflow steps
  DemoPlaceholder.tsx # Demo video placeholder modal
  Features.tsx        # 6 feature cards with mini UI previews
  OfflineCallout.tsx  # Offline-first feature section
  AppScreens.tsx      # Device mockups showcase
  Segments.tsx        # Business segment cards
  Benefits.tsx        # Owner benefits section
  Roadmap.tsx         # Product roadmap timeline
  LaunchOffer.tsx     # Launch offer banner
  HowToStart.tsx      # 3-step getting started
  LeadForm.tsx        # Inline lead form
  FAQ.tsx             # Accordion FAQ
  Footer.tsx          # Footer navigation
  CookieConsent.tsx   # Cookie consent banner
  ContactModal.tsx    # Modal contact form
  StickyCTA.tsx       # Mobile sticky CTA bar
lib/
  locale.ts           # RU/UZ dictionary
  utils.ts            # Utility functions (cn)
```

## TODOs

- [ ] Connect lead form to backend API/webhook
- [ ] Add real Telegram contact link after approval
- [ ] Add real demo video after pilot launch
- [ ] Add Yandex.Metrika, Facebook Pixel, Google Analytics IDs
- [ ] Add Open Graph image (`/og-ipak-savdo.png`)
- [ ] Optimize images (WebP/AVIF)
- [ ] Lighthouse performance audit

## License

© Ipak Savdo. All rights reserved.

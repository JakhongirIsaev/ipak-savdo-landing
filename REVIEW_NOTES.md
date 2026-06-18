# Review notes — creative redesign

**Repo:** `D:\birliy\ipak-savdo-landing-complete`
**Branch:** `design/creative-refresh` (created from `main`)
**State:** all changes are UNCOMMITTED in the working tree. NOT pushed, NOT deployed. `main` (prod) is untouched.
**Preview:** `npx next start -p 3000` → http://localhost:3000/ (the switcher is in the "Olti modul" / modules section).

---

## IMPORTANT: there are TWO separate change-sets in this working tree

1. **The creative redesign** (this session's work) — review focus.
2. **A pre-existing, uncommitted Yandex Metrika integration** that was already in the working tree BEFORE this branch. I did NOT author it; flagging so it isn't conflated with the redesign.

---

## 1) Creative redesign — REVIEW THESE

### Code (one file)
- `components/concept/ConceptLanding.tsx` — the LIVE homepage component (drives both `/` and `/ru`). Every redesign change is here: per-section motion/graphics + a product switcher. (~+574 / -? lines.)

### New image assets in `public/photos/`
- **Used:** `phone-s26-app.jpg` (S26 phone showing the real BirLiy Lite app UI composited with mock data), `full-setup.jpg` (tablet on stand + handheld barcode scanner + receipt printer).
- **Currently UNUSED (safe to delete):** `owner-hero-editorial.jpg`, `pain-notebook.jpg`, `phone-dashboard.jpg`, `cashier-scan.jpg`, `owner-evening.jpg`, `phone-s26.jpg`. (Intermediate AI renders that got reverted/superseded.)

### What changed per section (all in ConceptLanding.tsx)
- **Hero:** kept the ORIGINAL photo (`/photos/owner-tablet.jpg`); added a drifting green aurora background, a green halo behind the image, and a gently floating badge. (Header logo is the white wordmark — that part is already on `main`.)
- **#pain:** green aurora + oversized decorative `?` watermark + scroll-wipe accent rail + staggered reveal. (No AI photo — reverted per stakeholder.)
- **#reveal (live demo):** breathing green halo behind the device frame, "LIVE" ping dot on the eyebrow, hover-lift on the frame, green tap-hint pill with a bouncing ScanLine icon.
- **#segments:** green corner glows + faint grid backdrop; cards get gradient icon tiles, an oversized watermark index, a growing top accent bar on hover, a sliding arrow, hover lift+scale, stronger stagger.
- **#flow:** REVERTED to the original clean 4-card layout (the numbered-badge "pipeline" was removed per stakeholder — clipped badges looked broken).
- **#owner (dark):** green wash + blueprint grid + two drifting auroras; pulsing "Onlayn" status pill (reuses existing `t.command.status`); bullet cards get hover + icon chips; metric cards become a "live dashboard" (CountUp numbers, green top-edge accent, per-card pulsing dot, white→green gradient sheen).
- **#owner-control:** drifting aurora background; the phone photo frame was reverted to CLEAN (a green-wash/parallax effect was removed because it made the photo look washed out — opacity conflict between `reveal` whileInView and a continuous `animate`).
- **#modules:** top accent rail + auroras, an animated heading underline (scaleX on scroll), gradient icon tiles, hover lift+ring+glow. **Hosts the product switcher (below).**
- **#rollout:** aurora breathe + left-title glow; an animated vertical stepper rail (scaleY grows on scroll); green numbered nodes; hover.
- **#early-access:** green→yellow gradient top divider; aurora + a floating ring shape; the pilot-PRICE card is highlighted with yellow ring/glow/number-chip (yellow used ONLY for price, per brand rules).
- **#faq:** aurora glow; ping eyebrow dot; gradient divider; hover lift; chevron in a circular chip; smooth open/close via CSS `grid-rows` (answer text always in DOM → a11y/LCP safe).

### Product switcher (inside #modules)
- New state: `const [setupTab, setSetupTab] = useState<"phone" | "setup">("phone")` (near the other hooks ~line 505).
- Toggle: **"Telefon / To'liq jihoz"** (RU: "Телефон / Полный комплект").
- **Phone** state → static image `phone-s26-app.jpg` (real app UI + mock data).
- **Full setup** state → static image `full-setup.jpg`.
- Each state shows the image + a plain-language explanation (title + paragraph + 3 bullets, inline UZ/RU) — written simply on purpose (non-technical audience).
- Only the ACTIVE image renders (lazy). **No video** (deliberately removed for load speed).

### Principles followed (worth verifying)
- All decorative/looping motion is gated behind `reduce` (`prefers-reduced-motion` OR coarse pointer) — see the `reduce` flag and `fade()`/`reveal()` helpers.
- Hero headline + LCP image stay SSR-static (not gated behind JS).
- Copy is UNCHANGED except the new switcher explanations (UZ + RU added). Zero em-dashes (lint:copy enforces this and passes).

---

## 2) NOT my work — pre-existing uncommitted Yandex Metrika integration (separate review)

These were already modified/added in the working tree before the redesign branch; I did not author them:
- `components/YandexMetrika.tsx` (new)
- `app/layout.tsx`, `app/page.tsx`, `app/ru/page.tsx`, `app/llms.txt/route.ts`
- `components/landing/JsonLd.tsx`, `lib/landing/i18n.ts`, `.env.example`

Note: these cause the **Yandex CSP console errors** visible in the browser (the site CSP blocks `mc.yandex.ru`). To finish that integration the CSP allowlist needs `mc.yandex.ru` (script-src + img-src), or it should be reverted. Unrelated to the redesign.

---

## How to build / run (Node 25 + pnpm gotcha)
- `cd D:\birliy\ipak-savdo-landing-complete`
- **KNOWN ISSUE:** `next build` / `next dev` intermittently fail with `Cannot find module .../next/dist/compiled/jest-worker/processChild.js` (Node 25 + pnpm hardlink quirk). Fix: run `pnpm install --force` to completion, then retry. `next dev` is also unstable here; prefer **`npx next build && npx next start -p 3000`**.
- Gates currently green: `npx tsc --noEmit` = 0 errors, `npm run lint:copy` = 0, `next build` = 31/31 static pages.

## Quick diff commands for the reviewer
```
git -C D:/birliy/ipak-savdo-landing-complete status -sb
git -C D:/birliy/ipak-savdo-landing-complete diff -- components/concept/ConceptLanding.tsx
git -C D:/birliy/ipak-savdo-landing-complete diff --stat
```

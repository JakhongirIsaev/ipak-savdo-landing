# Design System — BirLiy

> Source of truth for visual decisions. Read this before any UI work.
> When the code and this doc diverge, the doc is the contract — update the code, or update this doc with rationale.

## Product Context

- **What this is:** BirLiy — единая рабочая поверхность для малого бизнеса в Узбекистане. Касса, склад, QR-оплата, чеки, отчёты в одном приложении на смартфоне/планшете.
- **Who it's for:** Магазины у дома, минимаркеты, кафе, аптеки, сервисные точки. Владельцы и кассиры без технического бэкграунда.
- **Space/industry:** Fintech / SMB SaaS / POS. Экосистема Ipak Yuli Bank.
- **Project type:** Marketing landing (RU/UZ) + lead admin (RU). Single Next.js 14 app.
- **Brand book reference:** BirLiy Brand Book V 1.0 (PDF в `C:\Users\User\Downloads\Telegram Desktop\BirLiy — Brand Book.pdf`).

## Aesthetic Direction

- **Direction:** Editorial calm. Type-driven, hairline-bordered, paper-on-paper. Mature SaaS, не "consumer-bouncy".
- **Decoration level:** Minimal. Один большой настоящий скриншот в product moment, никаких декоративных blob'ов, никаких gradient-mesh.
- **Mood:** "Меньше частей. Больше ясности." Поверхность не отвлекает кассира от покупателя. Спокойный фон для шумной работы.
- **Reference posture:** Linear, Stripe Docs, Vercel marketing — type-first editorial с воздухом. **НЕ** Y2K, **НЕ** SaaS landing template, **НЕ** purple gradient hero.

## Typography

- **Display/Hero:** Sora (300/400/600/700) via `next/font/google` → CSS var `--font-display`. Tighter tracking via `letter-spacing: -0.015em` (`tracking-tightish`).
- **Body:** Manrope (300/400/500/600/700) via `next/font/google` → `--font-body`. Полная поддержка кириллицы. Default `font-light` для больших абзацев (hero subtitle, voice insert).
- **Code/Data:** JetBrains Mono (400/500) → `--font-mono`. Используется в admin leads table и для tabular-nums чисел.
- **Loading:** Self-hosted через `next/font` с `display: swap`. CDN не требуется.

### Type scale (используется в коде)

| Role | Class | Size | Weight | Tracking | Where |
|------|-------|------|--------|----------|-------|
| Hero headline | `font-display text-5xl sm:text-6xl lg:text-[80px] font-bold tracking-tightish leading-[1.04]` | 80px desktop | 700 | -0.015em | Hero |
| Section headline | `font-display text-4xl sm:text-5xl font-semibold tracking-tightish leading-[1.08]` | 48px | 600 | -0.015em | Capabilities, WhyBirliy, etc. |
| Voice/quote | `font-display text-3xl sm:text-[40px] font-semibold tracking-tightish leading-[1.12]` | 40px | 600 | -0.015em | VoiceInsert |
| Card metric | `font-display text-5xl font-bold tracking-tightish tabular-nums` | 48px | 700 | -0.015em | HeroStatCard, Dashboard Tile |
| Card sub-metric | `font-display text-2xl font-semibold tracking-tightish tabular-nums` | 24px | 600 | -0.015em | HeroStatCard inner |
| Body large | `text-[19px] sm:text-[22px] font-light leading-relaxed` | 19-22px | 300 | normal | Hero subtitle |
| Body | `text-[17px] leading-[1.55]` | 17px | 400 | normal | Section copy |
| Body small | `text-sm` (14px) | 14px | 400 | normal | Footer, captions |
| Eyebrow | `text-xs font-semibold uppercase tracking-[0.18em] text-ink-500` | 12px | 600 | 0.18em | Numbered section labels (`01 / Что делает BirLiy`) |
| UI label small | `text-xs font-medium uppercase tracking-wider text-ink-500` | 12px | 500 | wider | Tile eyebrow, stat labels |

### Numbered sections

Лендинг использует постоянный паттерн `NN / Section Title` в eyebrow перед каждой section h2. Нумерация задаёт темп: `01 → 06`. Не пропускать, не путать порядок.

## Color

### Source of truth

```
tailwind.config.ts → theme.extend.colors
app/globals.css   → :root CSS variables (для admin/SVG, где Tailwind не достаёт)
```

### Brand palette

| Token | Hex | Where to use |
|-------|-----|--------------|
| `green-50` | `#ECFAEE` | Очень светлый зелёный фон (success состояния, едва-едва) |
| `green-100` | `#D6F3DD` | Soft mint, badge backgrounds, success card border |
| `green-300` | `#7ED99A` | Secondary accent в charts (второй ряд stacked bar) |
| **`green-500`** | **`#03B73D`** | **Primary action. CTA buttons. Only "won" status. Live indicator dot.** |
| `green-700` | `#027F2E` | CTA hover. Successful state text. |
| `green-800` | `#015521` | Form-internal success text (deep). |
| `ink-900` | `#0B1826` | Primary text. Headlines. Logo dark. |
| `ink-700` | `#3B4756` | Body copy. Secondary text. Cookie button hover bg. |
| `ink-500` | `#6B7682` | Muted text. Eyebrows. Captions. Inactive nav. |
| `paper` | `#F6F7F4` | Page background. **Default body color.** Не белый! |
| `mist` | `#E8EBE5` | Hairline borders. Subtle dividers. Section break backgrounds via `bg-mist/40`. |
| White `#FFFFFF` | — | Card surfaces (HeroStatCard, LeadForm, Cookie banner). Контраст с paper. |

### Signal palette (UI states only, never decoration)

| Token | Hex | Use |
|-------|-----|-----|
| `warn` | `#FFC83D` | "demo" status dot. Caution-only. |
| `stop` | `#E5484D` | "lost" status dot. Error messages. |
| `info` | `#3C82F6` | "contacted" status dot. Informational. |

### The Green Rule

Зелёный — это primary brand asset. Не размазывать. **Не более 5 точек зелёного на одном экране**:
1. Hero CTA
2. Header CTA
3. Live indicator dot в HeroStatCard
4. Опционально: success border после submit формы (`border-green-100`)
5. Опционально: "won" status dot в admin

Если появилось 6-е зелёное место — что-то не так. Раскрасить не нужно. Зелёный должен означать действие или успех.

### Recipe (brand book)

60% paper (фон, дыхание) · 30% ink (типографика) · 10% green (действие/успех).

## Spacing

- **Base unit:** Tailwind default 4px scale (`p-1=4px`, `p-2=8px`, `p-4=16px`, `p-6=24px`, `p-8=32px`).
- **Density:** Comfortable. Section padding `py-24 lg:py-32` (96-128px) — много воздуха.
- **Section shell:** `width: min(calc(100% - 2rem|3rem|4rem), 80rem)`, центрируется. Утилита `.section-shell` в globals.css. Max 1280px (80rem).
- **Hairlines:** Все горизонтальные разделители `border-t border-mist` (#E8EBE5). Толще не делать — это нарушит спокойствие.
- **Card padding:** Hero card / Lead form `p-5 → p-8` (20-32px). Cookie banner `p-5`.

## Layout

- **Approach:** Grid-disciplined editorial. 12-колоночный grid на desktop (`lg:grid-cols-12`), Hero — 7/5, Lead — 5/7. На mobile колонки складываются в один поток.
- **Section pattern (canonical):**
  1. `<section className="border-t border-mist py-24 lg:py-32">`
  2. `.section-shell`
  3. `<div className="max-w-3xl">` с eyebrow + h2
  4. `<div className="mt-16 grid ... border-t border-mist pt-16">` контент
- **Header:** Sticky, `h-[72px]`, `bg-paper/85 backdrop-blur`, hairline снизу.
- **Border radius scale:**
  - `rounded-full` — pills, dots, language switcher, CTA
  - `rounded-2xl` (16px) — Cookie banner, product moment image
  - `rounded-3xl` (24px) — HeroStatCard
  - `rounded-xl` (12px) — LeadForm inputs, dashboard tile inner
  - `rounded-lg` (8px) — Dashboard tiles, secondary surfaces
  - `rounded-md` (6px) — Export CSV button
- **Shadows:** Минимум. `shadow-[0_1px_2px_rgba(11,24,38,0.04)]` на HeroStatCard. `shadow-[0_8px_32px_rgba(11,24,38,0.08)]` на Cookie banner. Никаких `shadow-2xl`, никаких glow.

## Motion

- **Easing (canonical):** `cubic-bezier(0.2, 0.8, 0.2, 1)` — settle, don't bounce. Tailwind utility `ease-birliy`. JavaScript const `EASE = [0.2, 0.8, 0.2, 1]` для framer-motion.
- **Durations:** `duration-200` (200ms) для hover-color transitions. `duration-320` (320ms) для FAQ chevron. `duration-600` (600ms) для settle-in орchestrated reveals.
- **Settle-in pattern:** `initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, ease: EASE, delay }`. Stagger через `delay: 0, 0.08, 0.16, 0.24, 0.32` для последовательного появления элементов.
- **Reduced motion:** Globally respected в `globals.css` через `@media (prefers-reduced-motion: reduce)`. Не отключать.
- **Что НЕ делать:** Никакого scale-pulse, никакого bounce, никакого parallax. Motion должен исчезать в фон, не привлекать внимание.

## Status System (admin)

Единый источник: `lib/admin/status-meta.ts`. **Никогда не дублировать эти соответствия в других местах** — импортировать `STATUS_META` или `statusMeta()`.

| Status | Emoji | RU label | Dot color | Token |
|--------|-------|----------|-----------|-------|
| `new` | 🆕 | Новый | `ink-500` (нейтральный) | `bg-ink-500` |
| `contacted` | 📞 | В работе | `info` (синий) | `bg-info` |
| `demo` | 📅 | Демо | `warn` (жёлтый) | `bg-warn` |
| `won` | 🏆 | Выигран | `green-500` (бренд) | `bg-green-500` |
| `lost` | ❌ | Проигран | `stop` (красный) | `bg-stop` |

**Зелёный только для "won".** Это намеренно — зелёный = выигрыш, единственный.

## Chart Colors

`lib/admin/svg-chart.tsx`:
- Source colors (для stacked bars по источникам лидов): `["#03B73D", "#7ED99A", "#3B4756", "#6B7682", "#E8EBE5"]`. Первый — green-500, дальше через мяту, ink, mist.
- Fallback: `#0B1826` (ink-900) для 6+ источников.
- Funnel bar: `#3B4756` (ink-700) для всех статусов, **кроме `won`** → `#03B73D` (green-500).

## Iconography

- **Library:** `lucide-react` (≥0.300.0). Не смешивать с другими наборами.
- **Default stroke-width:** `1.5` (тоньше дефолтных 2). Это часть editorial calm — иконки не должны кричать.
- **Sizes:** `14`, `16`, `18`, `20`, `24`. По месту.
- **Color:** Иконки наследуют цвет от parent text. Не красить иконки в зелёный, кроме live-dot и CTA chevron.

## Component Patterns

### CTA Button

```tsx
className="inline-flex items-center gap-2 rounded-full bg-green-500 px-6 py-3.5 text-sm font-semibold text-white transition-colors duration-200 ease-birliy hover:bg-green-700"
```

Pill, не rounded-md. Hover уходит в `green-700`. Иконка справа (`ArrowRight size={16} strokeWidth={1.75}`).

### Eyebrow → H2 pair

```tsx
<p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">01 / Section title</p>
<h2 className="mt-5 max-w-[20ch] text-balance font-display text-4xl font-semibold leading-[1.08] tracking-tightish text-ink-900 sm:text-5xl">
  Section headline
</h2>
```

`max-w-[NNch]` обязателен — ограничивает ширину headline по characters, не пикселям. Текст не должен растекаться.

### Card surface

```tsx
className="rounded-3xl border border-mist bg-white p-7 shadow-[0_1px_2px_rgba(11,24,38,0.04)]"
```

White card на paper фоне. Hairline border, едва заметная тень. Никаких градиентов внутри.

### Dashboard Tile

```tsx
<div className="rounded-lg border border-mist bg-paper p-5">
  <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">Eyebrow</div>
  <div className="mt-3 font-display text-4xl font-bold text-ink-900">42</div>
  <div className="mt-1 text-xs text-ink-500">caption</div>
</div>
```

Plot для статистики. Eyebrow → большое число → caption. Delta-стрелка (`↑`/`↓`) только зелёная если положительная, иначе ink-500 (не красная — это не угроза).

### FAQ disclosure

Hairline only, никаких card backgrounds. Раскрывается по клику, chevron поворачивается через `duration-320 ease-birliy`. Только один открыт за раз.

### Mist grid

Утилита `.mist-grid` в globals.css — субтильная сетка 32×32px из `rgba(11, 24, 38, 0.04)`. Только для специальных секций (если понадобятся). Никогда зелёный.

## Accessibility

- **Selection color:** `rgba(3, 183, 61, 0.2)` (зелёная подсветка выделенного текста, едва).
- **Reduced motion:** Уважаем (см. Motion).
- **Focus rings:** `focus:ring-4 focus:ring-[#03B73D]/15` на form inputs. Видимый, не агрессивный.
- **Color contrast:** ink-900 на paper, ink-700 на paper, ink-500 на paper — все WCAG AA для тела (≥4.5:1). Зелёный CTA текст — белый (≥7:1).
- **Semantic HTML:** Section/header/nav/footer используются. h1 единственный (hero title), h2/h3 по иерархии.

## Internationalization

- **Locales:** `ru` (default) + `uz`. Хранится в `localStorage.birliy-locale`.
- **Both dicts MUST stay structurally identical** (`typeof ru === typeof uz`) — это comment-rule в `LandingPage.tsx`.
- **Fonts:** Manrope (Cyrillic + Latin-ext) покрывает оба языка. Sora — только Latin/Latin-Ext, для display headlines на UZ всё ещё работает (узбекский в латинице).

## Anti-patterns (никогда)

- ❌ Purple gradient hero (стандартная AI-slop)
- ❌ 3-column feature cards с иконками в цветных кружках
- ❌ Glassmorphism / frosted glass на больших поверхностях
- ❌ `text-center` для всех заголовков (мы asymmetric, editorial)
- ❌ Бубликовый border-radius на всём (`rounded-full` только для pills/CTA)
- ❌ Тёмная тема — её нет и пока не планируется. Не имитировать.
- ❌ Декоративные blob'ы / blur circles в фоне
- ❌ Inter, Roboto, Arial, Open Sans для display (мы Sora)
- ❌ Зелёный текст на белом для body copy (только для action affordance)
- ❌ Chart-libs (Recharts, Chart.js) — у нас hand-rolled SVG в `lib/admin/svg-chart.tsx`. Не вводить новую зависимость без обсуждения.

## Voice & Tone (copy)

Не часть визуала, но влияет на дизайн:

- Plain, practical, unhurried. Short sentences. Real verbs.
- Никаких "экосистема", "synergy", "innovative", "revolutionary", "transform".
- "Меньше частей. Больше ясности." — leading principle. Применяется и к копи, и к UI.
- Russian primary. Uzbek mirror. Никогда не переводить машинно — параллельные строки писались вручную.

## Known Issues / Drift

> Эти пункты — **технический долг**, который не блокирует, но стоит подчистить.

### Orphaned legacy components (P2 — dead code)

`components/Hero.tsx`, `components/Header.tsx`, `components/Footer.tsx`, `components/Features.tsx`, `components/Benefits.tsx`, `components/HowToStart.tsx`, `components/Workflow.tsx`, `components/Segments.tsx`, `components/FAQ.tsx`, `components/Roadmap.tsx`, `components/StickyCTA.tsx`, `components/TrustStrip.tsx`, `components/LaunchOffer.tsx`, `components/OfflineCallout.tsx`, `components/ProblemSection.tsx`, `components/CookieConsent.tsx`, `components/DemoPlaceholder.tsx`, `components/AppScreens.tsx` — **никем не импортируются**.

Все они ссылаются на устаревшие токены (`primary-green: #007A5A`, `cta-green: #00C853`, `text-dark`, `text-muted`, `card-border`, `soft-mint`), которых нет в текущем `tailwind.config.ts`. Если их случайно подключить — Tailwind молча их проигнорирует, фоны/цвета пропадут.

**Действие:** Удалить эти файлы. Канонический landing — `components/LandingPage.tsx` (single-file). Также: `.swarm/*` директории содержат старые worktree копии — удалить целиком.

### Admin Leads table (P2 — стилистический drift)

`app/admin/leads/page.tsx` использует `font-mono text-sm`, `bg-slate-100`, `bg-slate-800`, `even:bg-slate-50` — это не BirLiy токены, а Tailwind slate. Таблица читаемая, но эстетически не совпадает с `app/admin/dashboard/page.tsx` (который полностью на BirLiy).

**Действие:** При следующем подходе к админке переписать таблицу в BirLiy: `font-sans`, `bg-paper`, `bg-mist` для headers, `even:bg-mist/40` для rows, `bg-green-500` для Export CSV вместо хардкоженного `#02691A`.

### Form input hardcoded hex (P3 — мелочь)

`components/LeadForm.tsx` использует `#03B73D`, `#015521`, `#D6F3DD` напрямую в className вместо Tailwind токенов (`green-500`, `green-800`, `green-100`). Работает, но затрудняет глобальную смену палитры.

**Действие:** При следующем редактировании формы заменить хардкод на токены.

## Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-05-26 | DESIGN.md написан | Зафиксировать BirLiy дизайн-систему как контракт. Источник: tailwind.config + globals.css + LandingPage.tsx + status-meta.ts. |
| 2026-05-26 | Sora + Manrope + JetBrains Mono | Из brand book V 1.0. Sora — editorial display, Manrope — кириллица в body, JetBrains для табличных чисел. |
| 2026-05-26 | Green только на ≤5 точках на экран | Из brand book recipe (60/30/10). Зелёный = действие/успех, не декорация. |
| 2026-05-26 | won = единственный зелёный статус | Намеренная семантика: зелёный = выигрыш. Остальные статусы — нейтральные/signal-цвета. |
| 2026-05-26 | Hairline-only borders (mist #E8EBE5) | Editorial calm: разделители должны быть слышны, но не кричать. |
| 2026-05-26 | ease-birliy `cubic-bezier(0.2, 0.8, 0.2, 1)` | Settle, не bounce. Любые pulse/bounce нарушают "тихую поверхность". |
| 2026-05-26 | Hand-rolled SVG charts вместо Recharts | Бренд-выравнивание + бандл маленький. Каждый chart ~50 LOC. |

# 09: SEO Growth System for BirLiy

A practical runbook for anyone on the BirLiy team who manages content and search performance. No technical background required. Read top to bottom once, then use specific sections as a reference.

---

## 1. The Three Data Sources and What Each Tells You

### Google Search Console (GSC)

GSC shows what happens on Google before a user reaches your site. Google reports it with a 2-day delay, so "today's" data is always slightly behind.

**What it measures:**
- **Impressions** — how many times a BirLiy page appeared in Google search results for a given query. The user may not have clicked.
- **Clicks** — how many times they did click through to the site.
- **CTR (Click-Through Rate)** — clicks divided by impressions, shown as a percentage. A page with 1000 impressions and 50 clicks has a 5% CTR.
- **Average position** — the average rank at which your page appeared. Position 1 is the top result. Position 15 means you are on page 2.
- **Top queries** — the actual search phrases that generated impressions or clicks. These are real words your potential customers typed.
- **Top pages** — which pages on birliy.uz received the most traffic from Google.

**What GSC does NOT tell you:** what the user did after they landed on the site, how long they stayed, or whether they converted. For that you need Yandex Metrika or GA.

### Yandex Metrika

Yandex Metrika measures on-site behavior after a user arrives. For the Uzbekistan market it is especially useful because a meaningful share of local searches happen on Yandex.

**What it measures:**
- **Visits** — total sessions (one person can create multiple visits in a day).
- **Users** — unique visitors over a period.
- **Traffic sources** — where people came from: organic search, direct, social, referral, etc. The "organic" share shows how much of your traffic is coming from unpaid search.
- **Landing pages** — which pages users arrived on first. Tells you which blog post or the homepage is the entry point.
- **Bounce rate** — percentage of sessions where the user left without clicking anything else. A high bounce on a blog post is normal; a high bounce on the homepage is a warning sign.
- **Depth / time on site** — how many pages they viewed and how long they stayed. A user who reads a full article has higher depth than one who glances and leaves.

**What Metrika does NOT tell you:** which search queries drove organic visits (Yandex encrypts these), or how you rank compared to competitors. For queries and ranking, use GSC and SerpApi.

### SerpApi (Keyword Rank Tracker in Admin)

SerpApi makes a live Google or Yandex search request on your behalf and tells you exactly where BirLiy appears in the results for a specific keyword, which URL ranked, and who the competitors are. Unlike GSC (which averages your position over many queries), SerpApi gives you a real-time snapshot for one chosen keyword.

**What it measures:**
- **Position** — where birliy.uz appeared in the search results for that keyword at the moment of the check. "вне топ-10" means the site did not appear in the first 10 results.
- **URL found** — which specific page ranked (homepage, a blog article, the /ru page, etc.).
- **Competitors** — who else appeared on the first page for that keyword.
- **History** — the position from each previous check, so you can see a trend.

**Important constraint:** each keyword check costs SerpApi credits. Checks are manual and intentional. Do not run checks every day for every keyword; refresh only when you have published new content or made a significant change to the page and want to verify movement.

---

## 2. How to Read Search Console

### Impressions vs Clicks vs Position

Open the GSC Performance report. Set the date range to 28 days. Look at the table sorted by impressions descending.

A healthy keyword shows:
- Impressions growing week over week (Google is indexing and surfacing your pages more).
- Clicks growing in proportion to impressions (users are choosing your result).
- CTR between 3% and 15% for informational posts, 5%+ for navigational or branded queries.
- Position moving toward 1 over time.

An unhealthy pattern and what it means:

| Pattern | What it means | What to do |
|---|---|---|
| High impressions, almost zero clicks, position 1-3 | Title or description is not compelling for this query | Rewrite the title and meta description to match the exact intent of the query |
| Decent impressions, position 11-20 | You are on page 2, close to breaking through | This is the highest-leverage opportunity (see below) |
| Zero impressions for a target keyword | Google has not indexed the page, or there is no content targeting that phrase | Publish a focused article or add the phrase naturally to an existing page |
| Falling impressions on a page that used to rank | A competitor improved their page, or Google changed how it reads yours | Update the article: add fresh data, expand the FAQ, sharpen the intro |

### Spotting the "Page 2 Opportunity"

Filter the query table by position: between 11 and 20. These queries are your most actionable wins. The page already exists and Google already considers it relevant; it just needs a nudge.

For each query in that zone, ask:
1. Is there a page on birliy.uz that directly answers this query? If not, create one.
2. Does the title tag contain the query phrase (or a close variant)? If not, add it.
3. Does the first paragraph of the page answer the query directly? If not, rewrite the opening.
4. Are there internal links from other pages pointing to this page? If not, add them.

A page at position 14 for "do'kon uchun kassa dasturi" needs less new content than a page at position 51. Prioritize positions 11-20 first, then 21-30.

### Rising Impressions, Low CTR

This means Google is showing your page more often, but users are not clicking. The most common cause: the page title and meta description do not match what the user actually wanted.

Example: Your blog post titled "Ombor hisobi: do'konda tovar hisobi haqida" gets impressions for the query "do'konda nima qolgan" but the title does not contain those words. The user scans the results, sees a generic title, and clicks a competitor instead.

Fix: update the title to match the query intent directly ("Do'konda nima qolganini bilish: ombor hisobi qanday yuritiladi"), and update the meta description to include a direct answer in the first sentence.

---

## 3. How to Read the Keyword Rank Tracker

The admin panel shows a table of tracked keywords with their last known position, the URL that ranked, the competitors found, and the date of the last check.

**Reading positions:**

- Position 1-3: excellent, monitor for stability.
- Position 4-10: first page, good visibility. Work on CTR via title and description.
- Position 11-20: page 2. Highest-value improvement zone. One targeted content update often moves these into the top 10.
- "вне топ-10" (not in top 10): the site did not rank in the first 10 results for this keyword at the time of the check. This does not mean the page does not exist; it means competitors are outranking you for this specific query.

**Position changes:**

When you run a new check, compare the new position to the previous one. A move from 18 to 9 is a significant win. A move from 4 to 12 after a site change is a regression worth investigating.

**Competitors column:**

This shows who appeared on page 1 for the same query. Regularly look at what these competing pages contain. If a competitor's blog post ranks for "qarz daftarini almashtirish" and yours does not, read their article and identify what they covered that you did not.

**Credit discipline:**

Do not check all keywords every day. Suggested rhythm:
- After publishing a new blog post: check the 2-3 keywords that post targets, one week after publishing.
- After a site-wide SEO update (meta tags, new FAQ, structural change): check all tracked keywords once.
- Routine monitoring: check each keyword once every 2-4 weeks, not more.

---

## 4. How to Choose Next Blog Topics from Keyword Gaps

A keyword gap is a query that generates impressions in GSC (meaning Google is surfacing your site for it) but you have no page that directly answers it, or the page that ranks is a generic page like the homepage rather than a focused article.

### The gap-finding process

1. Open GSC Performance, filter to 28 days, sort by impressions.
2. Look at queries with more than 50 impressions but fewer than 10 clicks. These are gaps: visibility without conversion.
3. For each gap query, check which page Google matched it to (the "Pages" tab, filtered by that query). If it matched to the homepage instead of a blog post, you do not yet have a dedicated page for this intent.
4. Cluster the gap queries by topic. Write one article per cluster, not one article per individual phrase.

### Long-tail do'kon/minimarket/nasiya intents to prioritize

These phrases have lower competition than head terms and attract users who are already close to a decision:

- "do'konda qarz yozish" (writing down debts in a shop)
- "mijozlar qarzini kuzatish ilovasi" (app to track customer debts)
- "do'konda nima qolganini bilish" (knowing what stock is left)
- "kassa aparatsiz savdo" (selling without a hardware cash register)
- "ombor hisobini telefonda yuritish" (managing inventory on a phone)
- "terminalsiz QR tolov" (QR payment without a terminal)
- "чем заменить долговую тетрадь в магазине" (RU, what to replace the debt notebook with)
- "программа для магазина у дома без кассового аппарата" (RU, software for a neighborhood shop without a register)
- "как вести учет долгов покупателей" (RU, how to track customer debts)
- "склад магазина на телефоне" (RU, shop inventory on a phone)

Each of these phrases signals a user who has a specific problem. An article that addresses exactly that problem, opens with a direct answer, and shows how BirLiy solves it will outperform a generic "what is BirLiy" page every time.

---

## 5. What Counts as Success

Vanity metrics to ignore:
- Total pageviews (can be inflated by bots, social noise, or irrelevant traffic).
- "Ranking #1 for BirLiy" (branded queries do not represent organic reach to new users).
- Number of articles published (volume without targeting is just content debt).

Real success signals (check these monthly):

**Search:**
- Number of keywords where birliy.uz appears in positions 1-10 is growing month over month.
- Total organic clicks from GSC is growing.
- CTR for target queries is above 5%.

**On-site:**
- Organic visits in Yandex Metrika (traffic source = organic search) is growing.
- Bounce rate on blog articles is below 70%.
- Users who arrive on a blog post and then visit the homepage or click the lead form CTA.

**Business:**
- Number of qualified leads from the form is growing. A qualified lead is someone from the target segment (shop/minimarket owner in Uzbekistan) who submitted a real request.
- At least some leads mention "нашел в поиске" or arrived from a blog URL. Track UTM source or referrer if possible.

A single blog article that brings 5 qualified leads per month is more valuable than 20 articles that generate only bot traffic and zero conversions.

---

## 6. Priority Keywords by Cluster

These are the keywords from the UZ and RU behavioral keyword lists in `08-behavioral-seo-keywords.md`, organized by theme with notes on difficulty and strategy.

### Cluster A: Store Software (do'kon dasturi / программа для магазина)

**UZ:** do'kon uchun dastur, magazin uchun dastur, kichik do'kon uchun dastur, minimarket uchun kassa dasturi, oziq-ovqat do'koni uchun dastur

**RU:** программа для магазина, программа для магазина продуктов, программа для минимаркета, программа для магазина у дома, программа для дукана, приложение для магазина у дома

**Difficulty:** medium-high for head terms ("программа для магазина"), medium-low for long-tail forms with geographic or segment modifiers ("программа для дукана", "minimarket uchun kassa dasturi").

**Strategy:** target long-tail modifiers first. A post titled exactly "Minimarket uchun kassa dasturi: nima kerak va nima keraksiz" will rank faster than trying to compete for "программа для магазина" against larger directories.

### Cluster B: Phone Cashier / No Hardware (kassa telefonida / касса в телефоне)

**UZ:** telefonda kassa, kassa aparatsiz savdo, internetsiz kassa, oflayn kassa dasturi, dukon uchun telefon kassa

**RU:** касса в телефоне, мобильная касса, касса без интернета, касса на Android, касса для магазина продуктов

**Difficulty:** medium. The "no hardware / phone-first" angle is a genuine differentiator and less crowded than pure "kassa" terms.

**Strategy:** this cluster has the clearest BirLiy value proposition. Lead with the phone-only angle in article titles. "Kassa apparatsiz: do'konda telefon orqali savdo" is the kind of title that matches high-intent queries and immediately communicates the product's main benefit.

### Cluster C: Debt Notebook / Nasiya (qarz daftar / долговая тетрадь)

**UZ:** qarz daftar, nasiya daftar, nasiya yuritish dasturi, qarzni kuzatish ilovasi, xaridor qarz daftari

**RU:** долговая тетрадь, чем заменить тетрадь долгов, учет долгов покупателей, замена долговой тетради, насия учет

**Difficulty:** low to medium. "Чем заменить долговую тетрадь в магазине" is a long-tail RU query with clear commercial intent and relatively few strong competitors. "qarz daftar" in UZ has low competition. These are winnable.

**Strategy:** this is the highest-priority cluster for BirLiy's differentiation. No competitor in the Uzbekistan market is targeting this angle as directly. Publish at least one dedicated article in both UZ and RU. The RU question form "чем заменить долговую тетрадь в магазине" should be the exact article title, not paraphrased.

### Cluster D: Inventory / Ostatki (ombor hisobi / учет остатков)

**UZ:** ombor hisobi, do'kon ombor hisobi, tovar hisobi, tovar qoldig'i hisobi, do'konda nima qolgan

**RU:** учет товаров, учет остатков в магазине, учет продаж в магазине, контроль остатков товаров

**Difficulty:** medium. "Учет остатков" is a competitive generic term. Long-tail forms like "do'konda nima qolganini bilish" or "контроль остатков в небольшом магазине" are winnable.

**Strategy:** always combine inventory keywords with a shop-specific modifier. "Ombor hisobi" alone matches too broad an intent. "Do'kon ombor hisobi" or "ombor hisobini telefonda yuritish" is specific enough to rank.

**Note on noisy terms:** "pos" alone, "qoldiq" alone, and "ombor" alone are noisy and must always appear with context (see `08-behavioral-seo-keywords.md` Noisy Phrases section). Never use these as standalone meta keywords or URL slugs.

### Cluster E: No-Terminal QR Payment (terminalsiz QR / QR без терминала)

**UZ:** terminalsiz QR tolov, do'konda QR tolov, qr orqali tolov

**RU:** QR оплата без терминала, принять оплату по QR, QR оплата Узбекистан

**Difficulty:** low. This is a very specific intent with few competing pages in Uzbekistan. It is a secondary BirLiy feature but worth targeting because the query is nearly uncontested.

**Strategy:** one dedicated article or a strong FAQ section on the homepage is enough to capture this cluster. Do not build a full blog series here; it is not the primary growth driver.

### Head Terms to Deprioritize Initially

"POS tizimi", "кассовый аппарат", "программа учета" are competitive head terms dominated by large directories, government sites, and established vendors. They require significant domain authority to compete for. Focus on clusters C (nasiya) and B (phone-first/no-hardware) first, where BirLiy can win on differentiation.

---

## 7. What NOT to Do

**Keyword stuffing.** Repeating a phrase more than 2-3 times in an article does not improve ranking and makes the text unreadable. Write naturally. One well-placed phrase in the title, one in the first paragraph, and one in an H2 or FAQ question is enough.

**Fake or absolute claims.** Do not write "кассовый аппарат вам больше никогда не понадобится" or "BirLiy заменит любую кассу". This makes a legal and trust claim that is not universally true and can be challenged. Say instead: "для большинства магазинов у дома аппаратная касса не нужна — BirLiy работает на телефоне".

**Unrelated pure news content.** A blog post about football match results, transfer news, or celebrity scores zero points for BirLiy's SEO and actively dilutes the site's topical focus. Google measures topical authority: a site that consistently publishes about shop management, POS, inventory, and debt tracking builds authority in that niche. A site that mixes in unrelated sports news confuses the signal. See the football section below for the right approach.

**Over-optimizing the homepage.** The homepage targets broad branded and category terms. Do not try to rank the homepage for every long-tail query; that is what blog posts are for.

**Publishing and forgetting.** An article that is never updated, never linked to from newer posts, and never checked in GSC will plateau quickly. Set a reminder to review your top 5 articles every 3 months.

**Checking SerpApi rankings every day.** Every check costs credits. Daily checks give you noise, not signal. Wait at least one week after a change before checking.

---

## 8. First 12 Blog Topic Ideas

Organized into three groups: product SEO, AI/technology explainers, and business-connected football posts.

### Group 1: Product SEO Posts (6 posts)

These posts target the highest-priority keyword gaps. Each one should open with a direct 2-sentence answer to the query, include a practical numbered list, and close with a single CTA to the BirLiy lead form.

**Post 1 (UZ):** "Do'kon uchun dastur: kassa, ombor, qarz daftar"
- Target queries: "do'kon uchun dastur", "magazin uchun dastur", "do'kon uchun kassa dasturi"
- Angle: why managing three separate tools (hardware register, paper stock notebook, debt notebook) wastes time, and how one phone app covers all three.
- Structure: problem (three separate systems), solution (one app), how to get started in one day.

**Post 2 (UZ):** "Qarz daftarini telefonda yuritish: do'kondagi nasiyani boshqarish"
- Target queries: "qarz daftar", "nasiya daftar", "xaridor qarz daftari", "qarzni kuzatish ilovasi"
- Angle: the paper debt notebook is the last manual process left in most small shops. A phone-based system sends reminders and shows outstanding totals without a physical book.
- Structure: common pain (notebook lost, totals miscounted), what a digital debt tracker does, step-by-step setup.

**Post 3 (UZ):** "Ombor hisobi: do'konda nima qolganini bilish"
- Target queries: "ombor hisobi", "do'konda nima qolgan", "tovar qoldig'i hisobi"
- Angle: knowing current stock without a daily physical count. Focus on small shops where the owner does their own counting.
- Structure: why stock goes wrong (manual entry errors, no tracking), what inventory tracking in BirLiy looks like, how to do the first import.

**Post 4 (RU):** "Программа для магазина продуктов: касса, склад, долги"
- Target queries: "программа для магазина продуктов", "программа для минимаркета", "программа для небольшого магазина"
- Angle: Russian-language companion to Post 1 with grocery/minimarket framing. Emphasize that BirLiy works without a dedicated computer, cashbox hardware, or IT person.
- Structure: three tools that small grocery shops typically cobble together, why unified phone-first works better, what setup takes.

**Post 5 (RU):** "Чем заменить долговую тетрадь в магазине"
- Target queries: "чем заменить долговую тетрадь в магазине", "замена долговой тетради", "учет долгов покупателей"
- Angle: this is a direct question form title — use it exactly as the H1. The article answers the question in the first paragraph. High-intent, low competition.
- Structure: why the paper debt notebook fails (lost, miscounted, illegible), what a digital replacement provides, how BirLiy implements it, FAQ with real question forms.

**Post 6 (RU):** "Касса в телефоне для магазина у дома"
- Target queries: "касса в телефоне", "мобильная касса", "касса для магазина у дома", "касса без интернета"
- Angle: neighborhood shop owners do not need the same setup as a supermarket. A phone-based POS is enough and it removes the upfront hardware cost.
- Structure: what a neighborhood shop actually needs from a cash register (sales recording, receipt, daily totals, offline mode), how BirLiy provides this, cost comparison vs hardware terminal.

### Group 2: AI / Technology Explainers (3 posts)

These posts do not target high-volume keywords directly. Their purpose is to establish BirLiy as a knowledgeable, forward-thinking source for small business owners, which supports long-term domain authority and AI discovery indexing (llms.txt, Perplexity citations).

Keep the language simple. This audience is not technical. Explain what the technology does for the shop owner in plain terms.

**Post 7 (RU):** "Что значит автоматизация для небольшого магазина: без лишних слов"
- Angle: "automation" sounds intimidating. This post reframes it: for a small shop, automation means the phone tracks your stock so you do not have to count manually, and it shows you daily totals so you do not have to add up receipts at night.
- Do not hype. Do not use the word "AI" unless explaining a concrete feature. Focus on what the owner stops doing by hand.

**Post 8 (RU/UZ):** "Телефон вместо кассового аппарата: как это работает"
- Angle: a practical explainer of what actually happens when a sale is made on a phone POS: payment accepted, receipt sent to Telegram, stock updated. Demystify the technology.
- Include a simple numbered walkthrough of a single sale. No jargon.

**Post 9 (UZ):** "Do'konda texnologiya: nima foydali, nima emas"
- Angle: filter real technology benefits (phone POS, QR payments, automated stock tracking) from overhyped tools (blockchain, NFT, complex ERP). Written for a skeptical shop owner who has seen too many pitches.
- Tone: honest, slightly humorous. "Bu texnologiya sizga kerakmi? Bir qarang."

### Group 3: Football / Community Posts (3 posts)

These posts use football as a shared cultural reference point for the target audience (Uzbekistan shop owners who follow football). They must have a clear, direct business lesson as the main content. The football angle is the hook, not the subject. Do not recap match results, discuss transfers, or score-report. That content adds nothing to topical authority and will dilute SEO signals.

**Post 10 (RU):** "Контроль команды: чему учит управление магазином"
- Angle: a football team's manager does not stand at the register counting goals manually. They watch from above and see patterns. A shop owner who can view daily sales from any phone operates the same way: oversight without micromanagement.
- Business connection: BirLiy's owner-view features (remote access to daily totals, cashier activity log). No match results, no player names.

**Post 11 (RU):** "Дисциплина в бизнесе: почему правила важны в маленьком магазине"
- Angle: in football, the same rule (offside) applies whether the stadium is full or empty. In a shop, consistent inventory rules and consistent debt-recording protect you whether you have 10 customers or 200. Discipline at a small scale is what makes scaling possible.
- Business connection: building systematic habits (daily stock check, weekly debt review) using a phone app instead of relying on memory.

**Post 12 (UZ):** "Jamoaviy ish: do'konda kim nima qiladi va nazorat qanday ishlaydi"
- Angle: in a successful team, every player knows their role and the coach sees the full picture. A shop owner with one or two employees needs the same clarity: who handles the register, who handles stock, how the owner checks both without being present.
- Business connection: multi-cashier setup, PIN access control, and the owner's remote view in BirLiy. No match commentary.

---

## Checklist Before Publishing Any Article

- Title contains the primary target query phrase or a close natural variant.
- First 2-3 sentences answer the query directly.
- The article is about the stated topic from the first word to the last.
- Meta description (160 characters max) contains the query and a direct benefit.
- At least one internal link points to a related BirLiy page or article.
- The page has been added to sitemap.xml.
- After publishing: submit URL to Google Search Console URL Inspection.
- One week after publishing: run SerpApi check for the 2-3 target keywords.
- No em-dashes in copy (use a comma or a new sentence instead).
- No absolute claims ("never", "always", "guaranteed", "best in Uzbekistan").
- CTA at the end: one link, one action (birliy.uz/#lead or the Telegram contact).

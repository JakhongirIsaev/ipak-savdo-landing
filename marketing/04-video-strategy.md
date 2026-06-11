# Видео-стратегия BirLiy (Higgsfield → Instagram + Telegram)

Видео — это новый слой поверх готовой системы (`01`–`03`). Цель та же: **заявки**, не просмотры. Каждый ролик ведёт к одному CTA — написать в Telegram / оставить заявку на сайте.

Инструмент генерации — **Higgsfield** (подключён как MCP, см. конец файла). Делает картинки и видео до 15 сек, 30+ моделей (Kling, Veo, Soul и др.).

---

## 1. Где Higgsfield реально помогает (честно)

| Задача | Подход | Вердикт |
|--------|--------|---------|
| **Локальные бренд-ролики** (владелец дукана / минимаркета / аптеки / кафе в Ташкенте) | **text-to-video** — генерим новую аутентичную сцену | ✅ Главный выигрыш |
| Оживить готовые фото из `public/photos/` | **image-to-video** (фото → движение) | ✅ Быстро, для B-roll |
| Демо продукта («продажа за 15 сек», отчёты) | **Реальная запись экрана** приложения; Higgsfield только на интро/аутро | ⚠️ AI перерисует UI — не давать ему рисовать интерфейс |
| Текст на видео (кириллица / узбекский) | Накладываем **поверх** в монтаже (CapCut), не внутри AI | ❌ AI не умеет надёжно рендерить наш текст |

**Почему text-to-video, а не только стоковые фото:** наши 7 фото в `public/photos/` тёплые, но читаются как азиатское кафе/цветочный магазин — это **не наш рынок**. Аудитория BirLiy — владелец магазина у дома, минимаркета, аптеки в Ташкенте. Higgsfield может сгенерировать **местные лица и местный контекст** (дукан, чайхана, аптека) — это сильнее для доверия у продукта, сделанного для Узбекистана. Для первого батча оживляем фото (быстро), параллельно тестируем генерацию локальных сцен.

---

## 2. Производственные правила (бренд)

Те же анти-паттерны, что в `02-content-system.md` — видео их усиливает, не нарушает.

- **Формат:** 9:16 вертикаль (Reels + Telegram). При нужде дубль 1:1.
- **Длина:** 6–10 сек (макс 15). Короткий и петлёй — лучше длинного.
- **Движение:** спокойное, премиальное — медленный наезд, лёгкий параллакс, микро-движение. **Не дёргано, без резких склеек.**
- **Свет/цвет:** тёплый естественный свет, бумажные тона. Один зелёный акцент `#03B73D` — только в оверлее (галочка / цифра / кнопка). Текст — ink `#0B1826`.
- **Нельзя (как в бренд-гайде):** фиолетовые градиенты, «космос», свечения, глянец, стоковые улыбки в галстуках, капс, стена эмодзи.
- **Локальность:** лица и контекст — Центральная Азия / Ташкент. Дукан, минимаркет, аптека, кафе-чайхана.
- **Текст + CTA:** RU основной, UZ-зеркало для ключевых. Накладываем в монтаже, не в AI.
- **Звук:** без музыки-хайпа. Спокойный эмбиент или тишина + текст. Telegram часто смотрят без звука — смысл должен читаться глазами.

**Пайплайн одного ролика:** Higgsfield (чистый визуал, без текста) → CapCut (текст RU/UZ + зелёный акцент + лого-аутро + CTA) → экспорт 9:16 → пост по календарю.

---

## 3. Карта: пост → видео

Приоритет — ролики, которые легче всего конвертят в заявку.

| Видео | Тема | Источник | Под посты |
|-------|------|----------|-----------|
| **V1 Знакомство / «В одном месте»** | всё в одном | `owner-tablet.jpg` или генерация (дукан) | IG-01 · TG-01 |
| **V2 Боль → один экран** | боль→облегчение | `owner-shop.jpg` | IG-02 · TG-02 |
| **V3 Оффер «49 000 сум/мес»** | оффер | `owners-team.jpg` | IG-10 · TG-08 |
| V4 Свобода собственника | собственник | `owner-tablet.jpg` / генерация | IG-04 · TG-04 |
| V5 BirLiy для кафе | сегмент | `cafe-owner.jpg` / генерация (чайхана) | IG-08 · TG-07 |
| V6 BirLiy для магазина у дома | сегмент | генерация (дукан/минимаркет) | IG-09 |
| V7 Касса без интернета | фича | запись экрана `16/17` + интро | IG-05 · TG-05 |
| V8 Продажа за 15 секунд | как работает | **запись экрана** `16→17→18→20` | IG-03 · TG-03 |

V7–V8 — продукт: лучше реальная запись экрана, Higgsfield только обрамляет.

---

## 4. Первый батч — Неделя 1 (старт Пн 1 июня)

3 ролика под уже готовый календарь. Промпты — на английском (так генерится лучше). Текст-оверлей добавляем поверх в монтаже.

**Вход для image-to-video** (фото уже задеплоены, доступны по URL):
`https://birliy.uz/photos/owner-tablet.jpg` · `/owner-shop.jpg` · `/owners-team.jpg`

### V1 — «Ваш бизнес. В одном месте.» (Пн, IG-01 / TG-01)
- **Higgsfield (image-to-video, owner-tablet.jpg), Kling/Veo:**
  > Cinematic, very subtle slow dolly push-in on a young small-business owner standing at a warm wooden counter holding a tablet, soft natural daylight from a window, a monstera leaf in the foreground. She glances up from the screen with a calm, confident smile. Gentle realistic micro-motion — soft blink, faint leaf sway. Premium, editorial, documentary, warm paper tones. No text, no graphics. 9:16 vertical, 7s, 24fps.
- **Сильный вариант (text-to-video, локальный):**
  > Documentary cinematic shot inside a small neighborhood shop (dukan) in Tashkent, Uzbekistan. A Central Asian woman owner in her 30s stands behind a wooden counter holding a tablet, calm and confident, soft warm morning light, shelves of goods softly out of focus. Slow gentle push-in, shallow depth of field, natural skin tones, warm color grade. Realistic, premium, understated. No on-screen text. 9:16, 8s.
- **Оверлей:** 2–5s «Ваш бизнес.» → «В одном месте.» · аутро: лого BirLiy + «Касса · склад · оплаты» + зелёная точка + «Заявка → birliy.uz». UZ: «Biznesingiz. Bitta joyda.»

### V2 — «Касса отдельно. Склад отдельно. Оплаты отдельно.» (Ср, IG-02 / TG-02)
- **Higgsfield (image-to-video, owner-shop.jpg):**
  > Subtle cinematic push-in on a calm shop owner standing relaxed among tidy shelves, holding a phone, soft daylight, a quiet confident moment of being in control. Minimal realistic motion. Warm tones, premium documentary feel. No text. 9:16 vertical, 7s.
- **Оверлей:** 0–2s (напряжённо, ink) «Касса — отдельно. Склад — отдельно. Оплаты — отдельно.» → 2–5s (спокойно, зелёная галочка) «BirLiy. Один экран.» → CTA «Покажем → +998 97 421 24 54».

### V3 — «49 000 сум/мес первые 6 месяцев.» (Пт, IG-10 / TG-08)
- **Higgsfield (image-to-video, owners-team.jpg):**
  > Warm cinematic slow push-in on two small-business partners looking at a tablet together in their shop, soft natural light, genuine quiet smiles, flowers and wooden shelves softly blurred behind. Gentle realistic motion. Optimistic, premium, understated. No text. 9:16 vertical, 7s.
- **Оверлей:** «49 000 сум/мес.» (крупно) → «Первые 6 месяцев. Полный функционал.» → «Ранний доступ · Ташкент 2026» → CTA «Оставить заявку → birliy.uz · +998 97 421 24 54». UZ: «Oyiga 49 000 so'm. Birinchi 6 oy.»

---

## 5. Стоимость (честно)

Higgsfield — **платный**, по кредитам своего аккаунта. **Видео заметно дороже картинок**, цена зависит от модели и длины. Поэтому: сначала генерим 1 тестовый ролик на дешёвой модели → смотрим качество → потом батч. Перед массовой генерацией сверяем остаток кредитов. Не жжём кредиты на варианты вслепую — один выверенный промпт за раз.

---

## 6. Подключение Higgsfield (статус)

- MCP-сервер добавлен в Claude Code (user scope, во всех проектах): `https://mcp.higgsfield.ai/mcp`.
- **Остался 1 шаг (только Jack):** в Claude Code набрать `/mcp` → выбрать **higgsfield** → **Authenticate** → войти в аккаунт Higgsfield в браузере. Без этого генерация недоступна (`! Needs authentication`).
- Нужен аккаунт Higgsfield **с кредитами**. После авторизации — Claude генерит первый батч (V1–V3).
- Инструменты Higgsfield: marketing video generator, image-to-video (cinematic), viral clip generator, image/video generation, virality prediction.

# Gemini / Veo — промпты для BirLiy (видео с лицами + звук)

> Создано 2026-06-05. Под **Google Veo** (через Gemini / Flow). В отличие от Seedance, Veo **поддерживает человеческие лица и сам генерит звук** (амбиент, SFX, речь). Значит — возвращаем сильный сюжет: живой владелец-ташкентец, спокойный, в контроле.
>
> **Как пользоваться:** вставляешь английский промпт → 9:16, ~8 сек → генеришь 1 тест → смотришь → батч. Текст/лого/CTA — поверх в CapCut (внутри AI текст не пишем). Если в интерфейсе есть отдельное поле **Negative prompt** — туда вставляешь блок «Avoid».

## Бренд-рамки (держать всегда)
- Формат **9:16**, длина **8 сек**, движение спокойное (медленный наезд, лёгкий хэндхелд для живости).
- Свет тёплый, естественный; тона бумажные; лёгкое зерно. Один зелёный акцент #03B73D — **только в оверлее CapCut**, не в AI-сцене.
- Локация — Ташкент/Центральная Азия: дукан, минимаркет, аптека, чайхана. Местное лицо, естественные тона кожи.
- **Нельзя:** текст в кадре, логотипы, фиолет/неон, свечения, блики, глянец-пластик, сток-улыбки, быстрые склейки, кривые руки/лицо.
- Экран телефона держим неброским (не крупный читаемый UI) — реальный интерфейс добавим записью.

---

## V-HERO — Владелец дукана, «всё под контролем» (главный ролик)
**Под посты:** IG-01 / TG-01 (всё в одном), общий бренд-ролик.

**Промпт (вставить в Veo):**
> A cinematic, documentary-style vertical 9:16 video, 8 seconds. Subject: a Central Asian small-business owner, a woman in her mid-30s with a calm, confident expression, wearing a simple modern blouse, standing behind the wooden counter of her small neighborhood shop (dukan) in Tashkent, Uzbekistan. Action: she holds a smartphone in one hand, glances down at the screen, then looks up with a quiet, satisfied half-smile, as if everything is under control, and gently sets the phone on the counter. Setting: warm, tidy shop interior, shelves of everyday goods softly out of focus behind her, a small potted plant by a window. Camera: slow smooth dolly push-in from a medium shot to a medium close-up, shallow depth of field, subtle handheld micro-movement for realism. Lighting and color: soft natural morning light from a side window, warm paper tones, gentle film grain, muted warm color grade, no harsh contrast. Mood: calm, premium, reassuring, understated. Audio: soft ambient room tone, faint distant Tashkent street sounds, the quiet tap of a finger on a phone screen; no music. Style: editorial brand film, natural skin tones, realistic, high detail.

**Negative prompt (поле Avoid):**
> text, captions, subtitles, logos, watermarks, purple, neon, glowing effects, lens flares, glossy plastic look, stock-photo smile, fast cuts, jump cuts, distorted hands, extra fingers, deformed face, oversaturated colors, cartoon, 3d render

**Оверлей в CapCut:** 2–5s «Ваш бизнес.» → «В одном месте.» · аутро: лого + «Касса · склад · оплаты» + зелёная точка #03B73D + «Заявка → birliy.uz».
**UZ:** «Biznesingiz. Bitta joyda.»

---

## Как менять сцену (тот же каркас, другой сегмент)
Меняешь только блок **Subject + Setting**, остальное оставляешь:

- **Кафе/чайхана (IG-08/TG-07):** *a calm cafe owner, a man in his 40s, standing by a wooden table with a teapot and a plate of plov, a cozy Tashkent tea house, warm lamps and daylight mixed.* Audio: *gentle clink of tea cups, soft background chatter.*
- **Минимаркет (контроль смен):** *a shop owner in his 30s by a checkout counter with two cash drawers, tidy minimarket with bright tidy shelves, daytime.* Audio: *faint beep of a barcode scan, calm ambience.*
- **Аптека (IG-12):** *a pharmacist woman in her 30s in a clean modern pharmacy, neat shelves of boxes behind glass, soft even daylight.* Audio: *quiet calm room tone.*

---

## Озвучка (опционально, Veo умеет речь)
Если хочешь голос — добавь в конец промпта одну короткую реплику. Риск: акцент/липсинк могут хромать, поэтому лучше короткую фразу или вообще без речи + оверлей.
- RU: `She quietly says in Russian: "Всё на месте."`
- UZ: `She quietly says in Uzbek: "Hammasi joyida."`
По умолчанию — **без речи**, только амбиент; текст несёт оверлей.

## Пайплайн
Veo (чистая сцена, без текста) → CapCut: оверлей RU/UZ + зелёный акцент #03B73D + лого-аутро + CTA → экспорт 9:16 → пост по календарю.

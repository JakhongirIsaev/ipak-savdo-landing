# Чеклист публикации статьи блога (birliy.uz)

Короткий список перед публикацией новой (или обновлённой) статьи блога.

## Чеклист

1. **Даты честно.** В файле статьи `lib/blog/posts/<slug>.ts`:
   - `date`: дата первой публикации (YYYY-MM-DD), не меняется.
   - `modified`: ставить ТОЛЬКО если реально менялся текст статьи. Если не менялся, поле не нужно (в sitemap/JSON-LD подставится `date`). Не накручивать свежесть ради свежести.
2. **Три картинки статьи (1:1, 4:3, 16:9).** Сгенерировать в Higgsfield по спецификации ниже, загрузить в `public/photos/blog/`, прописать поле `image` в файле статьи (пример ниже). Пока картинок нет, статья использует общий запасной кадр, это нормально.
3. **Проверить все локали.** У статьи должны быть заполнены все три языка (`uz`, `ru`, `en`): `title`, `description`, `intro`, `sections`, `faq`. Узбекский: естественный ташкентский латиницей, без кириллицы. Жёсткие правила: ноль длинных тире «—», валюта «сум/so'm/som» (никогда «UZS»), без упоминаний банка, без выдуманной статистики.
4. **Прогнать тесты.** Локально: `npx tsc --noEmit`, `npm test`, `npm run lint:copy`, `npm run build`, `npm run test:e2e`. Всё должно быть зелёным (e2e проверяет индексируемость каждой статьи во всех трёх языках).
5. **После деплоя: отправить URL в Search Console.** Открыть Google Search Console для `birliy.uz`, в **URL Inspection** вставить новый URL статьи (все три языка) и нажать **Request Indexing**. Карта сайта `https://birliy.uz/sitemap.xml` уже отправлена, новые статьи Google подтянет и сам, но запрос ускоряет. Подробности в `marketing/06-google-indexing-runbook.md`. Гарантии и мгновенной индексации нет: переобход занимает дни-недели.

## Спецификация картинок для Higgsfield

На каждую статью нужны **три** кадра одного сюжета в трёх соотношениях сторон. Формат: **JPG**, цвет sRGB, без текста поверх (текст может обрезаться при кадрировании в выдаче).

| Соотношение | Размер (px) | Имя файла |
|---|---|---|
| 1:1 (квадрат) | **1200 × 1200** | `<slug>-1x1.jpg` |
| 4:3 (альбом) | **1200 × 900** | `<slug>-4x3.jpg` |
| 16:9 (широкий, основной для соцсетей/OG) | **1200 × 675** | `<slug>-16x9.jpg` |

- Класть в каталог `public/photos/blog/`. Итоговый абсолютный URL: `https://birliy.uz/photos/blog/<slug>-16x9.jpg` и т.д.
- `<slug>` берётся из имени файла статьи (например, `pos-tizimi-uzbekistan-minimarket`).
- Google для статей предпочитает несколько соотношений и картинку шириной не меньше 1200px, поэтому минимальная ширина везде 1200.

### Точные имена файлов для текущих 4 статей (12 файлов)

```
public/photos/blog/pos-tizimi-uzbekistan-minimarket-1x1.jpg     (1200x1200)
public/photos/blog/pos-tizimi-uzbekistan-minimarket-4x3.jpg     (1200x900)
public/photos/blog/pos-tizimi-uzbekistan-minimarket-16x9.jpg    (1200x675)

public/photos/blog/kak-vybrat-kassu-dlya-magazina-1x1.jpg       (1200x1200)
public/photos/blog/kak-vybrat-kassu-dlya-magazina-4x3.jpg       (1200x900)
public/photos/blog/kak-vybrat-kassu-dlya-magazina-16x9.jpg      (1200x675)

public/photos/blog/uchet-v-tetradi-skolko-teryaet-magazin-1x1.jpg   (1200x1200)
public/photos/blog/uchet-v-tetradi-skolko-teryaet-magazin-4x3.jpg   (1200x900)
public/photos/blog/uchet-v-tetradi-skolko-teryaet-magazin-16x9.jpg  (1200x675)

public/photos/blog/skladskoy-uchet-v-malenkom-magazine-1x1.jpg  (1200x1200)
public/photos/blog/skladskoy-uchet-v-malenkom-magazine-4x3.jpg  (1200x900)
public/photos/blog/skladskoy-uchet-v-malenkom-magazine-16x9.jpg (1200x675)
```

### Как подключить картинки после генерации

Загрузить 3 файла статьи в `public/photos/blog/`, затем в `lib/blog/posts/<slug>.ts` добавить поле `image` рядом с `date`:

```ts
export const post: BlogPost = {
  slug: "pos-tizimi-uzbekistan-minimarket",
  date: "2026-06-15",
  modified: "2026-06-15",
  image: {
    square: "https://birliy.uz/photos/blog/pos-tizimi-uzbekistan-minimarket-1x1.jpg",
    landscape: "https://birliy.uz/photos/blog/pos-tizimi-uzbekistan-minimarket-4x3.jpg",
    wide: "https://birliy.uz/photos/blog/pos-tizimi-uzbekistan-minimarket-16x9.jpg",
  },
  locales: { /* ... */ },
};
```

После этого JSON-LD статьи отдаст три соотношения (1:1, 4:3, 16:9), а Open Graph (карточка в соцсетях/мессенджерах) возьмёт широкий 16:9. Картинки задаются на статью (одинаковы для uz/ru/en). Не выдумывать имена файлов, которых нет: пока файла нет, оставлять запасной кадр.

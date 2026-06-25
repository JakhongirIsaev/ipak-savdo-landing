import Link from "next/link";
import { ArrowRight, BarChart3, Check, CreditCard, HelpCircle, PackageCheck, Receipt, ShieldCheck } from "lucide-react";
import type { SeoKeywordPage } from "@/lib/seo/keyword-pages";
import { seoKeywordJsonLd } from "@/lib/seo/keyword-pages";

const iconSet = [Receipt, PackageCheck, CreditCard, BarChart3, ShieldCheck, HelpCircle] as const;

function JsonLd({ page }: { page: SeoKeywordPage }) {
  const json = JSON.stringify(seoKeywordJsonLd(page)).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

export function SeoKeywordLanding({ page }: { page: SeoKeywordPage }) {
  const isRu = page.locale === "ru";
  const homeHref = isRu ? "/ru" : "/";
  const leadHref = `${homeHref}#lead`;
  const demoHref = `${homeHref}#reveal`;
  const langSwitchHref = isRu ? "/" : "/ru";
  const langSwitchLabel = isRu ? "UZ" : "RU";

  return (
    <>
      <JsonLd page={page} />
      <main className="min-h-screen bg-[#f7faf8] text-ink-900">
        <header className="border-b border-[#d9e2db] bg-white/92 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <Link href={homeHref} aria-label="BirLiy" className="inline-flex min-h-11 items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/birliy-wordmark.png" alt="BirLiy" width={1216} height={403} className="h-8 w-auto" />
            </Link>
            <nav aria-label={isRu ? "Навигация" : "Navigatsiya"} className="flex items-center gap-2">
              <Link href={demoHref} className="hidden min-h-10 items-center rounded-lg px-3 text-sm font-extrabold text-ink-700 transition hover:bg-[#f1f4f1] sm:inline-flex">
                {isRu ? "Демо" : "Demo"}
              </Link>
              <Link href={leadHref} className="inline-flex min-h-10 items-center rounded-lg bg-green-700 px-4 text-sm font-extrabold text-white transition hover:bg-green-800">
                {isRu ? "Заявка" : "Ariza"}
              </Link>
              <Link href={langSwitchHref} className="inline-flex min-h-10 items-center rounded-lg border border-[#d9e2db] px-3 text-sm font-extrabold text-ink-700 transition hover:bg-white">
                {langSwitchLabel}
              </Link>
            </nav>
          </div>
        </header>

        <section className="relative overflow-hidden border-b border-[#d9e2db] bg-white">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(3,183,61,0.12),transparent_38%)]" />
          <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-sm font-extrabold text-green-800">
                <span className="h-2 w-2 rounded-full bg-green-600" />
                {page.eyebrow}
              </p>
              <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight tracking-normal text-ink-900 sm:text-5xl lg:text-6xl">
                {page.h1}
              </h1>
              <p className="mt-5 max-w-2xl text-lg font-medium leading-8 text-ink-700">{page.intro}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href={leadHref} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-green-700 px-6 font-extrabold text-white shadow-[0_18px_42px_-24px_rgba(3,183,61,0.9)] transition hover:bg-green-800">
                  {page.finalCta.primary}
                  <ArrowRight size={18} />
                </Link>
                <Link href={demoHref} className="inline-flex min-h-12 items-center justify-center rounded-lg border border-[#d9e2db] bg-white px-6 font-extrabold text-ink-800 transition hover:border-green-300 hover:bg-green-50">
                  {page.finalCta.secondary}
                </Link>
              </div>
            </div>
            <div className="rounded-2xl border border-[#d9e2db] bg-[#0b1826] p-5 text-white shadow-[0_28px_80px_-52px_rgba(11,24,38,0.75)]">
              <p className="text-sm font-extrabold uppercase tracking-normal text-green-300">{isRu ? "Что внутри" : "Ichida nimalar bor"}</p>
              <ul className="mt-5 grid gap-3">
                {page.features.slice(0, 4).map((feature, index) => {
                  const Icon = iconSet[index];
                  return (
                    <li key={feature.title} className="grid grid-cols-[42px_1fr] gap-3 rounded-xl bg-white/[0.06] p-3 ring-1 ring-white/10">
                      <span className="grid h-10 w-10 place-items-center rounded-lg bg-green-500 text-white">
                        <Icon size={19} />
                      </span>
                      <span>
                        <span className="block font-extrabold">{feature.title}</span>
                        <span className="mt-0.5 block text-sm font-medium leading-6 text-white/72">{feature.text}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-4 md:grid-cols-3">
            {page.problems.map((item) => (
              <article key={item.title} className="rounded-xl border border-[#d9e2db] bg-white p-5 shadow-[0_1px_2px_rgba(11,24,38,0.04)]">
                <h2 className="text-xl font-extrabold tracking-normal">{item.title}</h2>
                <p className="mt-3 text-sm font-semibold leading-6 text-ink-500">{item.problem}</p>
                <p className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-sm font-extrabold leading-6 text-green-800">{item.solution}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-[#d9e2db] bg-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8 lg:py-16">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-normal text-green-700">{isRu ? "Как работает" : "Qanday ishlaydi"}</p>
              <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-normal sm:text-4xl">
                {isRu ? "Запуск без сложного обучения" : "Murakkab o'qishsiz ishga tushirish"}
              </h2>
              <p className="mt-4 text-lg leading-8 text-ink-700">
                {isRu
                  ? "Старт строится вокруг реального магазина: товары, кассир, первый чек и кабинет владельца."
                  : "Start haqiqiy do'kon atrofida quriladi: tovarlar, kassir, birinchi chek va egasi paneli."}
              </p>
            </div>
            <ol className="grid gap-3">
              {page.steps.map((step, index) => (
                <li key={step} className="grid grid-cols-[44px_1fr] items-start gap-4 rounded-xl border border-[#d9e2db] bg-[#fbfcfb] p-4">
                  <span className="grid h-11 w-11 place-items-center rounded-lg bg-green-700 font-extrabold text-white">{index + 1}</span>
                  <span className="pt-2 font-bold leading-7 text-ink-800">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="max-w-2xl">
            <p className="text-sm font-extrabold uppercase tracking-normal text-green-700">{isRu ? "Возможности BirLiy" : "BirLiy imkoniyatlari"}</p>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-normal sm:text-4xl">
              {isRu ? "Касса, склад и долги в одном рабочем экране" : "Kassa, sklad va qarzlar bitta ish ekranida"}
            </h2>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {page.features.map((feature, index) => {
              const Icon = iconSet[index % iconSet.length];
              return (
                <article key={feature.title} className="rounded-xl border border-[#d9e2db] bg-white p-5 shadow-[0_1px_2px_rgba(11,24,38,0.04)]">
                  <span className="grid h-11 w-11 place-items-center rounded-lg bg-green-50 text-green-700 ring-1 ring-green-600/15">
                    <Icon size={20} />
                  </span>
                  <h3 className="mt-4 text-lg font-extrabold tracking-normal">{feature.title}</h3>
                  <p className="mt-2 font-medium leading-7 text-ink-600">{feature.text}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="bg-[#0b1826] px-4 py-12 text-white sm:px-6 lg:px-8 lg:py-16">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-normal text-green-300">{isRu ? "Цена" : "Narx"}</p>
              <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-normal sm:text-4xl">{page.price.title}</h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-white/74">{page.price.body}</p>
            </div>
            <div className="rounded-2xl bg-white p-5 text-ink-900 shadow-[0_28px_90px_-52px_rgba(3,183,61,0.75)]">
              <p className="text-sm font-extrabold uppercase tracking-normal text-green-700">{isRu ? "Что важно" : "Muhim"}</p>
              <ul className="mt-4 grid gap-3">
                {page.price.bullets.map((item) => (
                  <li key={item} className="flex items-start gap-3 font-bold leading-7">
                    <Check size={18} className="mt-1 shrink-0 text-green-700" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href={leadHref} className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-green-700 px-5 font-extrabold text-white transition hover:bg-green-800">
                {page.finalCta.primary}
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="rounded-2xl border border-[#d9e2db] bg-white p-6 shadow-[0_1px_2px_rgba(11,24,38,0.04)] sm:p-8">
            <p className="text-sm font-extrabold uppercase tracking-normal text-green-700">{isRu ? "Поисковые варианты" : "Qidiruv variantlari"}</p>
            <h2 className="mt-3 text-2xl font-extrabold tracking-normal">{page.helper.title}</h2>
            <p className="mt-3 max-w-3xl font-medium leading-8 text-ink-700">{page.helper.body}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {page.related.map((link) => (
                <Link key={link.href} href={link.href} className="inline-flex min-h-10 items-center rounded-full border border-[#d9e2db] px-4 text-sm font-extrabold text-ink-700 transition hover:border-green-300 hover:bg-green-50">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-[#d9e2db] bg-white px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-4xl">
            <p className="text-sm font-extrabold uppercase tracking-normal text-green-700">FAQ</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-normal">{isRu ? "Частые вопросы" : "Ko'p so'raladigan savollar"}</h2>
            <div className="mt-8 grid gap-4">
              {page.faq.map((item) => (
                <article key={item.q} className="rounded-xl border border-[#d9e2db] bg-[#fbfcfb] p-5">
                  <h3 className="text-lg font-extrabold tracking-normal">{item.q}</h3>
                  <p className="mt-2 font-medium leading-7 text-ink-700">{item.a}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-4xl rounded-2xl bg-green-700 p-6 text-center text-white sm:p-10">
            <h2 className="text-3xl font-extrabold leading-tight tracking-normal">{page.finalCta.title}</h2>
            <p className="mx-auto mt-3 max-w-2xl text-lg font-medium leading-8 text-white/82">{page.finalCta.body}</p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href={leadHref} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-white px-6 font-extrabold text-green-800 transition hover:bg-green-50">
                {page.finalCta.primary}
                <ArrowRight size={18} />
              </Link>
              <Link href={demoHref} className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/35 px-6 font-extrabold text-white transition hover:bg-white/10">
                {page.finalCta.secondary}
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

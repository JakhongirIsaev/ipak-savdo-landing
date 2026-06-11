import type { ReactNode } from "react";
import {
  Users,
  MousePointerClick,
  Eye,
  Send,
  Inbox,
  Globe,
  ArrowRight,
  TrendingUp,
  Coins,
  Timer,
  Megaphone,
  Activity,
  type LucideIcon,
} from "lucide-react";
import { gaConfigured, getGaStats } from "@/lib/admin/ga";
import { getTelegramSubscribers, TELEGRAM_CHANNEL } from "@/lib/admin/social";
import { getLeadCounts, getFunnel } from "@/lib/admin/kpi";
import {
  getVisitStats,
  getStageConversion,
  getLeadSegments,
  computeUnitEconomics,
  fmtSum,
  PILOT_PRICE,
  FULL_PRICE,
  REVENUE_6M,
} from "@/lib/admin/lead-insights";
import { businessTypeLabel, languageLabel, sourceLabel, pluralRu } from "@/lib/admin/format";

export const dynamic = "force-dynamic";

const fmt = (n: number): string => n.toLocaleString("ru-RU");

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-mist bg-white p-5 shadow-[0_1px_2px_rgba(11,24,38,0.04)]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-ink-500">{label}</span>
        <Icon size={16} strokeWidth={1.5} className="text-ink-500" />
      </div>
      <div className="mt-3 font-display text-4xl font-bold tabular-nums tracking-tightish text-ink-900">{value}</div>
      {hint && <div className="mt-1.5 text-xs text-ink-500">{hint}</div>}
    </div>
  );
}

function SectionTitle({ icon: Icon, title }: { icon: LucideIcon; title: string }) {
  return (
    <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-semibold tracking-tightish text-ink-900">
      <Icon size={18} strokeWidth={1.75} className="text-ink-500" />
      {title}
    </h2>
  );
}

function ListCard({ title, rows }: { title: string; rows: { label: ReactNode; value: string }[] }) {
  return (
    <div className="rounded-xl border border-mist bg-white p-5 shadow-[0_1px_2px_rgba(11,24,38,0.04)]">
      <div className="mb-1 text-sm font-semibold text-ink-900">{title}</div>
      {rows.length === 0 ? (
        <div className="py-4 text-sm text-ink-500">Пока нет данных</div>
      ) : (
        <div>
          {rows.map((r, i) => (
            <div key={i} className="flex items-center justify-between gap-3 border-b border-mist py-2.5 last:border-0">
              <span className="min-w-0 truncate text-sm text-ink-700">{r.label}</span>
              <span className="shrink-0 text-sm font-medium tabular-nums text-ink-900">{r.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function fmtDur(sec: number | null): string {
  if (sec === null) return "—";
  if (sec < 60) return `${sec} сек`;
  if (sec < 3600) return `${Math.round(sec / 60)} мин`;
  if (sec < 86400) return `${Math.round(sec / 3600)} ч`;
  return `${Math.round(sec / 86400)} дн`;
}

const pct = (part: number, whole: number): string =>
  whole === 0 ? "—" : `${Math.round((part / whole) * 100)}%`;

export default async function AdminAnalyticsPage() {
  const [stats, subscribers, counts, funnel, visits, stages, segments] = await Promise.all([
    getGaStats(30),
    getTelegramSubscribers(),
    getLeadCounts(),
    getFunnel(),
    getVisitStats(),
    getStageConversion(),
    getLeadSegments(),
  ]);
  const gaOn = gaConfigured();

  const wonLeads = funnel.find((f) => f.status === "won")?.count ?? 0;
  const pipelineActive = funnel
    .filter((f) => f.status === "new" || f.status === "contacted" || f.status === "demo")
    .reduce((sum, f) => sum + f.count, 0);
  const econ = computeUnitEconomics({
    visitors30: visits?.visitors30 ?? 0,
    leads30: counts.thisMonth,
    totalLeads: counts.total,
    wonLeads,
    pipelineActive,
  });
  const needFirstClient = "появится после первого клиента";

  return (
    <>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tightish text-ink-900">Аналитика</h1>
        <p className="mt-1 text-sm text-ink-500">Все цифры по проекту в одном месте</p>
      </div>

      {/* Google Analytics */}
      <section className="mb-12">
        <SectionTitle icon={Globe} title="Сайт — Google Analytics" />

        {!gaOn ? (
          <div className="rounded-xl border border-dashed border-mist bg-white p-8 text-center">
            <div className="text-base font-semibold text-ink-900">Google Analytics ещё не подключён к кабинету</div>
            <p className="mx-auto mt-1.5 max-w-md text-sm text-ink-500">
              Сайт уже собирает данные. Чтобы показывать их здесь, нужен один ключ доступа от Google.
              Передай его — и эти карточки заполнятся реальными цифрами (посетители, источники, страницы, устройства).
            </p>
          </div>
        ) : stats === null ? (
          <div className="rounded-xl border border-dashed border-mist bg-white p-8 text-center">
            <div className="text-base font-semibold text-ink-900">Не удалось получить данные</div>
            <p className="mx-auto mt-1.5 max-w-md text-sm text-ink-500">
              Ключ есть, но Google не ответил. Проверь, что сервис-аккаунту дан доступ к ресурсу GA и указан верный Property ID.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <StatCard icon={Users} label="Посетители" value={fmt(stats.users)} hint="за 30 дней" />
              <StatCard icon={MousePointerClick} label="Сессии" value={fmt(stats.sessions)} hint="за 30 дней" />
              <StatCard icon={Eye} label="Просмотры страниц" value={fmt(stats.views)} hint="за 30 дней" />
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <ListCard
                title="Откуда приходят"
                rows={stats.sources.map((s) => ({ label: s.label, value: fmt(s.sessions) }))}
              />
              <ListCard
                title="Популярные страницы"
                rows={stats.pages.map((p) => ({
                  label: <span className="font-mono text-xs">{p.path}</span>,
                  value: fmt(p.views),
                }))}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <ListCard
                title="Города"
                rows={stats.cities.map((c) => ({ label: c.label, value: fmt(c.sessions) }))}
              />
              <ListCard
                title="Устройства"
                rows={stats.devices.map((d) => ({ label: d.label, value: fmt(d.sessions) }))}
              />
            </div>
          </div>
        )}
      </section>

      {/* First-party visits (our own beacon, no Google) */}
      <section className="mb-12">
        <SectionTitle icon={Activity} title="Посещаемость — свой счётчик" />
        {visits === null ? (
          <div className="rounded-xl border border-dashed border-mist bg-white p-8 text-center text-sm text-ink-500">
            Свой счётчик пока не ответил (нет данных или нет связи с базой).
          </div>
        ) : (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard icon={Users} label="Посетители" value={fmt(visits.visitors30)} hint="за 30 дней, наш счётчик" />
              <StatCard icon={Users} label="За 7 дней" value={fmt(visits.visitors7)} hint="уникальные посетители" />
              <StatCard icon={Eye} label="Просмотры" value={fmt(visits.views30)} hint="за 30 дней" />
              <StatCard
                icon={TrendingUp}
                label="Новые"
                value={pct(visits.newVisitors30, visits.visitors30)}
                hint="впервые на сайте"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <ListCard
                title="Устройства"
                rows={visits.devices.map((d) => ({ label: d.label, value: fmt(d.visitors) }))}
              />
              <ListCard
                title="Язык страницы"
                rows={visits.locales.map((l) => ({ label: l.label, value: fmt(l.visitors) }))}
              />
              <ListCard
                title="Переходы с сайтов"
                rows={visits.referrers.map((r) => ({
                  label: <span className="font-mono text-xs">{r.label}</span>,
                  value: fmt(r.visitors),
                }))}
              />
            </div>
            <p className="text-xs text-ink-500">
              Считает наш собственный скрипт на сайте (без Google). Включён 10 июня 2026, данные накапливаются.
              Часть визитов может быть ботами.
            </p>
          </div>
        )}
      </section>

      {/* Sales path: stage conversion + where we lose */}
      <section className="mb-12">
        <SectionTitle icon={Timer} title="Путь до клиента" />
        {stages === null || stages.total === 0 ? (
          <div className="rounded-xl border border-dashed border-mist bg-white p-8 text-center text-sm text-ink-500">
            Пока нет заявок для анализа пути.
          </div>
        ) : (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard icon={Inbox} label="Заявок за 30 дней" value={fmt(counts.thisMonth)} hint={`всего за всё время: ${fmt(counts.total)}`} />
              <StatCard icon={TrendingUp} label="Стали клиентами" value={fmt(wonLeads)} hint="за всё время" />
              <StatCard icon={Timer} label="Потеряно" value={fmt(stages.lost)} hint={pct(stages.lost, stages.total) + " всех заявок"} />
              <a
                href="/admin/leads"
                className="flex items-center justify-between rounded-xl border border-mist bg-white p-5 text-sm font-medium text-ink-900 shadow-[0_1px_2px_rgba(11,24,38,0.04)] transition-colors duration-200 ease-birliy hover:border-ink-500"
              >
                Открыть все заявки
                <ArrowRight size={16} strokeWidth={1.75} className="text-ink-500" />
              </a>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <StatCard
                icon={MousePointerClick}
                label="Заявка → контакт"
                value={pct(stages.reachedContacted, stages.total)}
                hint={`${fmt(stages.reachedContacted)} из ${fmt(stages.total)} · медиана ${fmtDur(stages.medianNewToContactedSec)}`}
              />
              <StatCard
                icon={Eye}
                label="Контакт → демо"
                value={pct(stages.reachedDemo, stages.reachedContacted)}
                hint={`${fmt(stages.reachedDemo)} из ${fmt(stages.reachedContacted)} · медиана ${fmtDur(stages.medianContactedToDemoSec)}`}
              />
              <StatCard
                icon={TrendingUp}
                label="Демо → клиент"
                value={pct(stages.reachedWon, stages.reachedDemo)}
                hint={`${fmt(stages.reachedWon)} из ${fmt(stages.reachedDemo)} · медиана ${fmtDur(stages.medianDemoToWonSec)}`}
              />
            </div>
            <ListCard
              title={`Потеряно: ${stages.lost} ${pluralRu(stages.lost, "заявка", "заявки", "заявок")} — на каком этапе`}
              rows={stages.lostByStage.map((l) => ({
                label:
                  l.stage === "new"
                    ? "Не успели связаться"
                    : l.stage === "contacted"
                      ? "После первого контакта"
                      : l.stage === "demo"
                        ? "После демо"
                        : String(l.stage),
                value: fmt(l.count),
              }))}
            />
          </div>
        )}
      </section>

      {/* Lead segments */}
      <section className="mb-12">
        <SectionTitle icon={Megaphone} title="Сегменты заявок" />
        {segments === null ? (
          <div className="rounded-xl border border-dashed border-mist bg-white p-8 text-center text-sm text-ink-500">
            Нет данных по сегментам.
          </div>
        ) : (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <ListCard
                title="Типы бизнеса"
                rows={segments.byType.map((t) => ({
                  label: businessTypeLabel(t.type),
                  value: t.won > 0 ? `${fmt(t.total)} · ${t.won} кл.` : fmt(t.total),
                }))}
              />
              <ListCard
                title="Язык заявки"
                rows={segments.byLanguage.map((l) => ({
                  label: languageLabel(l.language),
                  value: fmt(l.total),
                }))}
              />
              <ListCard
                title="Города"
                rows={segments.byCity.map((c) => ({ label: c.city, value: fmt(c.total) }))}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <ListCard
                title="Кампании (UTM и источники)"
                rows={segments.utm.map((u) => ({
                  label: `${sourceLabel(u.source)}${u.campaign === "—" ? "" : ` · ${u.campaign}`}`,
                  value: u.won > 0 ? `${fmt(u.total)} · ${u.won} кл.` : fmt(u.total),
                }))}
              />
              <StatCard
                icon={Inbox}
                label="Нужно оборудование"
                value={
                  segments.equipmentTotal === 0
                    ? "—"
                    : `${fmt(segments.equipmentYes)} из ${fmt(segments.equipmentTotal)}`
                }
                hint={`${pct(segments.equipmentYes, segments.equipmentTotal)} заявок просят сканер или планшет`}
              />
            </div>
          </div>
        )}
      </section>

      {/* Unit economics */}
      <section className="mb-12">
        <SectionTitle icon={Coins} title="Юнит-экономика" />
        <div className="space-y-5">
          {econ.winRatePct === null ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <StatCard
                icon={MousePointerClick}
                label="Конверсия в заявку"
                value={econ.leadRatePct === null ? "—" : `${econ.leadRatePct}%`}
                hint={
                  econ.leadRatePct === null
                    ? "счётчик работает с 10 июня 2026, данных пока мало"
                    : "заявки за 30 дней ÷ посетители (наш счётчик)"
                }
              />
              <div className="flex items-center rounded-xl border border-dashed border-mist bg-white p-5 text-sm leading-6 text-ink-500">
                Ценность заявки, потолок цены рекламы и стоимость пайплайна появятся после первого клиента
                со статусом «Выигран» 🏆. Формулы уже готовы и посчитаются сами.
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StatCard
                icon={MousePointerClick}
                label="Конверсия в заявку"
                value={econ.leadRatePct === null ? "—" : `${econ.leadRatePct}%`}
                hint={
                  econ.leadRatePct === null
                    ? "счётчик работает с 10 июня 2026, данных пока мало"
                    : "заявки за 30 дней ÷ посетители (наш счётчик)"
                }
              />
              <StatCard icon={TrendingUp} label="Заявка → клиент" value={`${econ.winRatePct}%`} hint="за всё время" />
              <StatCard
                icon={Users}
                label="Посетитель → клиент"
                value={econ.visitorToClientPct === null ? "—" : `${econ.visitorToClientPct}%`}
                hint="сквозная конверсия"
              />
              <StatCard
                icon={Coins}
                label="Ценность заявки"
                value={econ.valuePerLead12m === null ? "—" : fmtSum(econ.valuePerLead12m)}
                hint="выручка клиента за 12 мес × конверсия в клиента"
              />
              <StatCard
                icon={Coins}
                label="Макс. цена заявки"
                value={econ.maxCacPayback6m === null ? "—" : fmtSum(econ.maxCacPayback6m)}
                hint={`чтобы окупиться за 6 мес (пилот приносит ${fmtSum(REVENUE_6M)})`}
              />
              <StatCard
                icon={Inbox}
                label="Стоимость пайплайна"
                value={econ.pipelineValue12m === null ? "—" : fmtSum(econ.pipelineValue12m)}
                hint={`${fmt(pipelineActive)} активных заявок × ценность заявки`}
              />
              <StatCard
                icon={Coins}
                label="Подписка сейчас"
                value={`${fmtSum(econ.mrrPilot)}/мес`}
                hint={`${fmt(wonLeads)} ${pluralRu(wonLeads, "клиент", "клиента", "клиентов")} × ${fmtSum(PILOT_PRICE)} (пилот)`}
              />
              <StatCard
                icon={Coins}
                label="После пилота"
                value={`${fmtSum(econ.mrrAfterPilot)}/мес`}
                hint={`те же клиенты × ${fmtSum(FULL_PRICE)}`}
              />
            </div>
          )}
          <p className="text-xs text-ink-500">
            Оценка по ценам лендинга: {fmtSum(PILOT_PRICE)}/мес первые 6 месяцев, далее {fmtSum(FULL_PRICE)}/мес.
            Горизонт 12 месяцев, без затрат на привлечение и обслуживание. Цифры уточнятся с первыми клиентами.
          </p>
        </div>
      </section>

      {/* Social */}
      <section className="mb-12">
        <SectionTitle icon={Send} title="Соцсети" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            icon={Send}
            label={`Telegram · ${TELEGRAM_CHANNEL}`}
            value={subscribers === null ? "—" : fmt(subscribers)}
            hint={subscribers === null ? "не удалось получить" : pluralRu(subscribers, "подписчик", "подписчика", "подписчиков")}
          />
        </div>
      </section>

    </>
  );
}

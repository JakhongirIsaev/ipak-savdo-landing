import { sql } from "drizzle-orm";
import { pgTable, serial, text, boolean, timestamp, index, integer, jsonb } from "drizzle-orm/pg-core";
import { siteEventNames } from "@/lib/track/event-types";

// "minimarket" and "pharmacy" are public-facing form options; the older
// "cafe"/"restaurant"/"beauty" values stay for backward compatibility with
// existing leads, the Telegram intake, and admin filters. business_type is a
// plain text column (drizzle `enum` is a TS-only hint), so adding values needs
// no DB migration.
export const businessTypes = ["shop", "minimarket", "cafe", "restaurant", "market", "beauty", "service", "pharmacy", "other"] as const;
export type BusinessType = (typeof businessTypes)[number];

export const languages = ["ru", "uz"] as const;
export type Language = (typeof languages)[number];

export const leadStatuses = ["new", "contacted", "demo", "won", "lost"] as const;
export type LeadStatus = (typeof leadStatuses)[number];

export const leads = pgTable(
  "leads",
  {
    id: serial("id").primaryKey(),
    businessName: text("business_name").notNull(),
    businessType: text("business_type", { enum: businessTypes }).notNull(),
    businessTypeOther: text("business_type_other"),
    ownerName: text("owner_name").notNull(),
    ownerContact: text("owner_contact").notNull(),
    needsEquipment: boolean("needs_equipment").notNull().default(false),
    comment: text("comment"),
    source: text("source").notNull().default("direct"),
    utmSource: text("utm_source"),
    utmMedium: text("utm_medium"),
    utmCampaign: text("utm_campaign"),
    referrer: text("referrer"),
    userAgent: text("user_agent"),
    ip: text("ip"),
    language: text("language", { enum: languages }).notNull(),
    status: text("status", { enum: leadStatuses }).notNull().default("new"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    lastStatusChangeAt: timestamp("last_status_change_at", { withTimezone: true }),
    lastChangedBy: text("last_changed_by"),
    telegramMessageId: text("telegram_message_id"),
    city: text("city"),
    patentFileId: text("patent_file_id"),
    passportFileId: text("passport_file_id"),
    shopPhotoFileId: text("shop_photo_file_id"),
    patentStoragePath: text("patent_storage_path"),
    passportStoragePath: text("passport_storage_path"),
    shopStoragePath: text("shop_storage_path"),
  },
  (t) => ({
    createdAtIdx: index("leads_created_at_idx").on(t.createdAt),
    sourceIdx: index("leads_source_idx").on(t.source),
    statusIdx: index("leads_status_idx").on(t.status),
  }),
);

export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;

export const leadEvents = pgTable(
  "lead_events",
  {
    id: serial("id").primaryKey(),
    leadId: integer("lead_id").notNull().references(() => leads.id, { onDelete: "cascade" }),
    fromStatus: text("from_status", { enum: leadStatuses }),
    toStatus: text("to_status", { enum: leadStatuses }).notNull(),
    actor: text("actor").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    leadIdx: index("lead_events_lead_idx").on(t.leadId, t.createdAt),
  }),
);

export type LeadEvent = typeof leadEvents.$inferSelect;
export type NewLeadEvent = typeof leadEvents.$inferInsert;

export const botSessionSteps = ["name", "phone", "type", "city", "patent", "passport", "shop"] as const;
export type BotSessionStep = (typeof botSessionSteps)[number];

export const botSessions = pgTable("bot_sessions", {
  telegramUserId: text("telegram_user_id").primaryKey(),
  chatId: text("chat_id").notNull(),
  step: text("step", { enum: botSessionSteps }).notNull(),
  name: text("name"),
  phone: text("phone"),
  businessType: text("business_type", { enum: businessTypes }),
  city: text("city"),
  patentFileId: text("patent_file_id"),
  passportFileId: text("passport_file_id"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type BotSession = typeof botSessions.$inferSelect;
export type NewBotSession = typeof botSessions.$inferInsert;

export const supportSessionSteps = ["lang", "name", "phone", "question"] as const;
export type SupportSessionStep = (typeof supportSessionSteps)[number];

export const supportSessions = pgTable("support_sessions", {
  telegramUserId: text("telegram_user_id").primaryKey(),
  chatId: text("chat_id").notNull(),
  step: text("step", { enum: supportSessionSteps }).notNull(),
  language: text("language", { enum: languages }).notNull().default("ru"),
  name: text("name"),
  phone: text("phone"),
  question: text("question"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type SupportSession = typeof supportSessions.$inferSelect;
export type NewSupportSession = typeof supportSessions.$inferInsert;

// First-party, cookie-based visitor counter. One row per page view fired by the
// site beacon (components/VisitorBeacon.tsx → /api/hit). Owned data, no Google
// dependency — powers the "Посещаемость сайта" stats in the admin.
export const pageViews = pgTable(
  "page_views",
  {
    id: serial("id").primaryKey(),
    path: text("path").notNull(),
    visitorId: text("visitor_id").notNull(),
    sessionId: text("session_id").notNull(),
    isNewVisitor: boolean("is_new_visitor").notNull().default(false),
    locale: text("locale"),
    device: text("device"),
    referrer: text("referrer"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    createdAtIdx: index("page_views_created_at_idx").on(t.createdAt),
    visitorIdx: index("page_views_visitor_idx").on(t.visitorId),
    pathIdx: index("page_views_path_idx").on(t.path),
  }),
);

export type PageView = typeof pageViews.$inferSelect;
export type NewPageView = typeof pageViews.$inferInsert;

export const siteEvents = pgTable(
  "site_events",
  {
    id: serial("id").primaryKey(),
    event: text("event", { enum: siteEventNames }).notNull(),
    path: text("path").notNull(),
    visitorId: text("visitor_id").notNull(),
    sessionId: text("session_id").notNull(),
    locale: text("locale"),
    device: text("device"),
    placement: text("placement"),
    reason: text("reason"),
    source: text("source"),
    utmSource: text("utm_source"),
    utmMedium: text("utm_medium"),
    utmCampaign: text("utm_campaign"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    createdAtIdx: index("site_events_created_at_idx").on(t.createdAt),
    eventIdx: index("site_events_event_idx").on(t.event),
    sessionIdx: index("site_events_session_idx").on(t.sessionId),
  }),
);

export type SiteEvent = typeof siteEvents.$inferSelect;
export type NewSiteEvent = typeof siteEvents.$inferInsert;

// Keyword rank snapshots from SerpApi (admin "Keyword Rank Tracker"). One row per
// (keyword, locale) per manual refresh; the admin reads the two latest snapshots
// per keyword to show current position + change. Additive only — no existing
// table is touched. `position` is nullable (null = not found in the scanned page).
// `competitors` is a JSON string array of top competitor hostnames.
export const serpEngines = ["google", "yandex"] as const;
export type SerpEngine = (typeof serpEngines)[number];

export const keywordRanks = pgTable(
  "keyword_ranks",
  {
    id: serial("id").primaryKey(),
    keyword: text("keyword").notNull(),
    locale: text("locale", { enum: languages }).notNull(),
    engine: text("engine", { enum: serpEngines }).notNull().default("google"),
    location: text("location"),
    position: integer("position"),
    urlFound: text("url_found"),
    competitors: text("competitors"),
    checkedAt: timestamp("checked_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    keywordLocaleIdx: index("keyword_ranks_keyword_locale_idx").on(t.keyword, t.locale),
    checkedAtIdx: index("keyword_ranks_checked_at_idx").on(t.checkedAt),
  }),
);

export type KeywordRank = typeof keywordRanks.$inferSelect;
export type NewKeywordRank = typeof keywordRanks.$inferInsert;

export const contentObjectStatuses = [
  "draft",
  "generating",
  "pending_approval",
  "publishing",
  "staged",
  "approved",
  "rejected",
  "published",
  "failed",
] as const;
export type ContentObjectStatus = (typeof contentObjectStatuses)[number];

export const contentPlatforms = ["blog", "telegram", "instagram", "linkedin", "tiktok", "pinterest"] as const;
export type ContentPlatform = (typeof contentPlatforms)[number];

export interface ContentObjectDraft {
  version: number;
  platform: ContentPlatform;
  text: string;
  created_at: string;
  format?: string;
  metadata?: Record<string, unknown>;
}

export interface ContentObjectAsset {
  version: number;
  type: string;
  url: string;
  created_at: string;
}

export interface ContentObjectPublishJob {
  platform: ContentPlatform;
  status: string;
  job_id?: string;
  published_at?: string;
  url?: string;
  error?: string;
}

export interface ContentObjectMetrics {
  saves?: number;
  shares?: number;
  comments?: number;
  gsc_clicks?: number;
  gsc_impressions?: number;
  leads?: number;
}

export interface ContentObjectDeadLetter {
  timestamp: string;
  error: string;
  context?: unknown;
  retry_count: number;
}

export const contentObjects = pgTable(
  "content_objects",
  {
    id: text("id").primaryKey(),
    campaignId: text("campaign_id"),
    brief: text("brief").notNull(),
    status: text("status", { enum: contentObjectStatuses }).notNull().default("pending_approval"),
    platforms: jsonb("platforms").$type<ContentPlatform[]>().notNull().default(sql`'["blog","telegram"]'::jsonb`),
    drafts: jsonb("drafts").$type<ContentObjectDraft[]>().notNull().default(sql`'[]'::jsonb`),
    assets: jsonb("assets").$type<ContentObjectAsset[]>().notNull().default(sql`'[]'::jsonb`),
    approvedDraftVersion: integer("approved_draft_version"),
    approvedAssetVersion: integer("approved_asset_version"),
    publishJobs: jsonb("publish_jobs").$type<ContentObjectPublishJob[]>().notNull().default(sql`'[]'::jsonb`),
    metrics: jsonb("metrics").$type<ContentObjectMetrics>().notNull().default(sql`'{}'::jsonb`),
    deadLetters: jsonb("dead_letters").$type<ContentObjectDeadLetter[]>().notNull().default(sql`'[]'::jsonb`),
    source: text("source").notNull().default("api"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    statusIdx: index("content_objects_status_idx").on(t.status),
    createdAtIdx: index("content_objects_created_at_idx").on(t.createdAt),
  }),
);

export type ContentObject = typeof contentObjects.$inferSelect;
export type NewContentObject = typeof contentObjects.$inferInsert;

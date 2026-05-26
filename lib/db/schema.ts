import { pgTable, serial, text, boolean, timestamp, index, integer } from "drizzle-orm/pg-core";

export const businessTypes = ["shop", "cafe", "restaurant", "market", "beauty", "service", "other"] as const;
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

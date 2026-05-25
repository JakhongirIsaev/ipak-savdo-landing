import { pgTable, serial, text, boolean, timestamp, index } from "drizzle-orm/pg-core";

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
  },
  (t) => ({
    createdAtIdx: index("leads_created_at_idx").on(t.createdAt),
    sourceIdx: index("leads_source_idx").on(t.source),
    statusIdx: index("leads_status_idx").on(t.status),
  }),
);

export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;

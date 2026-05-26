import { describe, it, expect } from "vitest";
import { formatLeadMessage } from "./format";
import type { Lead } from "@/lib/db/schema";

const baseLead: Lead = {
  id: 42,
  businessName: "BillzCafe",
  businessType: "cafe",
  businessTypeOther: null,
  ownerName: "Иван Иванов",
  ownerContact: "+998 90 123 45 67",
  needsEquipment: true,
  comment: "нужно срочно",
  source: "instagram",
  utmSource: "instagram",
  utmMedium: "bio",
  utmCampaign: "may26",
  referrer: null,
  userAgent: null,
  ip: null,
  language: "ru",
  status: "new",
  createdAt: new Date("2026-05-25T13:42:00Z"),
  lastStatusChangeAt: null,
  lastChangedBy: null,
  telegramMessageId: null,
};

describe("formatLeadMessage", () => {
  it("includes the lead id with hash prefix", () => {
    const msg = formatLeadMessage(baseLead, "https://example.com");
    expect(msg).toContain("#42");
  });

  it("includes business name and Russian-labeled business type", () => {
    const msg = formatLeadMessage(baseLead, "https://example.com");
    expect(msg).toContain("BillzCafe");
    expect(msg).toContain("кафе");
  });

  it("uses business_type_other when type is 'other'", () => {
    const lead = { ...baseLead, businessType: "other" as const, businessTypeOther: "Пекарня" };
    const msg = formatLeadMessage(lead, "https://example.com");
    expect(msg).toContain("Пекарня");
  });

  it("renders 'да' for needs_equipment=true and 'нет' for false", () => {
    expect(formatLeadMessage(baseLead, "https://example.com")).toContain("Оборудование:</b> да");
    expect(formatLeadMessage({ ...baseLead, needsEquipment: false }, "https://example.com")).toContain("Оборудование:</b> нет");
  });

  it("escapes HTML special chars in user-supplied fields", () => {
    const lead = { ...baseLead, ownerName: "<script>alert(1)</script>" };
    const msg = formatLeadMessage(lead, "https://example.com");
    expect(msg).toContain("&lt;script&gt;");
    expect(msg).not.toContain("<script>");
  });

  it("formats time in Asia/Tashkent", () => {
    const msg = formatLeadMessage(baseLead, "https://example.com");
    expect(msg).toMatch(/25\.05\.2026/);
    expect(msg).toMatch(/18:42/);
  });

  it("includes admin link with lead id", () => {
    const msg = formatLeadMessage(baseLead, "https://example.com");
    expect(msg).toContain("https://example.com/admin/leads?id=42");
  });

  it("omits comment line when comment is null", () => {
    const lead = { ...baseLead, comment: null };
    const msg = formatLeadMessage(lead, "https://example.com");
    expect(msg).not.toContain("Комментарий");
  });

  it("omits UTM campaign when null", () => {
    const lead = { ...baseLead, utmCampaign: null };
    const msg = formatLeadMessage(lead, "https://example.com");
    expect(msg).not.toContain("кампания");
  });
});

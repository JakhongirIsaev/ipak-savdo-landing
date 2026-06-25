import type { Lead } from "@/lib/db/schema";

// Forward a captured lead to the BirLiy master (admin) so it shows up in the
// master leads admin. The landing is the public funnel; the master DB is the
// single source of truth (it authenticates this call with a shared
// X-Lead-Intake-Token — see the master's lib/lead-intake-auth.ts).
//
// Best-effort by design: the lead is ALREADY persisted locally and pushed to
// Telegram before this runs, so a master outage must never break public
// intake. But — unlike the previous silent gap where leads stopped reaching
// the master for weeks unnoticed — every failure is logged LOUDLY via
// console.error so a broken sync surfaces in the Railway logs instead of
// disappearing quietly.

const TIMEOUT_MS = 8000;

export async function forwardLeadToMaster(lead: Lead): Promise<void> {
  const url = process.env.MASTER_LEAD_INTAKE_URL;
  const token = process.env.MASTER_LEAD_INTAKE_TOKEN;
  if (!url || !token) {
    // Local dev / unconfigured env: skip rather than error, but make it visible.
    console.warn("[master-forward] skipped: MASTER_LEAD_INTAKE_URL/TOKEN not set");
    return;
  }

  const payload = {
    businessName: lead.businessName,
    businessType: lead.businessType,
    businessTypeOther: lead.businessTypeOther,
    ownerName: lead.ownerName,
    ownerContact: lead.ownerContact,
    needsEquipment: lead.needsEquipment,
    comment: lead.comment,
    source: lead.source,
    utmSource: lead.utmSource,
    utmMedium: lead.utmMedium,
    utmCampaign: lead.utmCampaign,
    referrer: lead.referrer,
    userAgent: lead.userAgent,
    ip: lead.ip,
    language: lead.language,
    city: lead.city,
    // Preserve the original capture time so the master shows the real date.
    createdAt: lead.createdAt instanceof Date ? lead.createdAt.toISOString() : lead.createdAt,
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", "x-lead-intake-token": token },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(
        `[master-forward] master rejected lead ${lead.id}: HTTP ${res.status} ${text.slice(0, 300)}`,
      );
    }
  } catch (err) {
    console.error(`[master-forward] failed to forward lead ${lead.id}`, err);
  } finally {
    clearTimeout(timer);
  }
}

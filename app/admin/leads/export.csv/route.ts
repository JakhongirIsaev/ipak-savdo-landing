import { db, leads } from "@/lib/db";
import { desc } from "drizzle-orm";
import { buildWhereClause, parseLeadFilters } from "@/lib/admin/filters";
import { toCsv } from "@/lib/csv";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HEADERS = [
  "id", "createdAt", "businessName", "businessType", "businessTypeOther",
  "ownerName", "ownerContact", "needsEquipment", "comment", "source",
  "utmSource", "utmMedium", "utmCampaign", "referrer", "userAgent", "ip",
  "language", "status",
] as const;

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const filters = parseLeadFilters(url.searchParams);
  const where = buildWhereClause(filters);

  const rows = await db
    .select()
    .from(leads)
    .where(where)
    .orderBy(desc(leads.createdAt));

  const csv = toCsv(HEADERS as unknown as readonly string[], rows as unknown as Record<string, unknown>[]);
  const filename = `leads-${new Date().toISOString().slice(0, 10)}.csv`;

  return new Response(csv, {
    status: 200,
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="${filename}"`,
    },
  });
}

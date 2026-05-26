import "dotenv/config";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";

async function main() {
  const result = await db.execute(sql`
    INSERT INTO lead_events (lead_id, from_status, to_status, actor, created_at)
    SELECT l.id, NULL, 'new', 'system', l.created_at
    FROM leads l
    WHERE NOT EXISTS (
      SELECT 1 FROM lead_events e WHERE e.lead_id = l.id
    )
  `);
  const rowCount = (result as any).rowCount ?? (result as any).count ?? "?";
  console.log(`Backfill complete. Rows inserted: ${rowCount}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

// QA helper: inspect / clean up concept_preview test leads in the live Neon DB.
//   node scripts/qa-lead.mjs find            → newest 5 concept_preview leads
//   node scripts/qa-lead.mjs delete <id>     → delete a test lead (events cascade)
import postgres from "postgres";
import { readFileSync } from "node:fs";

function loadEnv(path) {
  const out = {};
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)$/);
    if (m) {
      let v = m[2].trim();
      if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
      out[m[1]] = v;
    }
  }
  return out;
}

const env = loadEnv(".env.local");
const sql = postgres(env.DATABASE_URL, { max: 1 });
const [, , mode, arg] = process.argv;

try {
  if (mode === "find") {
    const rows = await sql`
      select id, business_name, business_type, owner_name, owner_contact, needs_equipment,
             comment, source, language, telegram_message_id,
             patent_file_id, passport_file_id, shop_photo_file_id,
             patent_storage_path, created_at
      from leads
      where source = 'concept_preview'
      order by id desc
      limit 5`;
    console.log(JSON.stringify(rows, null, 2));
  } else if (mode === "delete") {
    const id = parseInt(arg, 10);
    if (!Number.isFinite(id)) throw new Error("delete needs a numeric id");
    const r = await sql`delete from leads where id = ${id} returning id`;
    console.log("deleted:", JSON.stringify(r));
  } else {
    console.log("usage: node scripts/qa-lead.mjs find | delete <id>");
  }
} finally {
  await sql.end();
}

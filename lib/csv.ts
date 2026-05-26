function serializeCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "boolean") return value ? "true" : "false";
  const s = String(value);
  if (s.includes(",") || s.includes('"') || s.includes("\n") || s.includes("\r")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function toCsv<T extends Record<string, unknown>>(
  headers: ReadonlyArray<keyof T & string>,
  rows: T[],
): string {
  const headerLine = headers.join(",");
  const dataLines = rows.map((row) => headers.map((h) => serializeCell(row[h])).join(","));
  return [headerLine, ...dataLines].join("\n") + "\n";
}

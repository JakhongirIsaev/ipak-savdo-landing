import { and, between, eq, gte, ilike, lte, or, type SQL } from "drizzle-orm";
import { leads, leadStatuses, type BusinessType, type LeadStatus, businessTypes } from "@/lib/db/schema";

export interface LeadFilters {
  from: Date | null;
  to: Date | null;
  source: string | null;
  businessType: BusinessType | null;
  equipment: boolean | null;
  q: string | null;
  page: number;
  status: LeadStatus | null;
}

export const PAGE_SIZE = 50;

export function parseLeadFilters(params: URLSearchParams): LeadFilters {
  const fromStr = params.get("from");
  const toStr = params.get("to");
  const source = params.get("source");
  const typeStr = params.get("type");
  const equipmentStr = params.get("equipment");
  const q = params.get("q");
  const pageStr = params.get("page");

  const parseDay = (s: string | null, endOfDay = false): Date | null => {
    if (!s) return null;
    const d = new Date(s + (endOfDay ? "T23:59:59.999Z" : "T00:00:00Z"));
    return isNaN(d.getTime()) ? null : d;
  };

  const businessType: BusinessType | null =
    typeStr && (businessTypes as readonly string[]).includes(typeStr)
      ? (typeStr as BusinessType)
      : null;

  let equipment: boolean | null = null;
  if (equipmentStr === "yes") equipment = true;
  else if (equipmentStr === "no") equipment = false;

  const pageRaw = pageStr ? parseInt(pageStr, 10) : 1;
  const page = !pageRaw || pageRaw < 1 || isNaN(pageRaw) ? 1 : pageRaw;

  const statusStr = params.get("status");
  const status: LeadStatus | null =
    statusStr && (leadStatuses as readonly string[]).includes(statusStr)
      ? (statusStr as LeadStatus)
      : null;

  return {
    from: parseDay(fromStr),
    to: parseDay(toStr, true),
    source: source && source.length > 0 ? source : null,
    businessType,
    equipment,
    q: q && q.length > 0 ? q : null,
    page,
    status,
  };
}

export function buildWhereClause(filters: LeadFilters): SQL | undefined {
  const clauses: SQL[] = [];
  if (filters.from && filters.to) clauses.push(between(leads.createdAt, filters.from, filters.to));
  else if (filters.from) clauses.push(gte(leads.createdAt, filters.from));
  else if (filters.to) clauses.push(lte(leads.createdAt, filters.to));
  if (filters.source) clauses.push(eq(leads.source, filters.source));
  if (filters.businessType) clauses.push(eq(leads.businessType, filters.businessType));
  if (filters.equipment !== null) clauses.push(eq(leads.needsEquipment, filters.equipment));
  if (filters.status) clauses.push(eq(leads.status, filters.status));
  if (filters.q) {
    const like = `%${filters.q}%`;
    const orClause = or(ilike(leads.businessName, like), ilike(leads.ownerName, like));
    if (orClause) clauses.push(orClause);
  }
  return clauses.length > 0 ? and(...clauses) : undefined;
}

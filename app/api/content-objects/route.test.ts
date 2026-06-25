import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db", () => {
  const rows: any[] = [];
  let lastConflictKey: string | null = null;

  const contentObjects = {
    __id: "contentObjects",
    status: "status",
    createdAt: "createdAt",
    webhookEventKey: "webhookEventKey",
  };

  const insert = () => ({
    values: (row: any) => ({
      onConflictDoNothing: () => ({
        returning: async () => {
          const key = row.webhookEventKey;
          if (key && rows.some((existing) => existing.webhookEventKey === key)) {
            lastConflictKey = key;
            return [];
          }
          rows.push(row);
          return [row];
        },
      }),
      returning: async () => {
        rows.push(row);
        return [row];
      },
    }),
  });

  const select = () => ({
    from: () => ({
      where: () => ({
        limit: async () => rows.filter((row) => row.webhookEventKey === lastConflictKey).slice(0, 1),
      }),
      orderBy: () => ({
        limit: async () => rows.slice(),
      }),
    }),
  });

  return {
    db: { insert, select },
    contentObjects,
    contentObjectStatuses: [
      "draft",
      "generating",
      "pending_approval",
      "publishing",
      "staged",
      "approved",
      "rejected",
      "published",
      "failed",
    ],
    __rows: rows,
    __reset: () => {
      rows.splice(0);
      lastConflictKey = null;
    },
  };
});

import { POST } from "./route";
import * as dbMod from "@/lib/db";

const makeReq = (body: unknown) =>
  new Request("http://example.com/api/content-objects", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: "Bearer test-internal-token",
    },
    body: JSON.stringify(body),
  });

describe("POST /api/content-objects idempotency", () => {
  beforeEach(() => {
    process.env.AIOS_INTERNAL_TOKEN = "test-internal-token";
    (dbMod as any).__reset();
  });

  it("returns the existing ContentObject when idempotency key conflicts", async () => {
    const body = {
      brief: "Generate a durable task",
      status: "generating",
      drafts: [],
      idempotency_key: "telegram:update:9001",
      source: "telegram_task",
    };

    const first = await POST(makeReq(body));
    expect(first.status).toBe(201);
    const firstJson = await first.json();
    expect(firstJson.duplicate).toBe(false);

    const second = await POST(makeReq(body));
    expect(second.status).toBe(200);
    const secondJson = await second.json();

    expect(secondJson.duplicate).toBe(true);
    expect(secondJson.content_object.id).toBe(firstJson.content_object.id);
    expect(secondJson.content_object.idempotency_key).toBe("telegram:update:9001");
    expect((dbMod as any).__rows).toHaveLength(1);
  });
});

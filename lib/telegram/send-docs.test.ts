import { describe, it, expect, vi, afterEach } from "vitest";
import { sendLeadDocsAlbum } from "./send-docs";
import type { Lead } from "@/lib/db/schema";

const lead = {
  id: 7,
  businessType: "cafe",
  businessTypeOther: null,
  businessName: "BillzCafe",
  ownerName: "Иван",
  ownerContact: "+998901234567",
  city: "Ташкент",
} as unknown as Lead;

function img(name: string): File {
  return new File([new Uint8Array(10)], name, { type: "image/jpeg" });
}

afterEach(() => vi.restoreAllMocks());

describe("sendLeadDocsAlbum", () => {
  it("uploads a multipart photo album with info caption and returns largest file_ids in order", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          ok: true,
          result: [
            { photo: [{ file_id: "small1", file_size: 100 }, { file_id: "big1", file_size: 900 }] },
            { photo: [{ file_id: "big2", file_size: 500 }] },
            { photo: [{ file_id: "big3", file_size: 700 }] },
          ],
        }),
        { status: 200 },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const ids = await sendLeadDocsAlbum("tok", "-100", lead, [
      { file: img("patent.jpg"), label: "📄 Патент" },
      { file: img("passport.jpg"), label: "🪪 Паспорт" },
      { file: img("shop.jpg"), label: "🏪 Магазин" },
    ]);

    expect(ids).toEqual(["big1", "big2", "big3"]);

    const url = fetchMock.mock.calls[0][0] as string;
    expect(url).toContain("/sendMediaGroup");
    const body = fetchMock.mock.calls[0][1].body as FormData;
    expect(body.get("chat_id")).toBe("-100");
    const media = JSON.parse(body.get("media") as string);
    expect(media).toHaveLength(3);
    expect(media[0].media).toBe("attach://f0");
    expect(media[0].caption).toContain("Заявка #7");
    expect(media[0].caption).toContain("Патент");
    expect(media[0].parse_mode).toBe("HTML");
    expect(media[1].caption).toBe("🪪 Паспорт");
    expect(body.get("f0")).toBeInstanceOf(File);
    expect(body.get("f2")).toBeInstanceOf(File);
  });

  it("returns nulls when Telegram rejects the album", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("nope", { status: 400 })));
    const ids = await sendLeadDocsAlbum("tok", "-100", lead, [
      { file: img("a.jpg"), label: "a" },
      { file: img("b.jpg"), label: "b" },
    ]);
    expect(ids).toEqual([null, null]);
  });
});

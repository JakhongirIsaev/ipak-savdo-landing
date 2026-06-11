import { describe, it, expect } from "vitest";
import { validateLeadFile, sniffImageType, MAX_DOC_BYTES } from "./lead-files";

function file(bytes: number, type: string): File {
  return new File([new Uint8Array(bytes)], "doc", { type });
}

describe("validateLeadFile", () => {
  it("rejects null, non-file, and empty file as 'missing'", () => {
    expect(validateLeadFile(null)).toEqual({ ok: false, reason: "missing" });
    expect(validateLeadFile("oops")).toEqual({ ok: false, reason: "missing" });
    expect(validateLeadFile(file(0, "image/jpeg"))).toEqual({ ok: false, reason: "missing" });
  });

  it("rejects a disallowed type", () => {
    expect(validateLeadFile(file(50, "application/pdf"))).toEqual({ ok: false, reason: "type" });
  });

  it("rejects a file over the size cap", () => {
    expect(validateLeadFile(file(MAX_DOC_BYTES + 1, "image/jpeg"))).toEqual({ ok: false, reason: "size" });
  });

  it("accepts a valid image", () => {
    const f = file(200, "image/png");
    const r = validateLeadFile(f);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.file).toBe(f);
  });
});

describe("sniffImageType", () => {
  const withHead = (head: number[], type = "image/png") =>
    new File([new Uint8Array([...head, ...new Array(12).fill(0)])], "doc", { type });

  it("accepts real JPEG, PNG and WEBP magic bytes", async () => {
    expect(await sniffImageType(withHead([0xff, 0xd8, 0xff]))).toBe(true);
    expect(await sniffImageType(withHead([0x89, 0x50, 0x4e, 0x47]))).toBe(true);
    expect(
      await sniffImageType(new File([new Uint8Array([0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50])], "doc", { type: "image/webp" })),
    ).toBe(true);
  });

  it("rejects a non-image whose Content-Type claims image/png", async () => {
    const fake = new File([new TextEncoder().encode("this is plainly not an image")], "x.png", { type: "image/png" });
    expect(await sniffImageType(fake)).toBe(false);
  });
});

import { describe, it, expect } from "vitest";
import { toCsv } from "./csv";

describe("toCsv", () => {
  it("renders headers and rows", () => {
    const csv = toCsv(["id", "name"], [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }]);
    expect(csv).toBe(`id,name\n1,Alice\n2,Bob\n`);
  });

  it("quotes fields containing commas", () => {
    const csv = toCsv(["a"], [{ a: "1,2,3" }]);
    expect(csv).toBe(`a\n"1,2,3"\n`);
  });

  it("escapes double quotes by doubling them", () => {
    const csv = toCsv(["a"], [{ a: 'say "hi"' }]);
    expect(csv).toBe(`a\n"say ""hi"""\n`);
  });

  it("quotes fields with newlines", () => {
    const csv = toCsv(["a"], [{ a: "line1\nline2" }]);
    expect(csv).toBe(`a\n"line1\nline2"\n`);
  });

  it("serializes null and undefined as empty", () => {
    const csv = toCsv(["a", "b"], [{ a: null, b: undefined }]);
    expect(csv).toBe(`a,b\n,\n`);
  });

  it("serializes Date as ISO string", () => {
    const csv = toCsv(["t"], [{ t: new Date("2026-05-25T13:42:00.000Z") }]);
    expect(csv).toBe(`t\n2026-05-25T13:42:00.000Z\n`);
  });

  it("serializes booleans as true/false", () => {
    const csv = toCsv(["b"], [{ b: true }, { b: false }]);
    expect(csv).toBe(`b\ntrue\nfalse\n`);
  });
});

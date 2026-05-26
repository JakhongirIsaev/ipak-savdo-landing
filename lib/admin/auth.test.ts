import { describe, it, expect } from "vitest";
import { checkBasicAuth } from "./auth";

describe("checkBasicAuth", () => {
  const expected = { user: "jack", password: "s3cret" };

  it("returns true with correct creds", () => {
    const header = "Basic " + Buffer.from("jack:s3cret").toString("base64");
    expect(checkBasicAuth(header, expected)).toBe(true);
  });

  it("returns false with wrong password", () => {
    const header = "Basic " + Buffer.from("jack:nope").toString("base64");
    expect(checkBasicAuth(header, expected)).toBe(false);
  });

  it("returns false with wrong user", () => {
    const header = "Basic " + Buffer.from("rick:s3cret").toString("base64");
    expect(checkBasicAuth(header, expected)).toBe(false);
  });

  it("returns false with no header", () => {
    expect(checkBasicAuth(null, expected)).toBe(false);
  });

  it("returns false with malformed header", () => {
    expect(checkBasicAuth("Bearer abc", expected)).toBe(false);
    expect(checkBasicAuth("Basic !!!", expected)).toBe(false);
  });
});

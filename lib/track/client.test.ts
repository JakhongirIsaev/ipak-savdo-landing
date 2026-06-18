import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { trackSiteEvent, trackLeadSubmitAttempt, trackLeadSuccess } from "./client";

// trackSiteEvent reads browser globals at call time; the vitest env is "node",
// so we stub the minimal browser surface it touches. `sendBeacon` stands in for
// the internal /api/event funnel; `gtag` stands in for GA. Fully deterministic:
// no real network, no real GA, and no production lead is ever created.
let gtag: ReturnType<typeof vi.fn>;
let sendBeacon: ReturnType<typeof vi.fn>;

beforeEach(() => {
  gtag = vi.fn();
  sendBeacon = vi.fn(() => true);
  vi.stubGlobal("window", { gtag, location: { search: "", pathname: "/" } });
  vi.stubGlobal("document", { documentElement: { lang: "ru" } });
  vi.stubGlobal("navigator", { sendBeacon });
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const gaEventNames = (): string[] =>
  gtag.mock.calls.filter((c) => c[0] === "event").map((c) => c[1] as string);
const generateLeadCount = (): number =>
  gaEventNames().filter((name) => name === "generate_lead").length;

describe("lead funnel analytics — generate_lead is success-only", () => {
  it("opening the form (lead_form_view) does not emit generate_lead", () => {
    trackSiteEvent("lead_form_view");
    expect(gaEventNames()).toContain("lead_form_view");
    expect(generateLeadCount()).toBe(0);
    // internal /api/event funnel still receives the event
    expect(sendBeacon).toHaveBeenCalledWith("/api/event", expect.anything());
  });

  it("starting / typing (lead_form_start) does not emit generate_lead", () => {
    trackSiteEvent("lead_form_start");
    expect(gaEventNames()).toContain("lead_form_start");
    expect(generateLeadCount()).toBe(0);
  });

  it("a submit attempt (lead_form_submit) does not emit generate_lead", () => {
    trackLeadSubmitAttempt();
    expect(gaEventNames()).toContain("lead_form_submit");
    expect(generateLeadCount()).toBe(0);
  });

  it("a validation or API/network error does not emit generate_lead", () => {
    trackSiteEvent("lead_form_error", { reason: "validation" });
    trackSiteEvent("lead_form_error", { reason: "network" });
    expect(gaEventNames()).toContain("lead_form_error");
    expect(generateLeadCount()).toBe(0);
  });

  it("a server-confirmed lead emits lead_form_success and generate_lead exactly once", () => {
    trackLeadSuccess();
    expect(gaEventNames()).toContain("lead_form_success");
    expect(generateLeadCount()).toBe(1);
    // the success also flows to the internal funnel
    expect(sendBeacon).toHaveBeenCalledWith("/api/event", expect.anything());
  });

  it("across the full funnel, only trackLeadSuccess emits generate_lead", () => {
    trackSiteEvent("lead_form_view");
    trackSiteEvent("lead_form_start");
    trackLeadSubmitAttempt();
    trackSiteEvent("lead_form_error", { reason: "validation" });
    expect(generateLeadCount()).toBe(0);
    trackLeadSuccess();
    expect(generateLeadCount()).toBe(1);
  });
});

import { describe, expect, it } from "vitest";

import { isActiveRoute } from "@/components/bottom-navigation";

describe("isActiveRoute", () => {
  it("matches the home route only on an exact path", () => {
    expect(isActiveRoute("/", "/")).toBe(true);
    expect(isActiveRoute("/cek-harga", "/")).toBe(false);
  });

  it("matches a section route and its nested paths", () => {
    expect(isActiveRoute("/kulakan-bareng", "/kulakan-bareng")).toBe(true);
    expect(isActiveRoute("/kulakan-bareng/opp-1", "/kulakan-bareng")).toBe(
      true,
    );
  });

  it("does not match a sibling route with a shared prefix", () => {
    expect(isActiveRoute("/lapor-harga-lama", "/lapor-harga")).toBe(false);
  });
});

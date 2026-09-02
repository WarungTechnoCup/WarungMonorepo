import { describe, expect, it } from "vitest";

import {
  calculateConfidence,
  confidenceLabel,
} from "@/domain/harga-wajar/confidence";
import { createDuplicateFingerprint } from "@/domain/harga-wajar/fingerprint";

describe("trust controls", () => {
  it("clamps and labels confidence deterministically", () => {
    const score = calculateConfidence({
      eligibleReportCount: 30,
      independentWarungCount: 20,
      recency: 1,
      verification: 1,
      dispersion: 1,
      completeness: 1,
    });
    expect(score).toBe(100);
    expect(confidenceLabel(score, 20)).toBe("Tinggi");
    expect(confidenceLabel(90, 4)).toBe("Terbatas");
  });

  it("produces the same fingerprint for the same report facts", () => {
    const input = {
      warungId: "warung-1",
      productId: "product-1",
      observedDate: "2026-09-01",
      unitPriceIdr: 3075,
      quantityPackages: 1,
    };
    expect(createDuplicateFingerprint(input)).toBe(
      createDuplicateFingerprint(input),
    );
    expect(
      createDuplicateFingerprint({ ...input, unitPriceIdr: 3100 }),
    ).not.toBe(createDuplicateFingerprint(input));
  });
});

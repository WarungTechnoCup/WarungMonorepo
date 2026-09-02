import { describe, expect, it } from "vitest";

import { normalizePurchase } from "@/domain/harga-wajar/normalization";

describe("normalizePurchase", () => {
  it("calculates landed cost and canonical unit price", () => {
    expect(
      normalizePurchase({
        grossPriceIdr: 118_000,
        discountIdr: 0,
        deliveryFeeIdr: 5_000,
        quantityPackages: 1,
        unitsPerPackage: 40,
        baseUnit: "pcs",
        expectedBaseUnit: "pcs",
      }),
    ).toEqual({
      ok: true,
      landedTotalIdr: 123_000,
      baseUnitsTotal: 40,
      unitPriceIdr: 3_075,
      calculationVersion: "1.0.0",
    });
  });

  it("rejects incompatible units instead of inferring a conversion", () => {
    const result = normalizePurchase({
      grossPriceIdr: 100_000,
      discountIdr: 0,
      deliveryFeeIdr: 0,
      quantityPackages: 1,
      unitsPerPackage: 12,
      baseUnit: "liter",
      expectedBaseUnit: "botol",
    });

    expect(result).toEqual({ ok: false, reasons: ["INCOMPATIBLE_BASE_UNIT"] });
  });

  it("returns every relevant validation reason", () => {
    const result = normalizePurchase({
      grossPriceIdr: 0,
      discountIdr: -1,
      deliveryFeeIdr: -1,
      quantityPackages: 0,
      unitsPerPackage: 0,
      baseUnit: "pcs",
      expectedBaseUnit: "pcs",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reasons).toEqual([
        "INVALID_GROSS_PRICE",
        "INVALID_DISCOUNT",
        "INVALID_DELIVERY_FEE",
        "INVALID_PACKAGE_QUANTITY",
        "INVALID_UNITS_PER_PACKAGE",
        "NON_POSITIVE_LANDED_TOTAL",
      ]);
    }
  });
});

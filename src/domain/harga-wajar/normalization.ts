import type {
  NormalizationReasonCode,
  NormalizationResult,
  PurchaseNormalizationInput,
} from "@/domain/harga-wajar/types";
import { NORMALIZATION_VERSION } from "@/domain/harga-wajar/types";

function isNonNegativeInteger(value: number) {
  return Number.isSafeInteger(value) && value >= 0;
}

function isPositiveInteger(value: number) {
  return Number.isSafeInteger(value) && value > 0;
}

export function normalizePurchase(
  input: PurchaseNormalizationInput,
): NormalizationResult {
  const reasons: NormalizationReasonCode[] = [];

  if (!isPositiveInteger(input.grossPriceIdr)) {
    reasons.push("INVALID_GROSS_PRICE");
  }
  if (!isNonNegativeInteger(input.discountIdr)) {
    reasons.push("INVALID_DISCOUNT");
  }
  if (!isNonNegativeInteger(input.deliveryFeeIdr)) {
    reasons.push("INVALID_DELIVERY_FEE");
  }
  if (!isPositiveInteger(input.quantityPackages)) {
    reasons.push("INVALID_PACKAGE_QUANTITY");
  }
  if (!isPositiveInteger(input.unitsPerPackage)) {
    reasons.push("INVALID_UNITS_PER_PACKAGE");
  }
  if (
    input.baseUnit.trim().toLowerCase() !==
    input.expectedBaseUnit.trim().toLowerCase()
  ) {
    reasons.push("INCOMPATIBLE_BASE_UNIT");
  }

  const landedTotalIdr =
    input.grossPriceIdr - input.discountIdr + input.deliveryFeeIdr;

  if (Number.isFinite(landedTotalIdr) && landedTotalIdr <= 0) {
    reasons.push("NON_POSITIVE_LANDED_TOTAL");
  }

  if (reasons.length > 0) {
    return { ok: false, reasons };
  }

  const baseUnitsTotal = input.quantityPackages * input.unitsPerPackage;

  return {
    ok: true,
    landedTotalIdr,
    baseUnitsTotal,
    unitPriceIdr: Math.round(landedTotalIdr / baseUnitsTotal),
    calculationVersion: NORMALIZATION_VERSION,
  };
}

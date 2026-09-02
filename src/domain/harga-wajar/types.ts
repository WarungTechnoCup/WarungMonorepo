export const NORMALIZATION_VERSION = "1.0.0";
export const BENCHMARK_VERSION = "1.0.0";
export const MINIMUM_INDEPENDENT_WARUNGS = 5;

export type NormalizationReasonCode =
  | "INVALID_GROSS_PRICE"
  | "INVALID_DISCOUNT"
  | "INVALID_DELIVERY_FEE"
  | "INVALID_PACKAGE_QUANTITY"
  | "INVALID_UNITS_PER_PACKAGE"
  | "INCOMPATIBLE_BASE_UNIT"
  | "NON_POSITIVE_LANDED_TOTAL";

export type ObservationExclusionReason =
  | "DUPLICATE_REPORT"
  | "ANOMALOUS_PRICE"
  | "MISSING_AGGREGATION_CONSENT"
  | "INVALID_NORMALIZATION";

export type PriceReportStatus = "pending" | "included" | "flagged" | "excluded";

export interface PurchaseNormalizationInput {
  grossPriceIdr: number;
  discountIdr: number;
  deliveryFeeIdr: number;
  quantityPackages: number;
  unitsPerPackage: number;
  baseUnit: string;
  expectedBaseUnit: string;
}

export interface NormalizationSuccess {
  ok: true;
  landedTotalIdr: number;
  baseUnitsTotal: number;
  unitPriceIdr: number;
  calculationVersion: string;
}

export interface NormalizationFailure {
  ok: false;
  reasons: NormalizationReasonCode[];
}

export type NormalizationResult = NormalizationSuccess | NormalizationFailure;

export interface EligibleObservation {
  id: string;
  warungId: string;
  unitPriceIdr: number;
  observedAt: Date;
  verificationWeight: number;
  completenessWeight: number;
}

export interface BenchmarkInsufficient {
  status: "insufficient";
  independentContributors: number;
  requiredContributors: number;
  reportCount: number;
  message: string;
  calculationVersion: string;
}

export interface BenchmarkAvailable {
  status: "available";
  medianUnitPriceIdr: number;
  p25UnitPriceIdr: number;
  p75UnitPriceIdr: number;
  independentContributors: number;
  reportCount: number;
  confidenceScore: number;
  confidenceLabel: "Terbatas" | "Sedang" | "Tinggi";
  latestObservationAt: string;
  calculationVersion: string;
}

export type BenchmarkResult = BenchmarkInsufficient | BenchmarkAvailable;

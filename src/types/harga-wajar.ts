import type {
  BenchmarkResult,
  NormalizationSuccess,
  PriceReportStatus,
} from "@/domain/harga-wajar/types";

export interface PackagingOptionDto {
  id: string;
  label: string;
  unitsPerPackage: number;
  baseUnit: string;
}

export interface ProductDto {
  id: string;
  slug: string;
  name: string;
  brand: string;
  baseUnit: string;
  description: string;
  isDemo: boolean;
  packagingOptions: PackagingOptionDto[];
}

export interface BenchmarkDto {
  productId: string;
  province: string;
  city: string;
  district: string;
  windowDays: number;
  computedAt: string | null;
  result: BenchmarkResult;
}

export interface PriceReportResultDto {
  reportId: string;
  reference: string;
  status: PriceReportStatus;
  statusReason: string | null;
  normalization: NormalizationSuccess;
  benchmark: BenchmarkDto;
}

export interface ActivityItemDto {
  id: string;
  reference: string;
  productName: string;
  observedDate: string;
  unitPriceIdr: number;
  status: PriceReportStatus;
  statusReason: string | null;
  createdAt: string;
}

export type OpportunityStatus =
  | "DRAFT"
  | "OPEN"
  | "TARGET_REACHED"
  | "QUOTE_REQUESTED"
  | "QUOTE_RECEIVED"
  | "ACCEPTED"
  | "FULFILLED"
  | "CANCELLED";

export interface OwnCommitmentDto {
  id: string;
  opportunityId: string;
  quantityPackages: number;
  createdAt: string;
  productName: string;
  packagingLabel: string;
  targetPriceIdr: number;
  deadline: string;
  status: OpportunityStatus;
  organizerName: string;
  city: string;
  district: string;
}

export interface MethodologyConfidenceLabel {
  label: string;
  minimumScore: number;
  maximumScore: number;
}

export interface MethodologyDto {
  normalizationVersion: string;
  benchmarkVersion: string;
  minimumIndependentWarungs: number;
  landedTotalFormula: string;
  baseUnitsFormula: string;
  unitPriceFormula: string;
  aggregation: string;
  dispersion: string;
  outlierPolicy: string;
  confidenceLabels: MethodologyConfidenceLabel[];
  documentationPath: string;
}

export type ConsentPurpose = "anonymous_aggregation" | "receipt_storage";

export interface ConsentStateDto {
  purpose: ConsentPurpose;
  description: string;
  granted: boolean;
  policyVersion: string;
  grantedAt: string | null;
  withdrawnAt: string | null;
}

export interface ModerationQueueItemDto {
  id: string;
  status: PriceReportStatus;
  statusReason: string | null;
  observedDate: string;
  createdAt: string;
  isDemo: boolean;
  productName: string;
  unitPriceIdr: number | null;
  province: string | null;
  city: string | null;
  district: string | null;
}

export interface AdminAuditEventDto {
  id: string;
  eventType: string;
  entityType: string;
  entityId: string;
  reasonCode: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
}

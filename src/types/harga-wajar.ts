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

import {
  calculateConfidence,
  confidenceLabel,
} from "@/domain/harga-wajar/confidence";
import { interquartileRange, median } from "@/domain/harga-wajar/statistics";
import {
  BENCHMARK_VERSION,
  MINIMUM_INDEPENDENT_WARUNGS,
  type BenchmarkResult,
  type EligibleObservation,
} from "@/domain/harga-wajar/types";

function average(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function buildBenchmark(
  observations: EligibleObservation[],
  now = new Date(),
): BenchmarkResult {
  const independentContributors = new Set(
    observations.map((observation) => observation.warungId),
  ).size;

  if (independentContributors < MINIMUM_INDEPENDENT_WARUNGS) {
    return {
      status: "insufficient",
      independentContributors,
      requiredContributors: MINIMUM_INDEPENDENT_WARUNGS,
      reportCount: observations.length,
      message:
        "Belum cukup laporan independen untuk membuat patokan harga area.",
      calculationVersion: BENCHMARK_VERSION,
    };
  }

  const prices = observations.map((observation) => observation.unitPriceIdr);
  const { p25, p75 } = interquartileRange(prices);
  const newest = observations.reduce(
    (latest, observation) =>
      observation.observedAt > latest ? observation.observedAt : latest,
    observations[0]?.observedAt ?? now,
  );
  const ageDays = Math.max(
    0,
    (now.getTime() - newest.getTime()) / (24 * 60 * 60 * 1000),
  );
  const recency = Math.max(0, 1 - ageDays / 90);
  const center = median(prices);
  const dispersion = center === 0 ? 0 : Math.max(0, 1 - (p75 - p25) / center);
  const score = calculateConfidence({
    eligibleReportCount: observations.length,
    independentWarungCount: independentContributors,
    recency,
    verification: average(
      observations.map((observation) => observation.verificationWeight),
    ),
    dispersion,
    completeness: average(
      observations.map((observation) => observation.completenessWeight),
    ),
  });

  return {
    status: "available",
    medianUnitPriceIdr: center,
    p25UnitPriceIdr: p25,
    p75UnitPriceIdr: p75,
    independentContributors,
    reportCount: observations.length,
    confidenceScore: score,
    confidenceLabel: confidenceLabel(score, independentContributors),
    latestObservationAt: newest.toISOString(),
    calculationVersion: BENCHMARK_VERSION,
  };
}

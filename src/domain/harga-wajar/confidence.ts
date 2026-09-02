interface ConfidenceInput {
  eligibleReportCount: number;
  independentWarungCount: number;
  recency: number;
  verification: number;
  dispersion: number;
  completeness: number;
}

function clampUnit(value: number) {
  return Math.min(Math.max(value, 0), 1);
}

export function calculateConfidence(input: ConfidenceInput) {
  const score =
    100 *
    (0.3 * Math.min(input.independentWarungCount / 20, 1) +
      0.2 * Math.min(input.eligibleReportCount / 30, 1) +
      0.15 * clampUnit(input.recency) +
      0.15 * clampUnit(input.verification) +
      0.1 * clampUnit(input.dispersion) +
      0.1 * clampUnit(input.completeness));

  return Math.round(Math.min(Math.max(score, 0), 100));
}

export function confidenceLabel(
  score: number,
  independentWarungCount: number,
): "Terbatas" | "Sedang" | "Tinggi" {
  if (independentWarungCount < 5 || score < 50) {
    return "Terbatas";
  }
  if (score < 75) {
    return "Sedang";
  }
  return "Tinggi";
}

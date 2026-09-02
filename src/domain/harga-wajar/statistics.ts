export function percentile(values: number[], percentileValue: number) {
  if (values.length === 0) {
    throw new Error("Statistik membutuhkan setidaknya satu nilai.");
  }
  if (percentileValue < 0 || percentileValue > 1) {
    throw new Error("Persentil harus berada antara 0 dan 1.");
  }

  const sorted = [...values].sort((left, right) => left - right);
  const position = (sorted.length - 1) * percentileValue;
  const lowerIndex = Math.floor(position);
  const upperIndex = Math.ceil(position);
  const lower = sorted[lowerIndex];
  const upper = sorted[upperIndex];

  if (lower === undefined || upper === undefined) {
    throw new Error("Posisi persentil tidak valid.");
  }

  if (lowerIndex === upperIndex) {
    return lower;
  }

  return Math.round(lower + (upper - lower) * (position - lowerIndex));
}

export function median(values: number[]) {
  return percentile(values, 0.5);
}

export function interquartileRange(values: number[]) {
  const p25 = percentile(values, 0.25);
  const p75 = percentile(values, 0.75);
  return { p25, p75, iqr: p75 - p25 };
}

export function isAnomalousPrice(value: number, referenceValues: number[]) {
  if (referenceValues.length < 4) {
    return false;
  }

  const { p25, p75, iqr } = interquartileRange(referenceValues);
  return value < p25 - 1.5 * iqr || value > p75 + 1.5 * iqr;
}

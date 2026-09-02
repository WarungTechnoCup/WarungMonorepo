import { describe, expect, it } from "vitest";

import { buildBenchmark } from "@/domain/harga-wajar/benchmark";
import {
  interquartileRange,
  isAnomalousPrice,
  median,
} from "@/domain/harga-wajar/statistics";

const now = new Date("2026-09-02T00:00:00.000Z");

function observation(
  index: number,
  price: number,
  warungId = `warung-${index}`,
) {
  return {
    id: `observation-${index}`,
    warungId,
    unitPriceIdr: price,
    observedAt: new Date("2026-09-01T00:00:00.000Z"),
    verificationWeight: 0.8,
    completenessWeight: 1,
  };
}

describe("benchmark statistics", () => {
  it("calculates median and interquartile range without mutating input", () => {
    const values = [3100, 3000, 3200, 3050];
    expect(median(values)).toBe(3075);
    expect(interquartileRange(values)).toEqual({
      p25: 3038,
      p75: 3125,
      iqr: 87,
    });
    expect(values).toEqual([3100, 3000, 3200, 3050]);
  });

  it("flags a clear IQR anomaly", () => {
    expect(isAnomalousPrice(9000, [3000, 3050, 3100, 3150, 3200])).toBe(true);
    expect(isAnomalousPrice(3125, [3000, 3050, 3100, 3150, 3200])).toBe(false);
  });

  it("withholds all price statistics below five independent warungs", () => {
    expect(
      buildBenchmark(
        [observation(1, 3000), observation(2, 3100), observation(3, 9000)],
        now,
      ),
    ).toEqual({
      status: "insufficient",
      independentContributors: 3,
      requiredContributors: 5,
      reportCount: 3,
      message:
        "Belum cukup laporan independen untuk membuat patokan harga area.",
      calculationVersion: "1.0.0",
    });
  });

  it("does not count repeated reports from one warung as independent", () => {
    const result = buildBenchmark(
      [
        observation(1, 3000, "same-warung"),
        observation(2, 3050, "same-warung"),
        observation(3, 3100, "warung-2"),
        observation(4, 3150, "warung-3"),
        observation(5, 3200, "warung-4"),
      ],
      now,
    );
    expect(result.status).toBe("insufficient");
    expect(result.independentContributors).toBe(4);
  });

  it("publishes a versioned benchmark at the threshold", () => {
    const result = buildBenchmark(
      [3000, 3050, 3100, 3150, 3200].map((price, index) =>
        observation(index, price),
      ),
      now,
    );

    expect(result).toMatchObject({
      status: "available",
      medianUnitPriceIdr: 3100,
      p25UnitPriceIdr: 3050,
      p75UnitPriceIdr: 3150,
      independentContributors: 5,
      reportCount: 5,
      calculationVersion: "1.0.0",
    });
  });
});

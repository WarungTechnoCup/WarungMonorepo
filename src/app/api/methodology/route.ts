import { NextResponse } from "next/server";

import {
  BENCHMARK_VERSION,
  MINIMUM_INDEPENDENT_WARUNGS,
  NORMALIZATION_VERSION,
} from "@/domain/harga-wajar/types";
import { apiError } from "@/server/api-response";
import type { ApiSuccess } from "@/types/api";
import type { MethodologyDto } from "@/types/harga-wajar";

export async function GET() {
  try {
    const response: ApiSuccess<MethodologyDto> = {
      data: {
        normalizationVersion: NORMALIZATION_VERSION,
        benchmarkVersion: BENCHMARK_VERSION,
        minimumIndependentWarungs: MINIMUM_INDEPENDENT_WARUNGS,
        landedTotalFormula:
          "harga_kotor - diskon + ongkos_kirim = total_terkirim",
        baseUnitsFormula: "jumlah_kemasan * isi_per_kemasan = total_unit_dasar",
        unitPriceFormula: "total_terkirim / total_unit_dasar = harga_satuan",
        aggregation: "median",
        dispersion: "interquartile_range",
        outlierPolicy: "flagged_with_reason_code_not_deleted",
        confidenceLabels: [
          { label: "Tinggi", minimumScore: 75, maximumScore: 100 },
          { label: "Sedang", minimumScore: 50, maximumScore: 74 },
          { label: "Terbatas", minimumScore: 0, maximumScore: 49 },
        ],
        documentationPath: "/cara-kerja",
      },
    };

    return NextResponse.json(response, {
      headers: { "Cache-Control": "public, max-age=3600" },
    });
  } catch (error) {
    return apiError(error);
  }
}

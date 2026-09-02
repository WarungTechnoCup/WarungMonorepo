import { NextResponse } from "next/server";

import { apiError } from "@/server/api-response";
import { requireAuthenticatedUser } from "@/server/auth";
import { previewNormalization } from "@/server/harga-wajar/repository";
import { priceReportInputSchema } from "@/server/harga-wajar/validation";
import type { ApiSuccess } from "@/types/api";
import type { NormalizationSuccess } from "@/domain/harga-wajar/types";

export async function POST(request: Request) {
  try {
    await requireAuthenticatedUser();
    const input = priceReportInputSchema.parse(await request.json());
    const response: ApiSuccess<NormalizationSuccess> = {
      data: await previewNormalization(input),
    };
    return NextResponse.json(response, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return apiError(error);
  }
}

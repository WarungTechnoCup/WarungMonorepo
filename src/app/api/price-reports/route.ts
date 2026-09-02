import { NextResponse } from "next/server";
import { z } from "zod";

import { apiError } from "@/server/api-response";
import { requireAuthenticatedUser } from "@/server/auth";
import { submitPriceReport } from "@/server/harga-wajar/repository";
import { priceReportInputSchema } from "@/server/harga-wajar/validation";
import type { ApiSuccess } from "@/types/api";
import type { PriceReportResultDto } from "@/types/harga-wajar";

const idempotencyKeySchema = z.uuid();

export async function POST(request: Request) {
  try {
    const user = await requireAuthenticatedUser();
    const idempotencyKey = idempotencyKeySchema.parse(
      request.headers.get("Idempotency-Key"),
    );
    const report = priceReportInputSchema.parse(await request.json());
    const response: ApiSuccess<PriceReportResultDto> = {
      data: await submitPriceReport({
        authUserId: user.id,
        idempotencyKey,
        report,
      }),
    };
    return NextResponse.json(response, {
      status: 201,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return apiError(error);
  }
}

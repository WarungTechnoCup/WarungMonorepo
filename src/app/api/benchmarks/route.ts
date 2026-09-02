import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";

import { apiError } from "@/server/api-response";
import { getBenchmark } from "@/server/harga-wajar/repository";
import type { ApiSuccess } from "@/types/api";
import type { BenchmarkDto } from "@/types/harga-wajar";

const benchmarkQuerySchema = z.object({
  productId: z.uuid(),
  province: z.string().trim().min(2).default("DKI Jakarta"),
  city: z.string().trim().min(2).default("Jakarta Barat"),
  district: z.string().trim().min(2).default("Kebon Jeruk"),
  windowDays: z.coerce
    .number()
    .int()
    .refine((value) => value === 30 || value === 90),
});

export async function GET(request: NextRequest) {
  try {
    const query = benchmarkQuerySchema.parse({
      productId: request.nextUrl.searchParams.get("productId"),
      province: request.nextUrl.searchParams.get("province") ?? undefined,
      city: request.nextUrl.searchParams.get("city") ?? undefined,
      district: request.nextUrl.searchParams.get("district") ?? undefined,
      windowDays: request.nextUrl.searchParams.get("windowDays") ?? "30",
    });
    const response: ApiSuccess<BenchmarkDto> = {
      data: await getBenchmark(query),
    };
    return NextResponse.json(response, {
      headers: { "Cache-Control": "public, max-age=60" },
    });
  } catch (error) {
    return apiError(error);
  }
}

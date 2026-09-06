import { NextResponse } from "next/server";

import { apiError } from "@/server/api-response";
import { listOpportunities } from "@/server/kulakan-bareng/repository";
import type { ApiSuccess } from "@/types/api";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const province = searchParams.get("province") || undefined;
    const city = searchParams.get("city") || undefined;
    const district = searchParams.get("district") || undefined;

    const data = await listOpportunities({ province, city, district });

    return NextResponse.json({ data } satisfies ApiSuccess<typeof data>, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    return apiError(error);
  }
}

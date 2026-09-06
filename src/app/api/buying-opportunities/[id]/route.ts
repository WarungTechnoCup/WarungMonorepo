import { NextResponse } from "next/server";

import { apiError } from "@/server/api-response";
import { getOpportunity } from "@/server/kulakan-bareng/repository";
import type { ApiSuccess } from "@/types/api";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const data = await getOpportunity(id);

    return NextResponse.json({ data } satisfies ApiSuccess<typeof data>, {
      headers: {
        "Cache-Control": "public, s-maxage=10, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    return apiError(error);
  }
}

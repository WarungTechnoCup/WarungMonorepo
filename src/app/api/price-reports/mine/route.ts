import { NextResponse } from "next/server";

import { apiError } from "@/server/api-response";
import { requireAuthenticatedUser } from "@/server/auth";
import { listOwnReports } from "@/server/harga-wajar/repository";
import type { ApiSuccess } from "@/types/api";
import type { ActivityItemDto } from "@/types/harga-wajar";

export async function GET() {
  try {
    const user = await requireAuthenticatedUser();
    const response: ApiSuccess<ActivityItemDto[]> = {
      data: await listOwnReports(user.id),
    };
    return NextResponse.json(response, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return apiError(error);
  }
}

import { NextResponse } from "next/server";

import { listModerationQueue } from "@/server/admin/repository";
import { apiError } from "@/server/api-response";
import { requireAdminUser } from "@/server/auth";
import type { ApiSuccess } from "@/types/api";
import type { ModerationQueueItemDto } from "@/types/harga-wajar";

export async function GET() {
  try {
    await requireAdminUser();
    const response: ApiSuccess<ModerationQueueItemDto[]> = {
      data: await listModerationQueue(),
    };
    return NextResponse.json(response, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return apiError(error);
  }
}

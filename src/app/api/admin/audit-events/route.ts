import { NextResponse } from "next/server";

import { listAuditEvents } from "@/server/admin/repository";
import { apiError } from "@/server/api-response";
import { requireAdminUser } from "@/server/auth";
import type { ApiSuccess } from "@/types/api";
import type { AdminAuditEventDto } from "@/types/harga-wajar";

export async function GET(request: Request) {
  try {
    await requireAdminUser();
    const limitParam = new URL(request.url).searchParams.get("limit");
    const limit = Math.min(Math.max(Number(limitParam) || 100, 1), 500);

    const response: ApiSuccess<AdminAuditEventDto[]> = {
      data: await listAuditEvents(limit),
    };
    return NextResponse.json(response, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return apiError(error);
  }
}

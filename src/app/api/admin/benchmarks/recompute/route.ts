import { NextResponse } from "next/server";

import { recomputeAllBenchmarks } from "@/server/admin/repository";
import { apiError } from "@/server/api-response";
import { requireAdminUser } from "@/server/auth";
import type { ApiSuccess } from "@/types/api";

export async function POST() {
  try {
    const admin = await requireAdminUser();
    const data = await recomputeAllBenchmarks(admin.id);

    return NextResponse.json({ data } satisfies ApiSuccess<typeof data>, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return apiError(error);
  }
}

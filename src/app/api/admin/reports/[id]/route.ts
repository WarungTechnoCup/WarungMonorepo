import { NextResponse } from "next/server";

import { moderateReport } from "@/server/admin/repository";
import { moderationSchema } from "@/server/admin/validation";
import { apiError } from "@/server/api-response";
import { requireAdminUser } from "@/server/auth";
import type { ApiSuccess } from "@/types/api";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await requireAdminUser();
    const { id } = await params;
    const decision = moderationSchema.parse(await request.json());

    const data = await moderateReport({
      actorAuthUserId: admin.id,
      reportId: id,
      decision,
    });

    return NextResponse.json({ data } satisfies ApiSuccess<typeof data>, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return apiError(error);
  }
}

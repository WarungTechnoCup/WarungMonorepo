import { NextResponse } from "next/server";

import { apiError } from "@/server/api-response";
import { requireAdminUser } from "@/server/auth";
import {
  getOpportunity,
  transitionOpportunity,
} from "@/server/kulakan-bareng/repository";
import { opportunityTransitionSchema } from "@/server/kulakan-bareng/validation";
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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await requireAdminUser();
    const { id } = await params;
    const { status, reasonCode } = opportunityTransitionSchema.parse(
      await request.json(),
    );

    const data = await transitionOpportunity({
      actorAuthUserId: admin.id,
      opportunityId: id,
      to: status,
      reasonCode,
    });

    return NextResponse.json({ data } satisfies ApiSuccess<typeof data>, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return apiError(error);
  }
}

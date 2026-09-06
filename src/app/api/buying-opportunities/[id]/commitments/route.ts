import { NextResponse } from "next/server";

import { apiError } from "@/server/api-response";
import { requireAuthenticatedUser } from "@/server/auth";
import { submitCommitment } from "@/server/kulakan-bareng/repository";
import { commitBuyingInputSchema } from "@/server/kulakan-bareng/validation";
import type { ApiSuccess } from "@/types/api";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireAuthenticatedUser();
    const { id } = await params;
    const data = commitBuyingInputSchema.parse(await request.json());

    const result = await submitCommitment({
      authUserId: user.id,
      opportunityId: id,
      data,
    });

    return NextResponse.json(
      { data: result } satisfies ApiSuccess<typeof result>,
      {
        status: 201,
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (error) {
    return apiError(error);
  }
}

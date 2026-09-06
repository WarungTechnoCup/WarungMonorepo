import { NextResponse } from "next/server";

import { apiError } from "@/server/api-response";
import { requireAuthenticatedUser } from "@/server/auth";
import { listOwnCommitments } from "@/server/kulakan-bareng/repository";
import type { ApiSuccess } from "@/types/api";
import type { OwnCommitmentDto } from "@/types/harga-wajar";

export async function GET() {
  try {
    const user = await requireAuthenticatedUser();
    const response: ApiSuccess<OwnCommitmentDto[]> = {
      data: await listOwnCommitments(user.id),
    };
    return NextResponse.json(response, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return apiError(error);
  }
}

import { NextResponse } from "next/server";

import { apiError } from "@/server/api-response";
import { requireAdminUser } from "@/server/auth";
import { recordSupplierQuote } from "@/server/kulakan-bareng/repository";
import { supplierQuoteInputSchema } from "@/server/kulakan-bareng/validation";
import type { ApiSuccess } from "@/types/api";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await requireAdminUser();
    const { id } = await params;
    const quote = supplierQuoteInputSchema.parse(await request.json());

    const data = await recordSupplierQuote({
      actorAuthUserId: admin.id,
      opportunityId: id,
      quote,
    });

    return NextResponse.json({ data } satisfies ApiSuccess<typeof data>, {
      status: 201,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return apiError(error);
  }
}

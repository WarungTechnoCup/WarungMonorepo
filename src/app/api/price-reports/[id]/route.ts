import { NextResponse } from "next/server";
import { z } from "zod";

import { apiError } from "@/server/api-response";
import { requireAuthenticatedUser } from "@/server/auth";
import { withdrawPriceReport } from "@/server/harga-wajar/repository";
import type { ApiSuccess } from "@/types/api";

const paramsSchema = z.object({ id: z.uuid() });
const actionSchema = z.object({ action: z.literal("withdraw_aggregation") });

interface PriceReportRouteProps {
  params: Promise<{ id: string }>;
}

export async function PATCH(
  request: Request,
  { params }: PriceReportRouteProps,
) {
  try {
    const user = await requireAuthenticatedUser();
    const { id } = paramsSchema.parse(await params);
    actionSchema.parse(await request.json());
    const response: ApiSuccess<
      Awaited<ReturnType<typeof withdrawPriceReport>>
    > = {
      data: await withdrawPriceReport({
        authUserId: user.id,
        reportId: id,
      }),
    };
    return NextResponse.json(response, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return apiError(error);
  }
}

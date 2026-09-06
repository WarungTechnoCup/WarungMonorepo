import { NextResponse } from "next/server";

import { apiError } from "@/server/api-response";
import { requireAuthenticatedUser } from "@/server/auth";
import {
  buildOwnPassport,
  recordPassportExport,
} from "@/server/passport/repository";
import type { ApiSuccess } from "@/types/api";
import type { PassportDto } from "@/types/harga-wajar";

export async function POST() {
  try {
    const user = await requireAuthenticatedUser();
    const passport = await buildOwnPassport(user.id);
    await recordPassportExport(user.id);

    const response: ApiSuccess<PassportDto> = { data: passport };
    return NextResponse.json(response, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return apiError(error);
  }
}

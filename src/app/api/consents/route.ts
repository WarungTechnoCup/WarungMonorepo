import { NextResponse } from "next/server";

import { apiError } from "@/server/api-response";
import { requireAuthenticatedUser } from "@/server/auth";
import {
  grantConsent,
  listOwnConsents,
  withdrawConsent,
} from "@/server/consent/repository";
import { consentMutationSchema } from "@/server/consent/validation";
import type { ApiSuccess } from "@/types/api";
import type { ConsentStateDto } from "@/types/harga-wajar";

const noStore = { headers: { "Cache-Control": "no-store" } };

export async function GET() {
  try {
    const user = await requireAuthenticatedUser();
    const response: ApiSuccess<ConsentStateDto[]> = {
      data: await listOwnConsents(user.id),
    };
    return NextResponse.json(response, noStore);
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuthenticatedUser();
    const { purpose } = consentMutationSchema.parse(await request.json());
    await grantConsent({ authUserId: user.id, purpose });

    const response: ApiSuccess<ConsentStateDto[]> = {
      data: await listOwnConsents(user.id),
    };
    return NextResponse.json(response, noStore);
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await requireAuthenticatedUser();
    const purpose = new URL(request.url).searchParams.get("purpose");
    const parsed = consentMutationSchema.parse({ purpose });
    await withdrawConsent({ authUserId: user.id, purpose: parsed.purpose });

    const response: ApiSuccess<ConsentStateDto[]> = {
      data: await listOwnConsents(user.id),
    };
    return NextResponse.json(response, noStore);
  } catch (error) {
    return apiError(error);
  }
}

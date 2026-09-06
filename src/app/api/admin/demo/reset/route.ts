import { NextResponse } from "next/server";

import { getServiceConfiguration } from "@/lib/env";
import { resetDemoData } from "@/server/admin/repository";
import { apiError, ConflictError } from "@/server/api-response";
import { requireAdminUser } from "@/server/auth";
import type { ApiSuccess } from "@/types/api";

export async function POST() {
  try {
    const admin = await requireAdminUser();

    // Refuse outside demo mode so the control cannot delete seeded data in
    // an environment that is being treated as production.
    if (!getServiceConfiguration().demoMode) {
      throw new ConflictError(
        "Reset data contoh hanya tersedia ketika DEMO_MODE aktif.",
      );
    }

    const data = await resetDemoData(admin.id);

    return NextResponse.json({ data } satisfies ApiSuccess<typeof data>, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return apiError(error);
  }
}

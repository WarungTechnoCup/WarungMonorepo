import { NextResponse } from "next/server";

import { getServiceConfiguration } from "@/lib/env";
import type { ApiSuccess } from "@/types/api";

interface HealthData {
  status: "ok";
  version: string;
  services: ReturnType<typeof getServiceConfiguration>;
}

export function GET() {
  const response: ApiSuccess<HealthData> = {
    data: {
      status: "ok",
      version: "0.1.0",
      services: getServiceConfiguration(),
    },
  };

  return NextResponse.json(response, {
    headers: { "Cache-Control": "no-store" },
  });
}

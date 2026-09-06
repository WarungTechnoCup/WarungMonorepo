import { describe, expect, it, vi } from "vitest";

import { GET } from "@/app/api/health/route";

describe("GET /api/health", () => {
  it("uses the shared success contract without exposing credentials", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "");
    vi.stubEnv("DATABASE_URL", "");

    const response = GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(body).toEqual({
      data: {
        status: "ok",
        version: "0.1.0",
        services: {
          supabase: false,
          database: false,
          storage: false,
          demoMode: false,
          administration: false,
        },
      },
    });
    expect(JSON.stringify(body)).not.toContain("test-publishable-key");
  });
});

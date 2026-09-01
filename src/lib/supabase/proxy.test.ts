// @vitest-environment node

import { createServerClient } from "@supabase/ssr";
import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import { refreshSession } from "@/lib/supabase/proxy";

vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn(),
}));

function configureSupabase() {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "test-publishable-key");
}

describe("session proxy", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  it("fails closed on a protected route without configuration", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "");
    const request = new NextRequest("http://localhost/lapor-harga");

    const response = await refreshSession(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain(
      "/masuk?status=konfigurasi&next=%2Flapor-harga",
    );
  });

  it("keeps public routes available without configuration", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "");

    const response = await refreshSession(
      new NextRequest("http://localhost/cek-harga"),
    );

    expect(response.status).toBe(200);
  });

  it("redirects an unauthenticated protected request", async () => {
    configureSupabase();
    vi.mocked(createServerClient).mockReturnValue({
      auth: {
        getClaims: vi.fn().mockResolvedValue({
          data: null,
          error: new Error("invalid session"),
        }),
      },
    } as never);

    const response = await refreshSession(
      new NextRequest("http://localhost/aktivitas"),
    );

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain(
      "/masuk?status=autentikasi&next=%2Faktivitas",
    );
  });

  it("allows an authenticated protected request", async () => {
    configureSupabase();
    vi.mocked(createServerClient).mockReturnValue({
      auth: {
        getClaims: vi.fn().mockResolvedValue({
          data: { claims: { sub: "user-id" } },
          error: null,
        }),
      },
    } as never);

    const response = await refreshSession(
      new NextRequest("http://localhost/passport"),
    );

    expect(response.status).toBe(200);
  });
});

import { afterEach, describe, expect, it, vi } from "vitest";

import {
  ConfigurationError,
  getServiceConfiguration,
  getSupabasePublicConfig,
} from "@/lib/env";

describe("environment contract", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("reports optional services as unconfigured without credentials", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "");
    vi.stubEnv("DATABASE_URL", "");

    expect(getServiceConfiguration()).toMatchObject({
      supabase: false,
      database: false,
      storage: true,
      demoMode: false,
    });
  });

  it("fails with an actionable message when Supabase is missing", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "");

    expect(() => getSupabasePublicConfig()).toThrow(ConfigurationError);
    expect(() => getSupabasePublicConfig()).toThrow(".env.example");
  });

  it("accepts a complete public Supabase configuration", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "test-publishable-key");

    expect(getSupabasePublicConfig()).toEqual({
      url: "https://example.supabase.co",
      publishableKey: "test-publishable-key",
    });
  });
});

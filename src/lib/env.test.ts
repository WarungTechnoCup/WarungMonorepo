import { afterEach, describe, expect, it, vi } from "vitest";

import {
  ConfigurationError,
  getAdminEmails,
  getDatabaseUrl,
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
      storage: false,
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
    expect(getServiceConfiguration()).toMatchObject({
      supabase: true,
      storage: true,
    });
  });

  it("requires and returns the database pooler URL", () => {
    vi.stubEnv("DATABASE_URL", "");
    expect(() => getDatabaseUrl()).toThrow(ConfigurationError);

    vi.stubEnv("DATABASE_URL", "postgresql://user:password@example.com/db");
    expect(getDatabaseUrl()).toBe("postgresql://user:password@example.com/db");
  });
});

describe("getAdminEmails", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns an empty list when nothing is configured", () => {
    vi.stubEnv("ADMIN_EMAILS", "");

    expect(getAdminEmails()).toEqual([]);
  });

  it("normalises case and whitespace in the configured list", () => {
    vi.stubEnv("ADMIN_EMAILS", " Admin@Example.com , ops@example.com ,, ");

    expect(getAdminEmails()).toEqual(["admin@example.com", "ops@example.com"]);
  });
});

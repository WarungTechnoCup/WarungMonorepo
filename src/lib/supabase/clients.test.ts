import { createBrowserClient, createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { afterEach, describe, expect, it, vi } from "vitest";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { createSupabaseServerClient } from "@/lib/supabase/server";

vi.mock("@supabase/ssr", () => ({
  createBrowserClient: vi.fn(),
  createServerClient: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

const publicUrl = "https://example.supabase.co";
const publishableKey = "test-publishable-key";

function configureSupabase() {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", publicUrl);
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", publishableKey);
}

describe("Supabase client factories", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  it("creates a browser client from public configuration", () => {
    configureSupabase();
    const expectedClient = { kind: "browser" };
    vi.mocked(createBrowserClient).mockReturnValue(expectedClient as never);

    expect(createSupabaseBrowserClient()).toBe(expectedClient);
    expect(createBrowserClient).toHaveBeenCalledWith(publicUrl, publishableKey);
  });

  it("bridges the server client to the Next.js cookie store", async () => {
    configureSupabase();
    const getAll = vi
      .fn()
      .mockReturnValue([{ name: "session", value: "value" }]);
    const set = vi.fn();
    vi.mocked(cookies).mockResolvedValue({ getAll, set } as never);

    let cookieAdapter:
      | {
          getAll: () => unknown;
          setAll: (
            values: Array<{
              name: string;
              value: string;
              options: Record<string, unknown>;
            }>,
          ) => void;
        }
      | undefined;
    const expectedClient = { kind: "server" };
    vi.mocked(createServerClient).mockImplementation((...args: unknown[]) => {
      cookieAdapter = (
        args[2] as {
          cookies: NonNullable<typeof cookieAdapter>;
        }
      ).cookies;
      return expectedClient as never;
    });

    expect(await createSupabaseServerClient()).toBe(expectedClient);
    expect(cookieAdapter?.getAll()).toEqual([
      { name: "session", value: "value" },
    ]);
    cookieAdapter?.setAll([
      { name: "session", value: "updated", options: { httpOnly: true } },
    ]);

    expect(set).toHaveBeenCalledWith("session", "updated", { httpOnly: true });
  });
});

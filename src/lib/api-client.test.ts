import { afterEach, describe, expect, it, vi } from "vitest";

import { ApiClientError, fetchApi } from "@/lib/api-client";

describe("fetchApi", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns the API data payload", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ data: { id: "product-1" } }), {
          status: 200,
        }),
      ),
    );

    await expect(fetchApi<{ id: string }>("/api/products")).resolves.toEqual({
      id: "product-1",
    });
  });

  it("exposes stable API failures to the interface", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            code: "VALIDATION_ERROR",
            message: "Periksa kembali data yang dimasukkan.",
            requestId: "request-1",
            fieldErrors: { productId: ["Invalid UUID"] },
          }),
          { status: 400 },
        ),
      ),
    );

    await expect(fetchApi("/api/products")).rejects.toEqual(
      new ApiClientError(
        "Periksa kembali data yang dimasukkan.",
        "VALIDATION_ERROR",
        { productId: ["Invalid UUID"] },
      ),
    );
  });
});

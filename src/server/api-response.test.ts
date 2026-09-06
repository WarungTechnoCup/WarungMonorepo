import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { ConfigurationError } from "@/lib/env";
import { apiError, ConflictError, NotFoundError } from "@/server/api-response";
import { AuthenticationError } from "@/server/auth";

describe("apiError", () => {
  it("maps validation failures to an actionable 400 response", async () => {
    const result = z
      .object({ productId: z.uuid() })
      .safeParse({ productId: "x" });
    if (result.success) throw new Error("Expected invalid input.");

    const response = apiError(result.error);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      code: "VALIDATION_ERROR",
      fieldErrors: { productId: expect.any(Array) },
    });
  });

  it.each([
    [new AuthenticationError(), 401, "AUTHENTICATION_REQUIRED"],
    [new NotFoundError("Produk tidak ditemukan."), 404, "NOT_FOUND"],
    [new ConflictError("Laporan tidak dapat disimpan."), 409, "CONFLICT"],
    [
      new ConfigurationError("DATABASE_URL belum dikonfigurasi."),
      503,
      "SERVICE_UNAVAILABLE",
    ],
  ])("maps known application errors", async (error, status, code) => {
    const response = apiError(error);

    expect(response.status).toBe(status);
    await expect(response.json()).resolves.toMatchObject({ code });
  });

  it("logs an unrecognised error so failures are traceable", async () => {
    const logged = vi.spyOn(console, "error").mockImplementation(() => {});

    const response = apiError(new Error("relation does not exist"));

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toMatchObject({
      code: "INTERNAL_ERROR",
    });
    expect(logged).toHaveBeenCalledOnce();

    logged.mockRestore();
  });
});

import { describe, expect, it } from "vitest";
import { z } from "zod";

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
  ])("maps known application errors", async (error, status, code) => {
    const response = apiError(error);

    expect(response.status).toBe(status);
    await expect(response.json()).resolves.toMatchObject({ code });
  });
});

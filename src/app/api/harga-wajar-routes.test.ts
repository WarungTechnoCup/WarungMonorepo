// @vitest-environment node

import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { GET as getBenchmarks } from "@/app/api/benchmarks/route";
import { GET as getMine } from "@/app/api/price-reports/mine/route";
import { PATCH as withdrawReport } from "@/app/api/price-reports/[id]/route";
import { POST as previewNormalization } from "@/app/api/price-reports/preview-normalization/route";
import { POST as submitReport } from "@/app/api/price-reports/route";
import { GET as getProduct } from "@/app/api/products/[id]/route";
import { GET as getProducts } from "@/app/api/products/route";
import { requireAuthenticatedUser } from "@/server/auth";
import {
  getBenchmark,
  getProduct as loadProduct,
  listOwnReports,
  listProducts,
  previewNormalization as loadNormalization,
  submitPriceReport,
  withdrawPriceReport,
} from "@/server/harga-wajar/repository";

vi.mock("@/server/auth", () => ({
  AuthenticationError: class AuthenticationError extends Error {},
  requireAuthenticatedUser: vi.fn(),
}));

vi.mock("@/server/harga-wajar/repository", () => ({
  getBenchmark: vi.fn(),
  getProduct: vi.fn(),
  listOwnReports: vi.fn(),
  listProducts: vi.fn(),
  previewNormalization: vi.fn(),
  submitPriceReport: vi.fn(),
  withdrawPriceReport: vi.fn(),
}));

const productId = "10000000-0000-4000-8000-000000000001";
const packagingOptionId = "20000000-0000-4000-8000-000000000001";
const product = {
  id: productId,
  slug: "indomie-goreng-85g",
  name: "Indomie Goreng 85g",
  brand: "Indomie",
  baseUnit: "pcs",
  description: "Data demo",
  isDemo: true,
  packagingOptions: [
    {
      id: packagingOptionId,
      label: "Karton 40 pcs",
      unitsPerPackage: 40,
      baseUnit: "pcs",
    },
  ],
};

const reportInput = {
  productId,
  packagingOptionId,
  observedDate: "2026-09-01",
  quantityPackages: 1,
  grossPriceIdr: 118000,
  discountIdr: 0,
  deliveryFeeIdr: 5000,
  paymentTerms: "tunai",
  supplierType: "distributor",
  province: "DKI Jakarta",
  city: "Jakarta Barat",
  district: "Kebon Jeruk",
  aggregationConsent: true,
};

describe("Harga Wajar API contracts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireAuthenticatedUser).mockResolvedValue({
      id: "90000000-0000-4000-8000-000000000001",
    } as never);
  });

  it("returns only the public product DTO", async () => {
    vi.mocked(listProducts).mockResolvedValue([product]);
    const response = await getProducts(
      new NextRequest("http://localhost/api/products?query=indomie"),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ data: [product] });
    expect(JSON.stringify(body)).not.toContain("ownerAuthUserId");
    expect(listProducts).toHaveBeenCalledWith("indomie");
  });

  it("loads a single public product by slug", async () => {
    vi.mocked(loadProduct).mockResolvedValue(product);
    const response = await getProduct(new Request("http://localhost"), {
      params: Promise.resolve({ id: product.slug }),
    });
    expect(await response.json()).toEqual({ data: product });
  });

  it("returns an insufficient benchmark without price fields", async () => {
    vi.mocked(getBenchmark).mockResolvedValue({
      productId,
      province: "DKI Jakarta",
      city: "Jakarta Barat",
      district: "Kebon Jeruk",
      windowDays: 30,
      computedAt: null,
      result: {
        status: "insufficient",
        independentContributors: 3,
        requiredContributors: 5,
        reportCount: 3,
        message: "Belum cukup laporan independen.",
        calculationVersion: "1.0.0",
      },
    });
    const response = await getBenchmarks(
      new NextRequest(
        `http://localhost/api/benchmarks?productId=${productId}&windowDays=30`,
      ),
    );
    const body = await response.json();

    expect(body.data.result.status).toBe("insufficient");
    expect(body.data.result).not.toHaveProperty("medianUnitPriceIdr");
  });

  it("requires valid authenticated input for normalization preview", async () => {
    vi.mocked(loadNormalization).mockResolvedValue({
      ok: true,
      landedTotalIdr: 123000,
      baseUnitsTotal: 40,
      unitPriceIdr: 3075,
      calculationVersion: "1.0.0",
    });
    const response = await previewNormalization(
      new Request("http://localhost/api/price-reports/preview-normalization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reportInput),
      }),
    );
    expect(response.status).toBe(200);
    expect(requireAuthenticatedUser).toHaveBeenCalledOnce();
    expect((await response.json()).data.unitPriceIdr).toBe(3075);
  });

  it("passes the idempotency key and owner to report submission", async () => {
    const idempotencyKey = "70000000-0000-4000-8000-000000000001";
    vi.mocked(submitPriceReport).mockResolvedValue({
      reportId: "80000000-0000-4000-8000-000000000001",
      reference: "WCH-80000000",
      status: "included",
      statusReason: null,
      normalization: {
        ok: true,
        landedTotalIdr: 123000,
        baseUnitsTotal: 40,
        unitPriceIdr: 3075,
        calculationVersion: "1.0.0",
      },
      benchmark: {
        productId,
        province: "DKI Jakarta",
        city: "Jakarta Barat",
        district: "Kebon Jeruk",
        windowDays: 30,
        computedAt: null,
        result: {
          status: "insufficient",
          independentContributors: 1,
          requiredContributors: 5,
          reportCount: 1,
          message: "Belum cukup laporan independen.",
          calculationVersion: "1.0.0",
        },
      },
    });
    const response = await submitReport(
      new Request("http://localhost/api/price-reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey,
        },
        body: JSON.stringify(reportInput),
      }),
    );

    expect(response.status).toBe(201);
    expect(submitPriceReport).toHaveBeenCalledWith(
      expect.objectContaining({
        authUserId: "90000000-0000-4000-8000-000000000001",
        idempotencyKey,
      }),
    );
  });

  it("scopes activity history to the authenticated owner", async () => {
    vi.mocked(listOwnReports).mockResolvedValue([]);
    const response = await getMine();
    expect(response.status).toBe(200);
    expect(listOwnReports).toHaveBeenCalledWith(
      "90000000-0000-4000-8000-000000000001",
    );
  });

  it("withdraws aggregation only for the authenticated report owner", async () => {
    vi.mocked(withdrawPriceReport).mockResolvedValue({
      reportId: "80000000-0000-4000-8000-000000000001",
      status: "excluded",
      reasonCode: "AGGREGATION_CONSENT_WITHDRAWN",
    });
    const response = await withdrawReport(
      new Request(
        "http://localhost/api/price-reports/80000000-0000-4000-8000-000000000001",
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "withdraw_aggregation" }),
        },
      ),
      {
        params: Promise.resolve({
          id: "80000000-0000-4000-8000-000000000001",
        }),
      },
    );

    expect(response.status).toBe(200);
    expect(withdrawPriceReport).toHaveBeenCalledWith({
      authUserId: "90000000-0000-4000-8000-000000000001",
      reportId: "80000000-0000-4000-8000-000000000001",
    });
  });
});

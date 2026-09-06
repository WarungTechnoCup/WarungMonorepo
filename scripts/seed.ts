import "./load-env";

import { createDatabaseConnection } from "../src/db/client";
import {
  benchmarks,
  normalizedObservations,
  buyingCommitments,
  buyingOpportunities,
  packagingOptions,
  priceReports,
  products,
  supplierQuotes,
  warungs,
} from "../src/db/schema";
import { buildBenchmark } from "../src/domain/harga-wajar/benchmark";
import { createDuplicateFingerprint } from "../src/domain/harga-wajar/fingerprint";
import { NORMALIZATION_VERSION } from "../src/domain/harga-wajar/types";

const productIds = {
  noodles: "10000000-0000-4000-8000-000000000001",
  oil: "10000000-0000-4000-8000-000000000002",
};

const packageIds = {
  noodlesCarton: "20000000-0000-4000-8000-000000000001",
  oilCarton: "20000000-0000-4000-8000-000000000002",
};

const district = "Kebon Jeruk";
const city = "Jakarta Barat";
const province = "DKI Jakarta";
const observedAt = new Date("2026-09-01T02:00:00.000Z");

const warungRows = Array.from({ length: 8 }, (_, index) => ({
  id: `30000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`,
  ownerAuthUserId: `40000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`,
  displayName: `Warung Demo ${index + 1}`,
  province,
  city,
  district,
  isDemo: true,
}));

const noodlePrices = [3050, 3075, 3090, 3100, 3125, 3150];
const oilPrices = [16600, 16800, 17100];

async function seed() {
  const { db, close } = createDatabaseConnection();

  try {
    await db
      .insert(products)
      .values([
        {
          id: productIds.noodles,
          slug: "indomie-goreng-85g",
          name: "Indomie Goreng 85g",
          brand: "Indomie",
          baseUnit: "pcs",
          description: "Mi instan goreng kemasan 85 gram.",
          isDemo: true,
        },
        {
          id: productIds.oil,
          slug: "minyak-goreng-1-l",
          name: "Minyak Goreng 1 L",
          brand: "Demo",
          baseUnit: "botol",
          description: "Minyak goreng kemasan satu liter untuk data demo.",
          isDemo: true,
        },
      ])
      .onConflictDoNothing();

    await db
      .insert(packagingOptions)
      .values([
        {
          id: packageIds.noodlesCarton,
          productId: productIds.noodles,
          label: "Karton 40 pcs",
          unitsPerPackage: 40,
          baseUnit: "pcs",
        },
        {
          id: packageIds.oilCarton,
          productId: productIds.oil,
          label: "Karton 12 botol",
          unitsPerPackage: 12,
          baseUnit: "botol",
        },
      ])
      .onConflictDoNothing();

    await db.insert(warungs).values(warungRows).onConflictDoNothing();

    const reportRows = [
      ...noodlePrices.map((unitPriceIdr, index) => ({
        id: `50000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`,
        warungId: warungRows[index]!.id,
        productId: productIds.noodles,
        packagingOptionId: packageIds.noodlesCarton,
        observedDate: "2026-09-01",
        quantityPackages: 1,
        unitsPerPackage: 40,
        grossPriceIdr: unitPriceIdr * 40,
        discountIdr: 0,
        deliveryFeeIdr: 0,
        paymentTerms: "tunai",
        supplierType: "distributor",
        aggregationConsent: true,
        status: "included" as const,
        duplicateFingerprint: createDuplicateFingerprint({
          warungId: warungRows[index]!.id,
          productId: productIds.noodles,
          observedDate: "2026-09-01",
          unitPriceIdr,
          quantityPackages: 1,
        }),
        idempotencyKey: `seed-noodles-${index + 1}`,
        isDemo: true,
      })),
      ...oilPrices.map((unitPriceIdr, index) => ({
        id: `51000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`,
        warungId: warungRows[index]!.id,
        productId: productIds.oil,
        packagingOptionId: packageIds.oilCarton,
        observedDate: "2026-09-01",
        quantityPackages: 1,
        unitsPerPackage: 12,
        grossPriceIdr: unitPriceIdr * 12,
        discountIdr: 0,
        deliveryFeeIdr: 0,
        paymentTerms: "tunai",
        supplierType: "distributor",
        aggregationConsent: true,
        status: "included" as const,
        duplicateFingerprint: createDuplicateFingerprint({
          warungId: warungRows[index]!.id,
          productId: productIds.oil,
          observedDate: "2026-09-01",
          unitPriceIdr,
          quantityPackages: 1,
        }),
        idempotencyKey: `seed-oil-${index + 1}`,
        isDemo: true,
      })),
      {
        id: "52000000-0000-4000-8000-000000000001",
        warungId: warungRows[0]!.id,
        productId: productIds.noodles,
        packagingOptionId: packageIds.noodlesCarton,
        observedDate: "2026-09-01",
        quantityPackages: 1,
        unitsPerPackage: 40,
        grossPriceIdr: 3050 * 40,
        discountIdr: 0,
        deliveryFeeIdr: 0,
        paymentTerms: "tunai",
        supplierType: "distributor",
        aggregationConsent: true,
        status: "excluded" as const,
        statusReason: "DUPLICATE_REPORT",
        duplicateFingerprint: createDuplicateFingerprint({
          warungId: warungRows[0]!.id,
          productId: productIds.noodles,
          observedDate: "2026-09-01",
          unitPriceIdr: 3050,
          quantityPackages: 1,
        }),
        idempotencyKey: "seed-duplicate",
        isDemo: true,
      },
      {
        id: "52000000-0000-4000-8000-000000000002",
        warungId: warungRows[7]!.id,
        productId: productIds.noodles,
        packagingOptionId: packageIds.noodlesCarton,
        observedDate: "2026-09-01",
        quantityPackages: 1,
        unitsPerPackage: 40,
        grossPriceIdr: 9000 * 40,
        discountIdr: 0,
        deliveryFeeIdr: 0,
        paymentTerms: "tunai",
        supplierType: "distributor",
        aggregationConsent: true,
        status: "flagged" as const,
        statusReason: "ANOMALOUS_PRICE",
        duplicateFingerprint: "seed-anomaly-fingerprint",
        idempotencyKey: "seed-anomaly",
        isDemo: true,
      },
    ];

    await db.insert(priceReports).values(reportRows).onConflictDoNothing();

    const eligibleReports = reportRows.filter(
      (report) => report.status === "included",
    );
    await db
      .insert(normalizedObservations)
      .values(
        eligibleReports.map((report, index) => ({
          id: `60000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`,
          priceReportId: report.id,
          productId: report.productId,
          warungId: report.warungId,
          landedTotalIdr:
            report.grossPriceIdr - report.discountIdr + report.deliveryFeeIdr,
          baseUnitsTotal: report.quantityPackages * report.unitsPerPackage,
          unitPriceIdr: Math.round(
            (report.grossPriceIdr -
              report.discountIdr +
              report.deliveryFeeIdr) /
              (report.quantityPackages * report.unitsPerPackage),
          ),
          province,
          city,
          district,
          observedAt,
          verificationWeight: 80,
          completenessWeight: 100,
          eligible: true,
          calculationVersion: NORMALIZATION_VERSION,
        })),
      )
      .onConflictDoNothing();

    for (const [productId, prices] of [
      [productIds.noodles, noodlePrices],
      [productIds.oil, oilPrices],
    ] as const) {
      const productReports = eligibleReports.filter(
        (report) => report.productId === productId,
      );
      const result = buildBenchmark(
        productReports.map((report, index) => ({
          id: report.id,
          warungId: report.warungId,
          unitPriceIdr: prices[index]!,
          observedAt,
          verificationWeight: 0.8,
          completenessWeight: 1,
        })),
        new Date("2026-09-02T02:00:00.000Z"),
      );

      for (const windowDays of [30, 90]) {
        await db
          .insert(benchmarks)
          .values({
            productId,
            province,
            city,
            district,
            windowDays,
            status: result.status,
            medianUnitPriceIdr:
              result.status === "available" ? result.medianUnitPriceIdr : null,
            p25UnitPriceIdr:
              result.status === "available" ? result.p25UnitPriceIdr : null,
            p75UnitPriceIdr:
              result.status === "available" ? result.p75UnitPriceIdr : null,
            eligibleReportCount: result.reportCount,
            independentWarungCount: result.independentContributors,
            confidenceScore:
              result.status === "available" ? result.confidenceScore : null,
            confidenceLabel:
              result.status === "available" ? result.confidenceLabel : null,
            latestObservationAt:
              result.status === "available"
                ? new Date(result.latestObservationAt)
                : null,
            calculationVersion: result.calculationVersion,
          })
          .onConflictDoUpdate({
            target: [
              benchmarks.productId,
              benchmarks.province,
              benchmarks.city,
              benchmarks.district,
              benchmarks.windowDays,
            ],
            set: {
              status: result.status,
              medianUnitPriceIdr:
                result.status === "available"
                  ? result.medianUnitPriceIdr
                  : null,
              p25UnitPriceIdr:
                result.status === "available" ? result.p25UnitPriceIdr : null,
              p75UnitPriceIdr:
                result.status === "available" ? result.p75UnitPriceIdr : null,
              eligibleReportCount: result.reportCount,
              independentWarungCount: result.independentContributors,
              confidenceScore:
                result.status === "available" ? result.confidenceScore : null,
              confidenceLabel:
                result.status === "available" ? result.confidenceLabel : null,
              latestObservationAt:
                result.status === "available"
                  ? new Date(result.latestObservationAt)
                  : null,
              calculationVersion: result.calculationVersion,
              computedAt: new Date(),
            },
          });
      }
    }

    const opportunityId = "80000000-0000-4000-8000-000000000001";
    await db
      .insert(buyingOpportunities)
      .values([
        {
          id: opportunityId,
          productId: productIds.noodles,
          packagingOptionId: packageIds.noodlesCarton,
          province,
          city,
          district,
          targetQuantityPackages: 50,
          targetPriceIdr: 2800 * 40, // Target slightly cheaper
          deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // In 5 days
          status: "QUOTE_RECEIVED",
          organizerName: "Koperasi Warung Kebon Jeruk",
        },
      ])
      .onConflictDoNothing();

    await db
      .insert(buyingCommitments)
      .values([
        {
          id: "90000000-0000-4000-8000-000000000001",
          opportunityId,
          warungId: warungRows[0]!.id,
          quantityPackages: 20,
        },
        {
          id: "90000000-0000-4000-8000-000000000002",
          opportunityId,
          warungId: warungRows[1]!.id,
          quantityPackages: 17,
        },
      ])
      .onConflictDoNothing();

    await db
      .insert(supplierQuotes)
      .values([
        {
          id: "70000000-0000-4000-8000-000000000001",
          opportunityId,
          supplierName: "Distributor Sinar Utama",
          unitPriceIdr: 2850 * 40,
          deliveryFeeIdr: 0,
          minimumQuantityPackages: 40,
          validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          terms:
            "Pembayaran tunai saat pengiriman. Minimum pemesanan 40 karton.",
        },
      ])
      .onConflictDoNothing();

    console.info(
      "Data demo Harga Wajar dan Kulakan Bareng berhasil disiapkan.",
    );
  } finally {
    await close();
  }
}

seed().catch((error: unknown) => {
  console.error("Seed data demo gagal.", error);
  process.exitCode = 1;
});

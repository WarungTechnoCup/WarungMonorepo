import { and, desc, eq, gte, ilike, inArray, isNull, or } from "drizzle-orm";

import { getDatabaseClient } from "@/db/client";
import {
  auditEvents,
  benchmarks,
  consents,
  normalizedObservations,
  packagingOptions,
  priceReports,
  products,
  receiptObjects,
  warungs,
} from "@/db/schema";
import {
  BENCHMARK_VERSION,
  buildBenchmark,
  createDuplicateFingerprint,
  isAnomalousPrice,
  normalizePurchase,
  NORMALIZATION_VERSION,
  type NormalizationSuccess,
  type PriceReportStatus,
} from "@/domain/harga-wajar";
import { ConflictError, NotFoundError } from "@/server/api-response";
import type { PriceReportInput } from "@/server/harga-wajar/validation";
import type {
  ActivityItemDto,
  BenchmarkDto,
  PriceReportResultDto,
  ProductDto,
} from "@/types/harga-wajar";

const DEFAULT_WINDOW_DAYS = 30;
type DatabaseExecutor = Pick<
  ReturnType<typeof getDatabaseClient>,
  "select" | "insert"
>;

function reportReference(id: string) {
  return `WCH-${id.slice(0, 8).toUpperCase()}`;
}

export async function listProducts(query = ""): Promise<ProductDto[]> {
  const db = getDatabaseClient();
  const normalizedQuery = query.trim();
  const rows = await db
    .select()
    .from(products)
    .where(
      and(
        eq(products.isActive, true),
        normalizedQuery
          ? or(
              ilike(products.name, `%${normalizedQuery}%`),
              ilike(products.brand, `%${normalizedQuery}%`),
            )
          : undefined,
      ),
    )
    .orderBy(products.name)
    .limit(20);

  const packages = rows.length
    ? await db
        .select()
        .from(packagingOptions)
        .where(
          and(
            inArray(
              packagingOptions.productId,
              rows.map((row) => row.id),
            ),
            eq(packagingOptions.isActive, true),
          ),
        )
    : [];

  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand: row.brand,
    baseUnit: row.baseUnit,
    description: row.description,
    isDemo: row.isDemo,
    packagingOptions: packages
      .filter((item) => item.productId === row.id)
      .map((item) => ({
        id: item.id,
        label: item.label,
        unitsPerPackage: item.unitsPerPackage,
        baseUnit: item.baseUnit,
      })),
  }));
}

export async function getProduct(identifier: string) {
  const db = getDatabaseClient();
  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      identifier,
    );
  const [row] = await db
    .select()
    .from(products)
    .where(
      and(
        eq(products.isActive, true),
        isUuid ? eq(products.id, identifier) : eq(products.slug, identifier),
      ),
    )
    .limit(1);

  if (!row) throw new NotFoundError("Produk tidak ditemukan.");
  const packages = await db
    .select()
    .from(packagingOptions)
    .where(
      and(
        eq(packagingOptions.productId, row.id),
        eq(packagingOptions.isActive, true),
      ),
    );
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand: row.brand,
    baseUnit: row.baseUnit,
    description: row.description,
    isDemo: row.isDemo,
    packagingOptions: packages.map((item) => ({
      id: item.id,
      label: item.label,
      unitsPerPackage: item.unitsPerPackage,
      baseUnit: item.baseUnit,
    })),
  } satisfies ProductDto;
}

export async function getBenchmark(
  input: {
    productId: string;
    province: string;
    city: string;
    district: string;
    windowDays?: number;
  },
  database: DatabaseExecutor = getDatabaseClient(),
): Promise<BenchmarkDto> {
  const db = database;
  const windowDays = input.windowDays ?? DEFAULT_WINDOW_DAYS;
  const [row] = await db
    .select()
    .from(benchmarks)
    .where(
      and(
        eq(benchmarks.productId, input.productId),
        eq(benchmarks.province, input.province),
        eq(benchmarks.city, input.city),
        eq(benchmarks.district, input.district),
        eq(benchmarks.windowDays, windowDays),
      ),
    )
    .limit(1);

  if (!row || row.status === "insufficient") {
    return {
      productId: input.productId,
      province: input.province,
      city: input.city,
      district: input.district,
      windowDays,
      computedAt: row?.computedAt.toISOString() ?? null,
      result: {
        status: "insufficient",
        independentContributors: row?.independentWarungCount ?? 0,
        requiredContributors: 5,
        reportCount: row?.eligibleReportCount ?? 0,
        message:
          "Belum cukup laporan independen untuk membuat patokan harga area.",
        calculationVersion: row?.calculationVersion ?? BENCHMARK_VERSION,
      },
    };
  }

  if (
    row.medianUnitPriceIdr === null ||
    row.p25UnitPriceIdr === null ||
    row.p75UnitPriceIdr === null ||
    row.confidenceScore === null ||
    row.latestObservationAt === null
  ) {
    throw new ConflictError(
      "Data benchmark tidak lengkap dan perlu dihitung ulang.",
    );
  }

  return {
    productId: input.productId,
    province: input.province,
    city: input.city,
    district: input.district,
    windowDays,
    computedAt: row.computedAt.toISOString(),
    result: {
      status: "available",
      medianUnitPriceIdr: row.medianUnitPriceIdr,
      p25UnitPriceIdr: row.p25UnitPriceIdr,
      p75UnitPriceIdr: row.p75UnitPriceIdr,
      independentContributors: row.independentWarungCount,
      reportCount: row.eligibleReportCount,
      confidenceScore: row.confidenceScore,
      confidenceLabel:
        row.confidenceLabel === "Tinggi" || row.confidenceLabel === "Sedang"
          ? row.confidenceLabel
          : "Terbatas",
      latestObservationAt: row.latestObservationAt.toISOString(),
      calculationVersion: row.calculationVersion,
    },
  };
}

async function getNormalizationContext(input: PriceReportInput) {
  const db = getDatabaseClient();
  const [row] = await db
    .select({
      productId: products.id,
      productName: products.name,
      expectedBaseUnit: products.baseUnit,
      packagingOptionId: packagingOptions.id,
      unitsPerPackage: packagingOptions.unitsPerPackage,
      baseUnit: packagingOptions.baseUnit,
    })
    .from(packagingOptions)
    .innerJoin(products, eq(packagingOptions.productId, products.id))
    .where(
      and(
        eq(products.id, input.productId),
        eq(products.isActive, true),
        eq(packagingOptions.id, input.packagingOptionId),
        eq(packagingOptions.isActive, true),
      ),
    )
    .limit(1);

  if (!row) throw new NotFoundError("Produk atau kemasan tidak ditemukan.");
  const result = normalizePurchase({
    grossPriceIdr: input.grossPriceIdr,
    discountIdr: input.discountIdr,
    deliveryFeeIdr: input.deliveryFeeIdr,
    quantityPackages: input.quantityPackages,
    unitsPerPackage: row.unitsPerPackage,
    baseUnit: row.baseUnit,
    expectedBaseUnit: row.expectedBaseUnit,
  });

  if (!result.ok) {
    throw new ConflictError(`Normalisasi gagal: ${result.reasons.join(", ")}`);
  }

  return { ...row, normalization: result };
}

export async function previewNormalization(input: PriceReportInput) {
  return (await getNormalizationContext(input)).normalization;
}

export async function recomputeBenchmark(
  scope: {
    productId: string;
    province: string;
    city: string;
    district: string;
    windowDays?: number;
  },
  database: DatabaseExecutor = getDatabaseClient(),
) {
  const db = database;
  const windowDays = scope.windowDays ?? DEFAULT_WINDOW_DAYS;
  const cutoff = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000);
  const rows = await db
    .select()
    .from(normalizedObservations)
    .where(
      and(
        eq(normalizedObservations.productId, scope.productId),
        eq(normalizedObservations.province, scope.province),
        eq(normalizedObservations.city, scope.city),
        eq(normalizedObservations.district, scope.district),
        eq(normalizedObservations.eligible, true),
        gte(normalizedObservations.observedAt, cutoff),
      ),
    );
  const result = buildBenchmark(
    rows.map((row) => ({
      id: row.id,
      warungId: row.warungId,
      unitPriceIdr: row.unitPriceIdr,
      observedAt: row.observedAt,
      verificationWeight: row.verificationWeight / 100,
      completenessWeight: row.completenessWeight / 100,
    })),
  );

  await db
    .insert(benchmarks)
    .values({
      productId: scope.productId,
      province: scope.province,
      city: scope.city,
      district: scope.district,
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
      computedAt: new Date(),
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
        computedAt: new Date(),
      },
    });

  return getBenchmark({ ...scope, windowDays }, db);
}

export async function submitPriceReport(input: {
  authUserId: string;
  idempotencyKey: string;
  report: PriceReportInput;
}): Promise<PriceReportResultDto> {
  const db = getDatabaseClient();
  const context = await getNormalizationContext(input.report);
  return db.transaction(async (tx) => {
    const db = tx;
    let [warung] = await db
      .select()
      .from(warungs)
      .where(eq(warungs.ownerAuthUserId, input.authUserId))
      .limit(1);

    if (!warung) {
      [warung] = await db
        .insert(warungs)
        .values({
          ownerAuthUserId: input.authUserId,
          displayName: "Warung saya",
          province: input.report.province,
          city: input.report.city,
          district: input.report.district,
        })
        .returning();
    }
    if (!warung) throw new ConflictError("Profil warung tidak dapat dibuat.");

    const [existing] = await db
      .select({
        report: priceReports,
        observation: normalizedObservations,
      })
      .from(priceReports)
      .innerJoin(
        normalizedObservations,
        eq(normalizedObservations.priceReportId, priceReports.id),
      )
      .where(
        and(
          eq(priceReports.warungId, warung.id),
          eq(priceReports.idempotencyKey, input.idempotencyKey),
        ),
      )
      .limit(1);

    if (existing) {
      return {
        reportId: existing.report.id,
        reference: reportReference(existing.report.id),
        status: existing.report.status,
        statusReason: existing.report.statusReason,
        normalization: {
          ok: true,
          landedTotalIdr: existing.observation.landedTotalIdr,
          baseUnitsTotal: existing.observation.baseUnitsTotal,
          unitPriceIdr: existing.observation.unitPriceIdr,
          calculationVersion: existing.observation.calculationVersion,
        },
        benchmark: await getBenchmark(
          {
            productId: input.report.productId,
            province: input.report.province,
            city: input.report.city,
            district: input.report.district,
          },
          db,
        ),
      };
    }

    const fingerprint = createDuplicateFingerprint({
      warungId: warung.id,
      productId: input.report.productId,
      observedDate: input.report.observedDate,
      unitPriceIdr: context.normalization.unitPriceIdr,
      quantityPackages: input.report.quantityPackages,
    });
    const [duplicate] = await db
      .select({ id: priceReports.id })
      .from(priceReports)
      .where(eq(priceReports.duplicateFingerprint, fingerprint))
      .limit(1);
    const referencePrices = await db
      .select({ unitPriceIdr: normalizedObservations.unitPriceIdr })
      .from(normalizedObservations)
      .where(
        and(
          eq(normalizedObservations.productId, input.report.productId),
          eq(normalizedObservations.district, input.report.district),
          eq(normalizedObservations.eligible, true),
        ),
      );
    const anomalous = isAnomalousPrice(
      context.normalization.unitPriceIdr,
      referencePrices.map((row) => row.unitPriceIdr),
    );
    const status: PriceReportStatus = duplicate
      ? "excluded"
      : anomalous
        ? "flagged"
        : "included";
    const statusReason = duplicate
      ? "DUPLICATE_REPORT"
      : anomalous
        ? "ANOMALOUS_PRICE"
        : null;

    let receiptObjectId: string | null = null;
    if (
      input.report.receiptPath &&
      input.report.receiptMimeType &&
      input.report.receiptSizeBytes
    ) {
      const [receiptRow] = await db
        .insert(receiptObjects)
        .values({
          ownerAuthUserId: input.authUserId,
          storagePath: input.report.receiptPath,
          mimeType: input.report.receiptMimeType,
          sizeBytes: input.report.receiptSizeBytes,
          retentionUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year retention
        })
        .returning();

      if (receiptRow) {
        receiptObjectId = receiptRow.id;
      }
    }

    const [created] = await db
      .insert(priceReports)
      .values({
        warungId: warung.id,
        productId: input.report.productId,
        packagingOptionId: input.report.packagingOptionId,
        receiptObjectId: receiptObjectId,
        observedDate: input.report.observedDate,
        quantityPackages: input.report.quantityPackages,
        unitsPerPackage: context.unitsPerPackage,
        grossPriceIdr: input.report.grossPriceIdr,
        discountIdr: input.report.discountIdr,
        deliveryFeeIdr: input.report.deliveryFeeIdr,
        paymentTerms: input.report.paymentTerms,
        supplierType: input.report.supplierType,
        aggregationConsent: input.report.aggregationConsent,
        status,
        statusReason,
        duplicateFingerprint: fingerprint,
        idempotencyKey: input.idempotencyKey,
      })
      .returning();
    if (!created) throw new ConflictError("Laporan tidak dapat disimpan.");

    await db.insert(normalizedObservations).values({
      priceReportId: created.id,
      productId: input.report.productId,
      warungId: warung.id,
      landedTotalIdr: context.normalization.landedTotalIdr,
      baseUnitsTotal: context.normalization.baseUnitsTotal,
      unitPriceIdr: context.normalization.unitPriceIdr,
      province: input.report.province,
      city: input.report.city,
      district: input.report.district,
      observedAt: new Date(`${input.report.observedDate}T12:00:00.000Z`),
      verificationWeight: 50,
      completenessWeight: 100,
      eligible: status === "included",
      exclusionReason: statusReason,
      calculationVersion: NORMALIZATION_VERSION,
    });
    await db.insert(consents).values({
      ownerAuthUserId: input.authUserId,
      purpose: "anonymous_aggregation",
      policyVersion: "1.0.0",
    });
    await db.insert(auditEvents).values({
      actorAuthUserId: input.authUserId,
      eventType: "price_report_created",
      entityType: "price_report",
      entityId: created.id,
      reasonCode: statusReason,
      metadata: { status },
    });

    const benchmarkScopes = [30, 90].map((windowDays) => ({
      productId: input.report.productId,
      province: input.report.province,
      city: input.report.city,
      district: input.report.district,
      windowDays,
    }));
    const [benchmark] = await Promise.all(
      benchmarkScopes.map((scope) => recomputeBenchmark(scope, db)),
    );
    if (!benchmark) {
      throw new ConflictError("Benchmark tidak dapat dihitung ulang.");
    }

    return {
      reportId: created.id,
      reference: reportReference(created.id),
      status,
      statusReason,
      normalization: context.normalization as NormalizationSuccess,
      benchmark,
    };
  });
}

export async function withdrawPriceReport(input: {
  authUserId: string;
  reportId: string;
}) {
  const db = getDatabaseClient();

  return db.transaction(async (tx) => {
    const [report] = await tx
      .select({
        id: priceReports.id,
        productId: priceReports.productId,
        province: normalizedObservations.province,
        city: normalizedObservations.city,
        district: normalizedObservations.district,
      })
      .from(priceReports)
      .innerJoin(warungs, eq(priceReports.warungId, warungs.id))
      .innerJoin(
        normalizedObservations,
        eq(normalizedObservations.priceReportId, priceReports.id),
      )
      .where(
        and(
          eq(priceReports.id, input.reportId),
          eq(warungs.ownerAuthUserId, input.authUserId),
        ),
      )
      .limit(1);

    if (!report) throw new NotFoundError("Laporan tidak ditemukan.");

    const reasonCode = "AGGREGATION_CONSENT_WITHDRAWN";
    await tx
      .update(priceReports)
      .set({
        aggregationConsent: false,
        status: "excluded",
        statusReason: reasonCode,
        updatedAt: new Date(),
      })
      .where(eq(priceReports.id, report.id));
    await tx
      .update(normalizedObservations)
      .set({ eligible: false, exclusionReason: reasonCode })
      .where(eq(normalizedObservations.priceReportId, report.id));
    await tx
      .update(consents)
      .set({ withdrawnAt: new Date() })
      .where(
        and(
          eq(consents.ownerAuthUserId, input.authUserId),
          eq(consents.purpose, "anonymous_aggregation"),
          isNull(consents.withdrawnAt),
        ),
      );
    await tx.insert(auditEvents).values({
      actorAuthUserId: input.authUserId,
      eventType: "price_report_aggregation_withdrawn",
      entityType: "price_report",
      entityId: report.id,
      reasonCode,
    });

    await Promise.all(
      [30, 90].map((windowDays) =>
        recomputeBenchmark(
          {
            productId: report.productId,
            province: report.province,
            city: report.city,
            district: report.district,
            windowDays,
          },
          tx,
        ),
      ),
    );

    return { reportId: report.id, status: "excluded" as const, reasonCode };
  });
}

export async function listOwnReports(
  authUserId: string,
): Promise<ActivityItemDto[]> {
  const db = getDatabaseClient();
  const rows = await db
    .select({
      id: priceReports.id,
      productName: products.name,
      observedDate: priceReports.observedDate,
      unitPriceIdr: normalizedObservations.unitPriceIdr,
      status: priceReports.status,
      statusReason: priceReports.statusReason,
      createdAt: priceReports.createdAt,
    })
    .from(priceReports)
    .innerJoin(warungs, eq(priceReports.warungId, warungs.id))
    .innerJoin(products, eq(priceReports.productId, products.id))
    .innerJoin(
      normalizedObservations,
      eq(normalizedObservations.priceReportId, priceReports.id),
    )
    .where(eq(warungs.ownerAuthUserId, authUserId))
    .orderBy(desc(priceReports.createdAt));

  return rows.map((row) => ({
    id: row.id,
    reference: reportReference(row.id),
    productName: row.productName,
    observedDate: row.observedDate,
    unitPriceIdr: row.unitPriceIdr,
    status: row.status,
    statusReason: row.statusReason,
    createdAt: row.createdAt.toISOString(),
  }));
}

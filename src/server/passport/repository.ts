import { countDistinct, eq, sql } from "drizzle-orm";

import { getDatabaseClient } from "@/db/client";
import {
  auditEvents,
  normalizedObservations,
  priceReports,
  warungs,
} from "@/db/schema";
import {
  BENCHMARK_VERSION,
  NORMALIZATION_VERSION,
} from "@/domain/harga-wajar/types";
import { listOwnConsents } from "@/server/consent/repository";
import type { PassportDto } from "@/types/harga-wajar";

/**
 * Spec section 14 forbids a Passport from carrying a lending score or any
 * recommendation. This builder therefore only counts what the contributor
 * actually did, and keeps derived figures in a separate estimated bucket so
 * the interface can label them as such rather than implying verification.
 */
export async function buildOwnPassport(
  authUserId: string,
): Promise<PassportDto> {
  const db = getDatabaseClient();

  const [warung] = await db
    .select()
    .from(warungs)
    .where(eq(warungs.ownerAuthUserId, authUserId))
    .limit(1);

  const consents = await listOwnConsents(authUserId);
  const generatedAt = new Date().toISOString();

  if (!warung) {
    return {
      hasProfile: false,
      area: null,
      activeSince: null,
      lastContributionAt: null,
      verified: { receiptBackedReports: 0 },
      reported: { totalReports: 0, distinctProducts: 0, supplierTypes: 0 },
      calculated: { benchmarkEligibleReports: 0, areasContributed: 0 },
      estimated: { landedTotalIdr: 0, completenessPercent: 0 },
      consents,
      methodology: {
        normalizationVersion: NORMALIZATION_VERSION,
        benchmarkVersion: BENCHMARK_VERSION,
      },
      generatedAt,
    };
  }

  const [totals] = await db
    .select({
      totalReports: sql<number>`COUNT(*)::int`,
      receiptBacked: sql<number>`COUNT(${priceReports.receiptObjectId})::int`,
      distinctProducts: countDistinct(priceReports.productId),
      supplierTypes: countDistinct(priceReports.supplierType),
      firstAt: sql<string | null>`MIN(${priceReports.createdAt})`,
      lastAt: sql<string | null>`MAX(${priceReports.createdAt})`,
    })
    .from(priceReports)
    .where(eq(priceReports.warungId, warung.id));

  const [derived] = await db
    .select({
      eligible: sql<number>`COUNT(*) FILTER (WHERE ${normalizedObservations.eligible})::int`,
      areas: countDistinct(normalizedObservations.district),
      landedTotal: sql<number>`COALESCE(SUM(${normalizedObservations.landedTotalIdr}), 0)::int`,
      completeness: sql<number>`COALESCE(ROUND(AVG(${normalizedObservations.completenessWeight})), 0)::int`,
    })
    .from(normalizedObservations)
    .where(eq(normalizedObservations.warungId, warung.id));

  return {
    hasProfile: true,
    area: { city: warung.city, district: warung.district },
    activeSince: totals?.firstAt
      ? new Date(totals.firstAt).toISOString()
      : null,
    lastContributionAt: totals?.lastAt
      ? new Date(totals.lastAt).toISOString()
      : null,
    verified: { receiptBackedReports: totals?.receiptBacked ?? 0 },
    reported: {
      totalReports: totals?.totalReports ?? 0,
      distinctProducts: totals?.distinctProducts ?? 0,
      supplierTypes: totals?.supplierTypes ?? 0,
    },
    calculated: {
      benchmarkEligibleReports: derived?.eligible ?? 0,
      areasContributed: derived?.areas ?? 0,
    },
    estimated: {
      landedTotalIdr: derived?.landedTotal ?? 0,
      completenessPercent: derived?.completeness ?? 0,
    },
    consents,
    methodology: {
      normalizationVersion: NORMALIZATION_VERSION,
      benchmarkVersion: BENCHMARK_VERSION,
    },
    generatedAt,
  };
}

/**
 * Exporting is an owner reading their own record, so it needs no sharing
 * consent. It is still audited, because section 14 requires an audit trail
 * for exports.
 */
export async function recordPassportExport(authUserId: string) {
  const db = getDatabaseClient();

  const [warung] = await db
    .select({ id: warungs.id })
    .from(warungs)
    .where(eq(warungs.ownerAuthUserId, authUserId))
    .limit(1);

  await db.insert(auditEvents).values({
    actorAuthUserId: authUserId,
    eventType: "passport_exported",
    entityType: "warung",
    entityId: warung?.id ?? "00000000-0000-0000-0000-000000000000",
    metadata: { exportedAt: new Date().toISOString() },
  });
}

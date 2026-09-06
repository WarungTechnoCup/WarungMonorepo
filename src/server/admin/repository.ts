import { and, desc, eq, inArray, or } from "drizzle-orm";

import { getDatabaseClient } from "@/db/client";
import {
  auditEvents,
  normalizedObservations,
  priceReports,
  products,
  warungs,
} from "@/db/schema";
import type { ModerationInput } from "@/server/admin/validation";
import { NotFoundError } from "@/server/api-response";
import { recomputeBenchmark } from "@/server/harga-wajar/repository";
import type {
  AdminAuditEventDto,
  ModerationQueueItemDto,
} from "@/types/harga-wajar";

const MODERATION_WINDOWS = [30, 90];

export async function listModerationQueue(): Promise<ModerationQueueItemDto[]> {
  const db = getDatabaseClient();

  const rows = await db
    .select({
      id: priceReports.id,
      status: priceReports.status,
      statusReason: priceReports.statusReason,
      observedDate: priceReports.observedDate,
      createdAt: priceReports.createdAt,
      isDemo: priceReports.isDemo,
      productName: products.name,
      unitPriceIdr: normalizedObservations.unitPriceIdr,
      province: normalizedObservations.province,
      city: normalizedObservations.city,
      district: normalizedObservations.district,
    })
    .from(priceReports)
    .innerJoin(products, eq(priceReports.productId, products.id))
    .leftJoin(
      normalizedObservations,
      eq(normalizedObservations.priceReportId, priceReports.id),
    )
    .where(
      or(
        eq(priceReports.status, "pending"),
        eq(priceReports.status, "flagged"),
      ),
    )
    .orderBy(desc(priceReports.createdAt))
    .limit(100);

  return rows.map((row) => ({
    ...row,
    unitPriceIdr: row.unitPriceIdr ?? null,
    province: row.province ?? null,
    city: row.city ?? null,
    district: row.district ?? null,
    createdAt: row.createdAt.toISOString(),
  }));
}

export async function moderateReport(input: {
  actorAuthUserId: string;
  reportId: string;
  decision: ModerationInput;
}) {
  const db = getDatabaseClient();

  const scope = await db.transaction(async (tx) => {
    const [report] = await tx
      .select()
      .from(priceReports)
      .where(eq(priceReports.id, input.reportId))
      .limit(1);

    if (!report) throw new NotFoundError("Laporan tidak ditemukan.");

    const eligible = input.decision.status === "included";

    await tx
      .update(priceReports)
      .set({
        status: input.decision.status,
        statusReason: input.decision.reasonCode,
        updatedAt: new Date(),
      })
      .where(eq(priceReports.id, report.id));

    const [observation] = await tx
      .update(normalizedObservations)
      .set({
        eligible: eligible && report.aggregationConsent,
        exclusionReason: eligible ? null : input.decision.reasonCode,
      })
      .where(eq(normalizedObservations.priceReportId, report.id))
      .returning();

    await tx.insert(auditEvents).values({
      actorAuthUserId: input.actorAuthUserId,
      eventType: "price_report_moderated",
      entityType: "price_report",
      entityId: report.id,
      reasonCode: input.decision.reasonCode,
      metadata: { from: report.status, to: input.decision.status },
    });

    return observation
      ? {
          productId: observation.productId,
          province: observation.province,
          city: observation.city,
          district: observation.district,
        }
      : null;
  });

  if (scope) {
    await Promise.all(
      MODERATION_WINDOWS.map((windowDays) =>
        recomputeBenchmark({ ...scope, windowDays }),
      ),
    );
  }

  return { id: input.reportId, status: input.decision.status };
}

/**
 * Recomputes every scope that currently has an observation, so an operator can
 * repair benchmarks after a calculation version change without shell access.
 */
export async function recomputeAllBenchmarks(actorAuthUserId: string) {
  const db = getDatabaseClient();

  const scopes = await db
    .selectDistinct({
      productId: normalizedObservations.productId,
      province: normalizedObservations.province,
      city: normalizedObservations.city,
      district: normalizedObservations.district,
    })
    .from(normalizedObservations);

  await Promise.all(
    scopes.flatMap((scope) =>
      MODERATION_WINDOWS.map((windowDays) =>
        recomputeBenchmark({ ...scope, windowDays }),
      ),
    ),
  );

  await db.insert(auditEvents).values({
    actorAuthUserId,
    eventType: "benchmarks_recomputed",
    entityType: "benchmark",
    entityId: "00000000-0000-0000-0000-000000000000",
    metadata: { scopeCount: scopes.length, windows: MODERATION_WINDOWS },
  });

  return { scopes: scopes.length, windows: MODERATION_WINDOWS.length };
}

export async function listAuditEvents(
  limit = 100,
): Promise<AdminAuditEventDto[]> {
  const db = getDatabaseClient();

  const rows = await db
    .select()
    .from(auditEvents)
    .orderBy(desc(auditEvents.createdAt))
    .limit(limit);

  return rows.map((row) => ({
    id: row.id,
    eventType: row.eventType,
    entityType: row.entityType,
    entityId: row.entityId,
    reasonCode: row.reasonCode,
    metadata: row.metadata,
    createdAt: row.createdAt.toISOString(),
  }));
}

/**
 * Removes only rows explicitly flagged as demo data. Real contributions are
 * never touched, so the control is safe to expose while DEMO_MODE is on.
 */
export async function resetDemoData(actorAuthUserId: string) {
  const db = getDatabaseClient();

  const scopes = await db
    .selectDistinct({
      productId: normalizedObservations.productId,
      province: normalizedObservations.province,
      city: normalizedObservations.city,
      district: normalizedObservations.district,
    })
    .from(normalizedObservations)
    .innerJoin(
      priceReports,
      eq(normalizedObservations.priceReportId, priceReports.id),
    )
    .where(eq(priceReports.isDemo, true));

  const removed = await db.transaction(async (tx) => {
    const demoWarungs = await tx
      .select({ id: warungs.id })
      .from(warungs)
      .where(eq(warungs.isDemo, true));

    const deleted = await tx
      .delete(priceReports)
      .where(eq(priceReports.isDemo, true))
      .returning({ id: priceReports.id });

    if (demoWarungs.length > 0) {
      await tx.delete(warungs).where(
        and(
          eq(warungs.isDemo, true),
          inArray(
            warungs.id,
            demoWarungs.map((row) => row.id),
          ),
        ),
      );
    }

    await tx.insert(auditEvents).values({
      actorAuthUserId,
      eventType: "demo_data_reset",
      entityType: "price_report",
      entityId: "00000000-0000-0000-0000-000000000000",
      metadata: { removedReports: deleted.length },
    });

    return deleted.length;
  });

  await Promise.all(
    scopes.flatMap((scope) =>
      MODERATION_WINDOWS.map((windowDays) =>
        recomputeBenchmark({ ...scope, windowDays }),
      ),
    ),
  );

  return { removedReports: removed };
}

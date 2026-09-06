import { and, desc, eq, inArray, isNull } from "drizzle-orm";

import { getDatabaseClient } from "@/db/client";
import {
  auditEvents,
  consents,
  normalizedObservations,
  priceReports,
  warungs,
} from "@/db/schema";
import { recomputeBenchmark } from "@/server/harga-wajar/repository";
import type { ConsentPurpose, ConsentStateDto } from "@/types/harga-wajar";

export const CONSENT_PURPOSES = [
  "anonymous_aggregation",
  "receipt_storage",
] as const satisfies readonly ConsentPurpose[];

export const CONSENT_POLICY_VERSION = "1.0.0";

const purposeDescriptions: Record<ConsentPurpose, string> = {
  anonymous_aggregation:
    "Mengizinkan laporan Anda ikut dihitung dalam median wilayah.",
  receipt_storage:
    "Mengizinkan penyimpanan berkas struk sebagai bukti verifikasi.",
};

export async function listOwnConsents(
  authUserId: string,
): Promise<ConsentStateDto[]> {
  const db = getDatabaseClient();

  const rows = await db
    .select()
    .from(consents)
    .where(eq(consents.ownerAuthUserId, authUserId))
    .orderBy(desc(consents.grantedAt));

  return CONSENT_PURPOSES.map((purpose) => {
    const latest = rows.find((row) => row.purpose === purpose);

    return {
      purpose,
      description: purposeDescriptions[purpose],
      granted: Boolean(latest) && latest?.withdrawnAt === null,
      policyVersion: latest?.policyVersion ?? CONSENT_POLICY_VERSION,
      grantedAt: latest?.grantedAt?.toISOString() ?? null,
      withdrawnAt: latest?.withdrawnAt?.toISOString() ?? null,
    };
  });
}

export async function grantConsent(input: {
  authUserId: string;
  purpose: ConsentPurpose;
}) {
  const db = getDatabaseClient();

  return db.transaction(async (tx) => {
    const [active] = await tx
      .select()
      .from(consents)
      .where(
        and(
          eq(consents.ownerAuthUserId, input.authUserId),
          eq(consents.purpose, input.purpose),
          isNull(consents.withdrawnAt),
        ),
      )
      .limit(1);

    if (!active) {
      await tx.insert(consents).values({
        ownerAuthUserId: input.authUserId,
        purpose: input.purpose,
        policyVersion: CONSENT_POLICY_VERSION,
      });
      await tx.insert(auditEvents).values({
        actorAuthUserId: input.authUserId,
        eventType: "consent_granted",
        entityType: "consent",
        entityId: input.authUserId,
        metadata: {
          purpose: input.purpose,
          policyVersion: CONSENT_POLICY_VERSION,
        },
      });
    }
  });
}

/**
 * Withdrawing aggregation consent must also pull the contributor's existing
 * observations out of every benchmark they feed, otherwise the withdrawal
 * would only affect future reports and the promise on /privasi would be false.
 */
export async function withdrawConsent(input: {
  authUserId: string;
  purpose: ConsentPurpose;
}) {
  const db = getDatabaseClient();

  const scopes = await db.transaction(async (tx) => {
    await tx
      .update(consents)
      .set({ withdrawnAt: new Date() })
      .where(
        and(
          eq(consents.ownerAuthUserId, input.authUserId),
          eq(consents.purpose, input.purpose),
          isNull(consents.withdrawnAt),
        ),
      );

    await tx.insert(auditEvents).values({
      actorAuthUserId: input.authUserId,
      eventType: "consent_withdrawn",
      entityType: "consent",
      entityId: input.authUserId,
      reasonCode: "owner_request",
      metadata: { purpose: input.purpose },
    });

    if (input.purpose !== "anonymous_aggregation") {
      return [];
    }

    const owned = await tx
      .select({ id: warungs.id })
      .from(warungs)
      .where(eq(warungs.ownerAuthUserId, input.authUserId));

    const warungIds = owned.map((row) => row.id);
    if (warungIds.length === 0) {
      return [];
    }

    const affected = await tx
      .select({
        productId: normalizedObservations.productId,
        province: normalizedObservations.province,
        city: normalizedObservations.city,
        district: normalizedObservations.district,
      })
      .from(normalizedObservations)
      .where(inArray(normalizedObservations.warungId, warungIds));

    await tx
      .update(priceReports)
      .set({
        aggregationConsent: false,
        status: "excluded",
        statusReason: "aggregation_consent_withdrawn",
        updatedAt: new Date(),
      })
      .where(inArray(priceReports.warungId, warungIds));

    await tx
      .update(normalizedObservations)
      .set({
        eligible: false,
        exclusionReason: "aggregation_consent_withdrawn",
      })
      .where(inArray(normalizedObservations.warungId, warungIds));

    const unique = new Map<string, (typeof affected)[number]>();
    for (const scope of affected) {
      unique.set(
        `${scope.productId}|${scope.province}|${scope.city}|${scope.district}`,
        scope,
      );
    }

    return [...unique.values()];
  });

  await Promise.all(
    scopes.flatMap((scope) =>
      [30, 90].map((windowDays) =>
        recomputeBenchmark({ ...scope, windowDays }),
      ),
    ),
  );
}

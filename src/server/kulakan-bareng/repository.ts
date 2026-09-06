import { and, desc, eq, sql } from "drizzle-orm";

import { getDatabaseClient } from "@/db/client";
import {
  buyingCommitments,
  buyingOpportunities,
  packagingOptions,
  products,
  supplierQuotes,
  warungs,
} from "@/db/schema";
import { ConflictError, NotFoundError } from "@/server/api-response";
import type { CommitBuyingInput } from "@/server/kulakan-bareng/validation";

export async function listOpportunities(query: {
  province?: string;
  city?: string;
  district?: string;
}) {
  const db = getDatabaseClient();

  const conditions = [];
  if (query.province)
    conditions.push(eq(buyingOpportunities.province, query.province));
  if (query.city) conditions.push(eq(buyingOpportunities.city, query.city));
  if (query.district)
    conditions.push(eq(buyingOpportunities.district, query.district));

  const rows = await db
    .select({
      id: buyingOpportunities.id,
      productName: products.name,
      productSlug: products.slug,
      packagingLabel: packagingOptions.label,
      targetQuantityPackages: buyingOpportunities.targetQuantityPackages,
      targetPriceIdr: buyingOpportunities.targetPriceIdr,
      deadline: buyingOpportunities.deadline,
      status: buyingOpportunities.status,
      organizerName: buyingOpportunities.organizerName,
      province: buyingOpportunities.province,
      city: buyingOpportunities.city,
      district: buyingOpportunities.district,
      committedQuantity: sql<number>`COALESCE(SUM(${buyingCommitments.quantityPackages}), 0)::int`,
    })
    .from(buyingOpportunities)
    .innerJoin(products, eq(buyingOpportunities.productId, products.id))
    .innerJoin(
      packagingOptions,
      eq(buyingOpportunities.packagingOptionId, packagingOptions.id),
    )
    .leftJoin(
      buyingCommitments,
      eq(buyingOpportunities.id, buyingCommitments.opportunityId),
    )
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .groupBy(buyingOpportunities.id, products.id, packagingOptions.id)
    .orderBy(desc(buyingOpportunities.createdAt));

  return rows.map((row) => ({
    ...row,
    deadline: row.deadline.toISOString(),
  }));
}

export async function getOpportunity(id: string) {
  const db = getDatabaseClient();

  const [row] = await db
    .select({
      id: buyingOpportunities.id,
      productId: products.id,
      productName: products.name,
      productSlug: products.slug,
      packagingLabel: packagingOptions.label,
      targetQuantityPackages: buyingOpportunities.targetQuantityPackages,
      targetPriceIdr: buyingOpportunities.targetPriceIdr,
      deadline: buyingOpportunities.deadline,
      status: buyingOpportunities.status,
      organizerName: buyingOpportunities.organizerName,
      province: buyingOpportunities.province,
      city: buyingOpportunities.city,
      district: buyingOpportunities.district,
      committedQuantity: sql<number>`COALESCE(SUM(${buyingCommitments.quantityPackages}), 0)::int`,
    })
    .from(buyingOpportunities)
    .innerJoin(products, eq(buyingOpportunities.productId, products.id))
    .innerJoin(
      packagingOptions,
      eq(buyingOpportunities.packagingOptionId, packagingOptions.id),
    )
    .leftJoin(
      buyingCommitments,
      eq(buyingOpportunities.id, buyingCommitments.opportunityId),
    )
    .where(eq(buyingOpportunities.id, id))
    .groupBy(buyingOpportunities.id, products.id, packagingOptions.id)
    .limit(1);

  if (!row) throw new NotFoundError("Peluang pembelian tidak ditemukan.");

  const quotes = await db
    .select()
    .from(supplierQuotes)
    .where(eq(supplierQuotes.opportunityId, id));

  return {
    ...row,
    deadline: row.deadline.toISOString(),
    quotes: quotes.map((q) => ({
      id: q.id,
      supplierName: q.supplierName,
      unitPriceIdr: q.unitPriceIdr,
      deliveryFeeIdr: q.deliveryFeeIdr,
      minimumQuantityPackages: q.minimumQuantityPackages,
      validUntil: q.validUntil.toISOString(),
      terms: q.terms,
    })),
  };
}

export async function submitCommitment(input: {
  authUserId: string;
  opportunityId: string;
  data: CommitBuyingInput;
}) {
  const db = getDatabaseClient();

  return db.transaction(async (tx) => {
    let [warung] = await tx
      .select()
      .from(warungs)
      .where(eq(warungs.ownerAuthUserId, input.authUserId))
      .limit(1);

    if (!warung) {
      // Allow users to commit even if they haven't reported price before,
      // but they need a warung profile. Since we don't have location yet in this case,
      // we get it from opportunity for MVP simplicity.
      const [opp] = await tx
        .select()
        .from(buyingOpportunities)
        .where(eq(buyingOpportunities.id, input.opportunityId))
        .limit(1);
      if (!opp) throw new NotFoundError("Peluang pembelian tidak ditemukan.");

      [warung] = await tx
        .insert(warungs)
        .values({
          ownerAuthUserId: input.authUserId,
          displayName: "Warung Saya",
          province: opp.province,
          city: opp.city,
          district: opp.district,
        })
        .returning();
    }

    if (!warung) throw new ConflictError("Profil warung gagal dibuat.");

    const [opp] = await tx
      .select()
      .from(buyingOpportunities)
      .where(eq(buyingOpportunities.id, input.opportunityId))
      .limit(1);

    if (!opp) throw new NotFoundError("Peluang pembelian tidak ditemukan.");
    if (
      opp.status !== "OPEN" &&
      opp.status !== "TARGET_REACHED" &&
      opp.status !== "QUOTE_RECEIVED"
    ) {
      throw new ConflictError(
        "Peluang pembelian ini sudah tidak menerima komitmen.",
      );
    }

    const [created] = await tx
      .insert(buyingCommitments)
      .values({
        opportunityId: opp.id,
        warungId: warung.id,
        quantityPackages: input.data.quantityPackages,
      })
      .onConflictDoUpdate({
        target: [buyingCommitments.opportunityId, buyingCommitments.warungId],
        set: {
          quantityPackages: sql`${buyingCommitments.quantityPackages} + ${input.data.quantityPackages}`,
        },
      })
      .returning();

    // Check if target is reached
    const [aggregated] = await tx
      .select({
        total: sql<number>`SUM(${buyingCommitments.quantityPackages})::int`,
      })
      .from(buyingCommitments)
      .where(eq(buyingCommitments.opportunityId, opp.id));

    if (
      opp.status === "OPEN" &&
      aggregated.total >= opp.targetQuantityPackages
    ) {
      await tx
        .update(buyingOpportunities)
        .set({ status: "TARGET_REACHED", updatedAt: new Date() })
        .where(eq(buyingOpportunities.id, opp.id));
    }

    return created;
  });
}

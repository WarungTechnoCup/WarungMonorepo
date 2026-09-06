import { z } from "zod";

export const commitBuyingInputSchema = z.object({
  quantityPackages: z.number().int().positive(),
});

export type CommitBuyingInput = z.infer<typeof commitBuyingInputSchema>;

export const opportunityStatusSchema = z.enum([
  "DRAFT",
  "OPEN",
  "TARGET_REACHED",
  "QUOTE_REQUESTED",
  "QUOTE_RECEIVED",
  "ACCEPTED",
  "FULFILLED",
  "CANCELLED",
]);

export const opportunityTransitionSchema = z.object({
  status: opportunityStatusSchema,
  reasonCode: z.string().min(1).max(120).optional(),
});

export const supplierQuoteInputSchema = z.object({
  supplierName: z.string().min(1).max(160),
  unitPriceIdr: z.number().int().positive(),
  deliveryFeeIdr: z.number().int().nonnegative().default(0),
  minimumQuantityPackages: z.number().int().positive(),
  validUntil: z.iso.datetime(),
  terms: z.string().min(1).max(500),
});

export type OpportunityTransitionInput = z.infer<
  typeof opportunityTransitionSchema
>;
export type SupplierQuoteInput = z.infer<typeof supplierQuoteInputSchema>;

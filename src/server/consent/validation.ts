import { z } from "zod";

export const consentPurposeSchema = z.enum([
  "anonymous_aggregation",
  "receipt_storage",
]);

export const consentMutationSchema = z.object({
  purpose: consentPurposeSchema,
});

export type ConsentMutationInput = z.infer<typeof consentMutationSchema>;

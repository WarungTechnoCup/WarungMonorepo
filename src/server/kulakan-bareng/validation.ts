import { z } from "zod";

export const commitBuyingInputSchema = z.object({
  quantityPackages: z.number().int().positive(),
});

export type CommitBuyingInput = z.infer<typeof commitBuyingInputSchema>;

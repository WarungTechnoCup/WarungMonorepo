import { z } from "zod";

const positiveInteger = z.number().int().positive();
const nonNegativeInteger = z.number().int().nonnegative();

export const priceReportInputSchema = z.object({
  productId: z.uuid(),
  packagingOptionId: z.uuid(),
  observedDate: z.iso.date(),
  quantityPackages: positiveInteger,
  grossPriceIdr: positiveInteger,
  discountIdr: nonNegativeInteger.default(0),
  deliveryFeeIdr: nonNegativeInteger.default(0),
  paymentTerms: z.enum(["tunai", "tempo"]),
  supplierType: z.enum(["distributor", "grosir", "agen", "lainnya"]),
  province: z.string().trim().min(2).max(80),
  city: z.string().trim().min(2).max(80),
  district: z.string().trim().min(2).max(80),
  aggregationConsent: z.literal(true),
});

export type PriceReportInput = z.infer<typeof priceReportInputSchema>;

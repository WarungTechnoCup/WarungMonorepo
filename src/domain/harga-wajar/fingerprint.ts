import { createHash } from "node:crypto";

interface FingerprintInput {
  warungId: string;
  productId: string;
  observedDate: string;
  unitPriceIdr: number;
  quantityPackages: number;
}

export function createDuplicateFingerprint(input: FingerprintInput) {
  const canonical = [
    input.warungId,
    input.productId,
    input.observedDate,
    input.unitPriceIdr,
    input.quantityPackages,
  ].join(":");

  return createHash("sha256").update(canonical).digest("hex");
}

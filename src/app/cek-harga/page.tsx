import type { Metadata } from "next";

import { PriceSearch } from "@/components/price-search";

export const metadata: Metadata = {
  title: "Cek Harga",
  description: "Cari benchmark harga kulakan yang menjaga privasi warung.",
};

export default function PriceSearchPage() {
  return <PriceSearch />;
}

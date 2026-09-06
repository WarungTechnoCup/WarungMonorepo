import type { Metadata } from "next";

import { KulakanList } from "@/components/kulakan-list";

export const metadata: Metadata = {
  title: "Kulakan Bareng",
  description: "Daya beli tumbuh saat warung bergerak bersama.",
};

export default function GroupBuyingPage() {
  return <KulakanList />;
}

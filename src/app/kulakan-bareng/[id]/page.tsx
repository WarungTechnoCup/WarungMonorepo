import type { Metadata } from "next";

import { KulakanDetail } from "@/components/kulakan-detail";

export const metadata: Metadata = {
  title: "Detail Kulakan Bareng",
  description: "Komitmen yang jelas dan dapat ditinjau.",
};

interface GroupBuyingDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function GroupBuyingDetailPage({
  params,
}: GroupBuyingDetailPageProps) {
  const { id } = await params;
  return <KulakanDetail id={id} />;
}

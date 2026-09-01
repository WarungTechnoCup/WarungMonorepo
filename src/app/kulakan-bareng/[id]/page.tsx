import { ScaffoldPage } from "@/components/scaffold-page";

interface GroupBuyingDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function GroupBuyingDetailPage({
  params,
}: GroupBuyingDetailPageProps) {
  const { id } = await params;

  return (
    <ScaffoldPage
      description={`Detail peluang ${id} belum memiliki data. Rute tersedia untuk integrasi pada milestone Kulakan Bareng.`}
      eyebrow="Act, detail kulakan"
      plannedItems={[
        "Tampilkan syarat, wilayah, tenggat, dan status komitmen.",
        "Konfirmasi tindakan sebelum mencatat komitmen pengguna.",
        "Sediakan jalur keluar yang jelas sebelum tenggat yang disepakati.",
      ]}
      privacyNote="Identitas warung dan hubungan laporan dengan pemasok tidak akan ditampilkan secara publik."
      title="Komitmen yang jelas dan dapat ditinjau."
    />
  );
}

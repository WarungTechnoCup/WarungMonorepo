import { ScaffoldPage } from "@/components/scaffold-page";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const readableSlug = decodeURIComponent(slug).replaceAll("-", " ");

  return (
    <ScaffoldPage
      description={`Rute detail untuk ${readableSlug} sudah terhubung. Data produk dan benchmark belum tersedia.`}
      eyebrow="Discover, detail produk"
      plannedItems={[
        "Ringkas identitas, ukuran, dan wilayah produk.",
        "Jelaskan rentang, jumlah kontributor, kesegaran, dan tingkat keyakinan.",
        "Pisahkan benchmark komunitas dari kutipan pemasok.",
      ]}
      title="Detail produk yang dapat diaudit."
    />
  );
}

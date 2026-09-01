import { ScaffoldPage } from "@/components/scaffold-page";

export default function GroupBuyingPage() {
  return (
    <ScaffoldPage
      description="Rute ini akan menampilkan peluang pembelian bersama setelah data kebutuhan, komitmen, dan pemasok memiliki batas akses yang jelas."
      eyebrow="Act"
      plannedItems={[
        "Jelajahi peluang berdasarkan wilayah dan jenis produk.",
        "Bedakan minat awal dari komitmen pembelian.",
        "Jaga kutipan pemasok terpisah dari benchmark komunitas.",
      ]}
      title="Daya beli tumbuh saat warung bergerak bersama."
    />
  );
}

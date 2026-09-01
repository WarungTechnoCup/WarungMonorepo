import { ScaffoldPage } from "@/components/scaffold-page";

export default function PriceSearchPage() {
  return (
    <ScaffoldPage
      description="Pencarian katalog dan benchmark Harga Wajar akan ditempatkan di rute ini setelah model data dan metodologi disetujui."
      eyebrow="Discover"
      plannedItems={[
        "Cari produk menggunakan nama yang umum digunakan pemilik warung.",
        "Pisahkan kemasan, wilayah, dan waktu pengamatan.",
        "Tampilkan progress ketika data belum mencapai lima kontributor independen.",
      ]}
      privacyNote="Tidak ada harga contoh yang ditampilkan sebagai benchmark nyata pada milestone scaffold."
      title="Cek harga tanpa menebak."
    />
  );
}

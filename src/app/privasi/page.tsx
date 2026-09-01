import { ScaffoldPage } from "@/components/scaffold-page";

export default function PrivacyPage() {
  return (
    <ScaffoldPage
      description="Kebijakan rinci akan diselesaikan sebelum pengumpulan data. Prinsip minimisasi data dan persetujuan eksplisit sudah menjadi batas arsitektur."
      eyebrow="Privasi"
      plannedItems={[
        "Kumpulkan hanya data yang diperlukan untuk fitur yang dijelaskan.",
        "Simpan bukti transaksi sebagai data sensitif dengan akses terbatas.",
        "Publikasikan hanya bidang yang telah diizinkan dan diagregasi.",
        "Sediakan penarikan persetujuan dan penghapusan data yang dapat dipahami.",
      ]}
      privacyNote="Alamat persis, identitas warung, struk mentah, nomor telepon penuh, dan hubungan laporan dengan pemasok tidak boleh tersedia secara publik."
      title="Privasi adalah syarat produk."
    />
  );
}

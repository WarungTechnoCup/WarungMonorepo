import { ScaffoldPage } from "@/components/scaffold-page";

export default function ReportPricePage() {
  return (
    <ScaffoldPage
      description="Rute terlindungi ini disiapkan untuk kontribusi harga. Tanpa konfigurasi Supabase dan sesi yang valid, proxy akan menolak akses."
      eyebrow="Contribute"
      plannedItems={[
        "Validasi produk, ukuran, harga, wilayah, waktu, dan persetujuan di server.",
        "Unggah bukti ke bucket privat dengan jalur yang tidak dapat ditebak.",
        "Pertahankan masukan pengguna ketika validasi gagal.",
      ]}
      privacyNote="Jangan gunakan struk atau data pribadi nyata sampai kontrol Storage dan row-level security ditinjau."
      title="Bagikan harga dengan kendali yang jelas."
    />
  );
}

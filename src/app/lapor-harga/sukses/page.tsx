import { ScaffoldPage } from "@/components/scaffold-page";

export default function ReportSuccessPage() {
  return (
    <ScaffoldPage
      description="Konfirmasi ini belum mewakili pengiriman data. Halaman akan dihubungkan hanya setelah transaksi laporan berhasil."
      eyebrow="Contribute, konfirmasi"
      plannedItems={[
        "Tampilkan nomor referensi yang aman setelah transaksi berhasil.",
        "Jelaskan proses verifikasi dan ekspektasi waktu.",
        "Berikan jalur kembali ke aktivitas tanpa mengirim ulang formulir.",
      ]}
      title="Konfirmasi yang jujur dan dapat dilacak."
    />
  );
}

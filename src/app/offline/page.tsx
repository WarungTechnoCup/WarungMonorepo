import { ScaffoldPage } from "@/components/scaffold-page";

export default function OfflinePage() {
  return (
    <ScaffoldPage
      description="Shell offline tersedia, tetapi service worker belum diaktifkan sampai aturan caching data sensitif disetujui."
      eyebrow="Ketahanan jaringan"
      plannedItems={[
        "Tampilkan penjelasan ketika jaringan tidak tersedia.",
        "Jangan cache sesi, struk, Passport, atau respons pengguna lain.",
        "Aktifkan caching hanya setelah klasifikasi data dan pengujian selesai.",
      ]}
      title="Offline tanpa mengorbankan privasi."
    />
  );
}

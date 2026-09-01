import { ScaffoldPage } from "@/components/scaffold-page";

export default function AdminPage() {
  return (
    <ScaffoldPage
      description="Rute admin tersedia sebagai batas akses. Peran, audit trail, dan operasi moderasi belum diimplementasikan."
      eyebrow="Admin"
      plannedItems={[
        "Verifikasi peran admin pada server dan row-level security.",
        "Catat keputusan moderasi tanpa menyimpan data sensitif di log.",
        "Gunakan allowlist untuk setiap data yang keluar dari antarmuka admin.",
      ]}
      title="Operasi internal dengan jejak audit."
    />
  );
}

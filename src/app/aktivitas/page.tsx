import { ScaffoldPage } from "@/components/scaffold-page";

export default function ActivityPage() {
  return (
    <ScaffoldPage
      description="Aktivitas akan menampilkan kontribusi dan komitmen milik pengguna yang sedang masuk tanpa membuka data pengguna lain."
      eyebrow="Contribute, riwayat"
      plannedItems={[
        "Tampilkan status laporan milik pengguna.",
        "Tampilkan komitmen Kulakan Bareng yang relevan.",
        "Uji seluruh query terhadap akses lintas pengguna.",
      ]}
      title="Riwayat pribadi, batas akses tegas."
    />
  );
}

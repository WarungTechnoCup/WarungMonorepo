import { ScaffoldPage } from "@/components/scaffold-page";

export default function PassportPage() {
  return (
    <ScaffoldPage
      description="Passport hanya berupa preview terbatas. Tidak ada penilaian finansial atau klaim kelayakan kredit pada milestone ini."
      eyebrow="Contribute, preview"
      plannedItems={[
        "Tampilkan ringkasan kontribusi yang dipahami pengguna.",
        "Minta persetujuan terpisah sebelum penggunaan data baru.",
        "Jelaskan batas, sumber, dan masa berlaku setiap indikator.",
      ]}
      privacyNote="Data Passport diperlakukan sebagai data sensitif dan bukan profil publik."
      title="Passport sebagai preview yang terkendali."
    />
  );
}

import { ScaffoldPage } from "@/components/scaffold-page";

export default function HowItWorksPage() {
  return (
    <ScaffoldPage
      description="Halaman metodologi akan menjelaskan bagaimana kontribusi dinormalisasi, diverifikasi, dan diringkas tanpa mengungkap warung tertentu."
      eyebrow="Metodologi"
      plannedItems={[
        "Kontributor mengirim harga, kemasan, waktu, wilayah, dan bukti yang diizinkan.",
        "Sistem menormalisasi unit dan menghitung sinyal kepercayaan secara terpisah.",
        "Benchmark hanya muncul setelah ambang kontribusi independen terpenuhi.",
        "Warung dapat menindaklanjuti informasi melalui Kulakan Bareng.",
      ]}
      title="Dari bukti, menjadi acuan, lalu tindakan."
    />
  );
}

import type { Metadata } from "next";

import { PassportPreview } from "@/components/passport-preview";

export const metadata: Metadata = {
  title: "Passport",
  description:
    "Catatan aktivitas usaha Anda sendiri, dipisahkan antara terverifikasi, dilaporkan, dihitung, dan estimasi.",
};

export default function PassportPage() {
  return (
    <section className="page-shell py-14 sm:py-20">
      <div className="max-w-3xl">
        <h1 className="text-ink text-4xl leading-tight font-semibold tracking-[-0.045em] text-balance sm:text-5xl">
          Bukti aktivitas usaha, bukan penilaian.
        </h1>
        <p className="text-ink-muted mt-6 text-lg leading-8">
          Setiap angka di bawah dikelompokkan menurut asalnya, agar tidak ada
          perkiraan yang terbaca seolah sudah terverifikasi.
        </p>
      </div>

      <PassportPreview />
    </section>
  );
}

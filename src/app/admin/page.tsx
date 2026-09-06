import type { Metadata } from "next";

import { AdminConsole } from "@/components/admin-console";

export const metadata: Metadata = {
  title: "Admin",
  description:
    "Moderasi laporan, pemeliharaan benchmark, dan audit log untuk operator.",
};

export default function AdminPage() {
  return (
    <section className="page-shell py-14 sm:py-20">
      <div className="max-w-3xl">
        <h1 className="text-ink text-4xl leading-tight font-semibold tracking-[-0.045em] text-balance sm:text-5xl">
          Konsol moderasi dan pemeliharaan.
        </h1>
        <p className="text-ink-muted mt-6 text-lg leading-8">
          Setiap tindakan pada halaman ini tercatat pada audit log beserta
          alasannya, sehingga keputusan moderasi dapat ditinjau kembali.
        </p>
      </div>

      <AdminConsole />
    </section>
  );
}

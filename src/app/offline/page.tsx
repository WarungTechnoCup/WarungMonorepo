import { CloudSlash } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Offline",
  description:
    "Halaman ini muncul ketika perangkat tidak memiliki koneksi jaringan.",
};

const availableOffline = [
  { href: "/", label: "Beranda" },
  { href: "/cek-harga", label: "Cek harga" },
  { href: "/kulakan-bareng", label: "Kulakan bareng" },
  { href: "/cara-kerja", label: "Cara kerja" },
  { href: "/privasi", label: "Privasi" },
];

export default function OfflinePage() {
  return (
    <section className="page-shell py-14 sm:py-20">
      <div className="max-w-2xl">
        <span className="status-chip">
          <CloudSlash aria-hidden="true" size={14} weight="bold" />
          Offline
        </span>
        <h1 className="text-ink mt-8 text-4xl leading-tight font-semibold tracking-[-0.045em] text-balance sm:text-5xl">
          Perangkat Anda sedang tanpa koneksi.
        </h1>
        <p className="text-ink-muted mt-6 text-lg leading-8">
          Halaman yang pernah dibuka tetap dapat dilihat dari salinan tersimpan.
          Angka benchmark yang muncul berasal dari pengambilan terakhir, bukan
          perhitungan baru.
        </p>
      </div>

      <div className="border-ink/12 mt-12 grid gap-8 border-t pt-8 lg:grid-cols-[0.7fr_1.3fr]">
        <div>
          <p className="text-ink text-sm font-semibold">Tersedia offline</p>
          <p className="text-ink-muted mt-2 text-sm leading-6">
            Halaman publik disimpan agar tetap terbuka tanpa jaringan.
          </p>
        </div>
        <ul className="flex flex-wrap gap-3">
          {availableOffline.map((item) => (
            <li key={item.href}>
              <Link className="secondary-action" href={item.href}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-ink/12 mt-10 grid gap-8 border-t pt-8 lg:grid-cols-[0.7fr_1.3fr]">
        <div>
          <p className="text-ink text-sm font-semibold">Tidak disimpan</p>
          <p className="text-ink-muted mt-2 text-sm leading-6">
            Demi privasi, sebagian halaman selalu memerlukan jaringan.
          </p>
        </div>
        <ul className="text-ink-muted grid gap-3 text-sm leading-6">
          <li className="border-ink/10 border-l-2 pl-4">
            Laporan harga, aktivitas, dan komitmen Anda tidak pernah disimpan di
            perangkat oleh aplikasi ini.
          </li>
          <li className="border-ink/10 border-l-2 pl-4">
            Struk, sesi masuk, dan Passport hanya diambil langsung dari server
            ketika Anda daring.
          </li>
          <li className="border-ink/10 border-l-2 pl-4">
            Mengirim laporan baru memerlukan koneksi agar normalisasi dan
            pemeriksaan duplikat dapat dijalankan.
          </li>
        </ul>
      </div>

      <p className="text-ink-muted mt-10 text-sm leading-6">
        Sambungkan kembali jaringan, lalu muat ulang halaman ini.
      </p>
    </section>
  );
}

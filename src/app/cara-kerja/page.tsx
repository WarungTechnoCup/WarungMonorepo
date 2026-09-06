import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";

import {
  BENCHMARK_VERSION,
  MINIMUM_INDEPENDENT_WARUNGS,
  NORMALIZATION_VERSION,
} from "@/domain/harga-wajar/types";
import { formatRupiah } from "@/lib/format";

export const metadata: Metadata = {
  title: "Cara Kerja",
  description:
    "Penjelasan terbuka tentang cara laporan harga dinormalisasi, diagregasi, dan diberi tingkat kepercayaan.",
};

const steps = [
  {
    title: "Warung melaporkan pembelian",
    body: "Kontributor mengisi produk, tanggal, kemasan, jumlah, harga kotor, diskon, ongkos kirim, termin pembayaran, dan jenis pemasok. Bukti struk bersifat opsional.",
  },
  {
    title: "Sistem menormalisasi ke harga satuan",
    body: "Setiap laporan diubah menjadi harga per unit dasar memakai rumus yang sama, sehingga karton, dus, dan renceng dapat dibandingkan secara adil.",
  },
  {
    title: "Agregat area dihitung, bukan harga perorangan",
    body: "Harga wajar adalah median dari banyak laporan independen di satu wilayah. Laporan milik satu warung tidak pernah ditampilkan ke publik.",
  },
];

const confidenceLabels = [
  {
    label: "Tinggi",
    range: "75 sampai 100",
    requirement: `minimal ${MINIMUM_INDEPENDENT_WARUNGS} warung independen`,
  },
  {
    label: "Sedang",
    range: "50 sampai 74",
    requirement: `minimal ${MINIMUM_INDEPENDENT_WARUNGS} warung independen`,
  },
  {
    label: "Terbatas",
    range: `di bawah 50, atau kurang dari ${MINIMUM_INDEPENDENT_WARUNGS} warung`,
    requirement: "patokan ditahan, progres ditampilkan",
  },
];

const limitations = [
  "Angka ini bukan harga resmi, bukan rekomendasi harga jual, dan bukan penilaian pemasok.",
  "Perbandingan antarwilayah selalu diberi label karena biaya kirim dan pasokan berbeda.",
  "Pencilan ditandai dan dicatat alasannya, tidak dihapus diam-diam.",
  "Setiap angka membawa versi perhitungan agar hasil lama tetap dapat ditelusuri.",
];

export default function HowItWorksPage() {
  return (
    <section className="page-shell py-14 sm:py-20">
      <div className="max-w-3xl">
        <p className="eyebrow">Metodologi</p>
        <h1 className="text-ink mt-4 text-4xl leading-tight font-semibold tracking-[-0.045em] text-balance sm:text-5xl">
          Dari bukti, menjadi acuan, lalu tindakan.
        </h1>
        <p className="text-ink-muted mt-6 text-lg leading-8">
          Halaman ini menjelaskan perhitungan di balik Harga Wajar dengan bahasa
          sehari-hari. Metode yang tidak dapat dijelaskan tidak layak dipercaya.
        </p>
      </div>

      <h2 className="text-ink mt-14 text-2xl font-semibold tracking-tight">
        Tiga langkah
      </h2>
      <ol className="mt-6 grid gap-5 lg:grid-cols-3">
        {steps.map((step, index) => (
          <li
            className="border-ink/12 bg-paper-strong rounded-2xl border p-6"
            key={step.title}
          >
            <span className="text-accent font-mono text-sm">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="text-ink mt-3 text-lg font-semibold">
              {step.title}
            </h3>
            <p className="text-ink-muted mt-2 text-sm leading-6">{step.body}</p>
          </li>
        ))}
      </ol>

      <h2 className="text-ink mt-14 text-2xl font-semibold tracking-tight">
        Rumus normalisasi
      </h2>
      <div className="border-ink/12 bg-paper-strong mt-6 rounded-2xl border p-6">
        <dl className="grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-ink text-sm font-semibold">Total terkirim</dt>
            <dd className="text-ink-muted mt-1 font-mono text-sm leading-6">
              harga kotor - diskon + ongkos kirim
            </dd>
          </div>
          <div>
            <dt className="text-ink text-sm font-semibold">Total unit dasar</dt>
            <dd className="text-ink-muted mt-1 font-mono text-sm leading-6">
              jumlah kemasan x isi per kemasan
            </dd>
          </div>
          <div>
            <dt className="text-ink text-sm font-semibold">Harga satuan</dt>
            <dd className="text-ink-muted mt-1 font-mono text-sm leading-6">
              total terkirim / total unit dasar
            </dd>
          </div>
        </dl>

        <div className="border-accent mt-6 border-l-2 pl-4">
          <p className="text-ink text-sm font-semibold">Contoh</p>
          <p className="text-ink-muted mt-2 text-sm leading-6">
            Satu karton berisi 40 pieces, harga kotor {formatRupiah(118000)},
            ongkos kirim {formatRupiah(5000)}, tanpa diskon. Total terkirim
            menjadi {formatRupiah(123000)} untuk 40 unit dasar, sehingga harga
            satuan adalah {formatRupiah(3075)} per piece.
          </p>
        </div>
      </div>

      <h2 className="text-ink mt-14 text-2xl font-semibold tracking-tight">
        Tingkat kepercayaan
      </h2>
      <p className="text-ink-muted mt-4 max-w-3xl text-sm leading-6">
        Skor kepercayaan menggambarkan keandalan agregat, bukan penilaian
        penjual dan bukan skor kredit. Masukannya adalah jumlah laporan layak,
        jumlah warung independen, kebaruan data, tingkat verifikasi, sebaran
        harga, dan kelengkapan isian.
      </p>
      <ul className="divide-ink/10 border-ink/10 mt-6 divide-y border-y">
        {confidenceLabels.map((item) => (
          <li
            className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-4"
            key={item.label}
          >
            <span className="status-chip">{item.label}</span>
            <span className="text-ink text-sm font-semibold">{item.range}</span>
            <span className="text-ink-muted text-sm">{item.requirement}</span>
          </li>
        ))}
      </ul>
      <p className="text-ink-muted mt-5 text-sm leading-6">
        Di bawah {MINIMUM_INDEPENDENT_WARUNGS} warung independen, sistem menahan
        patokan dan menampilkan progres menuju ambang tersebut. Lebih baik
        mengatakan belum cukup data daripada memberi angka yang menyesatkan.
      </p>

      <h2 className="text-ink mt-14 text-2xl font-semibold tracking-tight">
        Batasan yang kami akui
      </h2>
      <ul className="text-ink-muted mt-5 grid gap-3 text-sm leading-6">
        {limitations.map((item) => (
          <li className="border-ink/10 border-l-2 pl-4" key={item}>
            {item}
          </li>
        ))}
      </ul>

      <p className="text-ink-muted mt-8 font-mono text-xs">
        Versi normalisasi {NORMALIZATION_VERSION} | versi benchmark{" "}
        {BENCHMARK_VERSION}
      </p>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link className="primary-action" href="/cek-harga">
          Cek harga sekarang
          <ArrowRight aria-hidden="true" size={18} weight="bold" />
        </Link>
        <Link className="secondary-action" href="/privasi">
          Baca kebijakan privasi
        </Link>
      </div>
    </section>
  );
}

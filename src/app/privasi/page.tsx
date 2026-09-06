import type { Metadata } from "next";
import Link from "next/link";

import { ConsentControls } from "@/components/consent-controls";
import { MINIMUM_INDEPENDENT_WARUNGS } from "@/domain/harga-wajar/types";

export const metadata: Metadata = {
  title: "Privasi",
  description:
    "Data apa yang dikumpulkan, siapa yang dapat melihatnya, dan bagaimana persetujuan ditarik kembali.",
};

const collected = [
  "Identitas masuk berupa surel dan kata sandi yang dikelola penyedia autentikasi.",
  "Lokasi administratif kasar pada tingkat provinsi, kota, dan kecamatan.",
  "Masukan normalisasi: produk, tanggal, kemasan, jumlah, harga, diskon, ongkos kirim, termin, dan jenis pemasok.",
  "Bukti struk bila diunggah secara sukarela, disimpan pada penyimpanan berakses terbatas.",
  "Komitmen Kulakan Bareng untuk keperluan koordinasi pembelian bersama.",
];

const notCollected = [
  "Titik GPS atau alamat persis warung.",
  "Nomor induk kependudukan atau dokumen identitas negara.",
  "Kredensial perbankan, data kartu, atau informasi pembayaran.",
  "Data penjualan, stok, dan pendapatan yang tidak diperlukan fitur saat ini.",
];

const visibility = [
  {
    who: "Anda sendiri",
    what: "Seluruh laporan mentah milik Anda, termasuk pemasok dan struk yang diunggah.",
  },
  {
    who: "Pengunjung publik",
    what: `Hanya agregat wilayah setelah ambang ${MINIMUM_INDEPENDENT_WARUNGS} warung independen terpenuhi. Tidak pernah laporan perorangan.`,
  },
  {
    who: "Penyelenggara Kulakan Bareng",
    what: "Jumlah komitmen agregat, bukan identitas atau riwayat harga tiap peserta.",
  },
];

export default function PrivacyPage() {
  return (
    <section className="page-shell py-14 sm:py-20">
      <div className="max-w-3xl">
        <p className="eyebrow">Privasi</p>
        <h1 className="text-ink mt-4 text-4xl leading-tight font-semibold tracking-[-0.045em] text-balance sm:text-5xl">
          Privasi adalah syarat produk.
        </h1>
        <p className="text-ink-muted mt-6 text-lg leading-8">
          Layanan ini hanya berguna bila warung merasa aman berkontribusi.
          Karena itu kami mengumpulkan sesedikit mungkin, dan menerbitkan hanya
          angka yang sudah diagregasi.
        </p>
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        <div className="border-ink/12 bg-paper-strong rounded-2xl border p-6">
          <h2 className="text-ink text-xl font-semibold tracking-tight">
            Yang dikumpulkan
          </h2>
          <ul className="text-ink-muted mt-4 grid gap-3 text-sm leading-6">
            {collected.map((item) => (
              <li className="border-accent border-l-2 pl-4" key={item}>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="border-ink/12 bg-paper-strong rounded-2xl border p-6">
          <h2 className="text-ink text-xl font-semibold tracking-tight">
            Yang tidak dikumpulkan
          </h2>
          <ul className="text-ink-muted mt-4 grid gap-3 text-sm leading-6">
            {notCollected.map((item) => (
              <li className="border-ink/15 border-l-2 pl-4" key={item}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <h2 className="text-ink mt-14 text-2xl font-semibold tracking-tight">
        Siapa melihat apa
      </h2>
      <dl className="divide-ink/10 border-ink/10 mt-6 divide-y border-y">
        {visibility.map((row) => (
          <div
            className="grid gap-2 py-5 sm:grid-cols-[14rem_1fr]"
            key={row.who}
          >
            <dt className="text-ink text-sm font-semibold">{row.who}</dt>
            <dd className="text-ink-muted text-sm leading-6">{row.what}</dd>
          </div>
        ))}
      </dl>

      <h2 className="text-ink mt-14 text-2xl font-semibold tracking-tight">
        Persetujuan yang dapat ditarik
      </h2>
      <p className="text-ink-muted mt-4 max-w-3xl text-sm leading-6">
        Persetujuan dicatat terpisah per keperluan dan disimpan bersama
        versinya. Menarik satu persetujuan tidak membatalkan yang lain.
      </p>
      <ConsentControls />

      <div className="border-ink/12 bg-paper-strong mt-14 rounded-2xl border p-6">
        <h2 className="text-ink text-xl font-semibold tracking-tight">
          Status kejujuran
        </h2>
        <p className="text-ink-muted mt-3 text-sm leading-6">
          Halaman ini menjelaskan perilaku produk pada tahap sekarang, bukan
          klaim kepatuhan hukum. Kewajiban perlindungan data pribadi di
          Indonesia masih memerlukan tinjauan hukum sebelum penggunaan produksi.
          Penarikan persetujuan sudah dapat dilakukan sendiri di atas. Ekspor
          data lengkap belum tersedia sebagai halaman kendali; sampai itu ada,
          permintaan diproses secara manual melalui kontak tim.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link className="secondary-action" href="/cara-kerja">
          Lihat metodologi perhitungan
        </Link>
      </div>
    </section>
  );
}

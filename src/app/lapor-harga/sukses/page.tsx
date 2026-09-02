import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

import { formatRupiah } from "@/lib/format";

interface ReportSuccessPageProps {
  searchParams: Promise<{
    reference?: string;
    status?: string;
    unitPriceIdr?: string;
    productName?: string;
  }>;
}

const statusMessages: Record<string, string> = {
  included: "Laporan valid dan telah masuk ke perhitungan benchmark.",
  flagged:
    "Laporan tersimpan dan menunggu pemeriksaan karena nilainya tidak biasa.",
  excluded:
    "Laporan tersimpan tetapi tidak dihitung karena terdeteksi sebagai duplikat.",
  pending: "Laporan tersimpan dan menunggu pemeriksaan.",
};

export default async function ReportSuccessPage({
  searchParams,
}: ReportSuccessPageProps) {
  const { reference, status, unitPriceIdr, productName } = await searchParams;

  return (
    <div className="page-shell py-16 sm:py-24">
      <section className="border-ink/12 bg-paper mx-auto max-w-2xl rounded-3xl border p-7 sm:p-10">
        <CheckCircle
          aria-hidden="true"
          className="text-accent"
          size={44}
          weight="fill"
        />
        <p className="eyebrow mt-6">Laporan tersimpan</p>
        <h1 className="text-ink mt-3 text-4xl font-semibold tracking-[-0.04em]">
          Terima kasih sudah berkontribusi.
        </h1>
        <p className="text-ink-muted mt-5 leading-7">
          {statusMessages[status ?? ""] ?? statusMessages.pending}
        </p>
        <dl className="border-ink/10 mt-7 space-y-4 border-y py-6">
          <div className="flex justify-between gap-4">
            <dt className="text-ink-muted">Referensi</dt>
            <dd className="text-ink font-mono font-semibold">
              {reference ?? "Tidak tersedia"}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-muted">Produk</dt>
            <dd className="text-ink text-right font-semibold">
              {productName ?? "Produk"}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-muted">Harga per unit</dt>
            <dd className="text-ink font-semibold">
              {formatRupiah(Number(unitPriceIdr ?? 0))}
            </dd>
          </div>
        </dl>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link className="primary-action justify-center" href="/aktivitas">
            Lihat aktivitas
          </Link>
          <Link className="secondary-action justify-center" href="/cek-harga">
            Kembali cek harga
          </Link>
        </div>
      </section>
    </div>
  );
}

import { CheckCircle, Info } from "@phosphor-icons/react";

import { formatDate, formatRupiah } from "@/lib/format";
import type { BenchmarkDto } from "@/types/harga-wajar";

export function BenchmarkCard({ benchmark }: { benchmark: BenchmarkDto }) {
  const { result } = benchmark;

  if (result.status === "insufficient") {
    const progress = Math.min(
      100,
      Math.round(
        (result.independentContributors / result.requiredContributors) * 100,
      ),
    );

    return (
      <section className="border-ink/12 bg-paper rounded-3xl border p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <Info aria-hidden="true" className="text-accent mt-0.5" size={24} />
          <div>
            <p className="text-ink text-lg font-semibold">Belum cukup data</p>
            <p className="text-ink-muted mt-2 leading-7">{result.message}</p>
          </div>
        </div>
        <div className="mt-7">
          <div className="text-ink-muted flex justify-between text-sm">
            <span>Kontributor independen</span>
            <span className="text-ink font-semibold">
              {result.independentContributors} dari{" "}
              {result.requiredContributors}
            </span>
          </div>
          <div className="bg-ink/10 mt-3 h-3 overflow-hidden rounded-full">
            <div
              className="bg-accent h-full rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <p className="text-ink-muted mt-5 text-sm leading-6">
          Median dan rentang harga tidak ditampilkan sampai ambang privasi
          terpenuhi.
        </p>
      </section>
    );
  }

  return (
    <section className="border-ink/12 bg-paper rounded-3xl border p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Harga wajar area</p>
          <p className="numeric text-ink mt-3 text-4xl font-semibold tracking-tight">
            {formatRupiah(result.medianUnitPriceIdr)}
          </p>
          <p className="text-ink-muted mt-2 text-sm">per unit dasar produk</p>
        </div>
        <span className="status-chip">
          <CheckCircle aria-hidden="true" size={15} weight="fill" />
          Keyakinan {result.confidenceLabel}
        </span>
      </div>
      <dl className="border-ink/10 mt-7 grid gap-5 border-t pt-6 sm:grid-cols-3">
        <div>
          <dt className="text-ink-muted text-sm">Rentang tengah</dt>
          <dd className="numeric text-ink mt-1 font-semibold">
            {formatRupiah(result.p25UnitPriceIdr)} sampai{" "}
            {formatRupiah(result.p75UnitPriceIdr)}
          </dd>
        </div>
        <div>
          <dt className="text-ink-muted text-sm">Sumber data</dt>
          <dd className="text-ink mt-1 font-semibold">
            {result.reportCount} laporan, {result.independentContributors}{" "}
            warung
          </dd>
        </div>
        <div>
          <dt className="text-ink-muted text-sm">Data terbaru</dt>
          <dd className="text-ink mt-1 font-semibold">
            {formatDate(result.latestObservationAt)}
          </dd>
        </div>
      </dl>
      <p className="text-ink-muted mt-5 text-xs leading-5">
        Versi perhitungan {result.calculationVersion}. Harga merupakan agregat
        komunitas, bukan harga dari warung atau pemasok tertentu.
      </p>
    </section>
  );
}

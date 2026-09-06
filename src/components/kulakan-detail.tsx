"use client";

import { Info } from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { fetchApi } from "@/lib/api-client";
import { formatRupiah } from "@/lib/format";

type Quote = {
  id: string;
  supplierName: string;
  unitPriceIdr: number;
  deliveryFeeIdr: number;
  minimumQuantityPackages: number;
  validUntil: string;
  terms: string;
};

type OpportunityDetail = {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  packagingLabel: string;
  targetQuantityPackages: number;
  targetPriceIdr: number;
  deadline: string;
  status: string;
  organizerName: string;
  province: string;
  city: string;
  district: string;
  committedQuantity: number;
  quotes: Quote[];
};

const opportunityStatusLabels: Record<string, string> = {
  DRAFT: "Draf",
  OPEN: "Terbuka",
  TARGET_REACHED: "Target tercapai",
  QUOTE_REQUESTED: "Penawaran diminta",
  QUOTE_RECEIVED: "Penawaran tersedia",
  ACCEPTED: "Penawaran diterima",
  FULFILLED: "Selesai",
  CANCELLED: "Dibatalkan",
};

export function KulakanDetail({ id }: { id: string }) {
  const [opportunity, setOpportunity] = useState<OpportunityDetail | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [commitQuantity, setCommitQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDetail = (showLoading = false) => {
    if (showLoading) setLoading(true);
    fetchApi<OpportunityDetail>(`/api/buying-opportunities/${id}`)
      .then((data) => {
        setOpportunity(data);
        setError(null);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Gagal memuat detail.");
        setOpportunity(null);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDetail(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!opportunity) return;

    if (commitQuantity <= 0) {
      setError("Kuantitas komitmen harus lebih dari 0.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      await fetchApi(`/api/buying-opportunities/${id}/commitments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantityPackages: commitQuantity }),
      });
      setSuccess("Komitmen berhasil ditambahkan!");
      fetchDetail(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal menyimpan komitmen.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-shell py-14 sm:py-20">
        <div className="border-ink/12 text-ink-muted rounded-3xl border p-8 text-center">
          <h1 className="text-lg">Memuat detail peluang...</h1>
        </div>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="page-shell py-14 sm:py-20">
        <div className="border-danger/30 bg-danger/5 text-ink rounded-3xl border p-6">
          <h1 className="text-xl font-semibold">Terjadi kesalahan</h1>
          <p className="text-ink-muted mt-2 text-sm">
            {error || "Peluang tidak ditemukan"}
          </p>
          <Link
            href="/kulakan-bareng"
            className="secondary-action mt-4 inline-flex"
          >
            Kembali ke daftar
          </Link>
        </div>
      </div>
    );
  }

  const isAcceptingCommitments = [
    "OPEN",
    "TARGET_REACHED",
    "QUOTE_RECEIVED",
  ].includes(opportunity.status);

  return (
    <div className="page-shell py-14 sm:py-20">
      <div className="max-w-3xl">
        <Link
          href="/kulakan-bareng"
          className="text-ink-muted mb-4 inline-block hover:underline"
        >
          &larr; Kembali ke daftar
        </Link>
        <div className="mb-2 flex items-center gap-3">
          <span
            className={`rounded-full px-2 py-1 text-xs font-semibold ${
              opportunity.status === "OPEN"
                ? "bg-[var(--accent)] text-white"
                : opportunity.status === "TARGET_REACHED"
                  ? "bg-amber-500 text-white"
                  : opportunity.status === "QUOTE_RECEIVED"
                    ? "bg-green-600 text-white"
                    : "bg-ink/10 text-ink"
            }`}
          >
            {opportunityStatusLabels[opportunity.status] ?? opportunity.status}
          </span>
          <span className="text-ink-muted text-sm">
            {opportunity.district}, {opportunity.city}
          </span>
        </div>
        <h1 className="text-ink text-3xl font-semibold sm:text-5xl">
          {opportunity.productName}
        </h1>
        <p className="text-ink-muted mt-2 text-lg">
          {opportunity.packagingLabel}
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <section className="border-ink/12 bg-paper rounded-2xl border p-5">
            <h2 className="text-ink mb-4 text-xl font-semibold">
              Progres Kuantitas
            </h2>
            <div className="mb-2 flex items-end justify-between">
              <div>
                <p className="text-ink-muted text-sm">Terkumpul</p>
                <p className="text-ink text-2xl font-bold">
                  {opportunity.committedQuantity}{" "}
                  <span className="text-sm font-normal">
                    dari {opportunity.targetQuantityPackages}{" "}
                    {opportunity.packagingLabel}
                  </span>
                </p>
              </div>
              <p className="text-ink-muted text-sm">
                Tenggat:{" "}
                {new Date(opportunity.deadline).toLocaleDateString("id-ID")}
              </p>
            </div>
            <div className="bg-ink/10 h-3 w-full overflow-hidden rounded-full">
              <div
                className="h-full bg-[var(--accent)] transition-all"
                style={{
                  width: `${Math.min(100, (opportunity.committedQuantity / opportunity.targetQuantityPackages) * 100)}%`,
                }}
              />
            </div>
          </section>

          <section className="border-ink/12 bg-paper rounded-2xl border p-5">
            <h2 className="text-ink mb-4 text-xl font-semibold">
              Harga target dan penawaran
            </h2>

            <div className="mb-6">
              <p className="text-ink-muted text-sm">
                Estimasi Harga Target Awal
              </p>
              <p className="text-ink text-xl font-medium">
                {formatRupiah(opportunity.targetPriceIdr)} /{" "}
                {opportunity.packagingLabel}
              </p>
            </div>

            {opportunity.quotes.length > 0 ? (
              <div>
                <h3 className="text-ink mb-3 font-semibold">
                  Penawaran pemasok tersedia
                </h3>
                <div className="space-y-3">
                  {opportunity.quotes.map((quote) => (
                    <div
                      key={quote.id}
                      className="border-ink/12 bg-paper rounded-xl border p-4"
                    >
                      <div className="flex justify-between">
                        <p className="text-ink font-semibold">
                          {quote.supplierName}
                        </p>
                        <p className="text-ink-muted text-sm">
                          Valid s.d.{" "}
                          {new Date(quote.validUntil).toLocaleDateString(
                            "id-ID",
                          )}
                        </p>
                      </div>
                      <p className="mt-1 text-lg font-bold text-[var(--accent)]">
                        {formatRupiah(quote.unitPriceIdr)} /{" "}
                        {opportunity.packagingLabel}
                      </p>
                      <p className="text-ink-muted mt-1 text-sm">
                        Ongkos kirim:{" "}
                        {quote.deliveryFeeIdr > 0
                          ? formatRupiah(quote.deliveryFeeIdr)
                          : "Gratis"}
                      </p>
                      <p className="text-ink-muted bg-ink/5 mt-2 rounded-md p-2 text-sm">
                        {quote.terms}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-ink-muted bg-ink/5 border-ink/10 rounded-xl border p-4 text-sm">
                Belum ada penawaran resmi dari supplier. Komunitas masih
                mengumpulkan volume target.
              </div>
            )}
          </section>

          <div className="bg-ink/5 border-ink/10 text-ink-muted flex gap-3 rounded-2xl border p-5">
            <Info className="mt-0.5 flex-shrink-0" size={20} weight="fill" />
            <div className="text-sm">
              <p className="text-ink mb-1 font-semibold">
                Penting (Legal Guardrail)
              </p>
              <p>
                Kulakan Bareng menggabungkan kebutuhan pembelian agar warung
                dapat meminta penawaran grosir. Setiap warung tetap bebas
                menentukan harga jual ecerannya, supplier, dan keputusan
                pembeliannya sendiri.
              </p>
            </div>
          </div>
        </div>

        <aside>
          <div className="border-ink/12 bg-paper sticky top-24 rounded-2xl border p-6">
            <h2 className="text-ink mb-4 text-xl font-semibold">
              Ikut Kulakan Bareng
            </h2>
            <p className="text-ink-muted mb-6 text-sm">
              Identitas warung dan hubungan laporan dengan pemasok tidak akan
              ditampilkan secara publik. Komitmen MVP ini tidak mengikat secara
              hukum hingga ketentuan disetujui.
            </p>

            {success ? (
              <div className="mb-4 rounded-xl border border-green-200 bg-green-100 p-3 text-sm text-green-800">
                {success}
              </div>
            ) : null}

            {error && isAcceptingCommitments ? (
              <div className="bg-danger/10 text-danger border-danger/20 mb-4 rounded-xl border p-3 text-sm">
                {error}
              </div>
            ) : null}

            {isAcceptingCommitments ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label
                    htmlFor="quantity"
                    className="text-ink mb-1 block font-medium"
                  >
                    Jumlah komitmen ({opportunity.packagingLabel})
                  </label>
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    required
                    value={commitQuantity}
                    onChange={(e) => setCommitQuantity(Number(e.target.value))}
                    className="border-ink/15 text-ink min-h-12 w-full rounded-xl border bg-white px-4 outline-none focus:border-[var(--accent)]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="primary-action mt-2 justify-center"
                >
                  {isSubmitting ? "Menyimpan..." : "Berikan Komitmen"}
                </button>
              </form>
            ) : (
              <div className="bg-ink/5 text-ink-muted rounded-xl p-4 text-center">
                Peluang ini sudah tidak menerima komitmen pembelian.
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

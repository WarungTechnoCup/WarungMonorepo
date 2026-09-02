"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { fetchApi } from "@/lib/api-client";
import { formatDate, formatRupiah } from "@/lib/format";
import type { ActivityItemDto } from "@/types/harga-wajar";

const statusLabels: Record<ActivityItemDto["status"], string> = {
  pending: "Menunggu pemeriksaan",
  included: "Masuk benchmark",
  flagged: "Perlu ditinjau",
  excluded: "Tidak dihitung",
};

export function ActivityList() {
  const [items, setItems] = useState<ActivityItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await fetchApi<ActivityItemDto[]>("/api/price-reports/mine"));
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Aktivitas tidak dapat dimuat.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(loadItems);
  }, [loadItems]);

  async function withdrawAggregation(item: ActivityItemDto) {
    setWithdrawingId(item.id);
    setError(null);
    try {
      await fetchApi(`/api/price-reports/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "withdraw_aggregation" }),
      });
      await loadItems();
    } catch (withdrawalError) {
      setError(
        withdrawalError instanceof Error
          ? withdrawalError.message
          : "Laporan tidak dapat ditarik dari benchmark.",
      );
    } finally {
      setWithdrawingId(null);
    }
  }

  return (
    <div className="page-shell py-14 sm:py-20">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">Aktivitas Saya</p>
          <h1 className="text-ink mt-4 text-4xl font-semibold tracking-[-0.045em] sm:text-6xl">
            Riwayat kontribusi harga.
          </h1>
        </div>
        <Link className="primary-action justify-center" href="/lapor-harga">
          Lapor harga baru
        </Link>
      </div>

      {loading ? (
        <p className="text-ink-muted mt-10" role="status">
          Memuat aktivitas...
        </p>
      ) : null}
      {error ? (
        <p className="text-danger mt-10" role="alert">
          {error}
        </p>
      ) : null}
      {!loading && !error && items.length === 0 ? (
        <section className="border-ink/12 mt-10 rounded-3xl border p-8">
          <h2 className="text-ink text-xl font-semibold">Belum ada laporan</h2>
          <p className="text-ink-muted mt-3">
            Laporan pertama kamu akan muncul di halaman ini.
          </p>
        </section>
      ) : null}
      <div className="mt-10 space-y-4">
        {items.map((item) => (
          <article
            className="border-ink/12 bg-paper grid gap-5 rounded-2xl border p-5 sm:grid-cols-[1fr_auto] sm:items-center"
            key={item.id}
          >
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-ink font-semibold">{item.productName}</h2>
                <span className="status-chip">{statusLabels[item.status]}</span>
              </div>
              <p className="text-ink-muted mt-2 text-sm">
                {item.reference} · Pembelian {formatDate(item.observedDate)}
              </p>
              {item.statusReason ? (
                <p className="text-ink-muted mt-2 text-xs">
                  Alasan pemeriksaan: {item.statusReason}
                </p>
              ) : null}
            </div>
            <div className="sm:text-right">
              <p className="text-ink text-xl font-semibold">
                {formatRupiah(item.unitPriceIdr)}
              </p>
              <p className="text-ink-muted mt-1 text-xs">per unit dasar</p>
              {item.status === "included" ? (
                <button
                  className="secondary-action mt-4"
                  disabled={withdrawingId === item.id}
                  onClick={() => void withdrawAggregation(item)}
                  type="button"
                >
                  {withdrawingId === item.id
                    ? "Menarik laporan..."
                    : "Tarik dari benchmark"}
                </button>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

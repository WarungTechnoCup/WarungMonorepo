"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  defaultCoarseLocation,
  LocationSelector,
} from "@/components/location-selector";
import { fetchApi } from "@/lib/api-client";
import { formatRupiah } from "@/lib/format";

type Opportunity = {
  id: string;
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
};

export function KulakanList() {
  const [area, setArea] = useState(defaultCoarseLocation);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const parameters = new URLSearchParams(area as unknown as Record<string, string>);
    fetchApi<Opportunity[]>(`/api/buying-opportunities?${parameters}`)
      .then((data) => {
        setOpportunities(data);
        setError(null);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Gagal memuat peluang.");
        setOpportunities([]);
      })
      .finally(() => setLoading(false));
  }, [area]);

  return (
    <div className="page-shell py-14 sm:py-20">
      <div className="max-w-3xl">
        <p className="eyebrow">Kulakan Bareng</p>
        <h1 className="text-ink mt-4 text-4xl font-semibold tracking-[-0.045em] sm:text-6xl">
          Daya beli tumbuh saat warung bergerak bersama.
        </h1>
        <p className="text-ink-muted mt-6 text-lg leading-8">
          Jelajahi peluang kulakan bersama untuk wilayah Anda. Gabungkan volume
          pembelian untuk menawar harga grosir yang lebih baik, tanpa komitmen
          pasti sebelum ada penawaran resmi.
        </p>
      </div>

      <div className="border-ink/12 bg-paper mt-10 max-w-xl rounded-2xl border p-4">
        <h2 className="text-ink mb-3 font-semibold">Pilih Wilayah Kulakan</h2>
        <LocationSelector
          onChange={(newArea) => {
            setLoading(true);
            setArea(newArea);
          }}
          value={area}
        />
      </div>

      <div className="mt-8">
        {loading ? (
          <div
            className="border-ink/12 text-ink-muted rounded-3xl border p-8"
            role="status"
          >
            Memuat peluang pembelian bersama...
          </div>
        ) : error ? (
          <div className="border-danger/30 bg-danger/5 text-ink rounded-3xl border p-6">
            <p className="font-semibold">Terjadi kesalahan</p>
            <p className="text-ink-muted mt-2 text-sm">{error}</p>
          </div>
        ) : opportunities.length === 0 ? (
          <div className="border-ink/12 text-ink-muted rounded-3xl border p-8 text-center">
            Belum ada peluang kulakan bareng yang sedang aktif di{" "}
            {area.district}.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {opportunities.map((opp) => (
              <div
                key={opp.id}
                className="border-ink/12 bg-paper flex flex-col rounded-2xl border p-5 transition hover:border-[var(--accent)]"
              >
                <div className="mb-2 flex items-start justify-between">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      opp.status === "OPEN"
                        ? "bg-[var(--accent)] text-white"
                        : opp.status === "TARGET_REACHED"
                          ? "bg-amber-500 text-white"
                          : "bg-ink/10 text-ink"
                    }`}
                  >
                    {opp.status}
                  </span>
                  <span className="text-ink-muted text-xs">
                    Tenggat:{" "}
                    {new Date(opp.deadline).toLocaleDateString("id-ID")}
                  </span>
                </div>

                <h3 className="text-ink mt-2 text-lg font-bold">
                  {opp.productName}
                </h3>
                <p className="text-ink-muted text-sm">{opp.packagingLabel}</p>

                <div className="my-4 flex-1">
                  <p className="mb-1 text-sm font-medium">
                    Terkumpul: {opp.committedQuantity} /{" "}
                    {opp.targetQuantityPackages} {opp.packagingLabel}
                  </p>
                  <div className="bg-ink/10 h-2 w-full overflow-hidden rounded-full">
                    <div
                      className="h-full bg-[var(--accent)] transition-all"
                      style={{
                        width: `${Math.min(100, (opp.committedQuantity / opp.targetQuantityPackages) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-ink-muted text-xs">
                    Estimasi Target Harga
                  </p>
                  <p className="text-ink font-semibold">
                    {formatRupiah(opp.targetPriceIdr)} / {opp.packagingLabel}
                  </p>
                </div>

                <Link
                  href={`/kulakan-bareng/${opp.id}`}
                  className="primary-action w-full justify-center text-sm"
                >
                  Lihat Detail
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

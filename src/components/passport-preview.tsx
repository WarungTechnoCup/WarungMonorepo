"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { fetchApi } from "@/lib/api-client";
import { formatDate, formatRupiah } from "@/lib/format";
import type { PassportDto } from "@/types/harga-wajar";

type Band = "Terverifikasi" | "Dilaporkan" | "Dihitung" | "Estimasi";

const bandNotes: Record<Band, string> = {
  Terverifikasi: "Didukung bukti struk yang Anda unggah.",
  Dilaporkan: "Anda masukkan sendiri dan belum diverifikasi.",
  Dihitung: "Hasil perhitungan sistem dari laporan yang layak.",
  Estimasi:
    "Perkiraan turunan. Jangan diperlakukan sebagai angka terverifikasi.",
};

export function PassportPreview() {
  const [passport, setPassport] = useState<PassportDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [exportedAt, setExportedAt] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setPassport(await fetchApi<PassportDto>("/api/passport"));
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Passport tidak dapat dimuat.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(load);
  }, [load]);

  async function exportPassport() {
    setExporting(true);
    setError(null);
    try {
      const fresh = await fetchApi<PassportDto>("/api/passport/export", {
        method: "POST",
      });
      setPassport(fresh);
      setExportedAt(fresh.generatedAt);
    } catch (exportError) {
      setError(
        exportError instanceof Error
          ? exportError.message
          : "Ekspor Passport gagal.",
      );
    } finally {
      setExporting(false);
    }
  }

  if (loading) {
    return (
      <p className="text-ink-muted mt-10" role="status">
        Menyiapkan Passport...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-danger mt-10" role="alert">
        {error}
      </p>
    );
  }

  if (!passport) return null;

  const bands: { band: Band; rows: { label: string; value: string }[] }[] = [
    {
      band: "Terverifikasi",
      rows: [
        {
          label: "Laporan dengan bukti struk",
          value: `${passport.verified.receiptBackedReports}`,
        },
      ],
    },
    {
      band: "Dilaporkan",
      rows: [
        { label: "Total laporan", value: `${passport.reported.totalReports}` },
        {
          label: "Produk berbeda",
          value: `${passport.reported.distinctProducts}`,
        },
        {
          label: "Jenis pemasok",
          value: `${passport.reported.supplierTypes}`,
        },
      ],
    },
    {
      band: "Dihitung",
      rows: [
        {
          label: "Laporan masuk benchmark",
          value: `${passport.calculated.benchmarkEligibleReports}`,
        },
        {
          label: "Wilayah yang dibantu",
          value: `${passport.calculated.areasContributed}`,
        },
      ],
    },
    {
      band: "Estimasi",
      rows: [
        {
          label: "Nilai pembelian tercatat",
          value: formatRupiah(passport.estimated.landedTotalIdr),
        },
        {
          label: "Kelengkapan isian",
          value: `${passport.estimated.completenessPercent}%`,
        },
      ],
    },
  ];

  return (
    <div className="mt-10">
      <div className="border-danger/40 bg-paper-strong rounded-2xl border-l-4 p-6">
        <p className="text-ink text-sm leading-6 font-semibold">
          Warung Passport membantu merapikan bukti aktivitas usaha. Ini bukan
          credit score dan tidak menentukan persetujuan pinjaman.
        </p>
      </div>

      {!passport.hasProfile ? (
        <section className="border-ink/12 mt-8 rounded-3xl border p-8">
          <h2 className="text-ink text-xl font-semibold">Belum ada aktivitas</h2>
          <p className="text-ink-muted mt-3 text-sm leading-6">
            Passport terisi setelah Anda mengirim laporan harga pertama.
          </p>
          <Link className="text-link mt-4" href="/lapor-harga">
            Lapor harga pertama
          </Link>
        </section>
      ) : (
        <>
          <dl className="border-ink/10 mt-8 grid gap-4 border-y py-5 sm:grid-cols-3">
            <div>
              <dt className="text-ink-muted text-xs">Wilayah</dt>
              <dd className="text-ink mt-1 text-sm font-semibold">
                {passport.area
                  ? `${passport.area.district}, ${passport.area.city}`
                  : "-"}
              </dd>
            </div>
            <div>
              <dt className="text-ink-muted text-xs">Aktif sejak</dt>
              <dd className="text-ink mt-1 text-sm font-semibold">
                {passport.activeSince ? formatDate(passport.activeSince) : "-"}
              </dd>
            </div>
            <div>
              <dt className="text-ink-muted text-xs">Kontribusi terakhir</dt>
              <dd className="text-ink mt-1 text-sm font-semibold">
                {passport.lastContributionAt
                  ? formatDate(passport.lastContributionAt)
                  : "-"}
              </dd>
            </div>
          </dl>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {bands.map((group) => (
              <section
                className="border-ink/12 bg-paper-strong rounded-2xl border p-6"
                key={group.band}
              >
                <h2 className="text-ink text-lg font-semibold">{group.band}</h2>
                <p className="text-ink-muted mt-1 text-xs leading-5">
                  {bandNotes[group.band]}
                </p>
                <dl className="divide-ink/10 mt-4 divide-y">
                  {group.rows.map((row) => (
                    <div
                      className="flex items-baseline justify-between gap-4 py-2"
                      key={row.label}
                    >
                      <dt className="text-ink-muted text-sm">{row.label}</dt>
                      <dd className="text-ink text-sm font-semibold">
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
          </div>
        </>
      )}

      <section className="mt-12">
        <h2 className="text-ink text-xl font-semibold tracking-tight">
          Persetujuan yang berlaku
        </h2>
        <ul className="divide-ink/10 border-ink/10 mt-4 divide-y border-y">
          {passport.consents.map((consent) => (
            <li
              className="flex flex-wrap items-center gap-3 py-3"
              key={consent.purpose}
            >
              <span className="status-chip">
                {consent.granted ? "Aktif" : "Tidak aktif"}
              </span>
              <span className="text-ink text-sm font-semibold">
                {consent.purpose}
              </span>
              <span className="text-ink-muted text-sm">
                {consent.description}
              </span>
            </li>
          ))}
        </ul>
        <Link className="text-link mt-4" href="/privasi">
          Kelola atau tarik persetujuan
        </Link>
      </section>

      <section className="border-ink/12 bg-paper-strong mt-12 rounded-2xl border p-6">
        <h2 className="text-ink text-xl font-semibold tracking-tight">
          Ekspor dan berbagi
        </h2>
        <p className="text-ink-muted mt-3 text-sm leading-6">
          Ekspor menyalin catatan Anda sendiri dan tercatat pada audit log.
          Berbagi Passport ke pihak ketiga lewat tautan berbatas waktu belum
          tersedia; sampai fitur itu ada beserta persetujuan terpisahnya, tidak
          ada data Passport yang dapat dibuka oleh orang lain.
        </p>
        <button
          className="secondary-action mt-4"
          disabled={exporting}
          onClick={() => void exportPassport()}
          type="button"
        >
          {exporting ? "Menyiapkan..." : "Ekspor catatan saya"}
        </button>
        {exportedAt ? (
          <p className="text-ink-muted mt-3 text-xs" role="status">
            Ekspor terakhir {formatDate(exportedAt)}. Versi normalisasi{" "}
            {passport.methodology.normalizationVersion}, versi benchmark{" "}
            {passport.methodology.benchmarkVersion}.
          </p>
        ) : null}
      </section>
    </div>
  );
}

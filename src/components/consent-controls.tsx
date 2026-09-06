"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { ApiClientError, fetchApi } from "@/lib/api-client";
import { formatDate } from "@/lib/format";
import type { ConsentPurpose, ConsentStateDto } from "@/types/harga-wajar";

const purposeLabels: Record<ConsentPurpose, string> = {
  anonymous_aggregation: "Agregasi anonim",
  receipt_storage: "Penyimpanan struk",
};

export function ConsentControls() {
  const [items, setItems] = useState<ConsentStateDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [needsSignIn, setNeedsSignIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<ConsentPurpose | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await fetchApi<ConsentStateDto[]>("/api/consents"));
      setNeedsSignIn(false);
    } catch (loadError) {
      if (
        loadError instanceof ApiClientError &&
        loadError.code === "AUTHENTICATION_REQUIRED"
      ) {
        setNeedsSignIn(true);
      } else {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Persetujuan tidak dapat dimuat.",
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(load);
  }, [load]);

  async function toggle(item: ConsentStateDto) {
    setPending(item.purpose);
    setError(null);
    try {
      const next = item.granted
        ? await fetchApi<ConsentStateDto[]>(
            `/api/consents?purpose=${item.purpose}`,
            { method: "DELETE" },
          )
        : await fetchApi<ConsentStateDto[]>("/api/consents", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ purpose: item.purpose }),
          });
      setItems(next);
    } catch (toggleError) {
      setError(
        toggleError instanceof Error
          ? toggleError.message
          : "Persetujuan tidak dapat diperbarui.",
      );
    } finally {
      setPending(null);
    }
  }

  if (loading) {
    return (
      <p className="text-ink-muted mt-6 text-sm" role="status">
        Memuat status persetujuan...
      </p>
    );
  }

  if (needsSignIn) {
    return (
      <div className="border-ink/12 bg-paper-strong mt-6 rounded-2xl border p-6">
        <p className="text-ink-muted text-sm leading-6">
          Masuk untuk melihat dan menarik persetujuan yang tercatat pada akun
          Anda.
        </p>
        <Link className="text-link mt-4" href="/masuk">
          Masuk ke akun
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-6">
      {error ? (
        <p className="text-danger mb-4 text-sm" role="alert">
          {error}
        </p>
      ) : null}

      <ul className="grid gap-5 lg:grid-cols-2">
        {items.map((item) => (
          <li
            className="border-ink/12 bg-paper-strong rounded-2xl border p-6"
            key={item.purpose}
          >
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-ink text-lg font-semibold">
                {purposeLabels[item.purpose]}
              </h3>
              <span className="status-chip">
                {item.granted ? "Aktif" : "Tidak aktif"}
              </span>
            </div>
            <p className="text-ink-muted mt-2 text-sm leading-6">
              {item.description}
            </p>
            <p className="text-ink-muted mt-2 text-xs">
              Versi kebijakan {item.policyVersion}
              {item.granted && item.grantedAt
                ? ` \u00b7 diberikan ${formatDate(item.grantedAt)}`
                : null}
              {!item.granted && item.withdrawnAt
                ? ` \u00b7 ditarik ${formatDate(item.withdrawnAt)}`
                : null}
            </p>
            <button
              className="secondary-action mt-4"
              disabled={pending === item.purpose}
              onClick={() => void toggle(item)}
              type="button"
            >
              {pending === item.purpose
                ? "Menyimpan..."
                : item.granted
                  ? "Tarik persetujuan"
                  : "Berikan persetujuan"}
            </button>
          </li>
        ))}
      </ul>

      <p className="text-ink-muted mt-5 text-sm leading-6">
        Menarik persetujuan agregasi juga mengeluarkan laporan Anda yang sudah
        masuk dari perhitungan benchmark, bukan hanya laporan berikutnya.
      </p>
    </div>
  );
}

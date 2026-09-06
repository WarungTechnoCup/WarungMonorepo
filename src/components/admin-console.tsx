"use client";

import { useCallback, useEffect, useState } from "react";

import { ApiClientError, fetchApi } from "@/lib/api-client";
import { formatDate, formatRupiah } from "@/lib/format";
import type {
  AdminAuditEventDto,
  ModerationQueueItemDto,
} from "@/types/harga-wajar";

interface HealthPayload {
  services: { demoMode: boolean; administration: boolean };
}

const decisions = [
  { status: "included", label: "Masukkan", reasonCode: "moderator_approved" },
  { status: "excluded", label: "Keluarkan", reasonCode: "moderator_rejected" },
  { status: "flagged", label: "Tandai", reasonCode: "moderator_flagged" },
] as const;

export function AdminConsole() {
  const [queue, setQueue] = useState<ModerationQueueItemDto[]>([]);
  const [events, setEvents] = useState<AdminAuditEventDto[]>([]);
  const [demoMode, setDemoMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const health = await fetchApi<HealthPayload>("/api/health");
      setDemoMode(health.services.demoMode);

      const [reports, auditEvents] = await Promise.all([
        fetchApi<ModerationQueueItemDto[]>("/api/admin/reports"),
        fetchApi<AdminAuditEventDto[]>("/api/admin/audit-events?limit=50"),
      ]);
      setQueue(reports);
      setEvents(auditEvents);
      setForbidden(false);
    } catch (loadError) {
      if (
        loadError instanceof ApiClientError &&
        loadError.code === "FORBIDDEN"
      ) {
        setForbidden(true);
      } else {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Konsol admin tidak dapat dimuat.",
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(load);
  }, [load]);

  async function run(key: string, action: () => Promise<string>) {
    setBusy(key);
    setError(null);
    setNotice(null);
    try {
      setNotice(await action());
      await load();
    } catch (actionError) {
      setError(
        actionError instanceof Error
          ? actionError.message
          : "Tindakan gagal dijalankan.",
      );
    } finally {
      setBusy(null);
    }
  }

  if (loading) {
    return (
      <p className="text-ink-muted mt-10" role="status">
        Memuat konsol admin...
      </p>
    );
  }

  if (forbidden) {
    return (
      <section className="border-ink/12 mt-10 rounded-3xl border p-8">
        <h2 className="text-ink text-xl font-semibold">Akses ditolak</h2>
        <p className="text-ink-muted mt-3 text-sm leading-6">
          Akun Anda sudah masuk tetapi tidak terdaftar sebagai administrator.
          Tambahkan alamat surel akun ke ADMIN_EMAILS untuk membuka konsol ini.
        </p>
      </section>
    );
  }

  return (
    <div className="mt-10">
      {error ? (
        <p className="text-danger mb-4 text-sm" role="alert">
          {error}
        </p>
      ) : null}
      {notice ? (
        <p className="text-ink mb-4 text-sm font-semibold" role="status">
          {notice}
        </p>
      ) : null}

      <section className="border-ink/12 bg-paper-strong rounded-2xl border p-6">
        <h2 className="text-ink text-xl font-semibold tracking-tight">
          Pemeliharaan sistem
        </h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            className="secondary-action"
            disabled={busy === "recompute"}
            onClick={() =>
              void run("recompute", async () => {
                const result = await fetchApi<{ scopes: number }>(
                  "/api/admin/benchmarks/recompute",
                  { method: "POST" },
                );
                return `Benchmark dihitung ulang untuk ${result.scopes} cakupan.`;
              })
            }
            type="button"
          >
            {busy === "recompute"
              ? "Menghitung ulang..."
              : "Hitung ulang benchmark"}
          </button>

          {demoMode ? (
            <button
              className="secondary-action"
              disabled={busy === "demo"}
              onClick={() =>
                void run("demo", async () => {
                  const result = await fetchApi<{ removedReports: number }>(
                    "/api/admin/demo/reset",
                    { method: "POST" },
                  );
                  return `${result.removedReports} laporan contoh dihapus.`;
                })
              }
              type="button"
            >
              {busy === "demo" ? "Mereset..." : "Reset data contoh"}
            </button>
          ) : (
            <p className="text-ink-muted self-center text-sm">
              Reset data contoh tersembunyi karena DEMO_MODE tidak aktif.
            </p>
          )}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-ink text-xl font-semibold tracking-tight">
          Moderasi laporan
        </h2>
        <p className="text-ink-muted mt-2 text-sm leading-6">
          Menampilkan laporan berstatus menunggu atau ditandai. Setiap keputusan
          dicatat pada audit log dengan alasannya.
        </p>

        {queue.length === 0 ? (
          <div className="border-ink/12 mt-6 rounded-3xl border p-8">
            <h3 className="text-ink text-lg font-semibold">Antrean kosong</h3>
            <p className="text-ink-muted mt-3 text-sm">
              Tidak ada laporan yang menunggu pemeriksaan.
            </p>
          </div>
        ) : null}

        <div className="mt-6 space-y-4">
          {queue.map((item) => (
            <article
              className="border-ink/12 bg-paper rounded-2xl border p-5"
              key={item.id}
            >
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-ink font-semibold">{item.productName}</h3>
                <span className="status-chip">{item.status}</span>
                {item.isDemo ? (
                  <span className="status-chip">Data contoh</span>
                ) : null}
              </div>
              <p className="text-ink-muted mt-2 text-sm">
                {item.unitPriceIdr === null
                  ? "Belum dinormalisasi"
                  : `${formatRupiah(item.unitPriceIdr)} per unit dasar`}
                {item.district ? ` · ${item.district}, ${item.city}` : ""}
              </p>
              <p className="text-ink-muted mt-1 text-xs">
                Pembelian {formatDate(item.observedDate)}
                {item.statusReason ? ` · ${item.statusReason}` : ""}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {decisions.map((decision) => (
                  <button
                    className="secondary-action"
                    disabled={busy === `${item.id}:${decision.status}`}
                    key={decision.status}
                    onClick={() =>
                      void run(`${item.id}:${decision.status}`, async () => {
                        await fetchApi(`/api/admin/reports/${item.id}`, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            status: decision.status,
                            reasonCode: decision.reasonCode,
                          }),
                        });
                        return `Laporan diperbarui menjadi ${decision.status}.`;
                      })
                    }
                    type="button"
                  >
                    {decision.label}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-ink text-xl font-semibold tracking-tight">
          Audit log
        </h2>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="text-ink-muted">
              <tr>
                <th className="py-2 pr-4 font-semibold">Waktu</th>
                <th className="py-2 pr-4 font-semibold">Peristiwa</th>
                <th className="py-2 pr-4 font-semibold">Entitas</th>
                <th className="py-2 font-semibold">Alasan</th>
              </tr>
            </thead>
            <tbody className="divide-ink/10 divide-y">
              {events.map((event) => (
                <tr key={event.id}>
                  <td className="text-ink-muted py-2 pr-4">
                    {formatDate(event.createdAt)}
                  </td>
                  <td className="text-ink py-2 pr-4 font-medium">
                    {event.eventType}
                  </td>
                  <td className="text-ink-muted py-2 pr-4">
                    {event.entityType}
                  </td>
                  <td className="text-ink-muted py-2">
                    {event.reasonCode ?? "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {events.length === 0 ? (
          <p className="text-ink-muted mt-4 text-sm">Belum ada peristiwa.</p>
        ) : null}
      </section>
    </div>
  );
}

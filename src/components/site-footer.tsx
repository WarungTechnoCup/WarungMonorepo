import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-ink/10 border-t">
      <div className="page-shell text-ink-muted flex flex-col gap-5 py-8 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p>Warung Cek Harga untuk ITECHNO CUP 2026.</p>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Link
            className="hover:text-ink min-h-11 content-center"
            href="/privasi"
          >
            Privasi
          </Link>
          <Link
            className="hover:text-ink min-h-11 content-center"
            href="/api/health"
          >
            Status layanan
          </Link>
          <Link
            className="hover:text-ink min-h-11 content-center"
            href="/offline"
          >
            Mode offline
          </Link>
        </div>
      </div>
    </footer>
  );
}

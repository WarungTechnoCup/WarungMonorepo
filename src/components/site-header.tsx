import { Storefront } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

const navigation = [
  { href: "/cek-harga", label: "Cek harga" },
  { href: "/kulakan-bareng", label: "Kulakan bareng" },
  { href: "/cara-kerja", label: "Cara kerja" },
];

export function SiteHeader() {
  return (
    <header className="border-ink/10 bg-paper/90 sticky top-0 z-50 border-b backdrop-blur-xl">
      <div className="page-shell flex min-h-20 items-center justify-between gap-4">
        <Link
          className="text-ink flex min-h-11 items-center gap-3 font-semibold tracking-tight"
          href="/"
        >
          <span className="bg-accent grid size-10 place-items-center rounded-xl text-white">
            <Storefront aria-hidden="true" size={22} weight="bold" />
          </span>
          <span>Warung Cek Harga</span>
        </Link>

        <nav
          aria-label="Navigasi utama"
          className="hidden items-center gap-7 md:flex"
        >
          {navigation.map((item) => (
            <Link
              className="text-ink-muted hover:text-ink flex min-h-11 items-center text-sm font-semibold"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link className="secondary-action" href="/masuk">
            Masuk
          </Link>
          <Link
            className="primary-action hidden md:inline-flex"
            href="/lapor-harga"
          >
            Lapor harga
          </Link>
        </div>
      </div>
    </header>
  );
}

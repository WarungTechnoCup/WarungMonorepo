import { ArrowLeft, Wrench } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

interface ScaffoldPageProps {
  eyebrow: string;
  title: string;
  description: string;
  plannedItems: string[];
  privacyNote?: string;
}

export function ScaffoldPage({
  eyebrow,
  title,
  description,
  plannedItems,
  privacyNote,
}: ScaffoldPageProps) {
  return (
    <section className="page-shell py-14 sm:py-20">
      <div className="max-w-4xl">
        <span className="status-chip">
          <Wrench aria-hidden="true" size={14} weight="bold" />
          Scaffold
        </span>
        <p className="eyebrow mt-8">{eyebrow}</p>
        <h1 className="text-ink mt-4 max-w-3xl text-4xl leading-tight font-semibold tracking-[-0.045em] text-balance sm:text-6xl">
          {title}
        </h1>
        <p className="text-ink-muted mt-6 max-w-2xl text-lg leading-8">
          {description}
        </p>
      </div>

      <div className="border-ink/12 mt-12 grid gap-8 border-t pt-8 lg:grid-cols-[0.7fr_1.3fr]">
        <div>
          <p className="text-ink text-sm font-semibold">Status milestone</p>
          <p className="text-ink-muted mt-2 text-sm leading-6">
            Struktur rute tersedia. Perilaku produk dan penyimpanan data belum
            diimplementasikan.
          </p>
        </div>
        <div>
          <h2 className="text-ink text-xl font-semibold tracking-tight">
            Cakupan yang direncanakan
          </h2>
          <ol className="divide-ink/10 border-ink/10 mt-5 divide-y border-y">
            {plannedItems.map((item, index) => (
              <li className="flex gap-5 py-5" key={item}>
                <span className="text-accent font-mono text-sm">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-ink-muted text-sm leading-6">{item}</span>
              </li>
            ))}
          </ol>
          {privacyNote ? (
            <p className="border-accent text-ink-muted mt-5 border-l-2 pl-4 text-sm leading-6">
              {privacyNote}
            </p>
          ) : null}
        </div>
      </div>

      <Link className="text-link mt-10" href="/">
        <ArrowLeft aria-hidden="true" size={18} weight="bold" />
        Kembali ke beranda
      </Link>
    </section>
  );
}

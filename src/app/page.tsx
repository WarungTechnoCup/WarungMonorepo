import {
  ArrowRight,
  CheckCircle,
  MagnifyingGlass,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

const principles = [
  "Harga acuan dari kontribusi independen",
  "Privasi warung dan bukti transaksi dijaga",
  "Aksi bersama setelah informasi cukup",
];

export default function Home() {
  return (
    <>
      <section className="border-ink/10 border-b">
        <div className="page-shell grid min-h-[calc(100svh-5rem)] items-center gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div className="max-w-3xl">
            <p className="eyebrow">Fondasi produk, milestone scaffold</p>
            <h1 className="text-ink mt-5 text-5xl leading-[0.98] font-semibold tracking-[-0.055em] text-balance sm:text-6xl lg:text-7xl">
              Tahu harga wajar sebelum warung belanja.
            </h1>
            <p className="text-ink-muted mt-7 max-w-2xl text-lg leading-8 sm:text-xl">
              Warung Cek Harga dirancang sebagai intelijen pengadaan yang
              mengubah kontribusi harga terverifikasi menjadi acuan aman dan
              peluang kulakan bersama.
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link className="primary-action" href="/cek-harga">
                <MagnifyingGlass aria-hidden="true" size={20} weight="bold" />
                Lihat scaffold cek harga
              </Link>
              <Link className="text-link" href="/cara-kerja">
                Pelajari metodologi
                <ArrowRight aria-hidden="true" size={18} weight="bold" />
              </Link>
            </div>
            <ul className="text-ink-muted mt-10 grid gap-3 text-sm sm:grid-cols-3">
              {principles.map((principle) => (
                <li className="flex items-start gap-2" key={principle}>
                  <CheckCircle
                    aria-hidden="true"
                    className="text-accent mt-0.5 shrink-0"
                    size={18}
                    weight="fill"
                  />
                  {principle}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative mx-auto w-full max-w-lg lg:justify-self-end">
            <div className="bg-accent/8 absolute -inset-4 -z-10 [transform:rotate(-2deg)] rounded-[2rem]" />
            <div className="border-ink/12 bg-paper overflow-hidden rounded-[1.75rem] border shadow-[0_24px_80px_rgba(36,39,31,0.12)]">
              <div className="border-ink/10 flex items-center justify-between border-b px-6 py-5">
                <div>
                  <p className="text-ink-muted text-xs font-semibold tracking-[0.14em] uppercase">
                    Contoh status benchmark
                  </p>
                  <p className="text-ink mt-1 font-semibold">
                    Minyak goreng 1 L
                  </p>
                </div>
                <span className="status-chip">Scaffold</span>
              </div>
              <div className="space-y-7 px-6 py-7">
                <div>
                  <div className="mb-3 flex items-center justify-between text-sm">
                    <span className="text-ink-muted">
                      Kontributor independen
                    </span>
                    <span className="text-ink font-semibold">
                      Belum cukup data
                    </span>
                  </div>
                  <div
                    aria-label="Data belum mencapai ambang lima kontributor"
                    className="bg-ink/8 h-3 overflow-hidden rounded-full"
                  >
                    <div className="bg-accent h-full w-2/5 rounded-full" />
                  </div>
                  <p className="text-ink-muted mt-3 text-sm leading-6">
                    Harga acuan belum ditampilkan sebelum lima kontributor
                    independen memenuhi pemeriksaan kepercayaan.
                  </p>
                </div>
                <div className="border-ink/10 grid grid-cols-2 gap-3 border-t pt-6">
                  <div className="metric-block">
                    <UsersThree
                      aria-hidden="true"
                      className="text-accent"
                      size={24}
                    />
                    <span>Progress, bukan angka semu</span>
                  </div>
                  <div className="metric-block">
                    <CheckCircle
                      aria-hidden="true"
                      className="text-accent"
                      size={24}
                    />
                    <span>Bukti diverifikasi nanti</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell py-20">
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="eyebrow">Ruang lingkup produk</p>
            <h2 className="text-ink mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              Informasi yang berujung pada tindakan.
            </h2>
          </div>
          <div className="border-ink/10 bg-ink/10 grid gap-px overflow-hidden rounded-3xl border sm:grid-cols-3">
            {[
              [
                "01",
                "Harga Wajar",
                "MVP",
                "Benchmark komunitas dengan ambang privasi.",
              ],
              [
                "02",
                "Kontribusi terverifikasi",
                "MVP",
                "Pelaporan harga dengan bukti dan kontrol kepercayaan.",
              ],
              [
                "03",
                "Kulakan Bareng",
                "MVP",
                "Koordinasi komitmen pembelian tanpa mencampur kutipan pemasok.",
              ],
            ].map(([number, title, status, description]) => (
              <article className="bg-paper min-h-64 p-6" key={number}>
                <div className="flex items-center justify-between">
                  <span className="text-ink-muted font-mono text-sm">
                    {number}
                  </span>
                  <span className="status-chip">{status}</span>
                </div>
                <h3 className="text-ink mt-12 text-xl font-semibold tracking-tight">
                  {title}
                </h3>
                <p className="text-ink-muted mt-3 text-sm leading-6">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

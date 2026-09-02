<div align="center">
  <h1>Warung Cek Harga</h1>
  <p>Intelijen pengadaan komunitas untuk warung Indonesia</p>
  <p>
    <a href="https://github.com/WarungTechnoCup/WarungMonorepo"><img src="https://img.shields.io/badge/GitHub-Repository-181717?logo=github" alt="GitHub Repository" /></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="MIT License" /></a>
    <img src="https://img.shields.io/badge/Deployment-Pending-lightgrey" alt="Deployment pending" />
  </p>
  <p><strong>Submission for ITECHNO CUP 2026 - Web Development</strong></p>
  <p><strong>Tim: Belum ditetapkan</strong></p>
</div>

## Daftar Isi

- [Tim Pengembang](#tim-pengembang)
- [Tentang Proyek](#tentang-proyek)
- [Fitur Unggulan](#fitur-unggulan)
- [Demo dan Screenshot](#demo-dan-screenshot)
- [Teknologi](#teknologi)
- [Arsitektur Sistem](#arsitektur-sistem)
- [Instalasi dan Setup](#instalasi-dan-setup)
- [Penggunaan](#penggunaan)
- [Dokumentasi API](#dokumentasi-api)
- [Testing](#testing)
- [Lisensi](#lisensi)

## Tim Pengembang

| Nama      | Peran                                               | GitHub           |
| --------- | --------------------------------------------------- | ---------------- |
| Anggota 1 | Discover: pencarian, benchmark, dan metodologi      | Belum ditetapkan |
| Anggota 2 | Contribute: autentikasi, pelaporan, dan kepercayaan | Belum ditetapkan |
| Anggota 3 | Act: Kulakan Bareng, integrasi, dan kesiapan demo   | Belum ditetapkan |

Nama dan akun GitHub akan diisi setelah anggota tim dikonfirmasi. Pembagian kerja lengkap tersedia di [docs/team-workflow.md](docs/team-workflow.md).

## Tentang Proyek

### Latar Belakang

Warung dan pengecer mikro membutuhkan acuan harga kulakan yang mudah dipahami tanpa membuka identitas, alamat, atau bukti transaksi mereka. Perbedaan informasi harga membuat keputusan stok dan pembelian bersama lebih sulit dilakukan.

### Solusi

Warung Cek Harga dirancang sebagai produk intelijen pengadaan komunitas. MVP akan menggabungkan Harga Wajar, kontribusi harga yang diverifikasi, dan Kulakan Bareng. Harga Wajar hanya akan ditampilkan setelah sedikitnya lima kontributor independen agar satu laporan tidak membentuk patokan publik. Produk ini mendukung SDG 8 sebagai fokus utama dan SDG 9 sebagai fokus pendukung.

Milestone saat ini adalah vertical slice Harga Wajar. Struktur aplikasi dan batas akses telah berkembang menjadi katalog, benchmark berambang privasi, autentikasi, normalisasi, kontribusi harga, dan aktivitas pribadi. Migrasi dan data demo tersedia, tetapi masih harus diterapkan dan diverifikasi pada project Supabase pengembangan. Kulakan Bareng belum diimplementasikan. Lihat [docs/progress.md](docs/progress.md) untuk status terkini.

### Tujuan

- Mengurangi kesenjangan informasi harga bagi pemilik warung.
- Memberikan acuan harga yang netral, berbasis kontribusi komunitas, dan menjaga privasi.
- Membantu pengguna beralih dari mengetahui harga ke tindakan pembelian bersama yang terukur.

## Fitur Unggulan

| Fitur                          | Tujuan                                                           | Status saat ini                                                     |
| ------------------------------ | ---------------------------------------------------------------- | ------------------------------------------------------------------- |
| Harga Wajar                    | Menampilkan benchmark harga setelah ambang kontributor terpenuhi | Diimplementasikan, menunggu verifikasi database pengembangan        |
| Kontribusi harga terverifikasi | Mengumpulkan laporan harga dengan perlindungan privasi           | Normalisasi dan laporan tersedia; unggah struk masih dinonaktifkan  |
| Kulakan Bareng                 | Membantu pembelian bersama berdasarkan minat dan komitmen        | Scaffold, domain belum diimplementasikan                            |
| Warung Passport                | Pratinjau terbatas untuk data sensitif dan bukti kepercayaan     | Route terlindungi tersedia, perilaku produk belum diimplementasikan |
| Batas akses aman               | Memisahkan route publik, terlindungi, dan admin                  | Diimplementasikan pada tingkat scaffold                             |

Route yang belum memiliki perilaku produk ditandai sebagai scaffolded. Tombol pada route tersebut tidak menyatakan bahwa proses backend telah berjalan.

## Demo dan Screenshot

### Live Demo

Belum tersedia. Hosting Vercel akan dikonfigurasi setelah aplikasi memiliki fitur produk dan lingkungan Supabase pengembangan.

### Screenshot

Belum tersedia. Screenshot desktop dan mobile akan ditambahkan setelah UI produk selesai. Statusnya dicatat di [docs/progress.md](docs/progress.md).

### Video Demo

Belum tersedia. Video akan dibuat untuk presentasi final setelah alur Harga Wajar, kontribusi harga, dan Kulakan Bareng dapat didemonstrasikan.

## Teknologi

### Frontend

| Teknologi             | Fungsi                                      |
| --------------------- | ------------------------------------------- |
| Next.js 16 App Router | Kerangka aplikasi web dan route server      |
| React 19              | Komponen antarmuka                          |
| TypeScript            | Kontrak tipe dan keamanan saat pengembangan |
| Tailwind CSS 4        | Sistem gaya mobile-first                    |

### Backend dan Data

| Teknologi           | Fungsi                                                  |
| ------------------- | ------------------------------------------------------- |
| Node.js 24          | Runtime pengembangan dan produksi                       |
| Supabase PostgreSQL | Database aplikasi yang akan digunakan                   |
| Supabase Auth       | Adapter autentikasi email dan kata sandi yang disiapkan |
| Supabase Storage    | Adapter penyimpanan bukti yang disiapkan                |
| Drizzle ORM         | Definisi schema dan migrasi SQL yang dapat ditinjau     |
| Zod                 | Validasi pada batas write saat endpoint bisnis dibuat   |

### DevOps dan Quality Gate

| Teknologi           | Fungsi                                               |
| ------------------- | ---------------------------------------------------- |
| pnpm 11             | Package manager dan lockfile reproducible            |
| Vitest              | Pengujian unit dan kontrak                           |
| Playwright          | Pengujian alur route pada desktop dan viewport 360px |
| ESLint dan Prettier | Konsistensi kode                                     |
| GitHub Actions      | Continuous integration untuk quality gate dan E2E    |
| Vercel              | Target deployment yang direncanakan                  |

### Alasan Pemilihan Teknologi

| Keputusan             | Alasan                                                                                |
| --------------------- | ------------------------------------------------------------------------------------- |
| Next.js App Router    | Mendukung route publik dan terlindungi dengan batas server yang jelas                 |
| Supabase dan Drizzle  | Menyediakan PostgreSQL, autentikasi, penyimpanan, dan migrasi yang dapat ditinjau tim |
| Tailwind CSS          | Memudahkan antarmuka konsisten dengan baseline mobile 360px                           |
| Vitest dan Playwright | Menguji logika serta pengalaman pengguna lintas viewport                              |

### Dependensi Utama

```json
{
  "next": "16.3.4",
  "react": "19.2.8",
  "@supabase/ssr": "^0.12.5",
  "drizzle-orm": "^0.44.5",
  "zod": "^4.1.11"
}
```

Versi lengkap tersedia di [package.json](package.json) dan dikunci dalam [pnpm-lock.yaml](pnpm-lock.yaml).

## Arsitektur Sistem

### Diagram Arsitektur

```text
Pengguna
  |
  v
Next.js App Router
  |-- Route publik dan API health
  |-- proxy.ts untuk refresh sesi dan batas route terlindungi
  |
  v
Adapter Supabase
  |-- Auth
  |-- PostgreSQL
  |-- Storage
  |
  v
Drizzle schema dan migrasi SQL
```

Adapter dan kontrak lingkungan tersedia, tetapi belum ada project Supabase, tabel domain, atau migrasi domain yang diterapkan. Detail keputusan arsitektur tersedia di [docs/architecture.md](docs/architecture.md).

### Database Schema

Schema domain dan migrasi pertama mencakup warung, katalog, laporan harga, hasil normalisasi, benchmark, consent, metadata struk, dan audit. RLS aktif pada seluruh tabel domain, dan constraint database mencegah publikasi median di bawah lima warung independen. Detail tersedia di [docs/architecture.md](docs/architecture.md) dan [docs/privacy.md](docs/privacy.md).

### Struktur Folder

```text
src/
  app/              # Routes App Router dan API
  components/       # Komponen antarmuka bersama
  db/               # Entry point Drizzle
  lib/              # Env, Supabase, dan utilitas bersama
  test/             # Kontrak dan helper pengujian
  types/            # Tipe API bersama
tests/              # Pengujian unit dan kontrak
e2e/                # Pengujian Playwright
docs/               # Dokumen kompetisi, arsitektur, dan workflow tim
docs/decisions/     # Architecture Decision Records
docs/source/        # Salinan spesifikasi Markdown
drizzle/            # Direktori migrasi SQL
scripts/            # Script pengembangan
.github/            # Konfigurasi CI
```

## Instalasi dan Setup

### Prerequisites

- Node.js 24
- pnpm 11
- Git

### Clone Repository

```bash
git clone https://github.com/WarungTechnoCup/WarungMonorepo.git
cd WarungMonorepo
```

### Install Dependencies

```bash
pnpm install --frozen-lockfile
```

### Environment Configuration

```bash
cp .env.example .env.local
```

Isi `.env.local` sesuai kebutuhan lingkungan. Jangan pernah memasukkan nilai rahasia ke Git.

| Variabel                               | Kegunaan                                        |
| -------------------------------------- | ----------------------------------------------- |
| `NEXT_PUBLIC_APP_URL`                  | URL aplikasi                                    |
| `NEXT_PUBLIC_SUPABASE_URL`             | URL project Supabase                            |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key Supabase untuk browser          |
| `DATABASE_URL`                         | Connection string transaction pooler PostgreSQL |
| `SUPABASE_STORAGE_BUCKET`              | Nama bucket penyimpanan                         |
| `DEMO_MODE`                            | Penanda mode demo                               |

Konfigurasi Supabase belum diperlukan untuk menampilkan route publik. Route terlindungi akan gagal secara aman dengan pesan konfigurasi yang dapat ditindaklanjuti ketika variabel wajib belum tersedia.

### Database Setup

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

Perintah database menjalankan migrasi dan seed sintetis Harga Wajar. Jalankan hanya pada project Supabase pengembangan yang telah ditinjau.

### Run Locally

```bash
pnpm dev
```

Buka [http://localhost:3000](http://localhost:3000). Untuk build produksi, gunakan `pnpm build` lalu `pnpm start`.

## Penggunaan

### Pengguna Umum

Route publik Harga Wajar:

- `/`
- `/cek-harga`
- `/produk/[slug]`
- `/kulakan-bareng`
- `/kulakan-bareng/[id]`
- `/cara-kerja`
- `/privasi`
- `/masuk`

`/cek-harga` dan `/produk/[slug]` membaca katalog serta benchmark dari API dan database. Route Kulakan Bareng tetap menampilkan status scaffold yang jujur.

### Pengguna Terautentikasi

Route berikut memiliki batas akses fail-closed dan perilaku Harga Wajar:

- `/lapor-harga`
- `/lapor-harga/sukses`
- `/aktivitas`
- `/passport`

### Admin

`/admin` disediakan sebagai route shell. Otorisasi admin dan operasi admin belum diimplementasikan.

## Dokumentasi API

Endpoint yang tersedia meliputi health, katalog, benchmark, pratinjau normalisasi, pengiriman laporan idempotent, dan aktivitas pemilik.

```bash
curl http://localhost:3000/api/health
```

Contoh respons lokal tanpa konfigurasi layanan:

```json
{
  "data": {
    "status": "ok",
    "version": "0.1.0",
    "services": {
      "database": false,
      "supabase": false,
      "storage": false
    }
  }
}
```

Kontrak API menggunakan `ApiSuccess<T>` untuk respons sukses dan `ApiFailure` untuk respons gagal. Benchmark `insufficient` tidak membawa statistik harga, sedangkan benchmark `available` hanya membawa agregat yang diizinkan.

## Testing

```bash
pnpm test
pnpm test:coverage
pnpm test:e2e
pnpm check
```

`pnpm check` menjalankan Prettier, ESLint, TypeScript, Vitest, dan production build. Playwright memeriksa seluruh route shell pada viewport desktop dan mobile 360px.

## Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).

## Dokumentasi Lanjutan

- [AGENTS.md](AGENTS.md): aturan kontribusi untuk coding agent dan engineering handbook ringkas.
- [CONTRIBUTING.md](CONTRIBUTING.md): alur clone sampai pull request untuk kontributor manusia.
- [docs/competition-requirements.md](docs/competition-requirements.md): tracker persyaratan submission dan penilaian ITECHNO CUP 2026.
- [docs/architecture.md](docs/architecture.md): batas arsitektur, akses, dan data.
- [docs/methodology.md](docs/methodology.md): metodologi Harga Wajar yang direncanakan.
- [docs/privacy.md](docs/privacy.md): aturan privasi dan data sensitif.
- [docs/ai-usage.md](docs/ai-usage.md): catatan penggunaan AI dan review manusia.
- [docs/demo-script.md](docs/demo-script.md): kerangka demonstrasi dan presentasi.
- [docs/progress.md](docs/progress.md): status implementasi dan pekerjaan berikutnya.

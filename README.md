# Warung Cek Harga

Warung Cek Harga adalah fondasi intelijen pengadaan untuk membantu pemilik warung memahami harga wajar, menyumbangkan bukti harga secara aman, dan membentuk daya beli melalui Kulakan Bareng. Proyek ini mengangkat SDG 8 sebagai fokus utama dan SDG 9 sebagai pendukung.

Status saat ini adalah **scaffold**. Rute, kontrak lingkungan, adapter, quality gates, dan dokumentasi tim sudah tersedia. Autentikasi, database domain, benchmark, kontribusi harga, pembelian bersama, Passport, dan deployment belum diimplementasikan.

## Pembeda utama

- **Harga Wajar:** benchmark komunitas yang baru tampil setelah sedikitnya lima kontributor independen.
- **Kontribusi terverifikasi:** fondasi untuk bukti transaksi, normalisasi, dan sinyal kepercayaan tanpa membuka identitas warung.
- **Kulakan Bareng:** jalur dari informasi harga menuju koordinasi daya beli, dengan kutipan pemasok tetap terpisah dari benchmark komunitas.
- **Passport:** preview terbatas untuk ringkasan kontribusi yang membutuhkan persetujuan dan perlindungan tambahan.

## Teknologi dan tujuannya

| Teknologi                        | Tujuan                                                      |
| -------------------------------- | ----------------------------------------------------------- |
| Next.js 16, React 19, TypeScript | Antarmuka App Router, rendering server, dan kontrak tipe    |
| Tailwind CSS 4                   | Sistem visual mobile-first dengan komponen milik proyek     |
| Supabase                         | PostgreSQL, autentikasi berbasis cookie, dan Storage privat |
| Drizzle ORM                      | Schema bertipe dan migrasi SQL yang dapat ditinjau          |
| Vitest dan Playwright            | Pengujian unit, kontrak, akses, dan alur pengguna           |

## Menjalankan lokal

Prasyarat: Node.js 24 dan pnpm 11.19.0.

```bash
pnpm install --frozen-lockfile
copy .env.example .env.local
pnpm dev
```

Buka `http://localhost:3000`. Aplikasi publik dapat dibangun tanpa kredensial Supabase. Rute terlindungi akan dialihkan ke halaman masuk dengan pesan konfigurasi sampai Supabase tersedia.

```bash
pnpm check
pnpm test:e2e
```

## Penggunaan scaffold

1. Buka beranda untuk melihat tesis produk dan status MVP.
2. Buka `/cek-harga`, `/produk/minyak-goreng-1-l`, atau `/kulakan-bareng` untuk memeriksa shell publik.
3. Buka `/api/health` untuk melihat versi dan status konfigurasi layanan tanpa secret.
4. Ikuti [CONTRIBUTING.md](CONTRIBUTING.md) sebelum mengerjakan slice fitur.

## Dokumentasi

- [Persyaratan kompetisi](docs/competition-requirements.md)
- [Arsitektur](docs/architecture.md)
- [Workflow tiga anggota](docs/team-workflow.md)
- [Schema dan migrasi](docs/architecture.md#data-dan-migrasi)
- [Lingkungan dan adapter](docs/architecture.md#kontrak-lingkungan)
- [Kontrak API](docs/architecture.md#kontrak-api)
- [Pengujian](CONTRIBUTING.md#pemeriksaan-wajib)
- [Privasi](docs/privacy.md)
- [Metodologi](docs/methodology.md)
- [Penggunaan AI](docs/ai-usage.md)
- [Demo dan deployment](docs/demo-script.md)
- [Progress](docs/progress.md)
- [Lisensi MIT](LICENSE)

Screenshot dan URL deployment akan ditambahkan setelah UI produk dan lingkungan hosting tersedia. Instruksi submission ada pada [tracker kompetisi](docs/competition-requirements.md#checklist-submission).

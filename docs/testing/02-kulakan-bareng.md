j# Panduan Pengetesan: Kulakan Bareng (Group Buying)

Dokumen ini menjelaskan alur pengujian fitur **Kulakan Bareng**, sebuah sistem agregasi permintaan berbasis komunitas untuk menegosiasikan harga yang lebih baik.

## 1. Persiapan Data (Seeding)

Fitur ini membutuhkan kumpulan _seed data_ untuk mendemonstrasikan _progress bar_ dan interaksi _supplier_.

1. Pastikan Anda sudah menjalankan migrasi skema `drizzle` dan _Push_ database.
2. Jalankan perintah _seeding_ untuk menyuntikkan data _mock_ (50 target, sudah terisi 37 komitmen):
   ```bash
   pnpm run db:seed
   ```
3. Pastikan _Development Server_ berjalan (`pnpm run dev`).

## 2. Pengujian Tampilan (UI) dan Pencarian

1. Buka browser dan kunjungi `http://localhost:3000/kulakan-bareng`.
2. Halaman _List_ akan terbuka.
3. Anda bisa mencoba mengubah pilihan **Provinsi / Kota / Kecamatan** di _Location Selector_.
4. **Ekspektasi Validasi:**
   - Karena _mock data_ di-_seed_ di area "DKI Jakarta", "Jakarta Barat", "Kebon Jeruk", Anda harus melihat minimal **satu peluang (_opportunity_)** aktif (Indomie Goreng 85g).
   - _Card_ menunjukkan _progress_ kuantitas "37 dari 50 karton".
   - Status tertera sebagai "QUOTE_RECEIVED".

## 3. Pengujian Detail & Komitmen Pembelian

1. Klik tombol **Lihat Detail** pada salah satu _Card_ di daftar peluang tersebut.
2. Halaman `/kulakan-bareng/[id]` akan ditampilkan.
3. **Ekspektasi Validasi Visual:**
   - Anda akan melihat harga estimasi (_target price_).
   - Terdapat **Penawaran Supplier Terkumpul** di layar (contoh: "Distributor Sinar Utama" dengan keterangan masa valid dan aturan ongkos kirim).
   - Informasi "Legal Guardrail" terlihat di layar.

## 4. Validasi Interaksi Komitmen

1. Untuk menguji input, **Anda wajib _login_ terlebih dahulu** (gunakan akun demo, atau _sign in_ di halaman `/masuk`).
2. Setelah _login_, buka kembali halaman Detail Peluang Kulakan tersebut.
3. Pada form di bagian kanan/bawah (tergantung ukuran layar), ketik angka komitmen (misalnya: `15`).
4. Klik **Berikan Komitmen**.
5. **Ekspektasi Validasi Database:**
   - Angka "Terkumpul" (Progress) segera berubah/bertambah, dari `37` menjadi `52`.
   - Sebuah _Toast/Pesan Sukses_ muncul.
   - Status _Peluang Pembelian_ akan langsung berubah menjadi **TARGET_REACHED** (jika sebelumnya _OPEN_ dan kuantitas barunya sudah memenuhi _target_quantity_packages_).
6. Untuk membuktikan keamanan, _Log Out_ dari akun Anda dan buka ulang halaman yang sama. Form pengisian tidak akan memperbolehkan _submit_ bagi pengguna publik.

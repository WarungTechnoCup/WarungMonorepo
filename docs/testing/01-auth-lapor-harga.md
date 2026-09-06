# Panduan Pengetesan: Autentikasi & Upload Struk (Lapor Harga)

Dokumen ini berisi panduan tahap demi tahap untuk menguji alur autentikasi (_login_ pengguna) dan _upload_ struk pembelian _(receipts)_ ke Supabase Storage, yang merupakan salah satu fungsionalitas inti pada MVP tahap pertama.

## 1. Persiapan Lingkungan (Prasyarat)

Pastikan layanan Supabase lokal sedang berjalan. Jika Anda menggunakan proyek _remote_ Supabase, pastikan _Environment Variables_ di `.env.local` sudah merujuk ke URL dan Key yang benar.

1. _Push schema_ database terbaru jika belum:
   ```bash
   pnpm run db:migrate
   ```
2. Anda bisa menjalankan _seeding_ untuk membuat _user demo_:
   ```bash
   pnpm run db:create-demo-user
   ```

## 2. Pengujian Login (Autentikasi)

1. Jalankan _server development_ Next.js:
   ```bash
   pnpm run dev
   ```
2. Buka browser dan arahkan ke rute `http://localhost:3000/masuk`.
3. Gunakan kredensial _Demo User_ yang dihasilkan dari langkah _seeding_ sebelumnya (biasanya email `demo@warungcekharga.id` dan password demo).
4. **Ekspektasi Validasi:**
   - Halaman akan _redirect_ ke _Beranda_ atau halaman profil setelah login sukses.
   - Sesi _cookie_ Supabase SSR terbentuk dengan benar.

## 3. Pengujian Lapor Harga & Upload Struk

1. Dalam keadaan sudah _login_, akses rute `/lapor-harga`.
2. Isi langkah pertama (memilih produk), langkah kedua (data pembelian dan harga), dan klik lanjut.
3. Pada halaman **Bukti dan Privasi**, pilih unggah sebuah gambar (bisa menggunakan gambar apa saja berformat `.png`, `.jpg`, atau `.webp` di bawah 5MB).
4. Selesaikan _submit_ form Lapor Harga.
5. **Ekspektasi Validasi UI:**
   - Pengguna diarahkan ke halaman sukses.
   - Halaman menunjukkan nomor referensi pelaporan.

## 4. Validasi Keamanan Storage & Database

1. Buka _dashboard_ Supabase (lokal Studio di `http://localhost:54323` atau Studio _remote_).
2. Periksa tabel `price_reports` dan pastikan data baris baru Anda masuk dengan kolom `receipt_object_id` terisi valid.
3. Buka menu **Storage**, lalu periksa _bucket_ `receipts`.
4. Gambar yang Anda unggah harus ada di sana.
5. **Uji RLS (Cross-User Security):**
   - _Copy_ URL berkas gambar tersebut dan coba buka di _Tab Incognito_ (sebagai _Anonymous User_).
   - **Ekspektasi:** Gambar _tidak_ bisa diakses karena kebijakan _Row-Level Security_ (RLS) mensyaratkan `owner_auth_user_id = auth.uid()`.

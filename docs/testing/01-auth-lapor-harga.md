# Panduan Pengetesan: Autentikasi & Upload Struk (Lapor Harga)

Dokumen ini berisi panduan tahap demi tahap untuk menguji alur autentikasi (*login* pengguna) dan *upload* struk pembelian *(receipts)* ke Supabase Storage, yang merupakan salah satu fungsionalitas inti pada MVP tahap pertama.

## 1. Persiapan Lingkungan (Prasyarat)

Pastikan layanan Supabase lokal sedang berjalan. Jika Anda menggunakan proyek *remote* Supabase, pastikan *Environment Variables* di `.env.local` sudah merujuk ke URL dan Key yang benar.

1. _Push schema_ database terbaru jika belum:
   ```bash
   pnpm run db:migrate
   ```
2. Anda bisa menjalankan _seeding_ untuk membuat *user demo*:
   ```bash
   pnpm run db:create-demo-user
   ```

## 2. Pengujian Login (Autentikasi)

1. Jalankan *server development* Next.js:
   ```bash
   pnpm run dev
   ```
2. Buka browser dan arahkan ke rute `http://localhost:3000/masuk`.
3. Gunakan kredensial *Demo User* yang dihasilkan dari langkah _seeding_ sebelumnya (biasanya email `demo@warungcekharga.id` dan password demo).
4. **Ekspektasi Validasi:**
   - Halaman akan *redirect* ke *Beranda* atau halaman profil setelah login sukses.
   - Sesi _cookie_ Supabase SSR terbentuk dengan benar.

## 3. Pengujian Lapor Harga & Upload Struk

1. Dalam keadaan sudah *login*, akses rute `/lapor-harga`.
2. Isi langkah pertama (memilih produk), langkah kedua (data pembelian dan harga), dan klik lanjut.
3. Pada halaman **Bukti dan Privasi**, pilih unggah sebuah gambar (bisa menggunakan gambar apa saja berformat `.png`, `.jpg`, atau `.webp` di bawah 5MB).
4. Selesaikan *submit* form Lapor Harga.
5. **Ekspektasi Validasi UI:**
   - Pengguna diarahkan ke halaman sukses.
   - Halaman menunjukkan nomor referensi pelaporan.

## 4. Validasi Keamanan Storage & Database

1. Buka *dashboard* Supabase (lokal Studio di `http://localhost:54323` atau Studio *remote*).
2. Periksa tabel `price_reports` dan pastikan data baris baru Anda masuk dengan kolom `receipt_object_id` terisi valid.
3. Buka menu **Storage**, lalu periksa *bucket* `receipts`.
4. Gambar yang Anda unggah harus ada di sana.
5. **Uji RLS (Cross-User Security):**
   - *Copy* URL berkas gambar tersebut dan coba buka di *Tab Incognito* (sebagai *Anonymous User*). 
   - **Ekspektasi:** Gambar *tidak* bisa diakses karena kebijakan _Row-Level Security_ (RLS) mensyaratkan `owner_auth_user_id = auth.uid()`.

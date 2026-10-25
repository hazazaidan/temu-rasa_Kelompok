# Temu Rasa — Aplikasi Web Pemesanan Makanan & Minuman

Aplikasi web interaktif hasil transformasi desain Figma Modul 5 (Vinix Batch 5 • Modul 7), dikembangkan lanjut di **Modul 8: Data Dinamis & Logika Aplikasi**.
Brand: **Temu Rasa**, *Banyak Rasa, Satu Cerita.*

- **Link Live Web:** https://temu-rasa.vercel.app *(atau tautan hasil deploy Vercel kamu)*
- **Repositori GitHub:** https://github.com/hazazaidan/temu-rasa
- **Branch Pengerjaan:** `feat/dynamic-data`
- **Figma Modul 5:** https://www.figma.com/design/Om6FVmdMwpw1t748WB4gJv/Temu-Rasa-%E2%80%93-Wireframe-15-Frame?node-id=0-1&t=Kj8bIMMkOpVFH1u2-1
- **PRD (PDF):** `PRD_Temu_Rasa.pdf`

---

## Tim — Kelompok 34

| Nama | Kontribusi |
|---|---|
| Noviardha Fitri Yuldhari | Penyusunan PRD, pengujian fungsional & skenario usability |
| Haza Zaidan Zidna Fann | Setup repo & Git, arsitektur data dinamis, integrasi autentikasi & logika aplikasi |
| Agung Maulana Triatmojo | Halaman Home, Navbar, Galeri Suasana, Footer |
| Bagus Faaza Azhar Amin | Halaman Menu, Filter Kategori, Detail Produk, FoodCard |
| Wildan Nair Nadzhir | Keranjang, Checkout, Kupon Diskon, Riwayat Pesanan & Live Tracker |

---

## Teknologi

- **Frontend Core:** React 18, Vite 5, Tailwind CSS 3, React Router DOM 6.
- **Ikonografi & Notifikasi:** Lucide React, `react-hot-toast` (Pop-up toast interaktif).
- **State Management & Autentikasi:** Context API (`CartContext`, `AuthContext`), Structured `localStorage`.
- **Styling:** Ornamen latar nusantara, Ambient glow mesh, Glassmorphism card, Sheen photo reflection.
- **AI Tool:** Claude (Anthropic) & Antigravity AI.

---

## Checklist Kesesuaian Modul 8 (100% Terpenuhi)

| Target Modul 8 | Implementasi di Temu Rasa | Status |
|---|---|:---:|
| **Target 1: Data Dinamis & Filter** | Daftar 17 menu nusantara dimuat via `fetch('/menu.json')` di `useProducts.js` dan dirender dengan `.map()`. Dilengkapi pencarian kata kunci real-time, filter kategori, chip Pedas/Vegetarian, pengurutan harga/rating, dan toggle tampilan Kartu/Daftar. | ✅ 100% |
| **Target 2: Form & Validasi Input** | 4 formulir aktif: **Checkout**, **Reservasi Meja**, **Tulis Ulasan**, dan **Login/Registrasi**. Semua divalidasi ketat (cek format nomor HP Indonesia, email, spasi `.trim()`, panjang karakter), error inline di bawah kolom, tombol terkunci loading saat kirim. | ✅ 100% |
| **Target 3: UX States (Skeleton, Empty, Error, Toast)** | Animasi loading skeleton saat fetch data, Empty State informatif dengan tombol Reset pencarian, Error State dengan tombol "Coba lagi", serta notifikasi Toast (`react-hot-toast`) menggantikan `alert()`. | ✅ 100% |
| **Fitur Autentikasi & Login Gate** | Pengunjung wajib login sebelum bisa memasukkan menu ke keranjang atau checkout. Tersedia modal Login/Daftar dengan tombol **⚡ Masuk Cepat Akun Demo (1-Klik)** dan simulasi Google. | ✅ 100% |
| **Fitur Nilai Tambah (Kupon & Tracker)** | Kupon Diskon otomatis (`TEMURASA20`, `DISKON10`, `GRATISONGKIR`), Live Order Tracker 4 tahapan (*Diterima ➔ Dimasak ➔ Diantar ➔ Selesai*), Cetak Struk Digital (PDF), dan Kirim Pesanan via WhatsApp. | ✅ 100% |

---

## Arsitektur Data & Penyimpanan (Database)

Aplikasi ini menggunakan perpaduan **Data Dinamis (Read)** dan **Structured LocalStorage / REST API (Write)** sesuai panduan Modul 8 (Slide 3 & 4):

1. **Katalog Menu & Produk (Read)**:
   - Disimpan di `public/menu.json` berisi 17 menu otentik nusantara lengkap dengan foto asli, deskripsi, harga, dan rating.
   - Dimuat secara dinamis melalui hook `src/hooks/useProducts.js` menggunakan `fetch()` dengan pembatalan request (`AbortController`), loading skeleton, dan error boundary.
   - *Opsional:* Sumber data dapat dialihkan ke API luar (seperti MockAPI / Supabase) via variabel `VITE_API_URL`.

2. **Penyimpanan Transaksi & Akun (Write)**:
   - **Autentikasi Akun**: `localStorage` (`temurasa_user`) via `AuthContext.jsx`.
   - **Keranjang Belanja**: `localStorage` (`temurasa-cart`) via `CartContext.jsx`.
   - **Riwayat Pesanan**: `localStorage` (`temurasa-orders`) + opsi `VITE_ORDER_URL` (bisa disambung ke MockAPI POST / Formspree).
   - **Reservasi Meja**: `localStorage` (`temurasa-reservations`) + opsi `VITE_RESERVATION_URL`.
   - **Ulasan Pelanggan**: `localStorage` (`temurasa-reviews`) + opsi `VITE_REVIEW_URL`.

### Keamanan Variabel Lingkungan (`.env`)
- Seluruh endpoint API eksternal bersifat opsional dan dikonfigurasi melalui `.env.local`.
- Template tersedia di `.env.example`. File `.env.local` sudah terlindungi di `.gitignore` sehingga rahasia API tidak akan terunggah ke repositori publik GitHub.

---

## Panduan Pengujian untuk Mentor / Evaluator

Buka web yang sudah dideploy (atau jalankan di lokal), lalu uji fitur-fitur berikut:

1. **Penguncian Login (Login Gate)**:
   - Pastikan dalam kondisi belum login (ada tombol *"Masuk"* di kanan atas).
   - Coba klik tombol **+** di kartu makanan manapun di Beranda atau Menu.
   - Sistem akan mengunci pesanan dan memunculkan pop-up modal login dengan notifikasi *"Silakan masuk akun terlebih dahulu untuk memesan menu"*.
   - Klik tombol **"⚡ Masuk Cepat Akun Demo (1-Klik)"** untuk langsung login sebagai *Budi Santoso*.
2. **Katalog & Filter Menu Dinamis (`/menu`)**:
   - Ketik `kopi` di kolom pencarian, menu langsung tersaring real-time.
   - Ketik kata acak seperti `xyz`, muncul **Empty State** *"Menu tidak ditemukan"* disertai tombol **Reset Pencarian**.
   - Coba filter kategori (*Makanan*, *Minuman*, *Camilan*) dan filter chip (*Pedas*, *Vegetarian*).
   - Ganti tampilan antara mode **Kartu** dan **Daftar**.
3. **Uji Loading & Error State**:
   - Buka DevTools (F12) ➔ tab Network ➔ centang *"Slow 3G"*, refresh halaman untuk melihat **Loading Skeleton**.
   - Klik kanan pada `menu.json` ➔ pilih *"Block request URL"*, refresh halaman untuk melihat tampilan **Error State** *"Ups, ada masalah"* dan tombol **Coba lagi**.
4. **Checkout & Kupon Promo (`/checkout`)**:
   - Tambahkan menu ke keranjang, klik *"Lanjut ke Checkout"*.
   - Masukkan kode kupon promo:
     - `TEMURASA20` ➔ Potongan diskon 20%.
     - `GRATISONGKIR` ➔ Gratis biaya ongkir.
   - Coba kosongkan salah satu kolom input saat klik *"Lanjut"* untuk melihat pesan validasi error per kolom.
   - Klik *"Konfirmasi & Buat Pesanan"*. Tombol berubah menjadi loading *"Memproses Pesanan..."*.
5. **Konfirmasi WhatsApp & Cetak Struk Digital**:
   - Setelah pesanan berhasil, klik **"Cetak Struk Digital"** untuk melihat nota resmi Temu Rasa yang siap cetak / simpan ke PDF.
   - Klik **"Konfirmasi ke WhatsApp"** untuk membuka WhatsApp dengan draft pesanan yang tersusun rapi.
6. **Live Order Tracker (`/pesanan`)**:
   - Masuk ke menu **Pesanan**, klik *"Lacak Status"* pada pesanan yang baru dibuat.
   - Lihat progress bar 4 tahapan (*Pesanan Diterima ➔ Dapur Menyiapkan ➔ Kurir Menuju Alamat ➔ Selesai*).
   - Klik tombol **"⚡ Simulasi Status"** untuk melihat animasi status pesanan bergerak maju secara langsung!

---

## Menjalankan di Komputer Lokal

```bash
# 1. Clone repositori
git clone https://github.com/hazazaidan/temu-rasa.git
cd temu-rasa

# 2. Pastikan berada di branch feat/dynamic-data
git checkout feat/dynamic-data

# 3. Pasang dependensi
npm install

# 4. Jalankan server pengembang
npm run dev

# 5. Build untuk produksi
npm run build
```

---

## Alur Git & Branching

- Pekerjaan Modul 8 dikerjakan di branch terpisah: `feat/dynamic-data`.
- Menggunakan konvensi commit terstruktur: `feat:`, `refactor:`, `style:`, `docs:`, `fix:`.
- Penggabungan ke branch `main` dilakukan melalui Pull Request (PR) setelah seluruh pengujian lolos.

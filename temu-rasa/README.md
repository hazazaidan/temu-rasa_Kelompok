# Temu Rasa — Aplikasi Web Pemesanan Makanan & Minuman

Prototipe web interaktif hasil transformasi desain Figma Modul 5 (Vinix Batch 5 • Modul 7).
Brand: **Temu Rasa** — *Banyak Rasa, Satu Cerita.*

- **Repositori:** https://github.com/hazazaidan/temu-rasa
- **Figma Modul 5:** https://www.figma.com/design/Om6FVmdMwpw1t748WB4gJv/Temu-Rasa-%E2%80%93-Wireframe-15-Frame?node-id=0-1&t=Kj8bIMMkOpVFH1u2-1
- **PRD (PDF):** `PRD_Temu_Rasa.pdf`

## Tim — Kelompok 34

| Nama | Kontribusi |
|---|---|
| Noviardha Fitri Yuldhari | Penyusunan PRD, pengujian fungsional |
| Haza Zaidan Zidna Fann | Setup repo & Git, struktur proyek, integrasi AI prompt-to-code |
| Agung Maulana Triatmojo | Halaman Home, Navbar, Footer |
| Bagus Faaza Azhar Amin | Halaman Menu, Detail Produk, FoodCard |
| Wildan Nair Nadzhir | Keranjang, Checkout, Riwayat Pesanan, Admin |

> Sesuaikan tabel di atas dengan kontribusi sebenarnya sebelum dikumpulkan.

## Teknologi

React 18 + Vite 5, Tailwind CSS 3, React Router DOM 6, Lucide React, Context API.
AI tool: Claude (Anthropic).

## Menjalankan di Lokal

```bash
git clone https://github.com/hazazaidan/temu-rasa.git
cd temu-rasa
npm install
npm run dev      # buka http://localhost:5173
npm run build    # build produksi
```

Butuh Node.js 18 atau lebih baru.

## Fitur

- Navbar dengan pencarian, badge keranjang, tombol Masuk, dan drawer hamburger di mobile
- Beranda: hero, menu favorit, banner "Tempat Favorit Buat Nongkrong"
- Menu: tab kategori (Semua/Makanan/Minuman/Camilan), pencarian, pengurutan, empty state
- Detail produk: varian, jumlah, komposisi, rekomendasi serupa
- Keranjang (drawer): tambah/kurang/hapus item, subtotal otomatis
- Checkout 3 langkah (Alamat, Pembayaran, Konfirmasi) dengan validasi form
- Riwayat pesanan dengan filter status; pesanan baru masuk otomatis
- Dashboard admin (statistik, grafik 7 hari, pesanan terbaru, menu terlaris)

### Interaksi stateful (rubrik minimal 2)
1. Drawer navigasi mobile
2. Tab kategori + pencarian + sort pada Menu
3. Keranjang dengan qty dan total dinamis
4. Stepper checkout dengan validasi
5. Filter status pesanan

## Struktur Folder

```
src/
├── components/  Navbar, Footer, FoodCard, CartModal, Button
├── context/     CartContext (state keranjang & pesanan)
├── data/        products.js (data dummy)
├── pages/       Home, Menu, ProductDetail, Checkout, OrderHistory, AdminDashboard
├── App.jsx      Routing & layout
└── main.jsx     Entry point
```

## Log Prompt AI

**Prompt 1 — Pemilihan framework:** meminta rekomendasi framework (Next.js, Vite/React, Vue, Astro) berdasarkan rubrik. Hasil: Vite + React + Tailwind.

**Prompt 2 — Generasi aplikasi:**
> Buat aplikasi web pemesanan makanan dan minuman "Temu Rasa" dengan React + Vite, Tailwind CSS v3, Lucide React, React Router v6, dan Context API untuk keranjang. Ikuti wireframe Figma Modul 4/5 (Homepage, Katalog, Detail, Keranjang, Checkout 3 langkah, Riwayat Pesanan, Admin). Token visual: krem #FDFBF7, navy #0F3870, kuning #F5B21B; font Fraunces italic untuk logo/judul dan Plus Jakarta Sans untuk teks. Wajib ada minimal 2 interaksi stateful. Responsif mobile sampai desktop. Pisahkan components/, pages/, context/, data/. Sertakan empty state.

## Catatan Perbaikan Manual

| No | Masalah | Perbaikan |
|---|---|---|
| 1 | Foto makanan belum tersedia | Placeholder emoji; ganti lewat field `image` di `products.js` |
| 2 | Banner "Menu Favorit Paling Banyak Dipesan" dan dekorasi tulisan tangan belum ada | Ditambahkan pada tahap poles |
| 3 | Halaman Login, Daftar, Lokasi, Lacak Pesanan belum dibuat | Rencana pengembangan |

> Tambahkan temuan bug dan perbaikan nyata dari hasil pengujian tim di tabel ini.

## Pengembangan Selanjutnya
Halaman Login/Daftar, Lokasi, Lacak Pesanan, foto produk asli, dan penyimpanan data ke backend.

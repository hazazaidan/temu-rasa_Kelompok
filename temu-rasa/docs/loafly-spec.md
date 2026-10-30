# Spesifikasi Riset Loafly & Audit Komparasi Temu Rasa

Dokumen ini berisi hasil riset mendalam terhadap template Framer **Loafly** (`https://loafly.framer.website/`) pada resolusi desktop (1440px) dan mobile (390px), serta perbandingannya secara mendetail (*section-by-section*) dengan **Temu Rasa** (`https://temu-rasakelompok-temu-rasa.vercel.app/`).

Semua aset screenshot tangkapan layar tersimpan di folder `docs/loafly/`.

---

## 1. Analisis Desain Loafly (Desktop & Mobile)

### 1.1 Layout & Grid System
- **Lebar Maksimal Container:** 1280px – 1360px dengan padding horizontal responsif:
  - Desktop (1440px): `px-8` hingga `px-12` (32px–48px), konten bernapas lega (*breathing room* luas).
  - Tablet (768px): `px-6` (24px).
  - Mobile (390px): `px-4` (16px), tanpa ada elemen yang memicu *horizontal scrollbar*.
- **Vertical Rhythm / Spacing Antar Section:**
  - Desktop: `py-24` hingga `py-32` (96px–128px) untuk section utama; transisi antar bagian tidak terasa padat/berdesakan.
  - Mobile: `py-14` hingga `py-20` (56px–80px).
- **Struktur Kolom:**
  - Hero: Asimetris 2 kolom (Desktop: teks 55%, visual arch 45%; Mobile: stack vertikal dengan visual utama di bawah headline).
  - Kategori / Menu: Kartu berorientasi horizontal/vertikal fleksibel dengan dukungan *snap slider* di layar sempit.
  - Testimonial: 3 kolom di desktop dengan kartu tengah/aktif sedikit lebih menonjol, menjadi single-card *draggable/swipeable slider* di mobile.
  - Bento/Galeri: Grid masonry/bento tidak seragam dengan rasio aspek terkunci (*aspect-ratio* presisi) dan padding rounded besar (28px–40px).

### 1.2 Tipografi
- **Headline Display (Lilita One / Display Serif):**
  - Ukuran Hero (Desktop): `120px - 136px`, `lineHeight: 100-110px`, `letterSpacing: -0.04em`.
  - Section Headings (H2): `48px - 64px`, `lineHeight: 1.05 - 1.15`, `letterSpacing: -0.03em`.
  - Subheading / Script: `22px - 28px` italic / hand-drawn touch.
- **Body & Tagline:**
  - Body Text: `16px - 18px`, `lineHeight: 1.5 - 1.6`, warna kontras lembut (bukan hitam murni `#000`, melainkan warm dark brown / deep navy).
  - Label / Badge: `11px - 13px`, font tebal (`font-bold` / `font-extrabold`), `tracking-wider` (0.05em–0.15em), uppercase.

### 1.3 Palet Warna & Transisi
- **Background Utama:** Warm Cream / Buttercrumb (`#FFF6D9` / `#FAF6EF` / `#FDFBF7`).
- **Dark Accent Zone:** Deep Cocoa / Espresso (`#150702` / `#2C201B`), ekuivalen dengan Deep Navy Temu Rasa (`#0F3870`).
- **Brand Accent:** Warm Amber / Gold / Orange (`#FF9B04` / `#FECB7D`), ekuivalen dengan Sun/Amber Temu Rasa (`#F5B21B` / `#FFB800`).
- **Wave Dividers (Pemisah Bergelombang):**
  - Menggunakan kurva SVG organik yang menyatu secara mulus antara section berlatar terang dan berlatar gelap.
  - Warna kurva selalu cocok persis (*pixel-perfect match*) dengan background section berikutnya, menghilangkan garis patahan tajam.

### 1.4 Sistem Gerak & Animasi (*Motion Feel*)
- **Karakteristik Fisika:**
  - Bukan *bouncy* norak atau pegas berlebihan.
  - Easing standar: `cubic-bezier(0.22, 1, 0.36, 1)` (efek *decelerating natural drop-in* khas Framer).
  - Durasi terkalibrasi:
    - *Micro-interactions* (hover tombol, ikon): 180ms – 250ms.
    - *Card elevation & zoom*: 300ms – 400ms.
    - *Scroll Reveal*: 650ms – 800ms dengan stagger 70ms – 90ms.
- **Scroll Reveal Types:**
  - Masked Line Slide: Teks besar muncul dari balik garis *overflow:hidden* (naik 24px–40px).
  - Soft Zoom-In / Clip-Path Arch: Foto muncul dengan ekspansi clip-path halus.
  - Staggered Cards: Grup kartu masuk bergantian dari bawah ke atas.
- **Background Ambiance:**
  - Gerakan sangat lambat (20s–40s cycle time) sehingga terasa hidup namun mata pengguna tetap fokus pada konten bacaan.

### 1.5 Komponen Interaktif Kunci
1. **Sticky Floating Navbar:**
   - Awalnya transparan/menyatu dengan latar.
   - Saat scroll > 20px, mengecil (*scale down padding*), memunculkan background kaca halus (`backdrop-blur-md bg-cream/90` atau `bg-white/90`), border tipis, dan bayangan lembut.
   - Indikator menu aktif berpindah dengan transisi posisi halus.
2. **Infinite Marquee Teks:**
   - Loop mulus tanpa patahan di sambungan teks.
   - Ujung kiri dan kanan dilapisi *fade gradient mask* (`mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent)`).
   - Melambat secara elegan saat kursor diarahkan (*hover pause/slowdown*).
3. **Interactive Testimonial Slider:**
   - Memiliki panah navigasi kiri/kanan, indikator dot, serta mendukung *touch swipe* dan *mouse drag*.
   - Kartu yang sedang aktif berada di tengah dengan skala sedikit lebih besar (1.02x) dan kontras 100%, sementara kartu di sisi kiri/kanan sedikit meredup (opacity 0.7).
4. **Category / Menu Horizontal Slider (Mobile):**
   - Pada layar sempit, daftar panjang kartu otomatis bertransformasi menjadi *horizontal snap slider* yang nyaman diakses jempol tanpa membuat halaman memanjang terlalu jauh.
5. **Micro-interaksi Tombol & Card Hover:**
   - Tombol utama memiliki efek *sheen* halus atau geseran panah lembut (translate 3–4px).
   - Kartu gambar melakukan zoom halus 1.04x di dalam batas *overflow-hidden* tanpa keluar border.

### 1.6 Adaptasi di Mobile (390px)
- Semua elemen dekoratif berat, efek hover kursor, dan pergeseran parallax berlebih dinonaktifkan demi performa dan kenyamanan sentuhan (*touch target* >= 44px).
- Bento grid beralih ke layout vertikal yang rapi tanpa teks terpotong.
- Floating WhatsApp dan tombol Back-to-Top diletakkan ergonomis tanpa saling tumpang tindih.

---

## 2. Audit Komparasi: Temu Rasa vs Loafly

| Komponen / Section | Temu Rasa Saat Ini (`temu-rasakelompok-temu-rasa.vercel.app`) | Loafly (`loafly.framer.website`) | Evaluasi & Peluang Polish |
|---|---|---|---|
| **Sistem Token Gerak** | Variasi CSS keyframes acak (`tr-up`, `tr-imgin`, `tr-float`, dll.) tanpa easing terpadu. | Satu kurva easing universal `cubic-bezier(0.22, 1, 0.36, 1)` dengan hierarki durasi presisi. | Perlu disatukan dalam satu file token `src/config/motion.js` dan toggle `motion.config.js`. |
| **Navbar** | Sticky biasa, border statis, mobile drawer standar. | Mengecil dinamis saat scroll, transisi pill/underline halus, drawer mobile beranimasi staggered. | Tambahkan dynamic scale + shadow tipis saat scroll, animasikan menu mobile dengan motion. |
| **Hero Section** | Layout sudah bagus (tumpeng/es kopi, badge berputar), tetapi animasi teks masuk serempak. | Headline masked reveal baris demi baris, arch foto membuka dengan clip-path, badge floating natural. | Tambahkan line-by-line reveal pada "Temu Rasa", parallax arch lembut di desktop, uap tipis dari es kopi. |
| **Marquee** | Teks berjalan statis kuning pekat, tepi tajam terpotong mendadak di batas layar. | Marquee dengan edge mask gradient kiri-kanan, melambat saat hover. | Tambahkan edge fade mask dan interaksi hover slow-down; tambah wave divider di bawahnya. |
| **Stats & Numbers** | Angka statis (5.000+, 17+, 100%, 4,9) langsung tampil. | Angka count-up halus saat pertama kali masuk viewport dengan tabular numbers. | Pasang komponen `<CountUp>` sekali putar saat ter-reveal. |
| **Keunggulan Layanan** | Grid 4 kartu dengan hover translate sederhana. | Staggered entrance, ikon dengan micro-motion, tinggi kartu simetris sempurna. | Rapikan stagger reveal, hover card naik + rotasi ikon mikro, tinggi seragam. |
| **Tentang Kami** | Foto joglo statis di kiri, teks di kanan. | Foto dengan reveal clip-path dan parallax halus saat scroll, checklist staggered. | Terapkan clip-path reveal pada foto joglo dan staggered checkmarks. |
| **Menu Favorit** | Grid 4 kartu. **BUG:** kartu ke-2 posisinya sedikit lebih tinggi/tidak rata pada beberapa resolusi. Tombol `+` biasa. | Foto zoom halus dalam container, tombol interaktif dengan konfirmasi visual, mobile snap slider. | **Perbaiki bug alignment kartu ke-2**, tambah micro-interaction pada tombol `+` (rotasi/centang), mobile jadi slider horizontal. |
| **CTA Biru (Tempat Nongkrong)** | **BUG KONTRAS:** Teks kuning "Cobain juga, yuk!" tertimpa blob kuning `bg-sun/90` sehingga sulit dibaca. | Kontras tinggi, layering elemen visual jelas, foto meluncur dari samping. | **Perbaiki layering/z-index blob kuning** agar berada di belakang teks dengan kontras aman, foto reveal dari sisi. |
| **Bento Suasana** | Bento grid foto nusantara sudah bagus, namun caption statis dan reveal serempak. | Bento reveal berurutan, hover zoom foto + caption meluncur naik halus dari bawah. | Tambahkan clip-path reveal bertahap, efek hover zoom + caption slide-up, pastikan teks tidak terpotong. |
| **Reservasi Meja** | Form berfungsi baik dengan validasi, namun transisi state submit mendadak. | Fokus ring brand yang lembut, feedback interaktif pada setiap baris hari. | Sorot baris "Hari Ini" lebih elegan, animasi loading & success state halus pada submit. |
| **Ulasan Pelanggan** | Grid statis 6-8 kartu yang membuat halaman memanjang ke bawah. | Carousel/slider interaktif dengan panah kiri/kanan, drag physics, kartu aktif menonjol. | **Ubah menjadi Testimonial Slider**: desktop menampilkan 3 kartu (tengah aktif), mobile drag/swipe. |
| **FAQ (Tanya Jawab)** | Tag `<details>` bawaan HTML: buka-tutup patah mendadak tanpa transisi tinggi. | Akordeon dengan transisi tinggi halus (*smooth height expansion*), rotasi ikon `+` menjadi `x`. | Ganti dengan akordeon berbasis motion/smooth collapse, lengkapi atribut aksesibilitas `aria-expanded`. |
| **Modal Login** | Modal pop-up standar. | Backdrop blur halus, transisi skala lembut, focus trap, tab indicator bergeser mulus. | Tambahkan tab indicator slider (Masuk / Daftar Baru), ESC close, backdrop blur, lock body scroll. |
| **Floating Actions** | WhatsApp dan Back-to-Top kadang saling menumpuk di viewport sempit mobile. | Tombol mengambang dengan transisi masuk/keluar teratur dan jarak aman di mobile. | Atur posisi responsif di mobile agar tombol keranjang, WA, dan Back-to-Top tidak tumpang tindih. |

---

## 3. Fitur Loafly yang Diadopsi vs Sengaja Dihindari

### A. Fitur Loafly yang DIADOPSI:
1. **Ritme Fisika Terpadu:** Easing `cubic-bezier(0.22, 1, 0.36, 1)` untuk semua transisi dan interaksi.
2. **Organic Wave Dividers:** Pemisah bergelombang SVG antar section kunci (Hero -> Marquee, Menu -> CTA, Suasana -> Reservasi).
3. **Smooth Edge-Masked Marquee:** Pita teks berjalan dengan efek pudar di pinggir layar dan melambat saat disentuh/di-hover.
4. **Interactive Slider Ulasan & Mobile Menu:** Menggantikan grid ulasan yang memanjang dengan slider interaktif yang lega.
5. **Micro-interactions yang Elegan:** Rotasi ikon `+` ke centang/keranjang, hover foto zoom 1.04x terisolasi, focus ring yang halus.
6. **Smooth Accordion FAQ:** Membuka dan menutup pertanyaan dengan animasi tinggi yang mulus.

### B. Fitur Loafly yang SENGAJA DIHINDARI (Untuk Menjaga Karakter Temu Rasa & Anti-AI Slop):
1. **DILARANG Meniru Layout Kafe Roti / Bakery:** Struktur Temu Rasa adalah resto & katering nusantara, bukan bakery. Layout konten tetap Temu Rasa.
2. **DILARANG Mengubah Warna:** Tidak menggunakan warna cokelat bakery Loafly. Tetap memakai palet identitas Temu Rasa: Navy (`#0F3870`), Sun/Amber (`#F5B21B`), Krem (`#FDFBF7` / `#FAF6EF`), dan Chili (`#D8432B`).
3. **DILARANG Mengubah Konten atau Bahasa:** Semua copy teks, nama menu, harga rupiah, rating, jam operasional, dan bahasa Indonesia tetap dipertahankan 100%.
4. **DILARANG Efek Slop Berlebihan:**
   - Tidak ada partikel bintang berkilau acak atau neon glow ungu/biru.
   - Tidak ada glassmorphism berlebihan yang membuat teks sulit terbaca.
   - Tidak ada animasi bounce kartun yang kekanak-kanakan.
   - Tidak membebani mobile dengan efek parallax/kursor berat.

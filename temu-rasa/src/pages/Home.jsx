import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Soup, Coffee, Camera, MapPin } from 'lucide-react'
import Button from '../components/Button'
import FoodCard from '../components/FoodCard'
import { products } from '../data/products'

// BARU: path foto dari public/img. Kalau ekstensi filemu .png / .webp, ganti di sini saja.
const HERO_IMG = '/img/hero.jpg'
const CAFE_IMG = '/img/cafe.jpg'

const perks = [
  { icon: Soup, label: 'Makanan Berat & Camilan' },
  { icon: Coffee, label: 'Kopi & Minuman Kekinian' },
  { icon: Camera, label: 'Suasana Nyaman & Instagramable' },
]

// BARU: tampilkan foto; kalau file tidak ketemu, jatuh ke emoji supaya layout tidak rusak
function Photo({ src, alt, emoji, className = '', emojiClass = 'text-8xl' }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <div className={`flex items-center justify-center bg-sun-soft ${className}`}>
        <span role="img" aria-label={alt} className={emojiClass}>{emoji}</span>
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  )
}

export default function Home() {
  return (
    <>
      {/* HERO: satu-satunya momen animasi saat halaman dibuka */}
      <section className="relative overflow-hidden">
        <div className="container-page grid items-center gap-12 py-12 md:grid-cols-[1.05fr_0.95fr] md:py-20">
          <div>
            <p className="tagline">Banyak Rasa, Satu Cerita.</p>
            <h1 className="title-display mt-3 text-[5.5rem] sm:text-[7rem] md:text-[8.5rem]">
              Temu<br />Rasa
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-navy-dark/75">
              Tempat makan dan minum yang menggabungkan rasa tradisional dan modern, untuk setiap cerita di setiap suapan.
            </p>
            <Button to="/menu" variant="accent" size="lg" className="mt-8">
              Lihat Menu <ArrowRight size={18} />
            </Button>
            <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
              {perks.map(({ icon: Icon, label }) => (
                <li key={label} className="flex max-w-[10.5rem] items-center gap-3 text-sm font-semibold leading-snug text-navy-dark/80">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sun-soft text-navy">
                    <Icon size={20} />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative isolate mx-auto w-full max-w-md animate-pop-in">
            <div className="blob-sun -right-6 -top-6 h-[105%] w-[105%] rotate-6" />
            <Photo
              src={HERO_IMG}
              alt="Es kopi susu dan nasi ayam geprek khas Temu Rasa"
              emoji="🧋"
              emojiClass="text-[9rem]"
              className="aspect-[4/5] w-full rounded-t-[999px] rounded-b-[2.5rem] shadow-card-hover"
            />
            <span className="absolute -right-3 top-10 flex h-24 w-24 rotate-12 items-center justify-center rounded-full bg-navy p-3 text-center font-display text-xs font-bold italic leading-tight text-sun shadow-card">
              Good Food Good Mood
            </span>
            <span className="absolute -left-4 bottom-8 -rotate-3 rounded-2xl bg-white px-4 py-2 font-script text-2xl font-bold text-navy shadow-card">
              Nongkrong jadi lebih berarti!
            </span>
          </div>
        </div>
      </section>

      {/* MENU FAVORIT */}
      <section className="container-page py-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-black text-navy md:text-4xl">
              <span className="scribble">Menu Favorit</span>
            </h2>
            <p className="mt-3 font-script text-2xl font-bold text-navy-light">Paling sering dipesan minggu ini</p>
          </div>
          <Link to="/menu" className="flex shrink-0 items-center gap-1 rounded-full px-3 py-2 text-sm font-bold text-navy transition-colors hover:bg-navy/5">
            Lihat Semua <ArrowRight size={14} />
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
          {products
            .filter((p) => p.bestSeller || p.rating >= 4.7)
            .slice(0, 4)
            .map((p) => (
              <FoodCard key={p.id} product={p} badge={p.bestSeller ? 'Best Seller' : undefined} />
            ))}
        </div>
      </section>

      {/* TEMPAT FAVORIT BUAT NONGKRONG */}
      <section className="container-page py-10">
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-navy text-white">
          <div className="absolute -bottom-16 -left-10 -z-10 h-56 w-56 rounded-blob bg-sun/90" />
          <div className="grid items-center gap-6 md:grid-cols-[1.2fr_0.8fr]">
            <div className="p-8 md:p-12">
              <MapPin size={34} className="text-sun" />
              <h3 className="mt-4 font-display text-3xl font-black italic leading-tight md:text-4xl">
                Tempat Favorit Buat Nongkrong
              </h3>
              <p className="mt-3 max-w-sm text-white/80">
                Dari sarapan sampai malam, semua ada di Temu Rasa.
              </p>
              <p className="mt-4 font-script text-2xl font-bold text-sun">Cobain juga, yuk!</p>
              <Button to="/menu" variant="accent" size="lg" className="mt-6">Pesan Sekarang</Button>
            </div>
            <div className="hidden h-full min-h-[18rem] md:block">
              <Photo
                src={CAFE_IMG}
                alt="Suasana nongkrong di Temu Rasa"
                emoji="☕"
                className="h-full w-full rounded-l-[6rem]"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
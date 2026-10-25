import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Soup,
  Coffee,
  Camera,
  MapPin,
  Star,
  ChefHat,
  ShieldCheck,
  Clock,
  Sparkles,
} from 'lucide-react'

import Button from '../components/Button'
import CaraPesan from '../components/CaraPesan'
import ErrorState from '../components/ErrorState'
import Faq from '../components/Faq'
import FoodCard from '../components/FoodCard'
import Marquee from '../components/Marquee'
import Reservasi from '../components/Reservasi'
import Reveal from '../components/Reveal'
import Suasana from '../components/Suasana'
import TentangKami from '../components/TentangKami'
import Ulasan from '../components/Ulasan'
import { ProductSkeleton } from '../components/ProductSkeleton'
import useProducts from '../hooks/useProducts'

const HERO_IMG = '/img/hero.jpg'
const CAFE_IMG = '/img/cafe.jpg'

const perks = [
  { icon: Soup, label: 'Makanan Berat & Camilan' },
  { icon: Coffee, label: 'Kopi & Minuman Kekinian' },
  { icon: Camera, label: 'Suasana Nyaman & Instagramable' },
]

const delay = (ms) => ({ animationDelay: `${ms}ms` })

function Photo({
  src,
  alt,
  emoji,
  className = '',
  emojiClass = 'text-8xl',
}) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center bg-sun-soft ${className}`}
      >
        <span
          role="img"
          aria-label={alt}
          className={emojiClass}
        >
          {emoji}
        </span>
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

function SectionFallback({ name, error }) {
  return (
    <div
      role="alert"
      className="container-page my-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
    >
      <p className="font-bold">
        Bagian {name} gagal ditampilkan.
      </p>
      <p className="mt-1 break-words">
        {error?.message || String(error)}
      </p>
    </div>
  )
}

class SectionErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error) {
    console.error(
      `Error pada bagian ${this.props.name}:`,
      error
    )
  }

  render() {
    if (this.state.error) {
      return (
        <SectionFallback
          name={this.props.name}
          error={this.state.error}
        />
      )
    }

    return this.props.children
  }
}

function SafeSection({ name, children }) {
  return (
    <SectionErrorBoundary name={name}>
      {children}
    </SectionErrorBoundary>
  )
}

export default function Home() {
  const {
    products = [],
    loading = false,
    error = null,
    reload,
  } = useProducts()

  const safeProducts = Array.isArray(products)
    ? products.filter(Boolean)
    : []

  const favorites = safeProducts
    .filter(
      (product) =>
        product.bestSeller ||
        Number(product.rating) >= 4.7
    )
    .slice(0, 4)

  const top = safeProducts.length
    ? safeProducts.reduce((best, product) =>
        Number(product?.reviews || 0) >
        Number(best?.reviews || 0)
          ? product
          : best
      )
    : null

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* Ambient Glows Mewah */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 top-[10%] h-80 w-80 rounded-full bg-sun/15 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 top-[35%] h-96 w-96 rounded-full bg-navy/10 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="tr-anim-blob2 pointer-events-none absolute -left-28 top-[8%] h-80 w-80 rounded-blob bg-sun opacity-20"
        />

        <div className="container-page relative grid items-center gap-12 py-12 md:grid-cols-[1.05fr_0.95fr] md:py-20">
          <div>
            <div className="tr-anim-up mb-4" style={delay(50)}>
              <span className="inline-flex items-center gap-2 rounded-full border border-navy/15 bg-white/95 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-navy shadow-sm backdrop-blur-sm">
                <Sparkles size={14} className="text-sun" /> Resto & Katering Nusantara
              </span>
            </div>

            <div
              className="tr-anim-up"
              style={delay(120)}
            >
              <p className="tagline">
                Banyak Rasa, Satu Cerita.
              </p>
            </div>

            <h1
              className="title-display tr-anim-up mt-3 text-[5.5rem] sm:text-[7rem] md:text-[8.5rem]"
              style={delay(250)}
            >
              Temu
              <br />
              Rasa
            </h1>

            <p
              className="tr-anim-up mt-6 max-w-md text-lg leading-relaxed text-navy-dark/75"
              style={delay(400)}
            >
              Tempat makan dan minum yang menggabungkan
              rasa tradisional dan modern, untuk setiap
              cerita di setiap suapan.
            </p>

            <div
              className="tr-anim-up mt-8 flex flex-wrap gap-3"
              style={delay(550)}
            >
              <Button
                to="/menu"
                variant="accent"
                size="lg"
              >
                Lihat Menu <ArrowRight size={18} />
              </Button>

              <Button
                to="/#reservasi"
                variant="outline"
                size="lg"
              >
                Reservasi Meja
              </Button>
            </div>

            <ul
              className="tr-anim-up mt-10 flex flex-wrap gap-x-8 gap-y-4"
              style={delay(700)}
            >
              {perks.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="group flex max-w-[10.5rem] items-center gap-3 text-sm font-semibold leading-snug text-navy-dark/80 transition-transform duration-200 hover:translate-x-1"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sun-soft text-navy shadow-sm transition-transform duration-200 group-hover:scale-110 group-hover:bg-sun">
                    <Icon size={20} />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </div>

          <div className="tr-anim-imgin relative isolate mx-auto w-full max-w-md">
            <div className="blob-sun tr-anim-morph -right-6 -top-6 h-[105%] w-[105%]" />

            <Photo
              src={HERO_IMG}
              alt="Es kopi susu gula aren segar khas Temu Rasa"
              emoji="🧋"
              emojiClass="text-[9rem]"
              className="aspect-[4/5] w-full rounded-t-[999px] rounded-b-[2.5rem] shadow-card-hover"
            />

            <span className="absolute -right-3 top-10 rotate-12">
              <span className="tr-anim-wob flex h-24 w-24 items-center justify-center rounded-full bg-navy p-3 text-center font-display text-xs font-bold italic leading-tight text-sun shadow-card">
                Good Food Good Mood
              </span>
            </span>

            <span className="absolute -top-10 left-[4%] z-20 hidden -rotate-3 sm:block pointer-events-none">
              <span
                className="tr-anim-up block font-script text-2xl font-bold text-navy sm:text-3xl"
                style={delay(1400)}
              >
                Nongkrong jadi lebih berarti!
              </span>
            </span>

            <div className="tr-anim-float absolute -left-2 bottom-6 z-20 rounded-2xl bg-white/95 p-3.5 shadow-card-hover backdrop-blur-sm sm:-left-6 sm:p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sun-soft text-xl shadow-sm">
                  🧋
                </span>
                <div>
                  <p className="font-display text-base font-bold leading-tight text-navy sm:text-lg">
                    {top?.name ?? 'Es Kopi Susu Gula Aren'}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-navy/60">
                    <Star size={12} className="fill-sun text-sun" />
                    4.9 dari 5.000+ ulasan puas
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Herb Tag */}
            <span className="tr-anim-float-slow absolute -bottom-3 right-4 hidden rounded-full border border-navy/10 bg-white/95 px-3.5 py-1.5 text-xs font-extrabold text-navy shadow-card backdrop-blur-md sm:inline-flex items-center gap-1.5 z-20">
              <span className="text-sun">🌿</span> 100% Rempah Nusantara
            </span>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <SafeSection name="pita teks">
        <Marquee />
      </SafeSection>

      {/* STATISTIK & KEUNGGULAN (Inspirasi CaterServ) */}
      <section className="container-page -mt-4 py-6">
        <Reveal className="grid grid-cols-2 gap-4 rounded-[2.5rem] glass-card p-6 shadow-card transition-all hover:shadow-[0_20px_50px_-15px_rgba(15,56,112,0.22)] sm:grid-cols-4 sm:p-8 border border-white/80">
          <div className="flex flex-col items-center justify-center p-3 text-center sm:border-r border-navy/10">
            <span className="font-display text-3xl font-black text-navy md:text-4xl">5.000+</span>
            <span className="mt-1 text-xs font-bold text-navy/60">Pelanggan Puas</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 text-center sm:border-r border-navy/10">
            <span className="font-display text-3xl font-black text-navy md:text-4xl">17+</span>
            <span className="mt-1 text-xs font-bold text-navy/60">Menu Nusantara</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 text-center sm:border-r border-navy/10">
            <span className="font-display text-3xl font-black text-navy md:text-4xl">100%</span>
            <span className="mt-1 text-xs font-bold text-navy/60">Alami & Halal</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 text-center">
            <span className="font-display text-3xl font-black text-navy md:text-4xl inline-flex items-center gap-1.5">
              <Star size={24} className="fill-sun text-sun" /> 4,9
            </span>
            <span className="mt-1 text-xs font-bold text-navy/60">Rating Pelanggan</span>
          </div>
        </Reveal>
      </section>

      {/* KEUNGGULAN LAYANAN KATERING & RESTO (Inspirasi CaterServ) */}
      <SafeSection name="keunggulan layanan">
        <section className="container-page py-10 md:py-14">
          <Reveal className="text-center">
            <p className="flex items-center justify-center gap-3 text-xs font-extrabold uppercase tracking-[0.25em] text-navy">
              <span aria-hidden="true" className="h-0.5 w-10 bg-navy" />
              Keunggulan Layanan
            </p>
            <h2 className="mt-4 font-display text-4xl font-black text-navy md:text-5xl">
              Kenapa Memilih <span className="scribble italic">Temu Rasa?</span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm text-navy-dark/75 sm:text-base">
              Standar pelayanan resto dan jamuan katering terbaik dengan cita rasa otentik yang selalu terjaga.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: ChefHat,
                title: 'Resep Warisan Asli',
                desc: 'Rempah alami racikan tradisional nusantara, diolah teliti untuk menjaga keotentikan rasa.',
                bg: 'bg-sun-soft text-navy',
              },
              {
                icon: ShieldCheck,
                title: '100% Halal & Segar',
                desc: 'Bahan baku harian berkualitas prima, tanpa bahan pengawet berbahaya dan terjamin higienis.',
                bg: 'bg-green-100 text-green-800',
              },
              {
                icon: Clock,
                title: 'Pengantaran Kilat',
                desc: 'Pesanan diantar dalam 25–45 menit dengan kemasan aman, menjaga hidangan tetap hangat.',
                bg: 'bg-amber-100 text-amber-900',
              },
              {
                icon: Sparkles,
                title: 'Layanan Acara & Meja',
                desc: 'Fasilitas reservasi nyaman untuk santap di tempat, katering syukuran, hingga rapat kantor.',
                bg: 'bg-blue-100 text-blue-900',
              },
            ].map((item, idx) => {
              const Icon = item.icon
              return (
                <Reveal key={item.title} delay={idx * 100} className="h-full">
                  <div className="group relative flex h-full flex-col rounded-[2.2rem] glass-card p-7 shadow-card transition-all duration-300 hover:-translate-y-2 hover:border-sun/40 hover:shadow-[0_22px_45px_-14px_rgba(15,56,112,0.25)]">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.bg} shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                      <Icon size={28} />
                    </div>
                    <h3 className="mt-5 font-display text-xl font-bold text-navy">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-navy-dark/70">
                      {item.desc}
                    </p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </section>
      </SafeSection>

      {/* TENTANG KAMI (Inspirasi CaterServ) */}
      <SafeSection name="tentang kami">
        <TentangKami />
      </SafeSection>

      {/* MENU FAVORIT */}
      <section className="container-page py-10">
        <SafeSection name="judul menu favorit">
          <Reveal className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl font-black text-navy md:text-4xl">
                <span className="scribble">
                  Menu Favorit
                </span>
              </h2>

              <p className="mt-3 font-script text-2xl font-bold text-navy-light">
                Paling sering dipesan minggu ini
              </p>
            </div>

            <Link
              to="/menu"
              className="flex shrink-0 items-center gap-1 rounded-full px-3 py-2 text-sm font-bold text-navy transition-colors hover:bg-navy/5"
            >
              Lihat Semua <ArrowRight size={14} />
            </Link>
          </Reveal>
        </SafeSection>

        {loading && (
          <div
            role="status"
            aria-label="Memuat menu favorit"
            className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5"
          >
            {Array.from({ length: 4 }, (_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="mt-8">
            <ErrorState
              message={String(error)}
              onRetry={reload}
            />
          </div>
        )}

        {!loading && !error && favorites.length > 0 && (
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
            {favorites.map((product, index) => (
              <SafeSection
                key={product.id ?? index}
                name={`kartu menu ${product.name ?? index + 1}`}
              >
                <Reveal
                  delay={index * 90}
                  className="h-full [&>article]:h-full"
                >
                  <FoodCard
                    product={product}
                    badge={
                      product.bestSeller
                        ? 'Best Seller'
                        : undefined
                    }
                  />
                </Reveal>
              </SafeSection>
            ))}
          </div>
        )}

        {!loading &&
          !error &&
          favorites.length === 0 && (
            <p className="mt-8 rounded-2xl bg-sun-soft p-6 text-center text-navy">
              Menu favorit belum tersedia saat ini.
            </p>
          )}
      </section>

      {/* TEMPAT NONGKRONG */}
      <SafeSection name="tempat nongkrong">
        <section className="container-page py-10">
          <Reveal className="relative isolate overflow-hidden rounded-[2rem] bg-navy text-white">
            <div className="absolute -bottom-16 -left-10 -z-10 h-56 w-56 rounded-blob bg-sun/90" />

            <div className="grid items-center gap-6 md:grid-cols-[1.2fr_0.8fr]">
              <div className="p-8 md:p-12">
                <MapPin size={34} className="text-sun" />

                <h3 className="mt-4 font-display text-3xl font-black italic leading-tight md:text-4xl">
                  Tempat Favorit Buat Nongkrong
                </h3>

                <p className="mt-3 max-w-sm text-white/80">
                  Dari sarapan sampai malam, semua ada di
                  Temu Rasa.
                </p>

                <p className="mt-4 font-script text-2xl font-bold text-sun">
                  Cobain juga, yuk!
                </p>

                <Button
                  to="/menu"
                  variant="accent"
                  size="lg"
                  className="mt-6"
                >
                  Pesan Sekarang
                </Button>
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
          </Reveal>
        </section>
      </SafeSection>

      {/* CARA PESAN */}
      <SafeSection name="cara pesan">
        <CaraPesan />
      </SafeSection>

      {/* SUASANA KAMI */}
      <SafeSection name="suasana">
        <Suasana />
      </SafeSection>

      {/* RESERVASI MEJA */}
      <SafeSection name="reservasi">
        <Reservasi />
      </SafeSection>

      {/* ULASAN PELANGGAN */}
      <SafeSection name="ulasan pelanggan">
        <Ulasan />
      </SafeSection>

      {/* TANYA JAWAB */}
      <SafeSection name="tanya jawab">
        <Faq />
      </SafeSection>
    </>
  )
}
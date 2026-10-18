import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Star, Minus, Plus, ShoppingBag, ChevronRight } from 'lucide-react'
import { products, rupiah } from '../data/products'
import { useCart } from '../context/CartContext'
import FoodCard, { Thumb } from '../components/FoodCard'
import Button from '../components/Button'

export default function ProductDetail() {
  const { id } = useParams()
  const p = products.find((x) => x.id === Number(id))
  const { addItem } = useCart()
  const [variant, setVariant] = useState(null)
  const [qty, setQty] = useState(1)

  if (!p) return (
    <div className="container-page max-w-xl py-24 text-center">
      <h1 className="font-display text-3xl font-black text-navy">Menu tidak ditemukan</h1>
      <p className="mt-2 text-navy-dark/65">Menu ini mungkin sudah tidak tersedia.</p>
      <Button to="/menu" className="mt-6">Kembali ke Menu</Button>
    </div>
  )
  const selected = variant ?? p.variants[0]
  const related = products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4)

  return (
    <div className="container-page py-8 md:py-12">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-sm text-navy/60">
        <Link to="/menu" className="font-semibold hover:text-navy">Menu</Link>
        <ChevronRight size={14} />
        <span>{p.category}</span>
        <ChevronRight size={14} />
        <span className="font-bold text-navy">{p.name}</span>
      </nav>

      <div className="mt-8 grid items-start gap-10 md:grid-cols-2 md:gap-14">
        {/* Foto besar + blob kuning */}
        <div className="relative isolate">
          <div className="blob-sun -left-5 -top-5 h-[104%] w-[104%] -rotate-6" />
          <Thumb
            p={p}
            size="text-[9rem]"
            className="aspect-square overflow-hidden rounded-[2.5rem] shadow-card-hover"
          />
          {p.bestSeller && (
            <span className="sticker absolute -right-2 top-6 !px-4 !py-1.5 !text-sm">Best Seller</span>
          )}
        </div>

        <div>
          <h1 className="font-display text-4xl font-black leading-tight text-navy md:text-5xl">{p.name}</h1>
          <p className="mt-3 text-3xl font-extrabold text-navy">{rupiah(p.price)}</p>
          <p className="mt-3 flex items-center gap-1.5 text-sm">
            <Star size={17} className="fill-sun text-sun" />
            <b>{p.rating}</b>
            <span className="text-navy/60">({p.reviews} ulasan)</span>
          </p>
          <p className="mt-5 max-w-prose leading-relaxed text-navy-dark/75">{p.desc}</p>

          <h3 className="mt-8 font-display text-lg font-bold text-navy-dark">Pilihan Varian</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {p.variants.map((v) => (
              <button
                key={v}
                onClick={() => setVariant(v)}
                aria-pressed={selected === v}
                className={`pill ${selected === v ? 'pill-active' : ''}`}
              >
                {v}
              </button>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3 sm:flex-nowrap">
            <div className="flex items-center gap-1 rounded-full border-2 border-navy/15 bg-white p-1">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Kurangi"
                className="flex h-10 w-10 items-center justify-center rounded-full text-navy transition-colors hover:bg-navy/5 active:scale-95"
              >
                <Minus size={16} />
              </button>
              <span className="w-8 text-center text-lg font-extrabold text-navy" aria-live="polite">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                aria-label="Tambah"
                className="flex h-10 w-10 items-center justify-center rounded-full text-navy transition-colors hover:bg-navy/5 active:scale-95"
              >
                <Plus size={16} />
              </button>
            </div>
            <Button onClick={() => addItem(p, qty, selected)} variant="accent" size="lg" className="flex-1">
              <ShoppingBag size={18} /> Tambah ke Keranjang
            </Button>
          </div>

          <div className="mt-10 rounded-3xl bg-sun-soft p-5">
            <h3 className="font-display text-lg font-bold text-navy-dark">Komposisi</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {p.composition.map((c) => (
                <li key={c} className="rounded-full bg-white px-3.5 py-1.5 text-sm font-semibold text-navy-dark/80">
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-16 flex flex-wrap items-end gap-x-4">
        <h2 className="font-display text-3xl font-black text-navy">
          <span className="scribble">Kamu mungkin juga suka</span>
        </h2>
        <p className="font-script text-2xl font-bold text-navy-light">Coba juga yuk!</p>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
        {related.map((r) => (
          <FoodCard key={r.id} product={r} badge={r.bestSeller ? 'Best Seller' : undefined} />
        ))}
      </div>
    </div>
  )
}
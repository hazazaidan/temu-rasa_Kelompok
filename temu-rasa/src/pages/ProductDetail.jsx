import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Star, Minus, Plus, ShoppingBag, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { rupiah } from '../data/products'
import useProducts from '../hooks/useProducts'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import FoodCard, { Thumb } from '../components/FoodCard'
import Button from '../components/Button'
import ErrorState from '../components/ErrorState'

// Skeleton khusus halaman detail (mengikuti bentuk layout: foto besar + info)
function DetailSkeleton() {
  return (
    <div role="status" aria-label="Memuat menu" className="container-page animate-pulse py-8 md:py-12">
      <div className="h-4 w-48 rounded-full bg-sun-soft" />
      <div className="mt-8 grid items-start gap-10 md:grid-cols-2 md:gap-14">
        <div className="aspect-square w-full rounded-[2.5rem] bg-sun-soft" />
        <div className="space-y-4">
          <div className="h-10 w-3/4 rounded-full bg-sun-soft" />
          <div className="h-8 w-1/3 rounded-full bg-sun-soft" />
          <div className="h-4 w-1/4 rounded-full bg-sun-soft" />
          <div className="h-4 w-full rounded-full bg-sun-soft" />
          <div className="h-4 w-5/6 rounded-full bg-sun-soft" />
          <div className="flex gap-2 pt-6">
            <div className="h-10 w-24 rounded-full bg-sun-soft" />
            <div className="h-10 w-24 rounded-full bg-sun-soft" />
            <div className="h-10 w-24 rounded-full bg-sun-soft" />
          </div>
          <div className="h-14 w-full rounded-full bg-sun-soft" />
        </div>
      </div>
    </div>
  )
}

export default function ProductDetail() {
  const { id } = useParams()
  const { products, loading, error, reload } = useProducts()
  const { addItem } = useCart()
  const { user, openModal } = useAuth()
  const [variant, setVariant] = useState(null)
  const [qty, setQty] = useState(1)

  // pindah ke menu lain (mis. dari "Kamu mungkin juga suka") = varian dan jumlah kembali awal
  useEffect(() => {
    setVariant(null)
    setQty(1)
  }, [id])

  // 1. Loading
  if (loading) return <DetailSkeleton />

  // 2. Error koneksi
  if (error) return <ErrorState message={error} onRetry={reload} />

  const p = products.find((x) => x.id === Number(id))

  // 3. Menu tidak ada
  if (!p) return (
    <div className="container-page max-w-xl py-24 text-center">
      <h1 className="font-display text-3xl font-black text-navy">Menu tidak ditemukan</h1>
      <p className="mt-2 text-navy-dark/65">Menu ini mungkin sudah tidak tersedia.</p>
      <Button to="/menu" className="mt-6">Kembali ke Menu</Button>
    </div>
  )

  const variants = p.variants ?? []
  const selected = variant ?? variants[0] ?? ''
  const related = products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4)

  const handleAdd = () => {
    if (!user) {
      openModal('login')
      toast('Silakan masuk akun terlebih dahulu untuk memesan menu', { icon: '🔐' })
      return
    }
    addItem(p, qty, selected)
    toast.success(`${qty}x ${p.name} masuk keranjang`)
  }

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

          {variants.length > 0 && (
            <>
              <h3 className="mt-8 font-display text-lg font-bold text-navy-dark">Pilihan Varian</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {variants.map((v) => (
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
            </>
          )}

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
                onClick={() => setQty((q) => Math.min(99, q + 1))}
                aria-label="Tambah"
                className="flex h-10 w-10 items-center justify-center rounded-full text-navy transition-colors hover:bg-navy/5 active:scale-95"
              >
                <Plus size={16} />
              </button>
            </div>
            <Button onClick={handleAdd} variant="accent" size="lg" className="flex-1">
              <ShoppingBag size={18} /> Tambah ke Keranjang
            </Button>
          </div>

          {p.composition?.length > 0 && (
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
          )}
        </div>
      </div>

      {related.length > 0 && (
        <>
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
        </>
      )}
    </div>
  )
}
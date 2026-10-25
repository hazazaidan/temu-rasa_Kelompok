import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { LayoutGrid, List, Plus, Search, SearchX, Star, X } from 'lucide-react'
import toast from 'react-hot-toast'
import FoodCard, { Thumb } from '../components/FoodCard'
import Button from '../components/Button'
import ErrorState from '../components/ErrorState'
import Reveal from '../components/Reveal'
import ProductSkeletonGrid from '../components/ProductSkeleton'
import useProducts from '../hooks/useProducts'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { categories, rupiah } from '../data/products'

// Satu baris menu untuk tampilan "Daftar"
function FoodRow({ product: p }) {
  const { addItem } = useCart()
  const { user, openModal } = useAuth()

  const handleAdd = () => {
    if (!user) {
      openModal('login')
      toast('Silakan masuk akun terlebih dahulu untuk memesan menu', { icon: '🔐' })
      return
    }
    addItem(p, 1, p.variants?.[0])
    toast.success(`${p.name} masuk keranjang`)
  }

  return (
    <li className="group relative flex items-center gap-4 rounded-2xl border border-navy/10 bg-white/85 p-3.5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-sun/60 hover:bg-white hover:shadow-card hover:-translate-y-0.5 sm:gap-5 sm:p-4">
      <Link to={`/menu/${p.id}`} className="shrink-0" aria-label={`Lihat ${p.name}`}>
        <Thumb p={p} size="text-3xl" className="sheen-wrapper h-20 w-20 overflow-hidden rounded-2xl sm:h-24 sm:w-24 shadow-sm transition-transform duration-300 group-hover:scale-105" />
      </Link>

      <div className="min-w-0 flex-1">
        {/* Title + Dotted Leader Line + Price Badge khas Appetizer */}
        <div className="flex items-center gap-2">
          <Link
            to={`/menu/${p.id}`}
            className="font-display text-base font-bold leading-tight text-navy transition-colors hover:text-navy-light shrink-0 sm:text-xl"
          >
            {p.name}
          </Link>

          {/* Dotted Leader Line (Khas Appetizer) */}
          <span aria-hidden="true" className="min-w-[16px] flex-1 border-b-2 border-dotted border-navy/20 mx-1" />

          {/* Badge Harga Khas Appetizer */}
          <span className="shrink-0 rounded-full bg-sun-soft px-3 py-0.5 font-display text-base font-black text-navy border border-sun/30 sm:text-lg">
            {rupiah(p.price)}
          </span>
        </div>

        {/* Deskripsi Muted di Bawah */}
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-navy-dark/65 sm:text-sm">
          {p.desc}
        </p>

        {/* Rating & Tombol Tambah Pesanan */}
        <div className="mt-2.5 flex items-center justify-between">
          <p className="flex items-center gap-1 text-xs font-semibold text-navy/60">
            <Star size={13} className="fill-sun text-sun" /> {p.rating}
            <span className="font-medium text-navy/45">({p.reviews} ulasan)</span>
          </p>

          <button
            onClick={handleAdd}
            aria-label={`Tambah ${p.name} ke keranjang`}
            className="flex items-center gap-1.5 rounded-full bg-sun px-3.5 py-1.5 text-xs font-extrabold text-navy-dark shadow-sun transition-all duration-200 hover:scale-105 hover:bg-sun-deep hover:text-white active:scale-95"
          >
            <Plus size={15} strokeWidth={3} />
            <span className="hidden sm:inline">Pesan</span>
          </button>
        </div>
      </div>
    </li>
  )
}

// Skeleton untuk tampilan "Daftar"
function RowSkeleton() {
  return (
    <div className="flex animate-pulse items-center gap-4 border-b border-dashed border-navy/15 py-5">
      <div className="h-20 w-20 shrink-0 rounded-2xl bg-sun-soft sm:h-24 sm:w-24" />
      <div className="flex-1 space-y-2">
        <div className="h-5 w-1/2 rounded-full bg-sun-soft" />
        <div className="h-3 w-3/4 rounded-full bg-sun-soft" />
        <div className="h-3 w-1/4 rounded-full bg-sun-soft" />
      </div>
      <div className="h-10 w-10 shrink-0 rounded-full bg-sun-soft" />
    </div>
  )
}

export default function Menu() {
  const { products, loading, error, reload } = useProducts()
  const [params, setParams] = useSearchParams()
  const [cat, setCat] = useState('Semua')
  const [sort, setSort] = useState('default')
  const [mode, setMode] = useState('kartu') // 'kartu' | 'daftar'

  const rawQ = params.get('q') || ''
  const q = rawQ.trim().toLowerCase()

  const setQuery = (v) => setParams(v ? { q: v } : {}, { replace: true })

  const list = useMemo(() => {
    let r = products.filter(
      (p) =>
        (cat === 'Semua' || p.category === cat) &&
        p.name.toLowerCase().includes(q)
    )
    if (sort === 'murah') r = [...r].sort((a, b) => a.price - b.price)
    if (sort === 'rating') r = [...r].sort((a, b) => b.rating - a.rating)
    return r
  }, [products, cat, q, sort])

  const resetAll = () => {
    setParams({})
    setCat('Semua')
    setSort('default')
  }

  return (
    <div className="container-page py-10 md:py-14">
      {/* Judul + coretan tangan */}
      <div className="relative">
        <h1 className="title-display text-6xl sm:text-7xl">Menu Kami</h1>
        <p className="mt-3 max-w-md text-lg text-navy-dark/70">Rasa yang selalu bikin kamu balik lagi.</p>
        <p
          aria-hidden="true"
          className="absolute right-0 top-0 hidden rotate-6 font-script text-3xl font-bold text-navy-light sm:block"
        >
          Enak banget!
          <svg viewBox="0 0 60 30" className="ml-auto mr-6 mt-1 h-7 w-14 text-sun" fill="none">
            <path d="M4 4 C 18 4, 30 14, 44 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <path d="M34 25 L45 25 L41 14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </p>
      </div>

      {/* Baris 1: kategori + urutkan */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2" role="tablist">
          {categories.map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={cat === c}
              onClick={() => setCat(c)}
              className={`pill ${cat === c ? 'pill-active' : ''}`}
            >
              {c}
            </button>
          ))}
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="input !w-auto !rounded-full !px-5 !py-2.5 font-semibold"
          aria-label="Urutkan"
        >
          <option value="default">Urutkan</option>
          <option value="murah">Harga terendah</option>
          <option value="rating">Rating tertinggi</option>
        </select>
      </div>

      {/* Baris 2: cari + chip + tampilan */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-navy/50" />
          <input
            type="search"
            value={rawQ}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari menu..."
            aria-label="Cari menu"
            className="input !rounded-full !py-2.5 !pl-11 !pr-10 [&::-webkit-search-cancel-button]:hidden"
          />
          {rawQ && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Hapus pencarian"
              className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-navy/60 transition-colors hover:bg-navy/5"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="ml-auto flex gap-2" role="group" aria-label="Tampilan menu">
          <button
            type="button"
            aria-pressed={mode === 'daftar'}
            onClick={() => setMode('daftar')}
            className={`pill gap-2 ${mode === 'daftar' ? 'pill-active' : ''}`}
          >
            <List size={16} /> Daftar
          </button>
          <button
            type="button"
            aria-pressed={mode === 'kartu'}
            onClick={() => setMode('kartu')}
            className={`pill gap-2 ${mode === 'kartu' ? 'pill-active' : ''}`}
          >
            <LayoutGrid size={16} /> Kartu
          </button>
        </div>
      </div>

      {/* 1. Loading */}
      {loading &&
        (mode === 'kartu' ? (
          <ProductSkeletonGrid count={8} />
        ) : (
          <div role="status" aria-label="Memuat menu" className="mt-4">
            {Array.from({ length: 6 }, (_, i) => (
              <RowSkeleton key={i} />
            ))}
          </div>
        ))}

      {/* 2. Error */}
      {!loading && error && <ErrorState message={error} onRetry={reload} />}

      {/* 3. Kosong */}
      {!loading && !error && list.length === 0 && (
        <div className="mx-auto mt-16 flex max-w-sm flex-col items-center gap-3 rounded-[2rem] bg-white px-8 py-12 text-center shadow-card">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-sun-soft">
            <SearchX size={36} className="text-navy" />
          </span>
          <h2 className="font-display text-2xl font-black text-navy">Menu tidak ditemukan</h2>
          <p className="text-sm text-navy-dark/65">Coba kata kunci lain atau lihat semua menu.</p>
          <Button className="mt-2" onClick={resetAll}>
            Reset Pencarian
          </Button>
        </div>
      )}

      {/* 4. Data tampil */}
      {!loading && !error && list.length > 0 && (
        <>
          <p className="mt-6 text-sm font-semibold text-navy/55">{list.length} menu</p>

          {mode === 'kartu' ? (
            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
              {list.map((p, i) => (
                <Reveal key={p.id} delay={(i % 4) * 80} className="h-full [&>article]:h-full">
                  <FoodCard product={p} badge={p.bestSeller ? 'Best Seller' : undefined} />
                </Reveal>
              ))}
            </div>
          ) : (
            <ul className="mt-4 space-y-3.5">
              {list.map((p) => (
                <FoodRow key={p.id} product={p} />
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
}
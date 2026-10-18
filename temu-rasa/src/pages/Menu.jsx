import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SearchX } from 'lucide-react'
import FoodCard from '../components/FoodCard'
import Button from '../components/Button'
import { products, categories } from '../data/products'

export default function Menu() {
  const [params, setParams] = useSearchParams()
  const [cat, setCat] = useState('Semua')
  const [sort, setSort] = useState('default')
  const q = (params.get('q') || '').toLowerCase()

  const list = useMemo(() => {
    let r = products.filter((p) => (cat === 'Semua' || p.category === cat) && p.name.toLowerCase().includes(q))
    if (sort === 'murah') r = [...r].sort((a, b) => a.price - b.price)
    if (sort === 'rating') r = [...r].sort((a, b) => b.rating - a.rating)
    return r
  }, [cat, q, sort])

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

      {/* Filter + urutkan */}
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

      {q && (
        <p className="mt-5 inline-flex flex-wrap items-center gap-2 rounded-full bg-sun-soft px-4 py-2 text-sm text-navy-dark">
          Hasil untuk “{params.get('q')}”
          <button className="font-bold underline underline-offset-2" onClick={() => setParams({})}>
            Hapus pencarian
          </button>
        </p>
      )}

      {list.length === 0 ? (
        <div className="mx-auto mt-16 flex max-w-sm flex-col items-center gap-3 rounded-[2rem] bg-white px-8 py-12 text-center shadow-card">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-sun-soft">
            <SearchX size={36} className="text-navy" />
          </span>
          <h2 className="font-display text-2xl font-black text-navy">Menu tidak ditemukan</h2>
          <p className="text-sm text-navy-dark/65">Coba kata kunci lain atau lihat semua menu.</p>
          <Button className="mt-2" onClick={() => { setParams({}); setCat('Semua') }}>
            Reset Pencarian
          </Button>
        </div>
      ) : (
        <>
          <p className="mt-6 text-sm font-semibold text-navy/55">{list.length} menu</p>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
            {list.map((p) => (
              <FoodCard key={p.id} product={p} badge={p.bestSeller ? 'Best Seller' : undefined} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
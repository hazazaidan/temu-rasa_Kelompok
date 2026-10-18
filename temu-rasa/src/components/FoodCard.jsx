import { Link } from 'react-router-dom'
import { Star, Plus } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { rupiah } from '../data/products'

export function Thumb({ p, className = '', size = 'text-6xl' }) {
  return (
    <div className={`flex items-center justify-center ${size} ${className}`} style={{ background: p.bg }}>
      {p.image ? (
        <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover" />
      ) : (
        <span role="img" aria-label={p.name}>{p.emoji}</span>
      )}
    </div>
  )
}

// BARU: prop opsional `badge`, contoh: <FoodCard product={p} badge="Best Seller" />
export default function FoodCard({ product: p, badge }) {
  const { addItem } = useCart()
  return (
    <article className="group flex flex-col rounded-[1.75rem] bg-white p-2 shadow-card transition-shadow duration-200 hover:shadow-card-hover">
      <Link to={`/menu/${p.id}`} className="relative block overflow-hidden rounded-[1.35rem]">
        <Thumb p={p} className="aspect-[4/3]" />
        {badge && (
          <span className="sticker absolute left-2 top-2 !text-[11px]">{badge}</span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1 px-3 pb-3 pt-3">
        <Link
          to={`/menu/${p.id}`}
          className="font-display text-lg font-bold leading-tight text-navy-dark transition-colors hover:text-navy-light"
        >
          {p.name}
        </Link>
        <p className="flex items-center gap-1 text-xs font-semibold text-navy/60">
          <Star size={13} className="fill-sun text-sun" /> {p.rating}
          <span className="font-medium text-navy/45">({p.reviews} ulasan)</span>
        </p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-lg font-extrabold text-navy">{rupiah(p.price)}</span>
          <button
            onClick={() => addItem(p, 1, p.variants[0])}
            aria-label={`Tambah ${p.name} ke keranjang`}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-sun text-navy-dark shadow-sun transition hover:bg-sun-deep hover:text-white active:scale-95"
          >
            <Plus size={20} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </article>
  )
}